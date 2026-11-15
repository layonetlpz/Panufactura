export type StageZone = 'Logística y Almacén' | 'Preparación y Masas' | 'Formado y Fermentación' | 'Cocción y Acabado' | 'Calidad y Despacho';
export type ControlClassification = 'BPM / Prerrequisito' | 'Punto de Control (PC)' | 'Posible PCC Térmico';
export type AsmeSymbol = 'Operación' | 'Inspección' | 'Transporte' | 'Demora' | 'Almacenamiento' | 'Decisión';

export interface PhaseData {
  id: number;
  name: string;
  shortName: string;
  zone: StageZone;
  asme: AsmeSymbol;
  classification: ControlClassification;
  visualStateKey: string;
  visualCaption: string;
  summary: string;
  objective: string;
  whatHappens: string;
  whyNecessary: string;
  impactOnFinalProduct: string;
  inputs: string[];
  inputState: string;
  transformation: string;
  outputs: string[];
  equipment: {
    name: string;
    role: string;
    scale: 'Artesanal' | 'Semindustrial' | 'Industrial' | 'Transversal';
  }[];
  variables: {
    label: string;
    referenceValue: string;
    note?: string;
  }[];
  qualityControl: {
    toVerify: string;
    adequateConditions: string;
    commonErrors: string;
    correctiveActions: string;
  };
  safetyAndHygiene: {
    risks: string;
    hygiene: string;
    contaminationPrevention: string;
    allergens: string;
  };
}

export const PHASES_DATA: PhaseData[] = [
  {
    id: 1,
    name: 'Recepción de materias primas',
    shortName: 'Recepción MP',
    zone: 'Logística y Almacén',
    asme: 'Inspección',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'reception',
    visualCaption: 'Bultos de harina fortificada, levadura, azúcar, sal y grasa inspeccionados en plataforma.',
    summary: 'Verificación física, documental y de inocuidad de los insumos antes de ingresar a planta.',
    objective: 'Garantizar que las materias primas cumplan las especificaciones de cantidad, calidad e higiene.',
    whatHappens: 'Se inspeccionan empaques, fechas de vencimiento, lotes, ausencia de plagas, humedad, olores extraños y certificados de calidad del proveedor.',
    whyNecessary: 'Evita el ingreso de insumos contaminados, vencidos o fuera de especificación que comprometerían todo el lote.',
    impactOnFinalProduct: 'Asegura la funcionalidad tecnológica (ej. fuerza de la harina y viabilidad de la levadura) y la inocuidad del pan.',
    inputs: ['Harina de trigo fortificada', 'Levadura seca instantánea', 'Azúcar', 'Sal', 'Grasa vegetal / margarina', 'Empaques', 'Orden de compra'],
    inputState: 'Insumos sellados en empaques de proveedor.',
    transformation: 'Validación documental y sensorial para liberación o rechazo.',
    outputs: ['Materias primas aceptadas e identificadas por lote (o en cuarentena/rechazo)'],
    equipment: [
      { name: 'Báscula de plataforma', role: 'Verificar el peso recibido contra remisión.', scale: 'Transversal' },
      { name: 'Termómetro infrarrojo', role: 'Controlar temperatura de insumos sensibles (ej. levadura fresca < 5 °C).', scale: 'Semindustrial' },
      { name: 'Estibas plásticas', role: 'Evitar contacto directo de bultos con el piso.', scale: 'Transversal' }
    ],
    variables: [
      { label: 'Humedad máx. harina', referenceValue: '< 14,5%', note: 'Previene hongos y apelmazamiento' },
      { label: 'Integridad de empaque', referenceValue: '100% sellado y limpio' },
      { label: 'Trazabilidad', referenceValue: 'Lote + Fecha de vencimiento vigente' }
    ],
    qualityControl: {
      toVerify: 'Peso, integridad de bultos, certificados de calidad, ausencia de gorgojos y fecha de vencimiento.',
      adequateConditions: 'Empaques íntegros, sin humedad ni olores extraños, vehículo de transporte limpio.',
      commonErrors: 'Aceptar harina húmeda, levadura vencida o sin registro de lote.',
      correctiveActions: 'Rechazar o aislar en zona de cuarentena y notificar al proveedor.'
    },
    safetyAndHygiene: {
      risks: 'Contaminación biológica (plagas, mohos), química o física desde el transporte.',
      hygiene: 'Limpieza previa del área de recepción y lavado de manos del operario.',
      contaminationPrevention: 'No apoyar bultos en el suelo; inspeccionar estado del vehículo.',
      allergens: 'Identificar gluten de trigo y posibles trazas de soya o lácteos desde el ingreso.'
    }
  },
  {
    id: 2,
    name: 'Almacenamiento de materias primas',
    shortName: 'Almacenamiento MP',
    zone: 'Logística y Almacén',
    asme: 'Almacenamiento',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'storage',
    visualCaption: 'Insumos organizados en estanterías con rotación PEPS/FIFO y control termohigrométrico.',
    summary: 'Conservación ordenada y protegida de los insumos hasta su uso en producción.',
    objective: 'Preservar la integridad física, química y biológica de las materias primas.',
    whatHappens: 'Los insumos secos se ubican en estanterías elevadas del piso bajo sistema PEPS (primeras entradas, primeras salidas), separados de químicos y residuos.',
    whyNecessary: 'Impide el deterioro prematuro, la infestación por plagas y el vencimiento de ingredientes.',
    impactOnFinalProduct: 'Mantiene activa la levadura y evita sabores rancios o presencia de mohos en la harina.',
    inputs: ['Materias primas aceptadas'],
    inputState: 'Insumos liberados e identificados por lote.',
    transformation: 'Conservación controlada bajo parámetros ambientales.',
    outputs: ['Materias primas protegidas y disponibles para dosificación'],
    equipment: [
      { name: 'Estanterías y estibas', role: 'Almacenamiento elevado y ordenado.', scale: 'Transversal' },
      { name: 'Recipientes herméticos', role: 'Proteger harina abierta y aditivos de humedad.', scale: 'Transversal' },
      { name: 'Termohigrómetro', role: 'Monitorear temperatura y humedad relativa.', scale: 'Transversal' }
    ],
    variables: [
      { label: 'Temperatura secos', referenceValue: '< 25 °C' },
      { label: 'Humedad relativa', referenceValue: '< 65% HR' },
      { label: 'Rotación', referenceValue: '100% PEPS / FIFO' }
    ],
    qualityControl: {
      toVerify: 'Registro diario de T y HR, fechas de vencimiento, orden y hermeticidad.',
      adequateConditions: 'Área seca, ventilada, limpia y libre de plagas.',
      commonErrors: 'Mezcla de lotes antiguos con nuevos o cercanía a detergentes.',
      correctiveActions: 'Reorganizar inventario bajo PEPS y descartar material deteriorado.'
    },
    safetyAndHygiene: {
      risks: 'Proliferación de hongos, rancidez oxidativa en grasas y contaminación química cruzada.',
      hygiene: 'Programa de limpieza de bodega y control integrado de plagas.',
      contaminationPrevention: 'Separación física total entre alimentos, químicos de aseo y residuos.',
      allergens: 'Rotulación clara de sacos de harina (gluten) y grasas/lácteos.'
    }
  },
  {
    id: 3,
    name: 'Pesaje y dosificación',
    shortName: 'Pesaje',
    zone: 'Preparación y Masas',
    asme: 'Operación',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'weighing',
    visualCaption: 'Ingredientes pesados con precisión según porcentaje panadero (harina 100%, agua 58%).',
    summary: 'Medición exacta de cada ingrediente de acuerdo con la formulación piloto.',
    objective: 'Garantizar que cada lote contenga las proporciones exactas de la fórmula.',
    whatHappens: 'Se taran recipientes y se pesan por separado harina (1.000 g base), agua (580 g), levadura seca (10 g), azúcar (40 g), sal (18 g), grasa (40 g) y mejorante opcional (5 g).',
    whyNecessary: 'Pequeñas variaciones en sal o levadura alteran drásticamente la fermentación y la reología de la masa.',
    impactOnFinalProduct: 'Define la hidratación, el sabor, el volumen y la repetibilidad lote a lote.',
    inputs: ['Materias primas almacenadas', 'Ficha de formulación'],
    inputState: 'Ingredientes a granel o en bulto.',
    transformation: 'Fraccionamiento exacto en masa (gramos) por lote.',
    outputs: ['Ingredientes dosificados listos para mezclado'],
    equipment: [
      { name: 'Balanza de precisión', role: 'Pesar ingredientes menores (levadura, sal, mejorante).', scale: 'Transversal' },
      { name: 'Báscula de plataforma / mesa', role: 'Pesar harina, agua y grasa.', scale: 'Transversal' },
      { name: 'Recipientes tarados e identificados', role: 'Separar ingredientes evitando contacto sal-levadura.', scale: 'Transversal' }
    ],
    variables: [
      { label: 'Harina (Base)', referenceValue: '100% (1.000 g piloto)' },
      { label: 'Agua potable', referenceValue: '58% (580 g piloto)' },
      { label: 'Levadura seca / Sal / Azúcar / Grasa', referenceValue: '1% / 1,8% / 4% / 4%' }
    ],
    qualityControl: {
      toVerify: 'Calibración de básculas, doble verificación en ingredientes críticos y orden de separación.',
      adequateConditions: 'Báscula nivelada en cero, recipientes limpios y secos.',
      commonErrors: 'Olvidar sal o levadura, contacto prolongado directo sal-levadura, error de tara.',
      correctiveActions: 'Re-pesar el ingrediente antes de incorporarlo a la tolva.'
    },
    safetyAndHygiene: {
      risks: 'Contaminación física por utensilios sucios o dosificación errónea de aditivos.',
      hygiene: 'Espátulas y recipientes exclusivos de grado alimenticio, limpios y desinfectados.',
      contaminationPrevention: 'Mantener cerrados los recipientes tras el pesaje.',
      allergens: 'Evitar contaminación cruzada con utensilios usados en otros productos (ej. huevo o nueces).'
    }
  },
  {
    id: 4,
    name: 'Mezclado',
    shortName: 'Mezclado',
    zone: 'Preparación y Masas',
    asme: 'Operación',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'mixing',
    visualCaption: 'Integración homogénea de secos, agua y grasa hasta formar una masa rústica inicial.',
    summary: 'Unión inicial de ingredientes a baja velocidad para hidratar la harina.',
    objective: 'Incorporar uniformemente los componentes e iniciar la hidratación de almidón y proteínas.',
    whatHappens: 'Se mezclan secos (harina, azúcar, levadura), se agrega el agua controlando su temperatura y se incorporan sal y grasa hasta obtener una masa rústica uniforme.',
    whyNecessary: 'Distribuye homogéneamente la levadura y el agua antes de aplicar trabajo mecánico intensivo.',
    impactOnFinalProduct: 'Previene grumos secos, puntos salados y fermentación desigual.',
    inputs: ['Ingredientes dosificados (1.693 g total piloto)'],
    inputState: 'Ingredientes sólidos y líquidos separados.',
    transformation: 'Hidratación inicial y formación de masa rústica heterogénea.',
    outputs: ['Masa homogénea inicial'],
    equipment: [
      { name: 'Amasadora / Mezcladora espiral (Vel. 1)', role: 'Integrar ingredientes a baja velocidad.', scale: 'Semindustrial' },
      { name: 'Batidora industrial / Bowl manual', role: 'Alternativa para lotes piloto pequeños.', scale: 'Artesanal' }
    ],
    variables: [
      { label: 'Tiempo de mezclado', referenceValue: '3 a 5 minutos', note: 'Velocidad baja' },
      { label: 'Temperatura objetivo de masa', referenceValue: '24 °C – 28 °C', note: 'Hasta 29–30 °C en proceso directo industrial' }
    ],
    qualityControl: {
      toVerify: 'Ausencia de harina seca en el fondo de la tolva y temperatura inicial de la masa.',
      adequateConditions: 'Masa integrada sin partículas secas sueltas.',
      commonErrors: 'Agua muy caliente (mata o acelera la levadura) o muy fría (retrasa fermentación).',
      correctiveActions: 'Ajustar temperatura del agua en el siguiente lote según temperatura ambiente.'
    },
    safetyAndHygiene: {
      risks: 'Atrapamiento mecánico si se introducen manos o utensilios con el equipo en marcha.',
      hygiene: 'Tolva y gancho limpios y libres de residuos de lotes anteriores.',
      contaminationPrevention: 'Rejilla de seguridad cerrada durante el funcionamiento.',
      allergens: 'Verificación de limpieza previa si la mezcladora procesa masas con lácteos o huevo.'
    }
  },
  {
    id: 5,
    name: 'Amasado',
    shortName: 'Amasado',
    zone: 'Preparación y Masas',
    asme: 'Operación',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'kneading',
    visualCaption: 'Desarrollo completo de la red viscoelástica de gluten (prueba del velo positiva).',
    summary: 'Trabajo mecánico intensivo para alinear proteínas y desarrollar la red de gluten.',
    objective: 'Obtener una masa lisa, elástica, manejable y capaz de retener gas.',
    whatHappens: 'La masa se somete a estiramiento y cizallamiento; la glutenina y la gliadina se entrecruzan formando una matriz elástica que supera la prueba del velo o membrana.',
    whyNecessary: 'Sin red de gluten desarrollada, el gas de la levadura escapa y el pan queda plano y compacto.',
    impactOnFinalProduct: 'Determina el volumen, la suavidad de la miga y la estructura alveolada.',
    inputs: ['Masa homogénea inicial'],
    inputState: 'Masa rústica y poco extensible.',
    transformation: 'Desarrollo viscoelástico de la red de gluten.',
    outputs: ['Masa desarrollada, lisa y elástica'],
    equipment: [
      { name: 'Amasadora de espiral (Vel. 2)', role: 'Desarrollar el gluten sin sobrecalentar en exceso.', scale: 'Semindustrial' },
      { name: 'Amasadora de brazos / Mesa', role: 'Alternativa artesanal o industrial.', scale: 'Artesanal' }
    ],
    variables: [
      { label: 'Tiempo de amasado', referenceValue: '8 a 12 minutos', note: 'Velocidad moderada/alta' },
      { label: 'Temperatura final de masa', referenceValue: '24 °C – 26 °C (máx. 28 °C)' }
    ],
    qualityControl: {
      toVerify: 'Prueba del velo/membrana (estirar un trozo hasta formar película translúcida sin romperse) y temperatura.',
      adequateConditions: 'Superficie lisa, brillante, ligeramente pegajosa pero se despega del bowl.',
      commonErrors: 'Sub-amasado (masa débil) o sobre-amasado (rompe el gluten, masa pegajosa).',
      correctiveActions: 'Si está sub-amasada, continuar 1–2 min; si se sobre-amasó, ajustar tiempo en siguiente lote.'
    },
    safetyAndHygiene: {
      risks: 'Riesgo mecánico por partes móviles y sobreesfuerzo del motor.',
      hygiene: 'Manos limpias y desinfectadas para realizar la prueba del velo.',
      contaminationPrevention: 'No usar anillos, relojes ni accesorios que puedan caer en la masa.',
      allergens: 'Control de polvo de harina en suspensión (gluten).'
    }
  },
  {
    id: 6,
    name: 'Primera fermentación',
    shortName: '1ra Fermentación',
    zone: 'Preparación y Masas',
    asme: 'Demora',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'fermentation1',
    visualCaption: 'Masa en bloque duplicando volumen por producción de CO₂ y compuestos aromáticos.',
    summary: 'Reposo en bloque donde la levadura genera gas y precursores de sabor.',
    objective: 'Permitir la actividad metabólica de Saccharomyces cerevisiae y relajar la masa.',
    whatHappens: 'La levadura fermenta azúcares disponibles produciendo CO₂ y etanol; el gas queda atrapado en la red de gluten expandiendo el bloque.',
    whyNecessary: 'Desarrolla aroma, fuerza en la masa y mejora la extensibilidad para el porcionado.',
    impactOnFinalProduct: 'Aporta miga más aireada, mejor sabor y textura blandita.',
    inputs: ['Masa desarrollada'],
    inputState: 'Masa compacta y elástica recién amasada.',
    transformation: 'Expansión biológica de volumen y desarrollo aromático.',
    outputs: ['Masa fermentada en bloque'],
    equipment: [
      { name: 'Recipientes cubiertos / Cámara', role: 'Proteger la masa de corrientes de aire y controlar T.', scale: 'Transversal' },
      { name: 'Termómetro y temporizador', role: 'Monitorear tiempo y temperatura.', scale: 'Transversal' }
    ],
    variables: [
      { label: 'Tiempo piloto', referenceValue: '45 a 60 minutos', note: '15–30 min en procesos directos cortos' },
      { label: 'Temperatura', referenceValue: '26 °C – 28 °C' }
    ],
    qualityControl: {
      toVerify: 'Aumento visible de volumen, aroma suave a fermentación y elasticidad al tacto.',
      adequateConditions: 'Superficie húmeda (no reseca), sin costra ni olor ácido excesivo.',
      commonErrors: 'Corrientes de aire que forman costra o temperaturas muy altas que sobrefermentan.',
      correctiveActions: 'Cubrir inmediatamente con plástico alimentario o ajustar temperatura de cámara.'
    },
    safetyAndHygiene: {
      risks: 'Contaminación ambiental si el recipiente queda destapado.',
      hygiene: 'Recipientes de grado alimentario limpios y ligeramente engrasados.',
      contaminationPrevention: 'Mantener cubierto lejos de corrientes de aire y zonas sucias.',
      allergens: 'Identificar contenedor con nombre del producto y lote.'
    }
  },
  {
    id: 7,
    name: 'División o porcionado',
    shortName: 'División',
    zone: 'Formado y Fermentación',
    asme: 'Operación',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'dividing',
    visualCaption: 'Porciones individuales pesadas uniformemente a 80 g (formulación piloto).',
    summary: 'Corte de la masa fermentada en unidades de peso idéntico.',
    objective: 'Obtener piezas de masa de peso uniforme para garantizar cocción pareja.',
    whatHappens: 'Se divide el bloque en porciones de 80 g (aprox. 21 unidades en la fórmula piloto; 20 objetivo), pesando y ajustando rápidamente.',
    whyNecessary: 'Piezas de distinto peso se hornean de forma desigual (unas crudas y otras quemadas).',
    impactOnFinalProduct: 'Garantiza tamaño comercial uniforme, peso estándar y cocción homogénea.',
    inputs: ['Masa fermentada en bloque'],
    inputState: 'Bloque único de masa expandida (~1.693 g).',
    transformation: 'Fraccionamiento en ~20–21 unidades de 80 g.',
    outputs: ['Porciones individuales de masa pesadas'],
    equipment: [
      { name: 'Rasqueta / Cortadora y báscula', role: 'Dividir y verificar peso de cada unidad.', scale: 'Artesanal' },
      { name: 'Divisora volumétrica', role: 'Porcionar lotes grandes con rapidez.', scale: 'Industrial' }
    ],
    variables: [
      { label: 'Peso objetivo por pieza', referenceValue: '80 g masa cruda', note: 'Alternativa comercial pequeña: 60 g' },
      { label: 'Rendimiento piloto', referenceValue: '~21 piezas (20 objetivo)' }
    ],
    qualityControl: {
      toVerify: 'Peso individual de piezas o muestreo mediante carta de control X-R.',
      adequateConditions: 'Operación ágil para evitar fermentación asimétrica entre primeras y últimas piezas.',
      commonErrors: 'Piezas desiguales o exceso de recortes que maltratan la masa.',
      correctiveActions: 'Repesar y ajustar con un solo corte limpio antes de pasar al boleado.'
    },
    safetyAndHygiene: {
      risks: 'Contaminación por manipulación directa o residuos de masa vieja en cuchillas.',
      hygiene: 'Mesa de acero inoxidable desinfectada y manos con lavado estricto o guantes.',
      contaminationPrevention: 'Cubrir las piezas ya divididas para evitar desecamiento.',
      allergens: 'Uso de mesa limpia exclusiva para masas de trigo.'
    }
  },
  {
    id: 8,
    name: 'Boleado',
    shortName: 'Boleado',
    zone: 'Formado y Fermentación',
    asme: 'Operación',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'rounding',
    visualCaption: 'Esferas lisas con tensión superficial uniforme y cierre basal sellado.',
    summary: 'Rotación suave de cada porción para formar una esfera tensa y lisa.',
    objective: 'Crear una película de tensión superficial que retenga los gases internos.',
    whatHappens: 'Mediante movimientos circulares se cierra la base de la porción y se orienta la superficie externa sin expulsar todo el gas.',
    whyNecessary: 'Prepara una geometría homogénea que facilita un formado simétrico posterior.',
    impactOnFinalProduct: 'Mejora la forma del rollo y evita grietas o desgarros en la corteza.',
    inputs: ['Porciones de 80 g'],
    inputState: 'Trozos irregulares recién cortados.',
    transformation: 'Estructuración esférica con tensión superficial.',
    outputs: ['Piezas boleadas uniformes'],
    equipment: [
      { name: 'Mesón de acero inoxidable', role: 'Superficie higiénica para boleado manual.', scale: 'Artesanal' },
      { name: 'Boleadora cónica', role: 'Redondeado continuo de piezas en planta.', scale: 'Industrial' }
    ],
    variables: [
      { label: 'Harina de espolvoreo', referenceValue: 'Mínima indispensable', note: 'El exceso impide cerrar la base' },
      { label: 'Tensión', referenceValue: 'Superficie lisa sin desgarros' }
    ],
    qualityControl: {
      toVerify: 'Superficie lisa, cierre inferior completo y ausencia de desgarres.',
      adequateConditions: 'Esferas uniformes sin exceso de harina adherida.',
      commonErrors: 'Exceso de presión (desgarra el gluten) o base abierta (fuga de gas).',
      correctiveActions: 'Re-bolear suavemente las piezas mal cerradas.'
    },
    safetyAndHygiene: {
      risks: 'Contaminación cruzada por exceso de harina reciclada sobre la mesa.',
      hygiene: 'No reutilizar harina contaminada del piso o bordes.',
      contaminationPrevention: 'Limpieza continua de la mesa de trabajo.',
      allergens: 'Control de polvo de harina.'
    }
  },
  {
    id: 9,
    name: 'Reposo intermedio',
    shortName: 'Reposo intermedio',
    zone: 'Formado y Fermentación',
    asme: 'Demora',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'resting',
    visualCaption: 'Bolas de masa cubiertas relajando la tensión del gluten durante 10–15 minutos.',
    summary: 'Descanso breve para relajar la elasticidad generada durante el boleado.',
    objective: 'Relajar la red de gluten y facilitar el estirado y enrollado sin retracción.',
    whatHappens: 'Las cadenas proteicas tensadas en el boleado recuperan extensibilidad mientras están cubiertas.',
    whyNecessary: 'Si se intenta formar inmediatamente después de bolear, la masa se encoge y se desgarra.',
    impactOnFinalProduct: 'Permite rollos simétricos, bien enrollados y sin deformaciones.',
    inputs: ['Piezas boleadas'],
    inputState: 'Esferas con alta tensión elástica.',
    transformation: 'Relajación reológica de la masa.',
    outputs: ['Bolas de masa relajadas y extensibles'],
    equipment: [
      { name: 'Bandejas / Carros escabiladeros con fundas', role: 'Proteger las bolas del aire durante el reposo.', scale: 'Semindustrial' },
      { name: 'Tela limpia o plástico alimentario', role: 'Evitar desecamiento superficial.', scale: 'Artesanal' }
    ],
    variables: [
      { label: 'Tiempo de reposo', referenceValue: '10 a 15 minutos' },
      { label: 'Ambiente', referenceValue: 'Temperatura ambiente controlada, sin corrientes' }
    ],
    qualityControl: {
      toVerify: 'Extensibilidad al presionar suavemente y ausencia de costra seca.',
      adequateConditions: 'Masa suave que cede al estirado sin contraerse.',
      commonErrors: 'Omitir el reposo o dejar las bolas destapadas.',
      correctiveActions: 'Extender el reposo 5 min si la masa aún ofrece resistencia elástica.'
    },
    safetyAndHygiene: {
      risks: 'Desecamiento superficial o contaminación por cubiertas sucias.',
      hygiene: 'Usar plásticos o telas limpias exclusivas de uso alimentario.',
      contaminationPrevention: 'Mantener cubiertas cerradas.',
      allergens: 'Sin riesgo adicional si los utensilios son exclusivos.'
    }
  },
  {
    id: 10,
    name: 'Formado',
    shortName: 'Formado',
    zone: 'Formado y Fermentación',
    asme: 'Operación',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'shaping',
    visualCaption: 'Piezas aplanadas, enrolladas en forma cilíndrica/ovalada y ubicadas con costura hacia abajo.',
    summary: 'Moldeado final que confiere la geometría característica de rollo al pan.',
    objective: 'Dar la forma ovalada o alargada uniforme y sellar la costura.',
    whatHappens: 'Cada bola relajada se aplana suavemente para desgasificar de forma pareja, se enrolla sobre sí misma y se coloca en la bandeja con la unión hacia abajo.',
    whyNecessary: 'Un enrollado uniforme distribuye las capas internas de la miga y evita que el pan se abra en el horno.',
    impactOnFinalProduct: 'Define la presentación comercial, simetría y estructura de la miga.',
    inputs: ['Masa relajada'],
    inputState: 'Esferas extensibles.',
    transformation: 'Desgasificación controlada y enrollado cilíndrico.',
    outputs: ['Piezas formadas tipo rollo en bandejas'],
    equipment: [
      { name: 'Mesa de trabajo y rodillo opcional', role: 'Aplanado y enrollado manual.', scale: 'Artesanal' },
      { name: 'Formadora de rodillos (moldeadora)', role: 'Laminado y enrollado uniforme en serie.', scale: 'Industrial' },
      { name: 'Bandejas engrasadas o con tapete', role: 'Soportar las piezas separadas.', scale: 'Transversal' }
    ],
    variables: [
      { label: 'Disposición', referenceValue: 'Costura hacia abajo, separación uniforme' },
      { label: 'Presión', referenceValue: 'Suave y pareja para no desgarrar' }
    ],
    qualityControl: {
      toVerify: 'Longitud uniforme, sellado de costura y separación adecuada entre rollos.',
      adequateConditions: 'Rollos simétricos, sin burbujas grandes atrapadas ni costuras abiertas.',
      commonErrors: 'Costura mal cerrada (se desenrolla en el horno) o piezas muy juntas (se pegan).',
      correctiveActions: 'Re-sellar la costura manualmente antes de llevar a fermentación final.'
    },
    safetyAndHygiene: {
      risks: 'Contaminación por bandejas mal lavadas o residuos carbonizados.',
      hygiene: 'Bandejas limpias y desinfectadas.',
      contaminationPrevention: 'Uso de desmoldantes grado alimentario.',
      allergens: 'Verificar composición del desmoldante (ej. trazas de soya).'
    }
  },
  {
    id: 11,
    name: 'Fermentación final',
    shortName: 'Fermentación final',
    zone: 'Formado y Fermentación',
    asme: 'Operación',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'proofing',
    visualCaption: 'Rollos duplicando/triplicando volumen en cámara cálida y húmeda (75–85% HR).',
    summary: 'Crecimiento volumétrico final controlado en cámara de fermentación antes del horneado.',
    objective: 'Alcanzar el volumen final y una estructura alveolada suave y uniforme.',
    whatHappens: 'La levadura produce más CO₂ que expande las celdas de aire formadas durante el enrollado; la humedad evita que la superficie se seque.',
    whyNecessary: 'Sin este crecimiento final, el pan resultaría denso, pesado y de corteza agrietada.',
    impactOnFinalProduct: 'Responsable directa de la esponjosidad y suavidad características del pan blandito.',
    inputs: ['Bandejas con piezas formadas'],
    inputState: 'Rollos compactos recién moldeados.',
    transformation: 'Expansión de volumen (2x a 3x) con estructura aireada.',
    outputs: ['Piezas fermentadas listas para acabado/horneado'],
    equipment: [
      { name: 'Cámara de fermentación (cuarto de crecimiento)', role: 'Controlar temperatura y humedad relativa.', scale: 'Semindustrial' },
      { name: 'Termohigrómetro y temporizador', role: 'Verificar condiciones de proofing.', scale: 'Transversal' }
    ],
    variables: [
      { label: 'Tiempo de referencia', referenceValue: '45 a 60 min (piloto) / 60–90 min (cámara)', note: 'Según vigor de levadura' },
      { label: 'Temperatura', referenceValue: '28 °C – 32 °C (hasta 35 °C en cámara)' },
      { label: 'Humedad relativa', referenceValue: '75% – 85% HR' }
    ],
    qualityControl: {
      toVerify: 'Volumen alcanzado y prueba de resiliencia táctil (al presionar suavemente, la huella regresa lento).',
      adequateConditions: 'Superficie elástica, húmeda pero no mojada, volumen uniforme.',
      commonErrors: 'Sub-fermentación (pan pequeño y duro) o sobre-fermentación (colapso al hornear y sabor ácido).',
      correctiveActions: 'Ajustar tiempo antes de hornear; si sobre-fermentó, registrar para reducir tiempo/T en el siguiente lote.'
    },
    safetyAndHygiene: {
      risks: 'Proliferación de mohos en cámara si falta limpieza y desinfección.',
      hygiene: 'Limpieza frecuente de bandejas de agua y paredes internas de la cámara.',
      contaminationPrevention: 'Uso de agua potable en el humidificador de la cámara.',
      allergens: 'Separación por bandejas identificadas.'
    }
  },
  {
    id: 12,
    name: 'Greñado o acabado superficial',
    shortName: 'Acabado (Opcional)',
    zone: 'Cocción y Acabado',
    asme: 'Decisión',
    classification: 'BPM / Prerrequisito',
    visualStateKey: 'scoring',
    visualCaption: 'Evaluación de acabado: en pan blandito tipo rollo el greñado no es obligatorio (superficie lisa o brillo leve).',
    summary: 'Decisión operativa sobre aplicación de corte leve o brillo superficial.',
    objective: 'Determinar si la presentación comercial requiere acabado superficial antes de hornear.',
    whatHappens: 'Para el pan de sal tipo rollo blandito colombiano, el greñado NO es indispensable pues su superficie es lisa. Opcionalmente se rocía agua o se aplica brillo ligero.',
    whyNecessary: 'Evitar cortes innecesarios que desgasifiquen una masa blanda enriquecida con grasa y azúcar.',
    impactOnFinalProduct: 'Conserva la superficie lisa, suave y brillante propia del pan blandito.',
    inputs: ['Piezas fermentadas'],
    inputState: 'Rollos expandidos y delicados al tacto.',
    transformation: 'Sin corte (superficie lisa) o aplicación opcional de brillo.',
    outputs: ['Piezas listas para ingresar al horno'],
    equipment: [
      { name: 'Brocha sanitaria / Atomizador', role: 'Aplicar rocío o brillo si la fórmula lo contempla.', scale: 'Transversal' },
      { name: 'Lame u hoja desinfectada', role: 'Solo si se define un corte decorativo muy superficial.', scale: 'Artesanal' }
    ],
    variables: [
      { label: 'Aplicación en pan blandito', referenceValue: 'No aplica greñado profundo' }
    ],
    qualityControl: {
      toVerify: 'Integridad superficial sin desinflar las piezas.',
      adequateConditions: 'Superficie intacta y limpia.',
      commonErrors: 'Cortar demasiado profundo provocando colapso de la pieza.',
      correctiveActions: 'Omitir el corte o usar hoja extremadamente afilada de forma superficial.'
    },
    safetyAndHygiene: {
      risks: 'Contaminación por brochas sucias o desprendimiento de cerdas.',
      hygiene: 'Brochas de silicona sanitaria desinfectadas.',
      contaminationPrevention: 'Evitar goteos en las bandejas.',
      allergens: 'Si se usa brillo con huevo o leche, declararlo obligatoriamente en la etiqueta.'
    }
  },
  {
    id: 13,
    name: 'Horneado',
    shortName: 'Horneado',
    zone: 'Cocción y Acabado',
    asme: 'Operación',
    classification: 'Posible PCC Térmico',
    visualStateKey: 'baking',
    visualCaption: 'Cocción a 180–200 °C: expansión inicial, gelatinización del almidón y dorado Maillard.',
    summary: 'Transformación térmica de la masa fermentada en pan cocido, seguro y estable.',
    objective: 'Cocer la masa, inactivar la levadura, fijar la estructura y desarrollar color y aroma.',
    whatHappens: 'Ocurre expansión de gases (oven spring), inactivación de levadura (~55–60 °C), gelatinización del almidón, coagulación de proteínas y pardeamiento no enzimático (Maillard/caramelización) en la corteza.',
    whyNecessary: 'Convierte una masa cruda e inestable en un alimento digerible, inocuo y con estructura permanente.',
    impactOnFinalProduct: 'Define color dorado, delgadez de corteza, cocción de miga y vida útil.',
    inputs: ['Piezas fermentadas'],
    inputState: 'Masa cruda expandida.',
    transformation: 'Cocción, fijación estructural y pardeamiento de corteza.',
    outputs: ['Pan horneado caliente (temperatura interna ~82–96 °C, ref. ~95 °C)'],
    equipment: [
      { name: 'Horno rotatorio / de convección / de pisos', role: 'Transferir calor por convección, conducción y radiación.', scale: 'Semindustrial' },
      { name: 'Termómetro de punzón y guantes térmicos', role: 'Verificar cocción interna y manipular bandejas.', scale: 'Transversal' }
    ],
    variables: [
      { label: 'Temperatura de horno', referenceValue: '180 °C – 200 °C (piloto) / 170–180 °C convección' },
      { label: 'Tiempo de horneado', referenceValue: '12 a 18 minutos', note: 'Ajustar según tamaño y carga' },
      { label: 'Temperatura interna final', referenceValue: '82 °C – 96 °C (ref. ~95 °C)' }
    ],
    qualityControl: {
      toVerify: 'Precalentamiento, temperatura y tiempo de ciclo, color uniforme y cocción interna.',
      adequateConditions: 'Dorado claro a medio uniforme, miga cocida sin centro húmedo crudo.',
      commonErrors: 'Horno muy caliente (quemado por fuera, crudo por dentro) o muy frío (pálido y seco).',
      correctiveActions: 'Ajustar temperatura/tiempo o rotar bandejas; segregar piezas crudas o quemadas.'
    },
    safetyAndHygiene: {
      risks: 'Quemaduras térmicas en operarios; peligro biológico residual si queda crudo.',
      hygiene: 'Guantes ignífugos limpios y hornos libres de residuos carbonizados.',
      contaminationPrevention: 'Control térmico para inactivación de microorganismos vegetativos.',
      allergens: 'Trazabilidad de lote en el registro de horneado.'
    }
  },
  {
    id: 14,
    name: 'Enfriamiento',
    shortName: 'Enfriamiento',
    zone: 'Cocción y Acabado',
    asme: 'Demora',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'cooling',
    visualCaption: 'Pan reposando en rejillas limpias durante 30–60 min hasta temperatura < 35 °C.',
    summary: 'Disipación controlada de calor y humedad residual antes del empaque.',
    objective: 'Estabilizar la miga y reducir la temperatura interna para evitar condensación en bolsa.',
    whatHappens: 'El vapor interno migra y se disipa al ambiente mientras la miga consolida su firmeza y elasticidad.',
    whyNecessary: 'Empacar pan caliente genera condensación de agua dentro de la bolsa, disparando el crecimiento de mohos.',
    impactOnFinalProduct: 'Preserva la textura de la corteza y extiende la vida útil microbiológica.',
    inputs: ['Pan horneado caliente'],
    inputState: 'Pan a ~90–95 °C internos liberando vapor.',
    transformation: 'Equilibrio térmico y estabilización de humedad superficial.',
    outputs: ['Pan enfriado a temperatura ambiente (< 30–35 °C)'],
    equipment: [
      { name: 'Rejillas de enfriamiento / Escabiladeros', role: 'Permitir circulación de aire por todas las caras.', scale: 'Transversal' },
      { name: 'Termómetro de punzón', role: 'Confirmar temperatura segura de empaque.', scale: 'Transversal' }
    ],
    variables: [
      { label: 'Tiempo de enfriamiento', referenceValue: '30 a 60 minutos' },
      { label: 'Temperatura objetivo antes de empacar', referenceValue: '< 30 °C – 35 °C' }
    ],
    qualityControl: {
      toVerify: 'Temperatura interna en el centro del pan y ausencia de condensación.',
      adequateConditions: 'Área limpia, ventilada, separada de zona sucia de harinas.',
      commonErrors: 'Empacar antes de tiempo o exponer a polvo/insectos.',
      correctiveActions: 'Extender el tiempo en rejilla hasta alcanzar < 35 °C.'
    },
    safetyAndHygiene: {
      risks: 'Recontaminación microbiológica o física posterior al horneado (fase crítica de exposición).',
      hygiene: 'Área exclusiva limpia con flujo de aire desde zona limpia hacia zona sucia.',
      contaminationPrevention: 'No ubicar rejillas cerca de puertas abiertas o recepción.',
      allergens: 'Evitar contacto con otros productos horneados con rellenos distintos.'
    }
  },
  {
    id: 15,
    name: 'Inspección y control de calidad',
    shortName: 'Inspección final',
    zone: 'Calidad y Despacho',
    asme: 'Inspección',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'inspection',
    visualCaption: 'Verificación de peso final, color, volumen, miga y segregación de producto no conforme.',
    summary: 'Evaluación física y sensorial del lote enfriado antes de su empaque.',
    objective: 'Asegurar que solo el producto conforme llegue al consumidor.',
    whatHappens: 'Se verifica peso por unidad (merma típica de horneado ~10–12%), color exterior, simetría, textura de miga y ausencia de defectos.',
    whyNecessary: 'Detecta desviaciones antes de gastar material de empaque o afectar la reputación de calidad.',
    impactOnFinalProduct: 'Garantiza uniformidad y cumplimiento de ficha técnica.',
    inputs: ['Pan enfriado'],
    inputState: 'Lote terminado en rejillas.',
    transformation: 'Clasificación en Producto Conforme vs. No Conforme.',
    outputs: ['Lote aprobado para empaque', 'Productos no conformes segregados'],
    equipment: [
      { name: 'Báscula de verificación', role: 'Controlar peso final horneado y merma.', scale: 'Transversal' },
      { name: 'Ficha técnica y registro de lote', role: 'Documentar conformidad o defectos.', scale: 'Transversal' }
    ],
    variables: [
      { label: 'Merma estimada de horneado', referenceValue: '~10% – 12% (referencial)' },
      { label: 'Atributos', referenceValue: 'Color dorado claro, miga blanda, sin quemaduras' }
    ],
    qualityControl: {
      toVerify: 'Peso, simetría, color, aroma, textura al tacto y ausencia de partículas extrañas.',
      adequateConditions: 'Iluminación adecuada y mesa limpia.',
      commonErrors: 'Aprobar piezas deformadas, crudas o con empaque dañado.',
      correctiveActions: 'Separar unidades no conformes para destino alternativo autorizado o eliminación controlada.'
    },
    safetyAndHygiene: {
      risks: 'Contaminación durante la manipulación de muestreo.',
      hygiene: 'Uso de guantes limpios o pinzas; las piezas cortadas para inspección interna no se empacan.',
      contaminationPrevention: 'Separación física de producto no conforme identificado.',
      allergens: 'Confirmar que la fórmula ejecutada corresponde a la etiqueta asignada.'
    }
  },
  {
    id: 16,
    name: 'Empaque',
    shortName: 'Empaque',
    zone: 'Calidad y Despacho',
    asme: 'Operación',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'packaging',
    visualCaption: 'Pan enfriado en bolsas aptas para alimentos, sellado hermético y rotulado con lote.',
    summary: 'Protección física, higiénica y rotulado legal del pan aprobado.',
    objective: 'Proteger el producto de contaminación, pérdida de frescura e informar al consumidor.',
    whatHappens: 'El pan enfriado se introduce en bolsas de polietileno o polipropileno, se sella y se aplica etiqueta con lote, fecha y declaración de alérgenos.',
    whyNecessary: 'Previene el resecamiento rápido y la contaminación durante el transporte y venta.',
    impactOnFinalProduct: 'Conserva suavidad y cumple requisitos legales (Res. 5109/2005 y Res. 810/2021).',
    inputs: ['Pan conforme enfriado', 'Bolsas grado alimenticio', 'Etiquetas'],
    inputState: 'Unidades sueltas a temperatura ambiente.',
    transformation: 'Envasado, sellado hermético e identificación por lote.',
    outputs: ['Producto empacado y codificado'],
    equipment: [
      { name: 'Mesa de empaque y selladora', role: 'Asegurar cierre hermético de bolsas.', scale: 'Semindustrial' },
      { name: 'Codificadora / Etiquetadora', role: 'Imprimir lote y fecha de vencimiento.', scale: 'Semindustrial' }
    ],
    variables: [
      { label: 'Integridad de sellado', referenceValue: '100% hermético sin fugas' },
      { label: 'Rotulado', referenceValue: 'Lote, fecha, ingredientes y alérgenos legibles' }
    ],
    qualityControl: {
      toVerify: 'Hermeticidad del sello, legibilidad del lote y correspondencia de etiqueta.',
      adequateConditions: 'Bolsas secas, limpias y sin perforaciones.',
      commonErrors: 'Sellos abiertos, etiquetas trocadas o falta de declaración de gluten.',
      correctiveActions: 'Re-empacar inmediatamente en bolsa nueva y verificar codificación.'
    },
    safetyAndHygiene: {
      risks: 'Contaminación por manos del operario o bolsas contaminadas.',
      hygiene: 'Lavado y desinfección de manos, uso de guantes y cofia.',
      contaminationPrevention: 'Almacenar bolsas en cajas cerradas hasta el momento de uso.',
      allergens: 'Declaración explícita de gluten de trigo (y leche/soya si aplica).'
    }
  },
  {
    id: 17,
    name: 'Almacenamiento del producto terminado',
    shortName: 'Almacenamiento PT',
    zone: 'Calidad y Despacho',
    asme: 'Almacenamiento',
    classification: 'Punto de Control (PC)',
    visualStateKey: 'storage_pt',
    visualCaption: 'Canastillas limpias ordenadas por lote bajo rotación PEPS en área seca y ventilada.',
    summary: 'Resguardo temporal del pan empacado antes de su despacho.',
    objective: 'Conservar el producto terminado en condiciones higiénicas sin deterioro físico.',
    whatHappens: 'Las bolsas se disponen en canastillas plásticas higienizadas sin sobrecargarlas para evitar aplastamiento, ordenadas por lote y fecha (PEPS).',
    whyNecessary: 'Mantiene la trazabilidad y evita daños mecánicos o contaminación cruzada antes de salir de planta.',
    impactOnFinalProduct: 'Preserva la forma esponjosa y frescura hasta el despacho.',
    inputs: ['Producto empacado y codificado'],
    inputState: 'Bolsas selladas.',
    transformation: 'Acopio ordenado por lotes.',
    outputs: ['Producto listo para despacho'],
    equipment: [
      { name: 'Canastillas plásticas higienizadas', role: 'Evitar aplastamiento y facilitar manejo.', scale: 'Transversal' },
      { name: 'Estanterías de producto terminado', role: 'Separar del piso y de materias primas.', scale: 'Transversal' }
    ],
    variables: [
      { label: 'Temperatura de almacén', referenceValue: 'Ambiente fresco (15 °C – 25 °C)' },
      { label: 'Rotación', referenceValue: 'PEPS / FIFO estricto' }
    ],
    qualityControl: {
      toVerify: 'Integridad de empaques, rotación por fecha y separación de químicos o devoluciones.',
      adequateConditions: 'Área limpia, seca, ventilada y libre de plagas.',
      commonErrors: 'Apilar demasiadas bolsas aplastando el pan o mezclar lotes.',
      correctiveActions: 'Redistribuir carga en canastillas y segregar empaques rotos.'
    },
    safetyAndHygiene: {
      risks: 'Aplastamiento mecánico, humedad o infestación.',
      hygiene: 'Lavado y desinfección periódica de canastillas.',
      contaminationPrevention: 'Área separada de recepción de materias primas y basuras.',
      allergens: 'Separación por tipo de producto en estanterías.'
    }
  },
  {
    id: 18,
    name: 'Distribución',
    shortName: 'Distribución',
    zone: 'Calidad y Despacho',
    asme: 'Transporte',
    classification: 'BPM / Prerrequisito',
    visualStateKey: 'distribution',
    visualCaption: 'Despacho higiénico en vehículo limpio hacia puntos de venta o degustación académica.',
    summary: 'Transporte y entrega del producto terminado al cliente o punto de consumo.',
    objective: 'Entregar el pan en óptimas condiciones de inocuidad, frescura e integridad física.',
    whatHappens: 'Se cargan canastillas en vehículo furgonado limpio y cerrado, verificando remisión y lote para mantener trazabilidad hasta el destino.',
    whyNecessary: 'Un transporte inadecuado puede contaminar o dañar un producto que fue fabricado correctamente.',
    impactOnFinalProduct: 'Garantiza que el consumidor reciba un pan fresco, intacto y seguro.',
    inputs: ['Producto terminado en canastillas', 'Guía de despacho / remisión'],
    inputState: 'Lotes liberados y empacados.',
    transformation: 'Traslado logístico al punto de venta o consumo.',
    outputs: ['Pan de sal tipo rollo entregado al cliente'],
    equipment: [
      { name: 'Vehículo furgonado limpio / Contenedor cerrado', role: 'Proteger del polvo, sol y lluvia.', scale: 'Transversal' },
      { name: 'Registros de despacho', role: 'Garantizar trazabilidad hacia adelante.', scale: 'Transversal' }
    ],
    variables: [
      { label: 'Condición de transporte', referenceValue: 'Limpio, seco, protegido de sol y humedad' },
      { label: 'Vida útil preliminar', referenceValue: 'Consumo mismo día o 3–5 días (sujeto a estudio)' }
    ],
    qualityControl: {
      toVerify: 'Limpieza del vehículo, ausencia de olores extraños y registro de lotes despachados.',
      adequateConditions: 'Transporte exclusivo de alimentos, sin químicos ni cargas incompatibles.',
      commonErrors: 'Exposición prolongada al sol o aplastamiento de canastillas.',
      correctiveActions: 'Rechazar vehículo sucio y reubicar canastillas con sujeción adecuada.'
    },
    safetyAndHygiene: {
      risks: 'Contaminación durante el traslado o pérdida de trazabilidad.',
      hygiene: 'Desinfección periódica del furgón y manos limpias del repartidor.',
      contaminationPrevention: 'Canastillas cerradas o cubiertas durante carga y descarga.',
      allergens: 'Mantener etiquetas intactas hasta el consumidor final.'
    }
  }
];
