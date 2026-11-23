export type EquipmentCategory =
  | 'Medición y Control'
  | 'Mezclado y Amasado'
  | 'División y Formado'
  | 'Climatización y Cocción'
  | 'Poshorneado y Empaque';

export interface EquipmentItem {
  id: string;
  name: string;
  phaseIds: number[];
  phaseLabel: string;
  scale: 'Artesanal' | 'Semindustrial' | 'Industrial' | 'Transversal';
  category: EquipmentCategory;
  machine3dId: string;
  functionDesc: string;
  contribution: string;
  maintenanceAndSafety: string;
  components: string[];
  relatedVariables: string[];
  safetyProtocols: string[];
  maintenanceSchedule: string;
  iconType: 'scale' | 'mixer' | 'kneader' | 'divider' | 'rounder' | 'proofer' | 'table' | 'oven' | 'cooling' | 'packaging';
}

export const EQUIPMENT_DATA: EquipmentItem[] = [
  {
    id: 'scale',
    name: 'Báscula de plataforma y balanza de precisión',
    phaseIds: [1, 3, 7, 15],
    phaseLabel: 'Fases 1, 3, 7 y 15: Recepción, Pesaje, División e Inspección',
    scale: 'Transversal',
    category: 'Medición y Control',
    machine3dId: 'scale_table',
    functionDesc: 'Medición gravimétrica exacta de materias primas (macro y microingredientes), porciones de masa cruda (80 g) y producto horneado.',
    contribution: 'Garantiza la repetibilidad del porcentaje panadero (Harina = 100%) y el control estadístico de pesos unitarios.',
    maintenanceAndSafety: 'Calibración periódica con pesas patrón certificadas; limpieza en seco sin sumergir celdas de carga ni indicadores.',
    components: [
      'Plato receptor en acero inoxidable AISI 304',
      'Celda de carga extensométrica de alta sensibilidad',
      'Indicador digital LCD con función de tara (TARE)',
      'Patas niveladoras antideslizantes y burbuja de nivel',
    ],
    relatedVariables: [
      'Dosificación por porcentaje panadero (Harina 100%, Agua 58%, Sal 1,8%, Levadura 1%)',
      'Peso por porción cruda (80 g ± 3 g)',
      'Merma de horneado y rendimiento del lote',
    ],
    safetyProtocols: [
      'No exceder la capacidad máxima nominal de la celda de carga',
      'Desconectar de la red eléctrica antes de limpieza húmeda perimetral',
      'Ubicar sobre mesa firme libre de vibraciones de amasadoras',
    ],
    maintenanceSchedule: 'Verificación semanal con masa patrón y calibración metrológica semestral.',
    iconType: 'scale',
  },
  {
    id: 'mixer',
    name: 'Mezcladora / Batidora Planetaria o de Tolva',
    phaseIds: [4],
    phaseLabel: 'Fase 4: Mezclado e hidratación inicial',
    scale: 'Semindustrial',
    category: 'Mezclado y Amasado',
    machine3dId: 'mixer',
    functionDesc: 'Integración homogénea a baja velocidad (Velocidad 1) de ingredientes secos, agua potable y materia grasa.',
    contribution: 'Previene la formación de grumos secos, controla la dispersión de levadura/sal y evita pérdidas por polvo de harina en suspensión.',
    maintenanceAndSafety: 'Operar únicamente con rejilla de seguridad abatida; limpieza y sanitización POES de la tolva tras cada jornada.',
    components: [
      'Tazón o tolva en acero inoxidable grado alimentario',
      'Agitador primario / paleta de incorporación',
      'Rejilla protectora con microinterruptor de parada',
      'Selector de velocidad baja y temporizador de ciclo',
    ],
    relatedVariables: [
      'Tiempo de mezclado inicial (3 – 5 min)',
      'Temperatura del agua de hidratación',
      'Porcentaje de absorción de agua (58%)',
    ],
    safetyProtocols: [
      'Enclavamiento eléctrico que detiene el motor al levantar la guarda',
      'Parada de emergencia tipo hongo accesible al operario',
      'Prohibición de uso de utensilios sueltos dentro de la tolva en giro',
    ],
    maintenanceSchedule: 'Lavado diario de tolva; inspección mensual de retenedores y transmisión.',
    iconType: 'mixer',
  },
  {
    id: 'kneader',
    name: 'Amasadora de espiral de dos velocidades',
    phaseIds: [5],
    phaseLabel: 'Fase 5: Amasado y desarrollo de gluten',
    scale: 'Semindustrial',
    category: 'Mezclado y Amasado',
    machine3dId: 'mixer',
    functionDesc: 'Aplica esfuerzo mecánico de estiramiento, plegado y cizalla para hidratar y alinear glutenina y gliadina formando la red viscoelástica.',
    contribution: 'Permite alcanzar el punto de velo o membrana en 8–12 minutos manteniendo la temperatura de la masa controlada (24–28 °C).',
    maintenanceAndSafety: 'Nunca introducir manos o espátulas con el espiral en movimiento; revisar tensión de correas y lubricación grado alimentario (NSF H1).',
    components: [
      'Gancho espiral forjado en acero inoxidable',
      'Barra divisoria central (rompe-masa)',
      'Artesa o tazón giratorio sincronizado',
      'Panel de control de 2 velocidades con inversión de giro y timer',
      'Rejilla de seguridad con sensor magnético',
    ],
    relatedVariables: [
      'Tiempo de amasado intensivo (8 – 12 min)',
      'Temperatura final de la masa (24 – 28 °C)',
      'Desarrollo de red de gluten (prueba del velo)',
    ],
    safetyProtocols: [
      'No anular el sensor de la rejilla protectora bajo ninguna circunstancia',
      'Aplicar bloqueo de energía (LOTO) antes de tensar correas',
      'Recoger cabello y evitar prendas holgadas (Res. 2674/2013)',
    ],
    maintenanceSchedule: 'Limpieza sanitaria por lote; engrase trimestral de rodamientos con lubricante grado alimentario.',
    iconType: 'kneader',
  },
  {
    id: 'proofer',
    name: 'Cámara de fermentación controlada (Cuarto de crecimiento)',
    phaseIds: [6, 11],
    phaseLabel: 'Fases 6 y 11: Primera fermentación y Fermentación final',
    scale: 'Semindustrial',
    category: 'Climatización y Cocción',
    machine3dId: 'proofer',
    functionDesc: 'Cabina térmica aislada con generación de vapor y control digital de temperatura (28–32 °C) y humedad relativa (75–85% HR).',
    contribution: 'Garantiza una tasa de producción de CO₂ constante por Saccharomyces cerevisiae y evita el encostramiento prematuro de los rollos.',
    maintenanceAndSafety: 'Drenaje y limpieza frecuente del depósito de agua para evitar biopelículas o mohos; calibración del termohigrómetro.',
    components: [
      'Controlador digital PID de temperatura y humedad relativa',
      'Generador de humedad por resistencia sumergida y flotador',
      'Puertas con visor de vidrio templado y empaque magnético',
      'Rieles interiores en acero inoxidable para bandejas de 60×40 cm',
    ],
    relatedVariables: [
      'Temperatura de fermentación (28 – 32 °C)',
      'Humedad relativa de cámara (75 – 85% HR)',
      'Tiempo de fermentación en bloque (30–45 min) y final (45–60 min)',
    ],
    safetyProtocols: [
      'Precaución ante salida de vapor húmedo al abrir puertas',
      'Utilizar agua potable filtrada para el generador de humedad',
      'Mantener piso seco frente a la cámara para prevenir resbalones',
    ],
    maintenanceSchedule: 'Desagüe y desinfección semanal de cuba de agua; contraste trimestral de sensores T/HR.',
    iconType: 'proofer',
  },
  {
    id: 'divider',
    name: 'Divisora volumétrica / Prensa hidráulica de masa',
    phaseIds: [7],
    phaseLabel: 'Fase 7: División o porcionado',
    scale: 'Industrial',
    category: 'División y Formado',
    machine3dId: 'shaping_table',
    functionDesc: 'Prensa equitativamente el bloque de masa fermentada y acciona cuchillas de acero inoxidable para obtener porciones de 80 g.',
    contribution: 'Estandariza el peso unitario del lote en segundos, evitando que el bloque continúe gasificando de manera desigual.',
    maintenanceAndSafety: 'Limpieza diaria de cuchillas y pistones; bloqueo de energía (LOTO) obligatorio antes de limpiar la cámara de corte.',
    components: [
      'Cabezal de prensado con tapa abatible y cierre de seguridad',
      'Juego de cuchillas estrella/cuadrícula en acero inoxidable',
      'Palanca o actuador hidráulico de prensado y corte',
      'Plato de compresión en polímero alimentario antiadherente',
    ],
    relatedVariables: [
      'Peso por porción cruda (80 g ± 3 g)',
      'Tiempo máximo de operación de corte (< 10 min por lote)',
      'Presión de prensado (sin desgarrar gluten)',
    ],
    safetyProtocols: [
      'Nunca accionar la palanca de corte con la tapa abierta',
      'Usar cepillo de cerdas plásticas para retirar restos en cuchillas (no usar las manos)',
      'Inspeccionar ausencia de fugas en circuito hidráulico',
    ],
    maintenanceSchedule: 'Limpieza de cabezal tras cada jornada; cambio anual de sellos y aceite hidráulico grado alimentario.',
    iconType: 'divider',
  },
  {
    id: 'rounder',
    name: 'Boleadora cónica (o estación de boleado)',
    phaseIds: [8],
    phaseLabel: 'Fase 8: Boleado y tensión superficial',
    scale: 'Industrial',
    category: 'División y Formado',
    machine3dId: 'shaping_table',
    functionDesc: 'Hace rodar las porciones de 80 g a lo largo de una canaleta helicoidal alrededor de un cono giratorio para formar esferas tensas.',
    contribution: 'Cierra los poros abiertos en el corte y crea una película exterior lisa capaz de retener el gas en la segunda fermentación.',
    maintenanceAndSafety: 'Ajustar teflón y canaletas sin acumulación de masa seca; verificar guardas en motor inferior.',
    components: [
      'Cono rotatorio recubierto en teflón antiadherente',
      'Canaleta helicoidal ajustable en aluminio/teflón',
      'Dosificador superior de espolvoreo mínimo de harina',
      'Bastidor con ruedas y freno de fijación',
    ],
    relatedVariables: [
      'Tensión superficial de la bola de masa',
      'Sellado de costura basal',
      'Cantidad de harina de espolvoreo (mínima necesaria)',
    ],
    safetyProtocols: [
      'No introducir manos entre el cono giratorio y la canaleta fija',
      'Desenergizar antes de raspar adherencias de masa en la espiral',
    ],
    maintenanceSchedule: 'Cepillado en seco diario; inspección semestral del recubrimiento antiadherente.',
    iconType: 'rounder',
  },
  {
    id: 'table',
    name: 'Mesa de formado en acero inoxidable y rodillos laminadores',
    phaseIds: [7, 8, 9, 10, 12],
    phaseLabel: 'Fases 7 a 10 y 12: Reposo intermedio, Formado tipo rollo y Acabado',
    scale: 'Artesanal',
    category: 'División y Formado',
    machine3dId: 'shaping_table',
    functionDesc: 'Superficie sanitaria lisa para el reposo cubierto (10–15 min), desgasificado suave, enrollado cilíndrico y disposición en latas.',
    contribution: 'Facilita el formado simétrico del pan tipo rollo con la costura hacia abajo y separación homogénea entre piezas.',
    maintenanceAndSafety: 'Limpieza y desinfección POES antes y después de cada turno; evitar golpes o cortes sobre la lámina inoxidable.',
    components: [
      'Cubierta superior en acero inoxidable AISI 304 calibre 16',
      'Rodillos laminadores / formadora de cilindros con graduación',
      'Cubierta plástica translúcida para reposo intermedio',
      'Entrepaño inferior para bandejas perforadas de 60×40 cm',
    ],
    relatedVariables: [
      'Tiempo de reposo intermedio (10 – 15 min)',
      'Longitud y diámetro del rollo formado',
      'Separación entre unidades en bandeja (3 – 4 cm)',
    ],
    safetyProtocols: [
      'Sanitizar con solución aprobada y secar antes del contacto con masa',
      'Mantener espátulas y rasquetas plásticas íntegras sin bordes astillados',
    ],
    maintenanceSchedule: 'Desinfección continua entre lotes; pasivado o pulido anual de superficie inoxidable.',
    iconType: 'table',
  },
  {
    id: 'oven',
    name: 'Horno industrial de convección forzada / rotatorio',
    phaseIds: [13],
    phaseLabel: 'Fase 13: Horneado (Posible PCC Térmico)',
    scale: 'Semindustrial',
    category: 'Climatización y Cocción',
    machine3dId: 'oven',
    functionDesc: 'Transfiere calor por convección y radiación a 180–200 °C durante 12–18 min para fijar la estructura de la miga y dorar la corteza.',
    contribution: 'Produce el salto de horno (oven spring), gelatiniza almidones, coagula el gluten (~82–96 °C internos) y desarrolla aroma/color Maillard.',
    maintenanceAndSafety: 'Uso obligatorio de guantes térmicos ignífugos; revisión de sellos de silicona, turbinas, quemadores/resistencias y campana extractora.',
    components: [
      'Cámara de cocción en acero inoxidable con aislamiento de lana mineral',
      'Turbina de convección con inversión periódica de flujo de aire',
      'Panel digital de temperatura, temporizador de ciclo y alarma sonora',
      'Puerta con doble vidrio templado térmico, empaque de silicona y manija fría',
      'Campana superior de extracción de vapores',
    ],
    relatedVariables: [
      'Temperatura de horneado (180 – 200 °C)',
      'Tiempo de horneado (12 – 18 min)',
      'Temperatura interna en el centro del pan (82 – 96 °C)',
    ],
    safetyProtocols: [
      'Portar guantes térmicos certificados hasta antebrazo al cargar/descargar latas',
      'Abrir puerta en dos tiempos para evacuar vapor caliente hacia la campana',
      'Verificar funcionamiento de válvula solenoide o termostato de seguridad de sobretemperatura',
    ],
    maintenanceSchedule: 'Limpieza diaria de cámara fría y vidrios; calibración trimestral de termopar y revisión de turbinas.',
    iconType: 'oven',
  },
  {
    id: 'cooling',
    name: 'Carros escabiladeros y rejillas de enfriamiento',
    phaseIds: [14],
    phaseLabel: 'Fase 14: Enfriamiento en zona limpia',
    scale: 'Transversal',
    category: 'Poshorneado y Empaque',
    machine3dId: 'cooling_rack',
    functionDesc: 'Estructura móvil multinivel que sostiene las bandejas perforadas permitiendo la circulación natural de aire por todas las caras del pan.',
    contribution: 'Disipa calor sensible y vapor de agua durante 30–60 minutos hasta bajar de 35 °C internos antes del empaque.',
    maintenanceAndSafety: 'Ubicar exclusivamente en zona limpia alejada de polvo de harina cruda; asegurar frenos de ruedas tras posicionar.',
    components: [
      'Bastidor vertical en perfil cuadrado de acero inoxidable',
      '10 a 18 niveles de guías con tope antideslizamiento de bandejas',
      'Rejillas ventiladas que evitan condensación basal en el pan',
      '4 ruedas giratorias de alta temperatura con freno de pedal',
    ],
    relatedVariables: [
      'Tiempo de enfriamiento (30 – 60 min)',
      'Temperatura interna objetivo al finalizar (< 35 °C)',
      'Humedad ambiental del área limpia',
    ],
    safetyProtocols: [
      'Desplazar el carro sujetándolo de las barras laterales con guantes térmicos',
      'Bloquear ruedas durante la carga y descarga de bandejas calientes',
    ],
    maintenanceSchedule: 'Lavado y desinfección semanal de bastidor y lubricación de rodachinas.',
    iconType: 'cooling',
  },
  {
    id: 'packaging',
    name: 'Estación de sellado térmico, codificado y canastillas PEPS',
    phaseIds: [15, 16, 17, 18],
    phaseLabel: 'Fases 15 a 18: Inspección, Empaque, Almacenamiento PT y Distribución',
    scale: 'Semindustrial',
    category: 'Poshorneado y Empaque',
    machine3dId: 'packaging',
    functionDesc: 'Integra mesa de inspección con termómetro de punzón, selladora térmica por impulso, rotulado de lote/alérgenos y canastillas plásticas.',
    contribution: 'Protege el pan blandito de la contaminación externa y pérdida de suavidad, garantizando trazabilidad y declaración de gluten.',
    maintenanceAndSafety: 'Precaución con cinta de teflón y resistencia caliente en la selladora; lavado y desinfección de canastillas antes de cada retorno.',
    components: [
      'Selladora térmica de mordaza con temporizador de impulso',
      'Termómetro digital de punzón en acero inoxidable para control pre-empaque',
      'Fechador / codificador de número de lote y fecha de vencimiento',
      'Canastillas plásticas apilables ventiladas para rotación PEPS',
    ],
    relatedVariables: [
      'Temperatura del pan previa al sellado (< 35 °C)',
      'Hermeticidad del sello térmico (100% continuo)',
      'Rotulado: Lote, fecha de fabricación/vencimiento y alérgeno (Contiene gluten)',
    ],
    safetyProtocols: [
      'No tocar la barra de sellado durante ni inmediatamente después del ciclo',
      'Estibar canastillas sobre base limpia sin exceder altura máxima de apilamiento',
    ],
    maintenanceSchedule: 'Revisión semanal de banda de teflón y nicrom en selladora; lavado diario de canastillas de despacho.',
    iconType: 'packaging',
  },
];
