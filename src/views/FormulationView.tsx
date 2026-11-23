import React, { useState } from 'react';
import {
  Calculator,
  Wheat,
  ArrowRightLeft,
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  Scale,
} from 'lucide-react';
import {
  INGREDIENTS_DATA,
  SUBSTITUTIONS_DATA,
  PILOT_UNIT_WEIGHT_G,
  BASE_FLOUR_G,
} from '../data/formulationData';

interface Props {
  onNavigateToBatch?: () => void;
}

const BATCH_STORAGE_KEY = 'panufactura_batch_v1';

export const FormulationView: React.FC<Props> = ({ onNavigateToBatch }) => {
  const [flourInput, setFlourInput] = useState<string>(String(BASE_FLOUR_G));
  const [unitWeightInput, setUnitWeightInput] = useState<string>(String(PILOT_UNIT_WEIGHT_G));
  const [includeImprover, setIncludeImprover] = useState<boolean>(true);
  const [displayUnit, setDisplayUnit] = useState<'g' | 'kg'>('g');
  const [decimals, setDecimals] = useState<number>(1);
  const [selectedIngId, setSelectedIngId] = useState<string>(INGREDIENTS_DATA[0].id);
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);

  const parsedFlour = Number(flourInput);
  const parsedUnitW = Number(unitWeightInput);

  // Input validation (Section 12)
  const flourError =
    flourInput.trim() === ''
      ? 'Ingresa una cantidad de harina base.'
      : isNaN(parsedFlour) || parsedFlour <= 0
      ? 'La cantidad de harina debe ser un número positivo (> 0 g).'
      : parsedFlour < 100
      ? 'Para un lote piloto representativo se recomiendan mínimo 100 g de harina.'
      : parsedFlour > 500000
      ? 'Cantidad fuera del rango de simulación de planta (máx. 500.000 g).'
      : null;

  const unitError =
    unitWeightInput.trim() === ''
      ? 'Ingresa el peso por pieza cruda.'
      : isNaN(parsedUnitW) || parsedUnitW <= 0
      ? 'El peso unitario debe ser positivo (> 0 g).'
      : parsedUnitW < 25 || parsedUnitW > 250
      ? 'Para pan tipo rollo el peso crudo habitual está entre 25 g y 250 g (Ref: 80 g).'
      : null;

  const safeFlour = !isNaN(parsedFlour) && parsedFlour > 0 ? Math.min(500000, parsedFlour) : BASE_FLOUR_G;
  const safeUnitW =
    !isNaN(parsedUnitW) && parsedUnitW >= 10 ? Math.min(500, parsedUnitW) : PILOT_UNIT_WEIGHT_G;

  const activeIngredients = INGREDIENTS_DATA.filter(
    (ing) => includeImprover || !ing.optional
  );

  const activeTotalBakerPercent = activeIngredients.reduce(
    (acc, ing) => acc + ing.bakerPercent,
    0
  );

  const totalDoughG = (safeFlour * activeTotalBakerPercent) / 100;
  const estimatedRawUnits = Math.floor(totalDoughG / safeUnitW);
  const leftoverDoughG = totalDoughG - estimatedRawUnits * safeUnitW;
  // Didactic estimate of post-bake mass assuming ~11% moisture evaporation loss in oven
  const estimatedBakedUnitWeightG = safeUnitW * 0.89;
  const scaleFactor = safeFlour / BASE_FLOUR_G;

  const formatMass = (grams: number) => {
    if (displayUnit === 'kg') {
      return `${(grams / 1000).toFixed(Math.max(2, decimals))} kg`;
    }
    return `${grams.toFixed(decimals)} g`;
  };

  const selectedIng =
    INGREDIENTS_DATA.find((i) => i.id === selectedIngId) || INGREDIENTS_DATA[0];

  const handleSetTargetUnits = (targetUnits: number) => {
    const neededDough = targetUnits * safeUnitW;
    const neededFlour = Math.round((neededDough * 100) / activeTotalBakerPercent);
    setFlourInput(String(neededFlour));
  };

  const handleSendToBatchControl = () => {
    try {
      const existingRaw = localStorage.getItem(BATCH_STORAGE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      const updated = {
        ...existing,
        batchId: existing.batchId || 'LOTE-PILOTO-01',
        flourGrams: Math.round(safeFlour),
        unitWeight: Math.round(safeUnitW),
        targetUnits: estimatedRawUnits,
        date: existing.date || new Date().toISOString().slice(0, 10),
        statuses: existing.statuses || {},
      };
      localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(updated));
      setTransferSuccess(true);
      setTimeout(() => setTransferSuccess(false), 3000);
      if (onNavigateToBatch) {
        onNavigateToBatch();
      }
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div className="space-y-6">
      {/* Pilot Formulation Academic Status Banner */}
      <div className="rounded-2xl bg-[#F3EFE6] border border-[#C87D20]/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs sm:text-sm text-[#181C23]">
          <strong className="text-[#14181F]">Naturaleza de la Formulación: </strong>
          Propuesta piloto académica para <strong>pan de sal tradicional tipo rollo (estilo pan blandito colombiano, sin relleno)</strong>{' '}
          estructurada en porcentaje panadero (Harina = 100%). No constituye una receta validada
          experimentalmente.
        </div>
        <button
          onClick={() => {
            setFlourInput(String(BASE_FLOUR_G));
            setUnitWeightInput(String(PILOT_UNIT_WEIGHT_G));
            setIncludeImprover(true);
          }}
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5DEC9] hover:bg-[#FBF9F5] text-xs font-bold text-[#14181F] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#9A3412]" />
          Restablecer base (1.000 g)
        </button>
      </div>

      {/* ==================== 1. BAKER'S PERCENTAGE CALCULATOR ==================== */}
      <section className="rounded-2xl bg-white border border-[#E5DEC9] p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#14181F] flex items-center gap-2">
              <Calculator className="w-6 h-6 text-[#C87D20]" />
              Calculadora Profesional de Porcentaje Panadero
            </h1>
            <p className="text-xs sm:text-sm text-[#5C554B] mt-0.5">
              Harina de trigo como base 100%. Todos los demás insumos escalan proporcionalmente en
              tiempo real.
            </p>
          </div>

          {/* Quick Batch Scaling Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-[#5C554B] mr-1">Escalar lote a:</span>
            {[21, 50, 100, 250].map((u) => (
              <button
                key={u}
                onClick={() => handleSetTargetUnits(u)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FBF9F5] hover:bg-[#F3EFE6] text-[#14181F] border border-[#E5DEC9] hover:border-[#C87D20] transition cursor-pointer"
              >
                ~{u} unid.
              </button>
            ))}
          </div>
        </div>

        {/* Validation Alerts */}
        {(flourError || unitError) && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              {flourError && <div className="font-semibold">• Harina base: {flourError}</div>}
              {unitError && <div className="font-semibold">• Peso por unidad: {unitError}</div>}
            </div>
          </div>
        )}

        {/* Controls & Output Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-[#FBF9F5] p-4 rounded-2xl border border-[#E5DEC9]">
          {/* Input 1: Flour Grams */}
          <div>
            <label
              htmlFor="flour-base-input"
              className="block text-xs font-bold text-[#14181F] mb-1"
            >
              Harina base (100%) [g]
            </label>
            <input
              id="flour-base-input"
              type="number"
              min={50}
              max={500000}
              step={50}
              value={flourInput}
              onChange={(e) => setFlourInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#C87D20]/60 bg-white text-sm font-mono-tech font-bold text-[#14181F]"
            />
            <div className="text-[11px] text-[#5C554B] mt-1">
              Factor de escala: <strong className="font-mono-tech">{scaleFactor.toFixed(2)}x</strong>
            </div>
          </div>

          {/* Input 2: Portion Weight */}
          <div>
            <label
              htmlFor="unit-weight-input"
              className="block text-xs font-bold text-[#14181F] mb-1"
            >
              Peso por pieza cruda [g]
            </label>
            <input
              id="unit-weight-input"
              type="number"
              min={25}
              max={250}
              step={5}
              value={unitWeightInput}
              onChange={(e) => setUnitWeightInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5DEC9] bg-white text-sm font-mono-tech font-bold text-[#14181F]"
            />
            <div className="text-[11px] text-[#5C554B] mt-1">
              Referencia piloto: <strong className="font-mono-tech">80 g</strong>
            </div>
          </div>

          {/* Precision & Units */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#14181F]">Unidades / Redondeo</span>
            </div>
            <div className="flex gap-1.5">
              {(['g', 'kg'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setDisplayUnit(u)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono-tech font-bold border cursor-pointer ${
                    displayUnit === u
                      ? 'bg-[#14181F] text-white border-[#14181F]'
                      : 'bg-white text-[#5C554B] border-[#E5DEC9]'
                  }`}
                >
                  {u}
                </button>
              ))}
              {[0, 1, 2].map((dec) => (
                <button
                  key={dec}
                  onClick={() => setDecimals(dec)}
                  title={`Redondear a ${dec} decimales`}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-tech font-bold border cursor-pointer ${
                    decimals === dec
                      ? 'bg-[#C87D20] text-white border-[#C87D20]'
                      : 'bg-white text-[#5C554B] border-[#E5DEC9]'
                  }`}
                >
                  .{dec}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-[11px] text-[#181C23] cursor-pointer pt-0.5">
              <input
                type="checkbox"
                checked={includeImprover}
                onChange={(e) => setIncludeImprover(e.target.checked)}
                className="accent-[#1B4332]"
              />
              <span>Incluir mejorante opcional (0,5%)</span>
            </label>
          </div>

          {/* KPI 1: Total Raw Dough */}
          <div className="rounded-xl bg-white p-3.5 border border-[#E5DEC9] flex flex-col justify-between">
            <div className="text-xs text-[#5C554B]">Masa cruda total</div>
            <div className="text-xl font-bold font-mono-tech text-[#9A3412]">
              {formatMass(totalDoughG)}
            </div>
            <div className="text-[11px] font-mono-tech text-[#5C554B]">
              Suma: {activeTotalBakerPercent.toFixed(1)}% panadero
            </div>
          </div>

          {/* KPI 2: Estimated Units & Yield */}
          <div className="rounded-xl bg-[#14181F] text-white p-3.5 flex flex-col justify-between">
            <div className="text-xs text-slate-300">Rendimiento estimado</div>
            <div className="text-xl font-bold font-mono-tech text-[#F4D06F]">
              ~{estimatedRawUnits} piezas
            </div>
            <div className="text-[11px] text-slate-300">
              Horneado est.: ~{estimatedBakedUnitWeightG.toFixed(0)} g/u (sobrante:{' '}
              {leftoverDoughG.toFixed(0)} g)
            </div>
          </div>
        </div>

        {/* Visual Production Scale Bar */}
        <div className="rounded-xl bg-[#F3EFE6]/70 border border-[#E5DEC9] p-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-[#14181F] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#1B4332]" />
              Distribución Proporcional de la Masa ({formatMass(totalDoughG)})
            </span>
            <button
              onClick={handleSendToBatchControl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition cursor-pointer"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              {transferSuccess
                ? '¡Enviado a Control de Lotes!'
                : 'Cargar esta fórmula en Control de Lotes →'}
            </button>
          </div>

          <div className="h-4 w-full rounded-full overflow-hidden flex border border-black/10">
            {activeIngredients.map((ing) => {
              const sharePct = (ing.bakerPercent / activeTotalBakerPercent) * 100;
              return (
                <div
                  key={ing.id}
                  style={{ width: `${sharePct}%`, backgroundColor: ing.colorHex }}
                  title={`${ing.name}: ${ing.bakerPercent}% (${sharePct.toFixed(1)}% de la masa)`}
                  className="h-full first:rounded-l-full last:rounded-r-full border-r border-black/10"
                />
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] text-[#5C554B] pt-1">
            {activeIngredients.map((ing) => (
              <span key={ing.id} className="inline-flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/15"
                  style={{ backgroundColor: ing.colorHex }}
                />
                <strong className="text-[#14181F]">{ing.name.split(' ')[0]}:</strong>{' '}
                {ing.bakerPercent}%
              </span>
            ))}
          </div>
        </div>

        {/* Ingredients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#14181F] text-white text-left">
                <th className="p-3 rounded-tl-xl">Ingrediente</th>
                <th className="p-3 font-mono-tech">% Panadero</th>
                <th className="p-3 font-mono-tech">% sobre Masa Total</th>
                <th className="p-3 font-mono-tech">Cantidad Calculada</th>
                <th className="p-3 rounded-tr-xl">Función Tecnológica</th>
              </tr>
            </thead>
            <tbody>
              {activeIngredients.map((ing, idx) => {
                const calcGrams = (safeFlour * ing.bakerPercent) / 100;
                const realShare = (ing.bakerPercent / activeTotalBakerPercent) * 100;
                const isSelected = selectedIngId === ing.id;
                return (
                  <tr
                    key={ing.id}
                    onClick={() => setSelectedIngId(ing.id)}
                    className={`border-b border-[#E5DEC9] cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#C87D20]/12'
                        : idx % 2 === 1
                        ? 'bg-[#FBF9F5] hover:bg-[#F3EFE6]'
                        : 'hover:bg-[#F3EFE6]'
                    }`}
                  >
                    <td className="p-3 font-bold text-[#14181F] flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/15"
                        style={{ backgroundColor: ing.colorHex }}
                      />
                      <span>{ing.name}</span>
                    </td>
                    <td className="p-3 font-mono-tech font-bold text-[#9A3412]">
                      {ing.bakerPercent}%
                    </td>
                    <td className="p-3 font-mono-tech text-xs text-[#5C554B]">
                      {realShare.toFixed(1)}%
                    </td>
                    <td className="p-3 font-mono-tech font-bold text-[#14181F]">
                      {formatMass(calcGrams)}
                    </td>
                    <td className="p-3 text-xs text-[#5C554B]">{ing.role}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#F3EFE6] font-bold text-[#14181F]">
                <td className="p-3 rounded-bl-xl">TOTAL LOTE CALCULADO</td>
                <td className="p-3 font-mono-tech text-[#9A3412]">
                  {activeTotalBakerPercent.toFixed(1)}%
                </td>
                <td className="p-3 font-mono-tech text-xs">100,0%</td>
                <td className="p-3 font-mono-tech text-[#1B4332]">
                  {formatMass(totalDoughG)}
                </td>
                <td className="p-3 rounded-br-xl text-xs text-[#5C554B]">
                  ~{estimatedRawUnits} piezas crudas de {safeUnitW} g
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* ==================== 2. INGREDIENT TECHNOLOGICAL DEEP DIVE ==================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-2xl bg-white border border-[#E5DEC9] p-5 shadow-sm space-y-2">
          <h2 className="text-base font-bold text-[#14181F] flex items-center gap-2 mb-3">
            <Wheat className="w-5 h-5 text-[#C87D20]" />
            Ficha Funcional por Ingrediente
          </h2>
          {INGREDIENTS_DATA.map((ing) => (
            <button
              key={ing.id}
              onClick={() => setSelectedIngId(ing.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-between ${
                selectedIngId === ing.id
                  ? 'bg-[#14181F] text-white border-[#14181F]'
                  : 'bg-[#FBF9F5] text-[#14181F] border-[#E5DEC9] hover:bg-[#F3EFE6]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15"
                  style={{ backgroundColor: ing.colorHex }}
                />
                <span className="truncate">{ing.name}</span>
              </div>
              <span className="font-mono-tech opacity-85 ml-2">{ing.bakerPercent}%</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8 rounded-2xl bg-white border border-[#E5DEC9] p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-[#14181F]">{selectedIng.name}</h3>
            <span className="px-3 py-1 rounded-full bg-[#C87D20]/15 text-[#9A3412] font-mono-tech text-xs font-bold">
              {selectedIng.bakerPercent}% panadero · Lote actual:{' '}
              {formatMass((safeFlour * selectedIng.bakerPercent) / 100)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-[#FBF9F5] p-4 border border-[#E5DEC9]">
              <div className="text-xs font-bold uppercase text-[#9A3412] mb-1">
                Función tecnológica
              </div>
              <p className="text-[#181C23] text-xs leading-relaxed">{selectedIng.role}</p>
            </div>
            <div className="rounded-xl bg-[#FBF9F5] p-4 border border-[#E5DEC9]">
              <div className="text-xs font-bold uppercase text-[#9A3412] mb-1">
                Especificación y propiedades
              </div>
              <p className="text-[#181C23] text-xs leading-relaxed">{selectedIng.properties}</p>
            </div>
            <div className="rounded-xl bg-[#1B4332]/8 p-4 border border-[#1B4332]/20">
              <div className="text-xs font-bold uppercase text-[#1B4332] mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Importancia reológica en la masa
              </div>
              <p className="text-[#181C23] text-xs leading-relaxed">
                {selectedIng.importanceInDough}
              </p>
            </div>
            <div className="rounded-xl bg-rose-50/70 p-4 border border-rose-200">
              <div className="text-xs font-bold uppercase text-rose-900 mb-1">
                Efecto de dosificación incorrecta
              </div>
              <p className="text-rose-950 text-xs leading-relaxed">
                {selectedIng.incorrectDosageEffect}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F3EFE6]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14181F] flex items-center gap-1.5 mb-2.5">
              <ArrowRightLeft className="w-4 h-4 text-[#C87D20]" />
              Alternativas y Sustituciones Tecnológicas Documentadas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {SUBSTITUTIONS_DATA.map((sub, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#E5DEC9] p-3 bg-[#FBF9F5]"
                >
                  <span className="font-bold text-[#14181F]">
                    {sub.base} → {sub.substitute}:{' '}
                  </span>
                  <span className="text-[#5C554B]">{sub.effect}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
