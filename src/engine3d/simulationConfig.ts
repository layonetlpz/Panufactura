export type CameraPreset = 'station' | 'overview' | 'closeup' | 'top' | 'side';
export type QualityLevel = 'high' | 'medium' | 'low';

export interface SimulationVariables {
  kneadTime: number;      // ref: 8-12 min
  fermTime: number;       // ref: 45-60 min
  fermTemp: number;       // ref: 28-32 °C
  fermHumidity: number;   // ref: 75-85 %
  portionWeight: number;  // ref: 80 g
  bakeTemp: number;       // ref: 180-200 °C
  bakeTime: number;       // ref: 12-18 min
}

export const DEFAULT_SIM_VARS: SimulationVariables = {
  kneadTime: 10,
  fermTime: 52,
  fermTemp: 30,
  fermHumidity: 80,
  portionWeight: 80,
  bakeTemp: 190,
  bakeTime: 15,
};

export interface HotspotInfo {
  id: string;
  label: string;
  description: string;
  position: [number, number, number];
}

export interface MachineInfo {
  id: string;
  name: string;
  phaseRange: string;
  description: string;
  focusPosition: [number, number, number];
  cameraPosition: [number, number, number];
  hotspots: HotspotInfo[];
}

export interface Phase3DConfig {
  phaseId: number;
  machineId: string;
  target: [number, number, number];
  cameraPos: [number, number, number];
  doughPos: [number, number, number];
  doughState:
    | 'ingredients'
    | 'weighing'
    | 'mixing'
    | 'kneading'
    | 'ferm1'
    | 'dividing'
    | 'rounding'
    | 'resting'
    | 'shaping'
    | 'proofing'
    | 'scoring'
    | 'baking'
    | 'cooling'
    | 'inspection'
    | 'packaging'
    | 'storage_pt'
    | 'distribution';
  operationLabel: string;
}

// Plant layout arranged cleanly from left (-11) to right (+11) in two industrial rows
export const MACHINES_INFO: Record<string, MachineInfo> = {
  reception: {
    id: 'reception',
    name: 'Área de Recepción y Almacenamiento MP',
    phaseRange: 'Fases 1 – 2',
    description: 'Plataforma con estibas, sacos de harina fortificada, contenedores sellados y estantería PEPS con termohigrómetro.',
    focusPosition: [-10.5, 1.0, -2.5],
    cameraPosition: [-10.5, 4.2, 3.2],
    hotspots: [
      { id: 'h-sacks', label: 'Sacos de Harina', description: 'Harina fortificada (Decreto 1944/1996), humedad < 14,5%.', position: [-11.3, 1.2, -2.2] },
      { id: 'h-peps', label: 'Estantería PEPS', description: 'Rotación Primeras Entradas, Primeras Salidas (< 25 °C, < 65% HR).', position: [-9.5, 1.7, -3.2] },
    ],
  },
  scale_table: {
    id: 'scale_table',
    name: 'Estación de Pesaje y Dosificación',
    phaseRange: 'Fase 3',
    description: 'Mesa inoxidable con báscula digital de plataforma y balanza de precisión para ingredientes menores según porcentaje panadero.',
    focusPosition: [-7.0, 1.1, -2.5],
    cameraPosition: [-7.0, 3.2, 1.8],
    hotspots: [
      { id: 'h-scale', label: 'Báscula Calibrada', description: 'Pesa 1.000 g de harina (100%) y 580 g de agua (58%).', position: [-7.0, 1.35, -2.4] },
      { id: 'h-micro', label: 'Ingredientes Menores', description: 'Sal (1,8%) y levadura seca (1%) separados antes de mezclar.', position: [-6.2, 1.25, -2.5] },
    ],
  },
  mixer: {
    id: 'mixer',
    name: 'Mezcladora y Amasadora de Espiral',
    phaseRange: 'Fases 4 – 5',
    description: 'Equipo con tolva giratoria de acero inoxidable, gancho espiral y panel de control de 2 velocidades para desarrollar la red de gluten.',
    focusPosition: [-3.5, 1.2, -2.5],
    cameraPosition: [-3.5, 3.4, 2.0],
    hotspots: [
      { id: 'h-bowl', label: 'Recipiente (Tolva)', description: 'Acero inoxidable grado alimentario con rotación continua.', position: [-3.5, 1.25, -2.2] },
      { id: 'h-hook', label: 'Herramienta Espiral', description: 'Estira y pliega la masa hasta superar la prueba del velo.', position: [-3.5, 1.55, -2.5] },
      { id: 'h-ctrl', label: 'Panel de Control', description: 'Vel. 1 Mezclado (3–5 min) · Vel. 2 Amasado (8–12 min).', position: [-2.7, 1.7, -2.6] },
    ],
  },
  proofer: {
    id: 'proofer',
    name: 'Cámara de Fermentación',
    phaseRange: 'Fases 6 y 11',
    description: 'Cabina térmica con puerta de vidrio, control digital de temperatura (28–32 °C) y humedad relativa (75–85% HR).',
    focusPosition: [0.5, 1.4, -2.6],
    cameraPosition: [0.5, 3.2, 2.4],
    hotspots: [
      { id: 'h-temp', label: 'Indicador T / HR', description: 'Mantiene 28–32 °C y 75–85% HR evitando formación de costra.', position: [0.5, 2.55, -1.9] },
      { id: 'h-trays', label: 'Bandejas Interiores', description: 'Soportan las piezas mientras duplican/triplican su volumen.', position: [0.5, 1.4, -2.3] },
    ],
  },
  shaping_table: {
    id: 'shaping_table',
    name: 'Divisora, Boleado y Estación de Formado',
    phaseRange: 'Fases 7 – 10',
    description: 'Línea de porcionado (80 g), redondeado con tensión superficial, reposo cubierto (10–15 min) y enrollado cilíndrico.',
    focusPosition: [4.8, 1.1, -2.3],
    cameraPosition: [4.8, 3.4, 2.2],
    hotspots: [
      { id: 'h-div', label: 'Divisora de Masa', description: 'Fracciona el bloque en porciones uniformes de 80 g.', position: [3.8, 1.45, -2.4] },
      { id: 'h-form', label: 'Mesa de Boleado y Formado', description: 'Forma esferas tensas y luego rollos con costura hacia abajo.', position: [5.3, 1.15, -2.2] },
    ],
  },
  oven: {
    id: 'oven',
    name: 'Horno Industrial de Convección',
    phaseRange: 'Fases 12 – 13',
    description: 'Cámara de cocción aislada con iluminación interior, resistencias térmicas, temporizador y control de 180–200 °C.',
    focusPosition: [9.5, 1.4, -2.4],
    cameraPosition: [9.5, 3.2, 2.6],
    hotspots: [
      { id: 'h-chamber', label: 'Cámara de Cocción', description: 'Gelatinización de almidón, coagulación y dorado Maillard.', position: [9.5, 1.4, -1.7] },
      { id: 'h-ovendisp', label: 'Indicador 190 °C / Timer', description: 'Ciclo de 12–18 min hasta T interna ~82–96 °C.', position: [10.4, 2.25, -1.7] },
    ],
  },
  cooling_rack: {
    id: 'cooling_rack',
    name: 'Rejillas de Enfriamiento (Escabiladero)',
    phaseRange: 'Fase 14',
    description: 'Carro multinivel en acero inoxidable que permite disipar calor y vapor hasta alcanzar < 35 °C antes del empaque.',
    focusPosition: [6.0, 1.2, 2.6],
    cameraPosition: [6.0, 3.0, 6.8],
    hotspots: [
      { id: 'h-rack', label: 'Rejillas Ventiladas', description: 'Evitan condensación dentro de la bolsa (30–60 min).', position: [6.0, 1.5, 2.6] },
    ],
  },
  packaging: {
    id: 'packaging',
    name: 'Estación de Inspección, Empaque y Despacho',
    phaseRange: 'Fases 15 – 18',
    description: 'Mesa de control de calidad, selladora térmica, etiquetado de lote/alérgenos, canastillas PEPS y bahía de distribución.',
    focusPosition: [-1.0, 1.1, 2.6],
    cameraPosition: [-1.0, 3.4, 7.2],
    hotspots: [
      { id: 'h-seal', label: 'Selladora y Rotulado', description: 'Bolsa grado alimentario, sello hermético y aviso de gluten.', position: [-0.8, 1.35, 2.6] },
      { id: 'h-crates', label: 'Canastillas PEPS y Despacho', description: 'Almacenamiento sin aplastamiento y transporte limpio.', position: [-4.8, 1.1, 2.6] },
    ],
  },
};

export const PHASE_3D_CONFIGS: Phase3DConfig[] = [
  { phaseId: 1, machineId: 'reception', target: [-10.5, 1.0, -2.5], cameraPos: [-10.5, 3.8, 2.8], doughPos: [-10.8, 1.05, -2.2], doughState: 'ingredients', operationLabel: 'Inspección de sacos e insumos' },
  { phaseId: 2, machineId: 'reception', target: [-9.5, 1.4, -3.0], cameraPos: [-8.2, 3.5, 2.2], doughPos: [-9.5, 1.2, -3.0], doughState: 'ingredients', operationLabel: 'Almacenamiento PEPS/FIFO' },
  { phaseId: 3, machineId: 'scale_table', target: [-7.0, 1.1, -2.5], cameraPos: [-7.0, 3.0, 1.4], doughPos: [-7.0, 1.18, -2.4], doughState: 'weighing', operationLabel: 'Pesaje exacto (% panadero)' },
  { phaseId: 4, machineId: 'mixer', target: [-3.5, 1.2, -2.5], cameraPos: [-3.5, 3.0, 1.4], doughPos: [-3.5, 1.18, -2.35], doughState: 'mixing', operationLabel: 'Mezclado a baja velocidad' },
  { phaseId: 5, machineId: 'mixer', target: [-3.5, 1.2, -2.5], cameraPos: [-2.2, 2.6, 1.0], doughPos: [-3.5, 1.18, -2.35], doughState: 'kneading', operationLabel: 'Amasado y desarrollo de gluten' },
  { phaseId: 6, machineId: 'proofer', target: [0.5, 1.3, -2.5], cameraPos: [0.5, 2.8, 1.8], doughPos: [0.5, 1.25, -2.5], doughState: 'ferm1', operationLabel: 'Primera fermentación en bloque' },
  { phaseId: 7, machineId: 'shaping_table', target: [4.2, 1.1, -2.4], cameraPos: [4.2, 2.9, 1.4], doughPos: [4.2, 1.12, -2.3], doughState: 'dividing', operationLabel: 'División en porciones de 80 g' },
  { phaseId: 8, machineId: 'shaping_table', target: [5.2, 1.1, -2.3], cameraPos: [5.2, 2.8, 1.3], doughPos: [5.2, 1.12, -2.3], doughState: 'rounding', operationLabel: 'Boleado con tensión superficial' },
  { phaseId: 9, machineId: 'shaping_table', target: [5.2, 1.1, -2.3], cameraPos: [5.8, 2.7, 1.4], doughPos: [5.2, 1.12, -2.3], doughState: 'resting', operationLabel: 'Reposo intermedio cubierto' },
  { phaseId: 10, machineId: 'shaping_table', target: [5.6, 1.1, -2.3], cameraPos: [6.2, 2.7, 1.3], doughPos: [5.6, 1.12, -2.3], doughState: 'shaping', operationLabel: 'Formado en rollos cilíndricos' },
  { phaseId: 11, machineId: 'proofer', target: [0.5, 1.4, -2.5], cameraPos: [0.5, 2.7, 1.6], doughPos: [0.5, 1.35, -2.5], doughState: 'proofing', operationLabel: 'Fermentación final (28–32 °C, 80% HR)' },
  { phaseId: 12, machineId: 'shaping_table', target: [7.4, 1.1, -2.3], cameraPos: [7.4, 2.6, 1.2], doughPos: [7.4, 1.12, -2.3], doughState: 'scoring', operationLabel: 'Acabado superficial (opcional)' },
  { phaseId: 13, machineId: 'oven', target: [9.5, 1.4, -2.4], cameraPos: [9.5, 2.8, 2.0], doughPos: [9.5, 1.35, -2.2], doughState: 'baking', operationLabel: 'Horneado (180–200 °C, Maillard)' },
  { phaseId: 14, machineId: 'cooling_rack', target: [6.0, 1.3, 2.6], cameraPos: [6.0, 2.8, 6.2], doughPos: [6.0, 1.35, 2.6], doughState: 'cooling', operationLabel: 'Enfriamiento en rejillas (< 35 °C)' },
  { phaseId: 15, machineId: 'packaging', target: [1.5, 1.1, 2.6], cameraPos: [1.5, 2.8, 6.0], doughPos: [1.5, 1.12, 2.6], doughState: 'inspection', operationLabel: 'Inspección y control de calidad' },
  { phaseId: 16, machineId: 'packaging', target: [-1.0, 1.1, 2.6], cameraPos: [-1.0, 2.8, 6.0], doughPos: [-1.0, 1.15, 2.6], doughState: 'packaging', operationLabel: 'Empaque hermético y rotulado' },
  { phaseId: 17, machineId: 'packaging', target: [-4.5, 1.0, 2.6], cameraPos: [-4.5, 3.0, 6.4], doughPos: [-4.5, 1.0, 2.6], doughState: 'storage_pt', operationLabel: 'Almacenamiento PT en canastillas PEPS' },
  { phaseId: 18, machineId: 'packaging', target: [-8.5, 1.2, 2.6], cameraPos: [-7.5, 3.4, 7.2], doughPos: [-8.5, 1.2, 2.6], doughState: 'distribution', operationLabel: 'Distribución en vehículo limpio' },
];
