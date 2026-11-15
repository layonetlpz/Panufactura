import React, { useState } from 'react';
import { Calculator, Wheat, ArrowRightLeft } from 'lucide-react';
import {
  INGREDIENTS_DATA,
  SUBSTITUTIONS_DATA,
  PILOT_UNIT_WEIGHT_G,
  TOTAL_BAKER_PERCENT,
} from '../data/formulationData';

export const FormulationView: React.FC = () => {
  const [flourGrams, setFlourGrams] = useState<number>(1000);
  const [unitWeight, setUnitWeight] = useState<number>(PILOT_UNIT_WEIGHT_G);
  const [selectedIngId, setSelectedIngId] = useState<string>(INGREDIENTS_DATA[0].id);

  const safeFlour = Math.max(100, flourGrams || 0);
  const safeUnitW = Math.max(30, unitWeight || PILOT_UNIT_WEIGHT_G);
  const totalDough = (safeFlour * TOTAL_BAKER_PERCENT) / 100;
  const estimatedUnits = Math.floor(totalDough / safeUnitW);

  const selectedIng = INGREDIENTS_DATA.find((i) => i.id === selectedIngId) || INGREDIENTS_DATA[0];

  const handleSetTargetUnits = (targetUnits: number) => {
    const neededDough = targetUnits * safeUnitW;
    const neededFlour = Math.round((neededDough * 100) / TOTAL_BAKER_PERCENT);
    setFlourGrams(neededFlour);
  };

  return (
    <div className="space-y-6">
      {/* Calculator */}
      <section className="rounded-2xl bg-white border border-[#E7DFD3] p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
              <Calculator className="w-6 h-6 text-amber-600" />
              Calculadora de Formulación Piloto (Porcentaje Panadero)
            </h1>
            <p className="text-sm text-[#6B5E53] mt-1">
              Basada en harina = 100%. Los rendimientos son estimaciones teóricas antes de pérdidas por manipulación y horneado.
            </p>
          </div>

          <div className="flex gap-2">
            {[20, 40, 100].map((u) => (
              <button
                key={u}
                onClick={() => handleSetTargetUnits(u)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition cursor-pointer"
              >
                Escalar a ~{u} unid.
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-[#FAF6F0] p-4 rounded-xl border border-[#E7DFD3]">
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-1">Harina base (g)</label>
            <input
              type="number"
              min={100}
              step={50}
              value={flourGrams}
              onChange={(e) => setFlourGrams(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-bold text-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-1">Peso por unidad cruda (g)</label>
            <input
              type="number"
              min={30}
              max={200}
              step={5}
              value={unitWeight}
              onChange={(e) => setUnitWeight(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-bold text-[#1E293B]"
            />
          </div>
          <div className="rounded-lg bg-white p-3 border border-slate-200">
            <div className="text-xs text-slate-500">Masa cruda total estimada</div>
            <div className="text-xl font-bold text-amber-700">{totalDough.toFixed(0)} g</div>
            <div className="text-[11px] text-slate-400">169,3% panadero</div>
          </div>
          <div className="rounded-lg bg-white p-3 border border-slate-200">
            <div className="text-xs text-slate-500">Unidades crudas estimadas</div>
            <div className="text-xl font-bold text-[#1E293B]">~{estimatedUnits} piezas</div>
            <div className="text-[11px] text-slate-400">De {safeUnitW} g c/u (estimado)</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#1E293B] text-white text-left">
                <th className="p-3 rounded-tl-lg">Ingrediente</th>
                <th className="p-3">% Panadero</th>
                <th className="p-3">Cantidad calculada (g)</th>
                <th className="p-3 rounded-tr-lg">Función tecnológica</th>
              </tr>
            </thead>
            <tbody>
              {INGREDIENTS_DATA.map((ing, idx) => {
                const calcG = ((safeFlour * ing.bakerPercent) / 100).toFixed(1);
                return (
                  <tr
                    key={ing.id}
                    onClick={() => setSelectedIngId(ing.id)}
                    className={`border-b border-slate-200 cursor-pointer transition ${
                      selectedIngId === ing.id
                        ? 'bg-amber-50'
                        : idx % 2 === 1
                        ? 'bg-slate-50/70 hover:bg-amber-50/40'
                        : 'hover:bg-amber-50/40'
                    }`}
                  >
                    <td className="p-3 font-semibold text-[#1E293B] flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: ing.colorHex }} />
                      {ing.name}
                    </td>
                    <td className="p-3 font-bold text-amber-800">{ing.bakerPercent}%</td>
                    <td className="p-3 font-bold text-[#1E293B]">{calcG} g</td>
                    <td className="p-3 text-slate-600">{ing.role}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ingredient Deep Dive */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-2xl bg-white border border-[#E7DFD3] p-5 shadow-sm space-y-2">
          <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2 mb-3">
            <Wheat className="w-5 h-5 text-amber-600" />
            Detalle por ingrediente
          </h2>
          {INGREDIENTS_DATA.map((ing) => (
            <button
              key={ing.id}
              onClick={() => setSelectedIngId(ing.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium border transition cursor-pointer flex items-center justify-between ${
                selectedIngId === ing.id
                  ? 'bg-[#1E293B] text-white border-[#1E293B]'
                  : 'bg-[#FAF6F0] text-[#1E293B] border-[#E7DFD3] hover:bg-amber-50'
              }`}
            >
              <span>{ing.name}</span>
              <span className="text-xs font-bold opacity-80">{ing.bakerPercent}%</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8 rounded-2xl bg-white border border-[#E7DFD3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#1E293B]">{selectedIng.name}</h3>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              {selectedIng.bakerPercent}% ({selectedIng.baseGrams} g base)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-[#FAF6F0] p-4 border border-[#E7DFD3]">
              <div className="text-xs font-bold uppercase text-amber-900 mb-1">Función tecnológica</div>
              <p className="text-[#4A3F35]">{selectedIng.role}</p>
            </div>
            <div className="rounded-xl bg-[#FAF6F0] p-4 border border-[#E7DFD3]">
              <div className="text-xs font-bold uppercase text-amber-900 mb-1">Propiedades relevantes</div>
              <p className="text-[#4A3F35]">{selectedIng.properties}</p>
            </div>
            <div className="rounded-xl bg-emerald-50/60 p-4 border border-emerald-200">
              <div className="text-xs font-bold uppercase text-emerald-900 mb-1">Importancia en la masa</div>
              <p className="text-emerald-950">{selectedIng.importanceInDough}</p>
            </div>
            <div className="rounded-xl bg-rose-50/60 p-4 border border-rose-200">
              <div className="text-xs font-bold uppercase text-rose-900 mb-1">Consecuencias de dosificación incorrecta</div>
              <p className="text-rose-950">{selectedIng.incorrectDosageEffect}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-sm font-bold text-[#1E293B] flex items-center gap-1.5 mb-2">
              <ArrowRightLeft className="w-4 h-4 text-amber-600" />
              Sustituciones posibles documentadas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {SUBSTITUTIONS_DATA.map((sub, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-2.5 bg-slate-50">
                  <span className="font-bold text-[#1E293B]">{sub.base} → {sub.substitute}: </span>
                  <span className="text-slate-600">{sub.effect}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
