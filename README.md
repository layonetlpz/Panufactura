# PANUFACTURA 3.0 — Simulador Industrial 3D de Manufactura del Pan

Plataforma interactiva de simulación tridimensional en tiempo real (**Three.js + React Three Fiber + WebGL 2**) y laboratorio de ingeniería de procesos para el estudio integral de la manufactura del **pan de sal tradicional tipo rollo (estilo pan blandito colombiano, sin relleno)**.

---

## 1. Características principales del Motor 3D Industrial

- **Modelado industrial multi-componente y articulado (`src/engine3d/machines/PlantMachines.tsx`):**
  - **Recepción y almacén PEPS:** sacos textiles de 50 kg con geometría deformada orgánica (`createDeformedSackGeometry`), costuras y caída gravitacional sobre estibas de madera, báscula de plataforma de piso con columna digital, estantería metálica PEPS con arriostramiento diagonal y termohigrómetro mural (`21.4 °C · 58% HR`).
  - **Dosificación gravimétrica:** mesa inoxidable con salpicadero sanitario, báscula digital con botonera táctil y pantalla LCD reactiva que incrementa el peso en vivo (`0 g → 1.000 g harina → +580 g agua → 1.693 g lote`), tamiz rotatorio con malla y manivela articulada, y micro-balanza de precisión.
  - **Amasadora industrial de espiral:** bastidor con rejillas de ventilación del motor, patas niveladoras, guarda metálica articulada con microinterruptor de seguridad, artesa inoxidable giratoria sobre rodillos de fricción, barra rompe-masa y **gancho helicoidal 3D (`TubeGeometry`)** con consola electrónica de 2 velocidades y parada de emergencia tipo hongo.
  - **Cámara de fermentación controlada:** gabinete térmico hueco con puerta abatible de cristal templado, bisagras de barril, carro interior de 10 niveles, cuba humidificadora con resistencias sumergidas y controlador digital PID (`T / % HR`).
  - **Línea de división, boleado y formado:** divisora hidráulica con palanca articulada y cabezal con cuadrícula de cuchillas en acero inoxidable; **boleadora cónica con canaleta helicoidal 3D** y dosificador superior de harina; mesa de formado con cubierta de arce y **formadora laminadora de doble rodillo contrarrotante**.
  - **Horno industrial de convección forzada:** cámara hueca con aislamiento térmico, puerta de doble cristal articulada con manija de cierre, **2 turbinas posteriores de convección giratorias**, resistencias incandescentes, campana extractora, panel PID y torreta luminosa de estado.
  - **Enfriamiento, inspección de miga, empaque y despacho:** carro escabiladero móvil con ruedas y frenos de pedal, turbina de ventilación limpia, estación luminosa de control de calidad con termómetro de punzón, **selladora térmica por impulso con mordaza articulada y cabezal etiquetador automático**, canastillas azules PEPS y furgón de reparto con puertas traseras abatibles.
- **Geometría orgánica de la masa y del Pan Rollo Colombiano (`src/engine3d/models/OrganicGeometries.ts`, `DoughModel.tsx`):**
  - Masa en bloque de alta resolución (`48×36`) con deformación viscoelástica y base de contacto plana.
  - Modelo 3D específico del **pan de sal tradicional tipo rollo** con 4 pliegues de enrollado cilíndrico, puntas cónicas, base de cocción plana, textura PBR de corteza dorada Maillard (`createBreadCrustTexture`) y **vista de corte transversal (`Corte Miga`)** que expone la estructura interna de alvéolos irregulares (`createCrumbAlveoliTexture`).
- **Control cinemático por sub-fases (`0.00 – 1.00`), 7 cámaras y 4 niveles gráficos:**
  - Línea de tiempo con *scrubbing* continuo en cualquier instante de la operación, velocidades **`0.25x`, `0.5x`, `1x`, `2x`, `4x`** y desglose de micro-operaciones mecánicas.
  - **7 perspectivas de cámara:** `Estación`, `Seguimiento` (acompaña el desplazamiento del producto), `Detalle`, `Interior`, `General`, `Superior` y `Lateral`.
  - **4 niveles de calidad gráfica:** `ULTRA` (PBR + sombras de contacto), `HIGH`, `MEDIUM` y `LOW`, con telemetría de FPS en tiempo real y modo **`Vista Limpia`**.

---

## 2. Módulos integrados de la plataforma

1. **Inicio (`DashboardView.tsx`):** portada editorial *"Del trigo al proceso industrial"* con visor 3D en vivo y panel de continuidad de las 18 fases.
2. **Simulación 3D (`ProcessTourView.tsx`):** entorno principal de planta tridimensional con control cinemático, corte de miga, 7 cámaras y ficha de ingeniería en 6 pestañas.
3. **Modo Exposición (`PresentationModeView.tsx`):** interfaz de aula para proyector con visor 3D expandido y control por teclado (`←`, `→`, `Espacio`, `Esc`).
4. **Análisis de Variables (`VariablesSimView.tsx`):** laboratorio paramétrico de 7 variables con matriz comparativa (*Referencia Piloto vs. Condición Modificada*) y respuesta 3D en vivo.
5. **Formulación (`FormulationView.tsx`):** calculadora profesional de porcentaje panadero (`Harina = 100%`, masa total `169,3%`) con transferencia directa a Control de Producción.
6. **Maquinaria y Equipos (`EquipmentView.tsx`):** catálogo técnico de 10 equipos con esquemas vectoriales SVG, componentes, variables, seguridad LOTO y mantenimiento.
7. **Calidad e Inocuidad (`QualityView.tsx`):** marco normativo (BPM Res. 2674/2013, HACCP Decreto 60/2002), controles en 10 áreas y matriz visual de 11 defectos.
8. **Diagrama de Flujo (`FlowDiagramView.tsx`):** secuencia ASME interactiva con zoom (`75% – 130%`), 4 nodos de decisión e inspector lateral.
9. **Control de Producción (`BatchControlView.tsx`):** trazabilidad de lote simulado con bitácora de incidencias y persistencia en `localStorage`.
10. **Evaluación (`QuizView.tsx`):** cuestionario de 12 preguntas organizado en 8 ejes temáticos.

---

## 3. Instalación, desarrollo y compilación

```bash
npm install
npm run dev
```

Para verificar tipos de TypeScript y generar la compilación de producción:

```bash
npx tsc -b
npm run build
```

> **Nota sobre Google Drive Desktop en Windows:** Si trabajas sobre una unidad virtualizada (`G:\Mi unidad\...`), ejecuta `npm install` y `npm run build` en una ruta **NTFS local** para evitar errores `EBADF` del sistema de archivos virtual.
