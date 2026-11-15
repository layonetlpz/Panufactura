# Arquitectura del Sistema — PANUFACTURA

## 1. Visión General

**PANUFACTURA** es una aplicación web educativa e interactiva construida con **React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons**, diseñada para simular y explicar el proceso completo de manufactura del pan de sal tradicional tipo rollo (estilo pan blandito colombiano, sin relleno) en 18 fases secuenciales.

No requiere backend, base de datos externa ni claves API; toda la persistencia del módulo de **Control de Lote** y el progreso del usuario se gestionan localmente mediante `localStorage`.

## 2. Centralización de Datos (Single Source of Truth)

Para garantizar coherencia absoluta entre los módulos de la aplicación y los entregables documentales (`/ENTREGABLES_PANADERIA/`), todos los parámetros del proceso se centralizan en `src/data/`:

- `src/data/phasesData.ts`: Definición tipada de las **18 fases** (identificación, objetivo, qué sucede, por qué es necesaria, entradas/salidas/transformación, maquinaria, variables de proceso respaldadas, control de calidad, inocuidad/BPM, estado visual de la masa y clasificación PC/PCC).
- `src/data/formulationData.ts`: Formulación piloto base (porcentajes panaderos: harina 100%, agua 58%, levadura seca 1%, azúcar 4%, sal 1,8%, grasa 4%, mejorante opcional 0,5%; 80 g por unidad), propiedades tecnológicas de cada ingrediente, consecuencias de dosificación incorrecta y sustituciones.
- `src/data/equipmentData.ts`: Galería de maquinaria y equipos (báscula, mezcladora, amasadora, divisora, boleadora, cámara de fermentación, mesa de trabajo, horno, rejillas de enfriamiento, equipos de empaque), clasificados por nivel tecnológico (artesanal, semindustrial, industrial).
- `src/data/qualityData.ts`: Controles de calidad por etapa, matriz interactiva de 12 defectos/causas/acciones y diferenciación entre Control de Calidad, BPM y PCC.
- `src/data/quizData.ts`: Banco de preguntas de selección múltiple con retroalimentación técnica inmediata.

## 3. Módulos de la Aplicación

1. **Inicio / Panel Principal (`DashboardView`):** Resumen del proyecto, acceso rápido a todos los módulos, ficha rápida del producto e indicador de progreso del recorrido.
2. **Recorrido y Simulación Visual (`ProcessTourView`):** Línea de progreso interactiva de 18 etapas, controles de reproducción automática (`Play/Pause`, `Anterior`, `Siguiente`, `Reiniciar`), ilustración SVG dinámica de la transformación de la masa en cada etapa y pestañas técnicas detalladas (Explicación, Entradas/Salidas, Maquinaria, Variables, Calidad, Inocuidad).
3. **Simulador Didáctico de Variables (`VariablesSimView`):** Controles deslizantes para tiempo/temperatura de fermentación, tiempo de amasado, temperatura/tiempo de horneado y peso de porciones, más escenarios pedagógicos predefinidos con advertencia explícita de modelo didáctico.
4. **Materias Primas y Calculadora (`FormulationView`):** Fichas de ingredientes + calculadora en tiempo real por cantidad de harina o número de unidades objetivo.
5. **Maquinaria y Equipos (`EquipmentView`):** Galería filtrable por fase y escala productiva.
6. **Calidad e Inocuidad (`QualityView`):** Controles por etapa, matriz interactiva de defectos y cuadro comparativo BPM / PC / PCC.
7. **Diagrama Interactivo del Proceso (`FlowDiagramView`):** Diagrama vectorial navegable con simbología de operaciones, inspecciones, almacenamientos y decisiones; hacer clic en cualquier nodo abre el detalle de la fase.
8. **Control de Lote (`BatchControlView`):** Simulador de orden de producción con cálculo automático de insumos, checklist de verificación por fase (`Pendiente`, `En proceso`, `Aprobada`, `Requiere revisión`) y persistencia en `localStorage`.
9. **Modo Exposición (`PresentationModeView`):** Interfaz limpia de alto contraste diseñada para proyector de aula, con navegación por teclado (`←` / `→` / `Esc`) y una fase a la vez.
10. **Evaluación de Conocimientos (`QuizView`):** Cuestionario interactivo con puntaje y retroalimentación explicativa.
