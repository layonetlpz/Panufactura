export type CameraPreset =
  | 'station'
  | 'follow'
  | 'closeup'
  | 'interior'
  | 'overview'
  | 'top'
  | 'side';

export type QualityLevel = 'ultra' | 'high' | 'medium' | 'low';

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

export interface KinematicSubPhase {
  range: [number, number];
  label: string;
}

export interface Phase3DConfig {
  phaseId: number;
  machineId: string;
  target: [number, number, number];
  cameraPos: [number, number, number];
  interiorPos: [number, number, number];
  interiorTarget: [number, number, number];
  doughPos: [number, number, number];
  doughEndPos?: [number, number, number];
  doughState:
    | 'ingredients'
    | 'storage_mp'
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
  subPhases: KinematicSubPhase[];
}

export const MACHINES_INFO: Record<string, MachineInfo> = {
  reception: {
    id: 'reception',
    name: 'Estación de Recepción, Báscula de Piso y Almacén PEPS',
    phaseRange: 'Fases 1 – 2',
    description:
      'Zona de ingreso con báscula de plataforma, estibas listonadas, bultos textiles de harina fortificada (50 kg), estantería metálica PEPS de 4 niveles, contenedores herméticos y termohigrómetro digital.',
    focusPosition: [-10.5, 1.0, -2.4],
    cameraPosition: [-10.5, 3.4, 2.5],
    hotspots: [
      {
        id: 'h-sacks',
        label: 'Sacos Textiles 50 kg',
        description: 'Harina fortificada (Decreto 1944/1996) con costura superior, etiqueta de lote y humedad < 14,5%.',
        position: [-11.3, 0.95, -2.1],
      },
      {
        id: 'h-floor-scale',
        label: 'Báscula de Recepción',
        description: 'Plataforma gravimétrica con columna digital para verificar remisiones de proveedor.',
        position: [-10.05, 1.15, -1.45],
      },
      {
        id: 'h-peps',
        label: 'Estantería PEPS / Termohigrómetro',
        description: 'Rotación Primeras Entradas, Primeras Salidas (< 25 °C, < 65% HR) con contenedores sellados.',
        position: [-9.45, 1.85, -3.1],
      },
    ],
  },
  scale_table: {
    id: 'scale_table',
    name: 'Estación de Dosificación Gravimétrica y Tamizado',
    phaseRange: 'Fase 3',
    description:
      'Mesa inoxidable AISI 304 con báscula digital de plataforma, balanza de precisión para microingredientes, tamiz rotatorio y recipientes separados según porcentaje panadero.',
    focusPosition: [-7.0, 1.08, -2.4],
    cameraPosition: [-7.0, 2.35, 0.85],
    hotspots: [
      {
        id: 'h-scale',
        label: 'Báscula Digital con Tara',
        description: 'Incremento dinámico de peso: 1.000 g harina (100%) + 580 g agua (58%) + menores = 1.693 g.',
        position: [-7.15, 1.52, -2.4],
      },
      {
        id: 'h-sifter',
        label: 'Tamiz Inoxidable',
        description: 'Retiene impurezas y airea la harina antes de su incorporación a la tolva.',
        position: [-7.72, 1.18, -2.4],
      },
      {
        id: 'h-micro',
        label: 'Micro-Balanza e Insumos',
        description: 'Dosificación separada de sal (18 g), levadura seca (10 g), azúcar (40 g) y grasa (40 g).',
        position: [-6.35, 1.2, -2.25],
      },
    ],
  },
  mixer: {
    id: 'mixer',
    name: 'Mezcladora y Amasadora Industrial de Espiral',
    phaseRange: 'Fases 4 – 5',
    description:
      'Amasadora de doble velocidad con bastidor en fundición, motor ventilado, cabezal de transmisión, artesa giratoria inoxidable, barra rompe-masa, gancho helicoidal 3D, rejilla articulada con enclavamiento y consola electrónica.',
    focusPosition: [-3.5, 1.05, -2.35],
    cameraPosition: [-3.5, 2.35, 0.75],
    hotspots: [
      {
        id: 'h-bowl',
        label: 'Artesa Giratoria AISI 304',
        description: 'Tazón perfilado con rotación sincronizada inversa al gancho para plegar la masa.',
        position: [-3.5, 1.02, -1.8],
      },
      {
        id: 'h-hook',
        label: 'Gancho Espiral 3D y Rompe-Masa',
        description: 'Hélice forjada que estira, comprime y oxigena la matriz de glutenina y gliadina.',
        position: [-3.5, 1.55, -2.35],
      },
      {
        id: 'h-guard',
        label: 'Rejilla con Microinterruptor',
        description: 'Guarda articulada que impide el acceso durante el ciclo y detiene el motor al abrirse.',
        position: [-3.5, 1.38, -1.9],
      },
      {
        id: 'h-ctrl',
        label: 'Consola 2 Velocidades + E-Stop',
        description: 'Vel. 1 Incorporación (3–5 min) · Vel. 2 Desarrollo de Gluten (8–12 min) y parada tipo hongo.',
        position: [-2.85, 1.72, -2.35],
      },
    ],
  },
  proofer: {
    id: 'proofer',
    name: 'Cámara de Fermentación Controlada (Climatización)',
    phaseRange: 'Fases 6 y 11',
    description:
      'Cabina térmica aislada con puerta de cristal templado, bisagras industriales, sello magnético, carro interior de 10 niveles, resistencias de calefacción, cuba humidificadora por vapor y controlador PID.',
    focusPosition: [0.5, 1.22, -2.3],
    cameraPosition: [0.5, 2.0, 0.85],
    hotspots: [
      {
        id: 'h-temp',
        label: 'Controlador PID T / HR',
        description: 'Regula 28–32 °C y 75–85% HR para actividad óptima de Saccharomyces cerevisiae.',
        position: [0.5, 2.42, -1.82],
      },
      {
        id: 'h-trays',
        label: 'Carro y Bandejas de Fermentación',
        description: 'Permite expansión orgánica de la masa sin formación de costra seca superficial.',
        position: [0.5, 1.68, -2.05],
      },
      {
        id: 'h-steam',
        label: 'Generador de Humedad',
        description: 'Cuba inferior calefactada que inyecta vapor suave manteniendo elasticidad en la corteza.',
        position: [0.5, 0.45, -1.95],
      },
    ],
  },
  shaping_table: {
    id: 'shaping_table',
    name: 'Línea de Divisora Hidráulica, Boleadora Cónica y Formadora de Rodillos',
    phaseRange: 'Fases 7 – 10 y 12',
    description:
      'Estación integrada por divisora volumétrica con cabezal de corte, boleadora cónica con canal helicoidal 3D, cámara de reposo intermedio y mesa de formado con tren laminador de rodillos para pan rollo.',
    focusPosition: [5.1, 1.08, -2.25],
    cameraPosition: [5.1, 2.5, 1.05],
    hotspots: [
      {
        id: 'h-div',
        label: 'Divisora Hidráulica de Cuchillas',
        description: 'Prensa el bloque fermentado y acciona cuchillas para separar porciones exactas de 80 g.',
        position: [3.15, 1.78, -2.45],
      },
      {
        id: 'h-round',
        label: 'Boleadora Cónica Helicoidal',
        description: 'Cono giratorio y canal espiral 3D que cierran poros y bolean cada porción.',
        position: [4.15, 1.55, -2.8],
      },
      {
        id: 'h-molder',
        label: 'Formadora de Rodillos y Laminado',
        description: 'Desgasifica suavemente y enrolla cada esfera formando el cilindro de pan de sal tipo rollo.',
        position: [5.95, 1.25, -2.25],
      },
    ],
  },
  oven: {
    id: 'oven',
    name: 'Horno Industrial de Convección Forzada',
    phaseRange: 'Fase 13',
    description:
      'Horno de cámara aislada con puerta abatible de doble cristal térmico, manija articulada, guías de bandejas, doble turbina posterior de convección, resistencias blindadas, inyección de vapor y campana extractora.',
    focusPosition: [9.35, 1.32, -2.05],
    cameraPosition: [9.35, 2.0, 0.9],
    hotspots: [
      {
        id: 'h-chamber',
        label: 'Cámara y Turbinas',
        description: 'Convección forzada a 180–200 °C: oven spring, gelatinización (~92 °C) y dorado Maillard.',
        position: [9.35, 1.82, -1.75],
      },
      {
        id: 'h-ovendoor',
        label: 'Puerta Térmica Articulada',
        description: 'Se abre automáticamente para carga (0–18%) y descarga (82–100%) de las bandejas.',
        position: [8.75, 0.88, -1.48],
      },
      {
        id: 'h-ovendisp',
        label: 'Control PID 190 °C',
        description: 'Control de temperatura, temporizador de ciclo (12–18 min) y alarma luminosa de fin de cocción.',
        position: [10.05, 2.02, -1.5],
      },
    ],
  },
  cooling_rack: {
    id: 'cooling_rack',
    name: 'Carro Escabiladero y Estación de Enfriamiento',
    phaseRange: 'Fase 14',
    description:
      'Estructura móvil inoxidable con rodachinas giratorias, 8 niveles de guías para bandejas perforadas y columna de ventilación forzada para abatir la temperatura interna a < 35 °C.',
    focusPosition: [6.0, 1.25, 2.6],
    cameraPosition: [6.0, 2.3, 5.1],
    hotspots: [
      {
        id: 'h-rack',
        label: 'Escabiladero Multinivel',
        description: 'Circulación de aire 360° durante 30–60 min para disipar vapor antes de empacar.',
        position: [6.0, 1.78, 2.6],
      },
      {
        id: 'h-fan',
        label: 'Turbina de Enfriamiento Limpio',
        description: 'Acelera la disipación térmica en zona limpia libre de polvo de harina.',
        position: [7.25, 1.65, 2.6],
      },
    ],
  },
  packaging: {
    id: 'packaging',
    name: 'Línea de Inspección, Corte de Miga, Empaque, Almacén PT y Despacho',
    phaseRange: 'Fases 15 – 18',
    description:
      'Estación con mesa luminosa de inspección, termómetro de punzón, báscula verificadora, corte transversal de miga, selladora térmica articulada, cabezal etiquetador, canastillas PEPS y furgón de distribución.',
    focusPosition: [-1.0, 1.08, 2.6],
    cameraPosition: [-1.0, 2.6, 5.6],
    hotspots: [
      {
        id: 'h-inspect',
        label: 'Inspección y Corte de Miga',
        description: 'Verifica peso, temperatura (< 35 °C), corteza dorada y estructura alveolar interna.',
        position: [1.35, 1.35, 2.6],
      },
      {
        id: 'h-seal',
        label: 'Selladora y Etiquetadora de Lote',
        description: 'Introduce los rollos en bolsa, acciona mordaza térmica e imprime lote y alérgeno gluten.',
        position: [-0.95, 1.35, 2.6],
      },
      {
        id: 'h-crates',
        label: 'Canastillas PEPS y Vehículo',
        description: 'Apilamiento ventilado sin aplastamiento y carga al furgón cerrado de distribución.',
        position: [-4.5, 1.25, 2.6],
      },
    ],
  },
};

export const PHASE_3D_CONFIGS: Phase3DConfig[] = [
  {
    phaseId: 1,
    machineId: 'reception',
    target: [-10.7, 0.75, -1.9],
    cameraPos: [-10.7, 2.65, 1.8],
    interiorPos: [-10.2, 1.45, -0.55],
    interiorTarget: [-10.7, 0.65, -1.95],
    doughPos: [-10.05, 0.22, -1.45],
    doughState: 'ingredients',
    operationLabel: 'Pesaje de recepción, inspección de sacos textiles y control de humedad',
    subPhases: [
      { range: [0.0, 0.25], label: 'Arribo de estiba y posicionamiento en plataforma de recepción' },
      { range: [0.25, 0.65], label: 'Verificación gravimétrica en báscula y control IR de temperatura' },
      { range: [0.65, 1.0], label: 'Inspección de costuras, registro de lote y liberación sanitaria' },
    ],
  },
  {
    phaseId: 2,
    machineId: 'reception',
    target: [-9.45, 1.15, -3.1],
    cameraPos: [-8.6, 2.55, 1.2],
    interiorPos: [-9.45, 1.35, -1.75],
    interiorTarget: [-9.45, 1.1, -3.2],
    doughPos: [-9.45, 1.02, -3.15],
    doughState: 'storage_mp',
    operationLabel: 'Transferencia a estantería PEPS y control higrométrico (< 25 °C, < 65% HR)',
    subPhases: [
      { range: [0.0, 0.35], label: 'Traslado de insumos liberados hacia estantería metálica PEPS' },
      { range: [0.35, 0.75], label: 'Organización por fecha de vencimiento y cierre de contenedores' },
      { range: [0.75, 1.0], label: 'Estabilización ambiental monitoreada por termohigrómetro' },
    ],
  },
  {
    phaseId: 3,
    machineId: 'scale_table',
    target: [-7.0, 1.05, -2.4],
    cameraPos: [-7.0, 2.15, 0.65],
    interiorPos: [-7.0, 1.45, -1.45],
    interiorTarget: [-7.0, 1.02, -2.42],
    doughPos: [-7.0, 0.94, -2.4],
    doughState: 'weighing',
    operationLabel: 'Dosificación progresiva en báscula digital (1.000 g harina + 580 g agua + menores)',
    subPhases: [
      { range: [0.0, 0.15], label: 'Tara de recipiente inoxidable y tamizado de harina (100%)' },
      { range: [0.15, 0.55], label: 'Incorporación gradual de harina hasta 1.000,0 g en pantalla LCD' },
      { range: [0.55, 0.85], label: 'Medición de agua potable (580 g) y micro-pesaje de sal (18 g) y levadura (10 g)' },
      { range: [0.85, 1.0], label: 'Verificación de lote completo (1.693 g) listo para mezclado' },
    ],
  },
  {
    phaseId: 4,
    machineId: 'mixer',
    target: [-3.5, 0.98, -2.35],
    cameraPos: [-3.5, 2.2, 0.55],
    interiorPos: [-3.5, 1.58, -1.55],
    interiorTarget: [-3.5, 0.78, -2.35],
    doughPos: [-3.5, 0.72, -2.35],
    doughState: 'mixing',
    operationLabel: 'Incorporación e hidratación a baja velocidad (Velocidad 1)',
    subPhases: [
      { range: [0.0, 0.15], label: 'Apertura de guarda, carga de secos e hidratación progresiva en artesa' },
      { range: [0.15, 0.3], label: 'Cierre de rejilla de seguridad y arranque en Velocidad 1 (baja)' },
      { range: [0.3, 0.85], label: 'Absorción de agua y transición de ingredientes sueltos a masa cohesiva' },
      { range: [0.85, 1.0], label: 'Incorporación de materia grasa (4%) y preparación para amasado' },
    ],
  },
  {
    phaseId: 5,
    machineId: 'mixer',
    target: [-3.5, 0.98, -2.35],
    cameraPos: [-2.6, 2.05, 0.45],
    interiorPos: [-3.5, 1.52, -1.58],
    interiorTarget: [-3.5, 0.75, -2.35],
    doughPos: [-3.5, 0.72, -2.35],
    doughState: 'kneading',
    operationLabel: 'Amasado intensivo en Velocidad 2: estiramiento, plegado y desarrollo de gluten',
    subPhases: [
      { range: [0.0, 0.12], label: 'Conmutación a Velocidad 2 en consola electrónica' },
      { range: [0.12, 0.65], label: 'Elongación, cizalla y plegado continuo entre gancho espiral y barra divisoria' },
      { range: [0.65, 0.9], label: 'Alisamiento viscoelástico y formación de la membrana de gluten (24–28 °C)' },
      { range: [0.9, 1.0], label: 'Parada suave del motor, apertura de guarda y verificación de velo' },
    ],
  },
  {
    phaseId: 6,
    machineId: 'proofer',
    target: [0.5, 1.15, -2.25],
    cameraPos: [0.5, 1.85, 0.65],
    interiorPos: [0.5, 1.32, -1.52],
    interiorTarget: [0.5, 1.12, -2.32],
    doughPos: [0.5, 1.06, -2.28],
    doughState: 'ferm1',
    operationLabel: 'Primera fermentación en bloque: expansión orgánica por generación de CO₂',
    subPhases: [
      { range: [0.0, 0.15], label: 'Ingreso de artesa/contenedor de masa en bloque a cámara climatizada' },
      { range: [0.15, 0.85], label: 'Producción de CO₂ y etanol: abombamiento orgánico progresivo de la masa' },
      { range: [0.85, 1.0], label: 'Maduración reológica alcanzada y extracción hacia divisora' },
    ],
  },
  {
    phaseId: 7,
    machineId: 'shaping_table',
    target: [3.35, 1.12, -2.35],
    cameraPos: [3.35, 2.25, 0.65],
    interiorPos: [3.15, 1.55, -1.45],
    interiorTarget: [3.15, 1.05, -2.42],
    doughPos: [3.15, 1.04, -2.42],
    doughEndPos: [3.95, 0.96, -2.25],
    doughState: 'dividing',
    operationLabel: 'Prensado hidráulico y división gradual del bloque en porciones de 80 g',
    subPhases: [
      { range: [0.0, 0.2], label: 'Colocación del bloque fermentado en cámara de alimentación de divisora' },
      { range: [0.2, 0.55], label: 'Accionamiento de palanca, descenso de cabezal y corte por cuadrícula' },
      { range: [0.55, 1.0], label: 'Ascenso del pistón y separación continua en porciones individuales de 80 g' },
    ],
  },
  {
    phaseId: 8,
    machineId: 'shaping_table',
    target: [4.35, 1.12, -2.45],
    cameraPos: [4.35, 2.2, 0.65],
    interiorPos: [4.25, 1.55, -1.55],
    interiorTarget: [4.25, 1.05, -2.65],
    doughPos: [4.15, 0.96, -2.55],
    doughEndPos: [4.95, 0.96, -2.25],
    doughState: 'rounding',
    operationLabel: 'Boleado rotacional en cono y canal helicoidal: formación de esferas tensas',
    subPhases: [
      { range: [0.0, 0.2], label: 'Ingreso de porciones irregulares a la base de la boleadora cónica' },
      { range: [0.2, 0.75], label: 'Ascenso orbital por el canal espiral redondeando y cerrando poros' },
      { range: [0.75, 1.0], label: 'Descarga de bolas lisas con tensión superficial sobre mesa inoxidable' },
    ],
  },
  {
    phaseId: 9,
    machineId: 'shaping_table',
    target: [5.25, 1.05, -2.25],
    cameraPos: [5.25, 2.15, 0.65],
    interiorPos: [5.25, 1.4, -1.45],
    interiorTarget: [5.25, 1.0, -2.25],
    doughPos: [5.25, 0.96, -2.25],
    doughState: 'resting',
    operationLabel: 'Reposo intermedio bajo cubierta protectora: relajación viscoelástica (10–15 min)',
    subPhases: [
      { range: [0.0, 0.2], label: 'Colocación de campana/cubierta higiénica sobre las bolas de masa' },
      { range: [0.2, 0.85], label: 'Relajación de tensiones de la red de gluten sin pérdida de humedad' },
      { range: [0.85, 1.0], label: 'Retiro de cubierta protectora con piezas extensibles listas para laminar' },
    ],
  },
  {
    phaseId: 10,
    machineId: 'shaping_table',
    target: [6.15, 1.08, -2.25],
    cameraPos: [6.15, 2.15, 0.65],
    interiorPos: [6.25, 1.45, -1.42],
    interiorTarget: [6.25, 1.0, -2.25],
    doughPos: [6.15, 0.98, -2.25],
    doughEndPos: [6.35, 0.98, -2.25],
    doughState: 'shaping',
    operationLabel: 'Laminado por rodillos y enrollado cilíndrico del pan de sal tipo rollo',
    subPhases: [
      { range: [0.0, 0.3], label: 'Paso de las esferas por rodillos laminadores para desgasificado uniforme' },
      { range: [0.3, 0.75], label: 'Enrollado progresivo sobre sí mismas formando los pliegues del rollo' },
      { range: [0.75, 1.0], label: 'Alineación en bandeja perforada con costura de cierre en la base' },
    ],
  },
  {
    phaseId: 11,
    machineId: 'proofer',
    target: [0.5, 1.24, -2.2],
    cameraPos: [0.5, 1.9, 0.7],
    interiorPos: [0.5, 1.36, -1.48],
    interiorTarget: [0.5, 1.24, -2.25],
    doughPos: [0.5, 1.24, -2.22],
    doughState: 'proofing',
    operationLabel: 'Fermentación final en cámara (28–32 °C, 80% HR): crecimiento volumétrico del rollo',
    subPhases: [
      { range: [0.0, 0.15], label: 'Apertura de puerta e introducción de bandeja de rollos al carro interior' },
      { range: [0.15, 0.85], label: 'Humidificación activa y expansión orgánica hasta duplicar/triplicar volumen' },
      { range: [0.85, 1.0], label: 'Verificación de resiliencia táctil y extracción hacia estación de acabado' },
    ],
  },
  {
    phaseId: 12,
    machineId: 'shaping_table',
    target: [6.3, 1.05, -2.25],
    cameraPos: [6.3, 2.1, 0.65],
    interiorPos: [6.3, 1.4, -1.45],
    interiorTarget: [6.3, 1.0, -2.25],
    doughPos: [6.3, 0.98, -2.25],
    doughState: 'scoring',
    operationLabel: 'Acondicionamiento superficial suave previo al ingreso al horno',
    subPhases: [
      { range: [0.0, 0.3], label: 'Posicionamiento de bandeja fermentada frente al cabezal de acabado' },
      { range: [0.3, 0.8], label: 'Nebulización/barnizado higiénico de superficie sin desinflar los alvéolos' },
      { range: [0.8, 1.0], label: 'Transferencia inmediata hacia la boca de carga del horno industrial' },
    ],
  },
  {
    phaseId: 13,
    machineId: 'oven',
    target: [9.45, 1.38, -2.05],
    cameraPos: [9.45, 2.1, 1.22],
    interiorPos: [9.35, 1.42, -1.35],
    interiorTarget: [9.35, 1.32, -2.15],
    doughPos: [9.35, 1.35, -2.05],
    doughState: 'baking',
    operationLabel: 'Ciclo de horneado: carga, convección 190 °C, oven spring, Maillard y descarga',
    subPhases: [
      { range: [0.0, 0.18], label: 'Apertura de puerta térmica e introducción de bandeja sobre rieles' },
      { range: [0.18, 0.45], label: 'Cierre hermético, encendido de turbinas y salto de horno (oven spring)' },
      { range: [0.45, 0.82], label: 'Gelatinización de almidón (~92 °C) y dorado progresivo de corteza (Maillard)' },
      { range: [0.82, 1.0], label: 'Fin de ciclo, apertura de puerta y extracción de pan rollo dorado' },
    ],
  },
  {
    phaseId: 14,
    machineId: 'cooling_rack',
    target: [6.0, 1.28, 2.6],
    cameraPos: [6.0, 2.25, 4.9],
    interiorPos: [6.0, 1.4, 3.85],
    interiorTarget: [6.0, 1.28, 2.6],
    doughPos: [6.0, 1.31, 2.6],
    doughState: 'cooling',
    operationLabel: 'Inserción en carro escabiladero y disipación térmica ventilada (< 35 °C)',
    subPhases: [
      { range: [0.0, 0.25], label: 'Deslizamiento de bandeja caliente al nivel central del escabiladero' },
      { range: [0.25, 0.8], label: 'Convección de aire limpio y liberación de vapor hasta < 35 °C en el núcleo' },
      { range: [0.8, 1.0], label: 'Estabilización de miga y corteza lista para control de calidad' },
    ],
  },
  {
    phaseId: 15,
    machineId: 'packaging',
    target: [1.35, 1.05, 2.6],
    cameraPos: [1.35, 2.05, 4.45],
    interiorPos: [1.35, 1.32, 3.55],
    interiorTarget: [1.35, 1.02, 2.6],
    doughPos: [1.35, 0.96, 2.6],
    doughState: 'inspection',
    operationLabel: 'Inspección sensorial, termometría de punzón y corte transversal de miga',
    subPhases: [
      { range: [0.0, 0.3], label: 'Llegada de bandeja bajo luminaria de inspección y control de peso' },
      { range: [0.3, 0.65], label: 'Punción térmica en centro del rollo (< 35 °C) para prevenir condensación' },
      { range: [0.65, 1.0], label: 'Evaluación de corte transversal: alvéolos irregulares y miga blanda conforme' },
    ],
  },
  {
    phaseId: 16,
    machineId: 'packaging',
    target: [-0.85, 1.08, 2.6],
    cameraPos: [-0.85, 2.15, 4.65],
    interiorPos: [-0.85, 1.4, 3.65],
    interiorTarget: [-0.85, 1.02, 2.65],
    doughPos: [-0.55, 0.96, 2.75],
    doughEndPos: [-0.95, 0.96, 2.75],
    doughState: 'packaging',
    operationLabel: 'Embolsado grado alimentario, sellado térmico por impulso y rotulado de lote',
    subPhases: [
      { range: [0.0, 0.35], label: 'Ingreso de los rollos enfriados dentro de bolsa de polietileno alimentario' },
      { range: [0.35, 0.7], label: 'Descenso de mordaza térmica y sellado hermético continuo' },
      { range: [0.7, 1.0], label: 'Aplicación de etiqueta trazable (Lote, Vencimiento y Alérgeno: Gluten)' },
    ],
  },
  {
    phaseId: 17,
    machineId: 'packaging',
    target: [-4.5, 0.95, 2.6],
    cameraPos: [-4.5, 2.35, 5.1],
    interiorPos: [-4.5, 1.45, 4.0],
    interiorTarget: [-4.5, 0.95, 2.6],
    doughPos: [-3.6, 1.05, 2.6],
    doughEndPos: [-4.5, 1.18, 2.6],
    doughState: 'storage_pt',
    operationLabel: 'Acomodación en canastillas plásticas ventiladas bajo rotación PEPS',
    subPhases: [
      { range: [0.0, 0.4], label: 'Traslado del paquete sellado hacia la torre de canastillas azules PEPS' },
      { range: [0.4, 0.85], label: 'Acomodación sin compresión para preservar la estructura del pan blandito' },
      { range: [0.85, 1.0], label: 'Registro de inventario de producto terminado listo para despacho' },
    ],
  },
  {
    phaseId: 18,
    machineId: 'packaging',
    target: [-7.6, 1.05, 2.6],
    cameraPos: [-7.0, 2.6, 5.8],
    interiorPos: [-6.4, 1.35, 4.2],
    interiorTarget: [-7.8, 1.05, 2.6],
    doughPos: [-5.8, 1.05, 2.6],
    doughEndPos: [-7.45, 1.05, 2.6],
    doughState: 'distribution',
    operationLabel: 'Carga de canastillas en furgón cerrado e higienizado para distribución final',
    subPhases: [
      { range: [0.0, 0.25], label: 'Apertura de compuertas traseras del vehículo limpio de distribución' },
      { range: [0.25, 0.75], label: 'Desplazamiento y estibado de canastillas de pan rollo en furgón' },
      { range: [0.75, 1.0], label: 'Cierre de furgón y salida hacia puntos de comercialización' },
    ],
  },
];
