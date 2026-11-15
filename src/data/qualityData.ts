export interface DefectItem {
  id: string;
  name: string;
  category: 'Técnico / Reológico' | 'Cocción / Visual' | 'Inocuidad / Calidad';
  description: string;
  possibleCauses: string[];
  originPhases: string;
  involvedVariables: string;
  correctiveAction: string;
  preventiveAction: string;
}

export const DEFECTS_DATA: DefectItem[] = [
  {
    id: 'sticky-dough',
    name: 'Masa demasiado pegajosa',
    category: 'Técnico / Reológico',
    description: 'La masa se adhiere excesivamente a las manos, mesa o tolva, dificultando el boleado y formado.',
    possibleCauses: ['Exceso de agua en dosificación', 'Harina de baja absorción o débil', 'Sobre-amasado que rompe la red de gluten', 'Temperatura de masa muy alta'],
    originPhases: 'Pesaje, Mezclado, Amasado',
    involvedVariables: 'Hidratación (%), tiempo de amasado, temperatura de masa',
    correctiveAction: 'Usar harina de espolvoreo con moderación si es leve; ajustar hidratación y tiempo de amasado en el siguiente lote.',
    preventiveAction: 'Estandarizar pesaje con báscula calibrada, controlar temperatura del agua y cronometrar el amasado.'
  },
  {
    id: 'underdeveloped-dough',
    name: 'Masa poco desarrollada',
    category: 'Técnico / Reológico',
    description: 'Masa opaca, áspera y que se desgarra fácilmente al realizar la prueba del velo.',
    possibleCauses: ['Tiempo de amasado insuficiente', 'Velocidad inadecuada', 'Harina con bajo contenido proteico'],
    originPhases: 'Amasado',
    involvedVariables: 'Tiempo (8–12 min), velocidad, calidad de harina',
    correctiveAction: 'Prolongar el amasado 1–2 minutos verificando con prueba de membrana.',
    preventiveAction: 'Definir tiempo de amasado por equipo y exigir prueba del velo positiva antes de pasar a fermentación.'
  },
  {
    id: 'low-volume',
    name: 'Pan de bajo volumen',
    category: 'Técnico / Reológico',
    description: 'Piezas pequeñas, pesadas y con poca expansión después del horneado.',
    possibleCauses: ['Fermentación insuficiente', 'Masa débil (sub-amasado)', 'Exceso de sal o contacto directo con levadura', 'Horno frío al cargar'],
    originPhases: 'Pesaje, Amasado, Fermentación, Horneado',
    involvedVariables: 'Red de gluten, producción de CO₂, temperatura del horno',
    correctiveAction: 'Verificar precalentamiento del horno y extender fermentación final si las piezas aún no alcanzan volumen.',
    preventiveAction: 'Controlar viabilidad de levadura, evitar contacto directo sal-levadura y registrar T/HR en cámara.'
  },
  {
    id: 'under-fermentation',
    name: 'Fermentación insuficiente',
    category: 'Técnico / Reológico',
    description: 'Poca generación de gas; la masa se siente dura y la huella al presionar regresa demasiado rápido.',
    possibleCauses: ['Levadura poco activa o vencida', 'Temperatura de cámara muy baja (< 26 °C)', 'Tiempo de reposo muy corto'],
    originPhases: 'Primera fermentación, Fermentación final',
    involvedVariables: 'Tiempo, temperatura, humedad, actividad de levadura',
    correctiveAction: 'Extender el tiempo en cámara verificando temperatura y humedad.',
    preventiveAction: 'Controlar fechas de vencimiento de levadura, rotación PEPS y monitoreo con termohigrómetro.'
  },
  {
    id: 'over-fermentation',
    name: 'Fermentación excesiva',
    category: 'Técnico / Reológico',
    description: 'Masa debilitada que colapsa en el horno, presenta superficie arrugada y aroma/sabor ácido.',
    possibleCauses: ['Tiempo de fermentación prolongado', 'Temperatura demasiado alta (> 35 °C)', 'Exceso de levadura'],
    originPhases: 'Primera fermentación, Fermentación final',
    involvedVariables: 'Tiempo, temperatura, dosificación de levadura',
    correctiveAction: 'Hornear de inmediato si aún conserva estructura; ajustar tiempo y temperatura en el siguiente lote.',
    preventiveAction: 'Establecer alarmas de tiempo límite y controlar estrictamente temperatura de masa y cámara.'
  },
  {
    id: 'dense-crumb',
    name: 'Miga compacta y densa',
    category: 'Técnico / Reológico',
    description: 'Interior del pan con alvéolos muy pequeños o cerrados, textura pesada y poco esponjosa.',
    possibleCauses: ['Baja hidratación', 'Amasado insuficiente', 'Fermentación final corta', 'Aplastamiento excesivo en el formado'],
    originPhases: 'Pesaje, Amasado, Formado, Fermentación final',
    involvedVariables: 'Agua (%), desarrollo de gluten, tiempo de proofing',
    correctiveAction: 'Revisar hidratación, técnica de enrollado y tiempos de fermentación para el lote siguiente.',
    preventiveAction: 'Estandarizar formulación piloto (58% agua) y capacitar en formado suave.'
  },
  {
    id: 'hard-crust',
    name: 'Corteza excesivamente dura',
    category: 'Cocción / Visual',
    description: 'Exterior grueso, rígido y seco que contrasta con el estilo pan blandito colombiano.',
    possibleCauses: ['Exceso de tiempo de horneado', 'Baja humedad en cámara o en horno', 'Baja proporción de grasa o azúcar'],
    originPhases: 'Pesaje, Fermentación final, Horneado',
    involvedVariables: 'Tiempo y temperatura de horneado, humedad relativa',
    correctiveAction: 'Reducir tiempo o temperatura de cocción y revisar fórmula.',
    preventiveAction: 'Validar perfil térmico del horno (180–200 °C por 12–18 min) y mantener 75–85% HR en fermentación.'
  },
  {
    id: 'uneven-color',
    name: 'Coloración irregular',
    category: 'Cocción / Visual',
    description: 'Panes muy dorados en un extremo y pálidos en otro o entre bandejas.',
    possibleCauses: ['Distribución desigual de calor en el horno', 'Piezas de distinto tamaño o peso', 'Sobrecarga de bandejas'],
    originPhases: 'División, Horneado',
    involvedVariables: 'Peso por unidad, carga del horno, flujo de aire',
    correctiveAction: 'Rotar bandejas a mitad de cocción (si el horno lo permite) y uniformar pesos.',
    preventiveAction: 'Mantenimiento preventivo de ventiladores/quemadores y control de peso en división.'
  },
  {
    id: 'raw-bread',
    name: 'Pan crudo en el centro',
    category: 'Cocción / Visual',
    description: 'Corteza aparentemente cocida pero miga húmeda, pastosa y con sabor a masa cruda.',
    possibleCauses: ['Temperatura muy alta al inicio (arrebato)', 'Tiempo de horneado insuficiente', 'Piezas más pesadas que el estándar (> 80 g)'],
    originPhases: 'División, Horneado',
    involvedVariables: 'Temperatura de horno, tiempo de cocción, temperatura interna (< 82 °C)',
    correctiveAction: 'Prolongar cocción a temperatura moderada; segregar piezas crudas como no conformes.',
    preventiveAction: 'Verificar temperatura interna (~95 °C) con termómetro de punzón y calibrar el horno.'
  },
  {
    id: 'overbaked',
    name: 'Pan excesivamente horneado / quemado',
    category: 'Cocción / Visual',
    description: 'Corteza muy oscura o carbonizada, sabor amargo y pérdida excesiva de humedad.',
    possibleCauses: ['Temperatura del horno demasiado alta', 'Tiempo de cocción excesivo', 'Exceso de azúcar en la mezcla'],
    originPhases: 'Pesaje, Horneado',
    involvedVariables: 'Temperatura, tiempo, % de azúcar',
    correctiveAction: 'Reducir tiempo o temperatura; retirar piezas quemadas para evitar riesgo sanitario/sensorial.',
    preventiveAction: 'Registrar perfil de horneado y usar temporizadores con alarma.'
  },
  {
    id: 'condensation-mold',
    name: 'Condensación en empaque y moho rápido',
    category: 'Inocuidad / Calidad',
    description: 'Gotas de agua dentro de la bolsa plástica que aceleran el deterioro microbiológico.',
    possibleCauses: ['Empacar el pan caliente (> 35 °C)', 'Área de enfriamiento húmeda o contaminada'],
    originPhases: 'Enfriamiento, Empaque',
    involvedVariables: 'Temperatura interna al empacar (< 35 °C), tiempo de enfriamiento (30–60 min)',
    correctiveAction: 'Retirar producto con condensación y reforzar control de temperatura antes de sellar.',
    preventiveAction: 'Medir temperatura interna con termómetro de punzón antes de autorizar el empaque.'
  }
];

export const QUALITY_PILLARS = [
  {
    title: 'Control de Calidad (CC)',
    badge: 'Atributos de Producto y Proceso',
    description: 'Verificaciones técnicas orientadas a asegurar uniformidad física, sensorial y de rendimiento (peso de 80 g, prueba del velo, color dorado, volumen y merma).',
    examples: ['Carta de control de peso en división', 'Prueba del velo en amasado', 'Evaluación de miga y corteza en inspección final']
  },
  {
    title: 'Buenas Prácticas de Manufactura (BPM)',
    badge: 'Resolución 2674 de 2013',
    description: 'Principios básicos y prácticas generales de higiene en la manipulación, preparación, envasado, almacenamiento y transporte de alimentos para garantizar inocuidad.',
    examples: ['Lavado de manos, cofia y uniforme limpio', 'Limpieza y desinfección (POES) de mesas y bandejas', 'Rotación PEPS y separación de químicos']
  },
  {
    title: 'Puntos Críticos de Control (PCC)',
    badge: 'Decreto 60 de 2002 (HACCP)',
    description: 'Etapa en la que puede aplicarse un control esencial para prevenir, eliminar o reducir un peligro de inocuidad a un nivel aceptable. No toda etapa es PCC.',
    examples: ['Horneado evaluado como posible PCC térmico (inactiva patógenos vegetativos)', 'Las demás etapas suelen operar como Puntos de Control (PC) y prerrequisitos BPM']
  }
];
