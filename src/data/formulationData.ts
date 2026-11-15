export interface IngredientData {
  id: string;
  name: string;
  bakerPercent: number;
  baseGrams: number;
  role: string;
  properties: string;
  importanceInDough: string;
  incorrectDosageEffect: string;
  colorHex: string;
  optional?: boolean;
}

export const PILOT_UNIT_WEIGHT_G = 80;
export const TOTAL_BAKER_PERCENT = 169.3;
export const BASE_FLOUR_G = 1000;

export const INGREDIENTS_DATA: IngredientData[] = [
  {
    id: 'flour',
    name: 'Harina de trigo para panificación',
    bakerPercent: 100,
    baseGrams: 1000,
    role: 'Base estructural: aporta almidón y proteínas formadoras de gluten (glutenina y gliadina).',
    properties: 'Harina fortificada (Decreto 1944/1996), idealmente con 10–11% de proteína y humedad < 14,5%.',
    importanceInDough: 'Es el ingrediente de referencia (100%). Al hidratarse y amasarse forma la red viscoelástica que retiene el gas.',
    incorrectDosageEffect: 'Una harina muy débil o mal dosificada genera masa pegajosa, incapaz de retener CO₂ y pan de bajo volumen.',
    colorHex: '#F3E5AB'
  },
  {
    id: 'water',
    name: 'Agua potable',
    bakerPercent: 58,
    baseGrams: 580,
    role: 'Hidrata proteínas y almidón; actúa como solvente y medio para la actividad enzimática.',
    properties: 'Agua potable limpia, cuya temperatura se ajusta según la temperatura ambiental para lograr masa a 24–28 °C.',
    importanceInDough: 'Permite la unión de glutenina y gliadina y regula la consistencia de la masa.',
    incorrectDosageEffect: 'Exceso: masa demasiado pegajosa y difícil de formar. Déficit: masa rígida, miga seca y compacta.',
    colorHex: '#38BDF8'
  },
  {
    id: 'yeast',
    name: 'Levadura seca instantánea',
    bakerPercent: 1,
    baseGrams: 10,
    role: 'Agente leudante biológico (Saccharomyces cerevisiae).',
    properties: 'Microorganismo vivo deshidratado que fermenta azúcares produciendo CO₂, etanol y compuestos aromáticos.',
    importanceInDough: 'Genera el gas que expande la red de gluten y da volumen y esponjosidad al pan.',
    incorrectDosageEffect: 'Exceso: sobrefermentación rápida, sabor ácido y colapso en horno. Déficit: pan pesado, denso y de bajo volumen.',
    colorHex: '#D97706'
  },
  {
    id: 'sugar',
    name: 'Azúcar',
    bakerPercent: 4,
    baseGrams: 40,
    role: 'Sustrato fermentable inicial, aporta dulzor suave y favorece el dorado de la corteza.',
    properties: 'Sacarosa refinada soluble; participa en reacciones de caramelización y pardeamiento de Maillard.',
    importanceInDough: 'Alimenta parcialmente a la levadura, suaviza la miga y contribuye al color dorado característico.',
    incorrectDosageEffect: 'Exceso: corteza excesivamente oscura o quemada y retardo osmótico de la levadura. Déficit: corteza pálida y menor suavidad.',
    colorHex: '#E2E8F0'
  },
  {
    id: 'salt',
    name: 'Sal',
    bakerPercent: 1.8,
    baseGrams: 18,
    role: 'Fortalece la red de gluten, regula la velocidad de fermentación y realza el sabor.',
    properties: 'Cloruro de sodio refinado. No debe entrar en contacto directo y prolongado con la levadura antes de mezclar.',
    importanceInDough: 'Controla el ritmo fermentativo evitando fermentaciones desbocadas y aporta el perfil de pan de sal.',
    incorrectDosageEffect: 'Exceso: inhibe la levadura generando pan pequeño y salado. Déficit (u olvido): masa débil, fermentación descontrolada y pan insípido.',
    colorHex: '#CBD5E1'
  },
  {
    id: 'fat',
    name: 'Manteca vegetal o margarina',
    bakerPercent: 4,
    baseGrams: 40,
    role: 'Lubrica la red de gluten, suaviza la miga y retarda el endurecimiento (retrogradación).',
    properties: 'Grasa plástica panadera de grado alimentario.',
    importanceInDough: 'Mejora la extensibilidad de la masa y confiere la textura blandita característica del pan rollo colombiano.',
    incorrectDosageEffect: 'Exceso: debilita en exceso el gluten reduciendo volumen y dejando textura grasosa. Déficit: miga más seca y envejecimiento rápido.',
    colorHex: '#FACC15'
  },
  {
    id: 'improver',
    name: 'Mejorante panario (Opcional)',
    bakerPercent: 0.5,
    baseGrams: 5,
    role: 'Estabiliza la fermentación, mejora volumen y uniformidad de la miga.',
    properties: 'Mezcla tecnológica opcional (enzimas, emulsionantes, ácido ascórbico).',
    importanceInDough: 'Brinda tolerancia operativa ante variaciones de harina o tiempos de proceso; puede omitirse si se controla bien el amasado.',
    incorrectDosageEffect: 'Exceso: miga excesivamente abierta o frágil. Omisión: requiere mayor precisión en amasado y fermentación.',
    colorHex: '#A78BFA',
    optional: true
  }
];

export const SUBSTITUTIONS_DATA = [
  { base: 'Manteca vegetal', substitute: 'Mantequilla', effect: 'Mayor aroma y sabor lácteo; posible coloración más intensa.' },
  { base: 'Manteca vegetal', substitute: 'Aceite vegetal', effect: 'Miga suave, pero menor estructura plástica y ausencia de sabor lácteo.' },
  { base: 'Azúcar', substitute: 'Panela o miel', effect: 'Coloración más intensa, aroma distinto y mayor riesgo de dorado excesivo.' },
  { base: 'Levadura seca instantánea', substitute: 'Levadura fresca (3%–4%)', effect: 'Requiere ajustar cantidad (aprox. triple de peso) y validar hidratación/tiempo.' },
  { base: 'Harina refinada', substitute: 'Harina integral parcial', effect: 'Mayor fibra y color más oscuro; posible menor volumen y miga más densa.' },
  { base: 'Mejorante', substitute: 'Ninguno (o leche en polvo 2%)', effect: 'Producto más limpio; la leche en polvo mejora color de corteza y aroma.' },
];
