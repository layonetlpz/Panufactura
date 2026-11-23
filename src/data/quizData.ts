export interface QuizQuestion {
  id: number;
  topic:
    | 'Materias primas'
    | 'Secuencia de manufactura'
    | 'Amasado'
    | 'Fermentación'
    | 'Horneado'
    | 'Maquinaria'
    | 'Variables'
    | 'Calidad e inocuidad';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_TOPICS: QuizQuestion['topic'][] = [
  'Materias primas',
  'Secuencia de manufactura',
  'Amasado',
  'Fermentación',
  'Horneado',
  'Maquinaria',
  'Variables',
  'Calidad e inocuidad',
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Secuencia de manufactura',
    question: '¿Cuál es el orden correcto de las operaciones inmediatamente posteriores a la primera fermentación en bloque (Fase 6)?',
    options: [
      'Horneado → Enfriamiento → Boleado → Empaque',
      'División (80 g) → Boleado → Reposo intermedio → Formado tipo rollo',
      'Formado → División → Reposo intermedio → Boleado',
      'Boleado → División → Formado → Amasado intensivo',
    ],
    correctIndex: 1,
    explanation:
      'Después de la primera fermentación en bloque (Fase 6), la masa pasa por División en porciones de 80 g (Fase 7), Boleado para crear tensión superficial (Fase 8), Reposo intermedio de 10–15 min para relajar el gluten (Fase 9) y Formado cilíndrico tipo rollo (Fase 10).',
  },
  {
    id: 2,
    topic: 'Materias primas',
    question: 'En la formulación piloto del pan de sal tipo rollo, ¿qué función tecnológica cumple principalmente la sal (1,8% panadero)?',
    options: [
      'Aportar color dorado por caramelización directa de cloruros',
      'Aumentar la tasa de producción de CO₂ acelerando la levadura sin límite',
      'Fortalecer la red de gluten, regular la velocidad de fermentación y realzar el sabor',
      'Sustituir al agua potable como medio de hidratación del almidón',
    ],
    correctIndex: 2,
    explanation:
      'La sal (1,8%) refuerza los enlaces iónicos de la red de gluten mejorando su tenacidad, controla la presión osmótica para evitar fermentaciones desbocadas y define el perfil sensorial del pan de sal.',
  },
  {
    id: 3,
    topic: 'Materias primas',
    question: 'Si se preparan 2.500 g de harina base (100%) con la formulación piloto (hidratación del 58% y masa total del 169,3%), ¿cuánta agua y cuánta masa cruda total se obtienen?',
    options: [
      '1.000 g de agua y 2.500 g de masa total',
      '1.450 g de agua y 4.232,5 g de masa cruda total',
      '580 g de agua y 1.693 g de masa cruda total',
      '2.000 g de agua y 5.000 g de masa cruda total',
    ],
    correctIndex: 1,
    explanation:
      'En porcentaje panadero todos los ingredientes se expresan respecto a la harina (100%). Con 2.500 g de harina: Agua = 2.500 × 0,58 = 1.450 g; Masa total = 2.500 × 1,693 = 4.232,5 g (~52 unidades de 80 g).',
  },
  {
    id: 4,
    topic: 'Amasado',
    question: '¿Qué propiedad reológica se comprueba mediante la "prueba del velo o membrana" al finalizar la Fase 5 (Amasado)?',
    options: [
      'La temperatura interna de gelatinización del almidón en el horno',
      'La formación de una película viscoelástica continua y translúcida de gluten capaz de retener CO₂ sin desgarrarse',
      'La humedad relativa dentro de la cámara de fermentación',
      'El porcentaje de merma por evaporación durante el enfriamiento',
    ],
    correctIndex: 1,
    explanation:
      'Al estirar suavemente una pequeña porción de masa amasada durante 8–12 minutos, debe formarse una membrana fina y translúcida sin romperse, indicando que glutenina y gliadina han desarrollado una matriz apta para retener el gas fermentativo.',
  },
  {
    id: 5,
    topic: 'Amasado',
    question: '¿Por qué es importante que la temperatura de la masa al salir de la amasadora se mantenga entre 24 °C y 28 °C?',
    options: [
      'Porque por encima de 28 °C el acero inoxidable de la tolva se funde',
      'Para evitar una fermentación prematura descontrolada y el debilitamiento enzimático/mecánico del gluten',
      'Porque la levadura Saccharomyces cerevisiae solo sobrevive bajo cero',
      'Para poder empacar la masa cruda directamente sin hornear',
    ],
    correctIndex: 1,
    explanation:
      'Una masa que sale demasiado caliente (> 30 °C) por exceso de fricción o agua tibia acelera prematuramente la fermentación, pierde fuerza estructural y dificulta el porcionado y formado.',
  },
  {
    id: 6,
    topic: 'Maquinaria',
    question: '¿Qué equipo industrial mantiene controlada la temperatura (28–32 °C) y la humedad relativa (75–85% HR) para evitar que los rollos formen costra superficial antes del horno?',
    options: [
      'Divisora volumétrica hidráulica',
      'Amasadora de espiral de dos velocidades',
      'Cámara de fermentación controlada (cuarto de crecimiento)',
      'Boleadora cónica recubierta en teflón',
    ],
    correctIndex: 2,
    explanation:
      'La cámara de fermentación aporta calor suave y vapor húmedo (75–85% HR) para que la superficie de la masa permanezca elástica mientras las piezas duplican o triplican su volumen.',
  },
  {
    id: 7,
    topic: 'Maquinaria',
    question: '¿Cuál es la contribución técnica de combinar una divisora volumétrica con una boleadora cónica en las Fases 7 y 8?',
    options: [
      'Hornear el pan en la mitad del tiempo sin usar horno',
      'Fraccionar el bloque en porciones uniformes (80 g) y cerrar los poros creando una esfera con tensión superficial homogénea',
      'Enfriar el pan recién horneado por debajo de 35 °C',
      'Sellar las bolsas plásticas e imprimir el código de lote',
    ],
    correctIndex: 1,
    explanation:
      'La divisora asegura exactitud gravimétrica/volumétrica (80 g) en poco tiempo, mientras la boleadora sella la superficie cortada y genera tensión uniforme para retener gas y facilitar el formado posterior.',
  },
  {
    id: 8,
    topic: 'Fermentación',
    question: '¿Qué defecto técnico se origina si se exceden significativamente el tiempo (> 75 min) o la temperatura (> 36 °C) durante la fermentación final?',
    options: [
      'La red de gluten gana resistencia ilimitada y el pan dura 6 meses',
      'Sobrefermentación: las paredes de los alvéolos se adelgazan en exceso, la estructura colapsa en el horno y aparece acidez',
      'El pan conserva el mismo volumen pero con corteza blanca',
      'No ocurre ningún cambio porque la levadura deja de actuar a los 20 minutos',
    ],
    correctIndex: 1,
    explanation:
      'La fermentación excesiva supera el límite elástico de las películas de gluten, causando escape de CO₂, aplastamiento o arrugas al entrar al horno y acumulación de ácidos secundarios.',
  },
  {
    id: 9,
    topic: 'Horneado',
    question: 'Durante la Fase 13 (Horneado a 180–200 °C por 12–18 min), ¿qué tres transformaciones físico-químicas fijan la estructura y apariencia del pan rollo?',
    options: [
      'Congelación del agua, cristalización de la sal y sublimación del gluten',
      'Expansión inicial (oven spring), gelatinización del almidón / coagulación del gluten (~82–96 °C) y dorado por reacción de Maillard',
      'Hidratación de gliadina, división celular de la levadura y fermentación láctica',
      'Retrogradación del almidón, condensación de vapor y sellado térmico',
    ],
    correctIndex: 1,
    explanation:
      'En los primeros minutos ocurre el salto de horno (oven spring) e inactivación térmica de la levadura (~55–60 °C); luego el almidón gelatiniza y el gluten coagula fijando la miga (~82–96 °C), mientras en la corteza ocurren reacciones de Maillard y caramelización.',
  },
  {
    id: 10,
    topic: 'Variables',
    question: 'En el laboratorio de variables, ¿qué sucede si el horno opera a una temperatura excesivamente alta (ej. 235 °C) con piezas sobredimensionadas (115 g)?',
    options: [
      'Cocción uniforme perfecta en menos de 3 minutos',
      'Arrebato térmico: pardeamiento prematuro o quemado de la corteza mientras el centro permanece crudo y pastoso (< 82 °C)',
      'Falta total de color en la corteza por exceso de calor',
      'Aumento de la humedad relativa de la cámara de fermentación',
    ],
    correctIndex: 1,
    explanation:
      'Una temperatura exterior muy elevada forma rápidamente una corteza rígida y oscura antes de que la conducción térmica hacia el núcleo de una pieza más gruesa logre gelatinizar el almidón y coagular las proteínas.',
  },
  {
    id: 11,
    topic: 'Calidad e inocuidad',
    question: '¿Por qué es un requisito crítico de control enfriar el pan hasta una temperatura interna inferior a 35 °C antes de empacarlo en bolsa cerrada (Fases 14–16)?',
    options: [
      'Porque el plástico se disuelve instantáneamente a 36 °C',
      'Para evitar que el vapor residual condense dentro de la bolsa, lo cual reblandece la corteza y acelera el crecimiento de mohos',
      'Para que la levadura vuelva a fermentar dentro del empaque',
      'Porque el pan frío pesa exactamente el doble que el pan caliente',
    ],
    correctIndex: 1,
    explanation:
      'Si el pan se empaca caliente (> 35 °C), el vapor de agua que aún migra desde la miga se condensa en la cara interna de la bolsa, elevando la actividad de agua superficial y provocando deterioro fúngico prematuro.',
  },
  {
    id: 12,
    topic: 'Calidad e inocuidad',
    question: 'Respecto al marco normativo colombiano y la gestión de inocuidad en panificación, ¿cuál de las siguientes afirmaciones es correcta?',
    options: [
      'Todas las 18 fases del proceso son obligatoriamente Puntos Críticos de Control (PCC)',
      'La Resolución 2674 de 2013 rige las Buenas Prácticas de Manufactura (BPM), mientras el horneado se analiza como posible PCC térmico bajo principios HACCP (Decreto 60/2002)',
      'El trigo no se considera alérgeno y no requiere declararse en el rotulado',
      'La rotación PEPS significa empacar primero los panes que aún están calientes',
    ],
    correctIndex: 1,
    explanation:
      'La Resolución 2674/2013 establece los requisitos sanitarios y de BPM (prerrequisitos), la mayoría de etapas operan como Puntos de Control (PC) de calidad/proceso y el horneado actúa como etapa térmica letal (posible PCC según Decreto 60/2002), además de exigir la declaración de gluten como alérgeno.',
  },
];
