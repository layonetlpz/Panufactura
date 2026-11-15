export interface EquipmentItem {
  id: string;
  name: string;
  phaseIds: number[];
  phaseLabel: string;
  scale: 'Artesanal' | 'Semindustrial' | 'Industrial' | 'Transversal';
  functionDesc: string;
  contribution: string;
  maintenanceAndSafety: string;
  iconType: 'scale' | 'mixer' | 'kneader' | 'divider' | 'rounder' | 'proofer' | 'table' | 'oven' | 'cooling' | 'packaging';
}

export const EQUIPMENT_DATA: EquipmentItem[] = [
  {
    id: 'scale',
    name: 'Báscula de plataforma y balanza de precisión',
    phaseIds: [1, 3, 7, 15],
    phaseLabel: 'Recepción, Pesaje, División e Inspección',
    scale: 'Transversal',
    functionDesc: 'Medición exacta de materias primas (macro y microingredientes), porciones de masa y producto horneado.',
    contribution: 'Garantiza la repetibilidad del porcentaje panadero y el control de pesos unitarios (80 g crudo).',
    maintenanceAndSafety: 'Calibración periódica con pesas patrón, limpieza en seco sin sumergir sensores electrónicos.'
    ,iconType: 'scale'
  },
  {
    id: 'mixer',
    name: 'Mezcladora / Batidora',
    phaseIds: [4],
    phaseLabel: 'Fase 4: Mezclado',
    scale: 'Semindustrial',
    functionDesc: 'Integración homogénea a baja velocidad de ingredientes secos, agua y grasa.',
    contribution: 'Previene grumos sin hidratar y distribuye uniformemente sal y levadura antes del amasado.',
    maintenanceAndSafety: 'Operar solo con rejilla de seguridad cerrada; limpieza y sanitización de tolva tras cada jornada.'
    ,iconType: 'mixer'
  },
  {
    id: 'kneader',
    name: 'Amasadora de espiral (o de brazos)',
    phaseIds: [5],
    phaseLabel: 'Fase 5: Amasado',
    scale: 'Semindustrial',
    functionDesc: 'Aplica trabajo mecánico controlado para alinear glutenina y gliadina y desarrollar la red de gluten.',
    contribution: 'Permite alcanzar el punto de tela en 8–12 minutos manteniendo la temperatura de masa controlada (24–28 °C).',
    maintenanceAndSafety: 'Nunca introducir manos o espátulas con el espiral en movimiento; revisar tensión de correas y lubricación grado alimentario.'
    ,iconType: 'kneader'
  },
  {
    id: 'divider',
    name: 'Divisora volumétrica / Rasqueta y cortadora',
    phaseIds: [7],
    phaseLabel: 'Fase 7: División o porcionado',
    scale: 'Industrial',
    functionDesc: 'Fracciona el bloque de masa fermentada en porciones de peso idéntico (80 g).',
    contribution: 'Acelera el porcionado evitando que la masa siga fermentando de forma desigual entre piezas.',
    maintenanceAndSafety: 'Limpieza diaria de cuchillas y pistones; bloqueo de energía (LOTO) antes de intervenir partes cortantes.'
    ,iconType: 'divider'
  },
  {
    id: 'rounder',
    name: 'Boleadora cónica (o mesón de boleado)',
    phaseIds: [8],
    phaseLabel: 'Fase 8: Boleado',
    scale: 'Industrial',
    functionDesc: 'Forma esferas tensas y lisas cerrando la base de cada porción de masa.',
    contribution: 'Genera tensión superficial uniforme para retener CO₂ y estandariza la geometría previa al formado.',
    maintenanceAndSafety: 'Ajustar canaletas sin exceso de harina acumulada; verificar protecciones en ejes giratorios.'
    ,iconType: 'rounder'
  },
  {
    id: 'proofer',
    name: 'Cámara de fermentación (Cuarto de crecimiento)',
    phaseIds: [6, 11],
    phaseLabel: 'Fases 6 y 11: Fermentaciones',
    scale: 'Semindustrial',
    functionDesc: 'Cabina con control de temperatura (28–35 °C) y humedad relativa (75–85% HR).',
    contribution: 'Asegura crecimiento volumétrico uniforme y evita la formación de costra seca en la superficie de los rollos.',
    maintenanceAndSafety: 'Limpieza frecuente de bandejas de agua para evitar mohos; calibración periódica del termohigrómetro.'
    ,iconType: 'proofer'
  },
  {
    id: 'table',
    name: 'Mesa de trabajo en acero inoxidable y rodillos',
    phaseIds: [7, 8, 9, 10],
    phaseLabel: 'Fases 7 a 10: División, Boleado, Reposo y Formado',
    scale: 'Artesanal',
    functionDesc: 'Superficie higiénica no porosa para manipulación, relajación y formado manual o con formadora de rodillos.',
    contribution: 'Facilita el enrollado simétrico con costura hacia abajo y cumple requisitos sanitarios de la Res. 2674.',
    maintenanceAndSafety: 'Limpieza y desinfección antes y después de cada lote; evitar rayaduras profundas.'
    ,iconType: 'table'
  },
  {
    id: 'oven',
    name: 'Horno rotatorio / de convección / de pisos',
    phaseIds: [13],
    phaseLabel: 'Fase 13: Horneado',
    scale: 'Semindustrial',
    functionDesc: 'Transfiere calor (180–200 °C) para cocer la masa, gelatinizar almidón, coagular proteínas y dorar corteza.',
    contribution: 'Fija la estructura definitiva del pan y garantiza su inocuidad térmica (~95 °C internos).',
    maintenanceAndSafety: 'Uso obligatorio de guantes ignífugos; revisión preventiva de quemadores, sellos de puerta y extractores.'
    ,iconType: 'oven'
  },
  {
    id: 'cooling',
    name: 'Rejillas y carros escabiladeros de enfriamiento',
    phaseIds: [14],
    phaseLabel: 'Fase 14: Enfriamiento',
    scale: 'Transversal',
    functionDesc: 'Estructuras ventiladas que permiten disipar calor y vapor por todas las caras del pan.',
    contribution: 'Reduce la temperatura interna a < 35 °C evitando condensación y crecimiento de mohos al empacar.',
    maintenanceAndSafety: 'Ubicar exclusivamente en zona limpia lejos de corrientes de polvo; lavado periódico de bandejas.'
    ,iconType: 'cooling'
  },
  {
    id: 'packaging',
    name: 'Selladora de bolsas y codificadora de lote',
    phaseIds: [16],
    phaseLabel: 'Fase 16: Empaque',
    scale: 'Semindustrial',
    functionDesc: 'Cierra herméticamente bolsas grado alimentario e imprime lote, fecha de vencimiento y alérgenos.',
    contribution: 'Protege contra contaminación ambiental, conserva frescura y asegura trazabilidad normativa.',
    maintenanceAndSafety: 'Precaución con mordaza caliente en selladora; verificar tinta grado alimentario o etiquetas legibles.'
    ,iconType: 'packaging'
  }
];
