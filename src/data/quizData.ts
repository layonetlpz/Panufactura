export interface QuizQuestion {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Secuencia de Fases',
    question: '¿Cuál es el orden correcto de las operaciones inmediatamente posteriores a la primera fermentación en bloque?',
    options: [
      'Horneado → Enfriamiento → Boleado',
      'División → Boleado → Reposo intermedio → Formado',
      'Formado → División → Reposo intermedio → Boleado',
      'Boleado → División → Formado → Amasado'
    ],
    correctIndex: 1,
    explanation: 'Después de la primera fermentación en bloque, la masa se divide en porciones iguales (80 g), se bolea para crear tensión superficial, descansa en reposo intermedio (10–15 min) para relajar el gluten y luego se forma en rollos.'
  },
  {
    id: 2,
    topic: 'Función de Ingredientes',
    question: 'En la formulación piloto del pan de sal tipo rollo, ¿qué función cumple principalmente la sal (1,8%)?',
    options: [
      'Aportar color dorado por caramelización directa',
      'Aumentar la producción de CO₂ acelerando la levadura',
      'Controlar la tasa de fermentación, fortalecer el gluten y aportar sabor',
      'Sustituir el agua para hidratar el almidón'
    ],
    correctIndex: 2,
    explanation: 'La sal fortalece la red de gluten, regula la actividad fermentativa de la levadura (evitando fermentaciones desbocadas) y aporta el sabor característico.'
  },
  {
    id: 3,
    topic: 'Amasado y Gluten',
    question: '¿Qué se verifica mediante la "prueba del velo o membrana" al finalizar el amasado?',
    options: [
      'La temperatura interna de cocción del pan',
      'El desarrollo adecuado de la red viscoelástica de gluten sin ruptura',
      'La humedad relativa de la cámara de fermentación',
      'El porcentaje de pérdida de humedad en el horno'
    ],
    correctIndex: 1,
    explanation: 'Al estirar suavemente un fragmento de masa hasta formar una película delgada y translúcida sin romperse, se confirma que la glutenina y gliadina han formado una red capaz de retener el gas.'
  },
  {
    id: 4,
    topic: 'Maquinaria',
    question: '¿Qué equipo permite controlar la temperatura (28–35 °C) y la humedad relativa (75–85%) durante la fermentación final?',
    options: [
      'Divisora volumétrica',
      'Amasadora de espiral',
      'Cámara de fermentación (cuarto de crecimiento)',
      'Boleadora cónica'
    ],
    correctIndex: 2,
    explanation: 'La cámara de fermentación mantiene ambiente cálido y húmedo para que los rollos expandan su volumen sin formar una costra seca en la superficie.'
  },
  {
    id: 5,
    topic: 'Fermentación',
    question: '¿Qué ocurre si se excede el tiempo o la temperatura durante la fermentación final?',
    options: [
      'La masa gana fuerza infinita y duplica su vida útil',
      'La estructura se debilita, puede colapsar en el horno y desarrolla sabor ácido',
      'El pan sale con mejor volumen y corteza más delgada',
      'Se elimina la necesidad de hornear a 180 °C'
    ],
    correctIndex: 1,
    explanation: 'La sobrefermentación agota la resistencia elástica del gluten y acumula ácidos orgánicos, provocando colapso estructural y sabor ácido.'
  },
  {
    id: 6,
    topic: 'Horneado',
    question: '¿Cuál es el rango de temperatura de referencia propuesto para el horneado piloto del pan tipo rollo?',
    options: [
      '80 °C – 95 °C durante 5 minutos',
      '28 °C – 32 °C durante 60 minutos',
      '180 °C – 200 °C durante 12 a 18 minutos',
      '300 °C – 350 °C durante 40 minutos'
    ],
    correctIndex: 2,
    explanation: 'La propuesta piloto establece 180–200 °C durante 12–18 minutos (alcanzando ~82–96 °C en el centro del pan) para gelatinizar almidones, coagular proteínas y dorar la corteza.'
  },
  {
    id: 7,
    topic: 'Control de Calidad e Inocuidad',
    question: '¿Por qué es obligatorio enfriar el pan (< 35 °C) antes de empacarlo en bolsa cerrada?',
    options: [
      'Para que el pan pierda todo su sabor antes de venderse',
      'Para evitar condensación de vapor dentro de la bolsa, que favorece el crecimiento de mohos',
      'Porque la selladora no funciona si el pan pesa menos de 80 g',
      'Para activar nuevamente la levadura dentro del empaque'
    ],
    correctIndex: 1,
    explanation: 'Empacar pan caliente genera condensación de agua en las paredes de la bolsa, creando un microambiente húmedo ideal para el deterioro por mohos.'
  },
  {
    id: 8,
    topic: 'Normativa Colombiana',
    question: '¿Qué norma colombiana establece los requisitos sanitarios y las Buenas Prácticas de Manufactura (BPM) aplicables a las panaderías?',
    options: [
      'Resolución 2674 de 2013',
      'Ley de Gravitación Universal',
      'Decreto 1944 únicamente sobre hornos',
      'Ninguna, las panaderías están exentas de BPM'
    ],
    correctIndex: 0,
    explanation: 'La Resolución 2674 de 2013 del Ministerio de Salud y Protección Social es la norma rectora de requisitos sanitarios y BPM para fabricación y comercialización de alimentos en Colombia.'
  }
];
