# Arquitectura de Software y Motor Gráfico 3D Industrial — PANUFACTURA 3.0

## 1. Visión general de ingeniería 3D

El simulador tridimensional de **PANUFACTURA 3.0** implementa una arquitectura híbrida en tiempo real sobre **Three.js + React Three Fiber + Drei + WebGL 2** orientada a representar con fidelidad mecánica, cinemática y reológica la planta de fabricación del **pan de sal tradicional tipo rollo (estilo pan blandito colombiano, sin relleno)**.

---

## 2. Pipeline de Geometrías Orgánicas y Modelado Procedural (`src/engine3d/models/OrganicGeometries.ts`)

En lugar de utilizar primitivas básicas (esferas, cubos o cápsulas genéricas), el motor genera mallas `THREE.BufferGeometry` de alta resolución con desplazamiento de vértices mediante ruido pseudo-Perlin multi-octava 3D (`smoothNoise3D`), curvas spline (`THREE.CatmullRomCurve3`) y barridos tubulares (`THREE.TubeGeometry`):

1. **`createDeformedSackGeometry()`:** sacos textiles de harina (50 kg) con abombamiento central, esquinas pellizcadas en las orejas de costura, asentamiento gravitacional en la base y micro-pliegues textiles.
2. **`createOrganicBulkDoughGeometry()`:** masa viscoelástica en bloque (`48×36` segmentos) con base plana de contacto sobre la artesa/mesa, lóbulos de plegado orgánico y normales suavizadas.
3. **`createOrganicPortionGeometry(radius, roundness)`:** transición geométrica continua entre porciones recién cortadas por las cuchillas de la divisora (`roundness = 0.15`) y esferas boleadas con tensión superficial y cierre basal (`roundness = 1.0`).
4. **`createColombianRollBreadGeometry()`:** modelo tridimensional exclusivo del **pan de sal tradicional tipo rollo** (`44×36` segmentos), con base de cocción aplanada, vientre abombado, puntas cónicas enrolladas, **4 pliegues espirales del enrollado cilíndrico** en la corona y asimetrías orgánicas sutiles.
5. **`createSlicedRollHalfGeometry()`:** secciona el modelo del pan rollo en el plano `x = 0` y genera la tapa planar `ShapeGeometry` con mapeo UV normalizado para exponer la **estructura alveolar irregular interna de la miga** durante la inspección en primer plano (`Corte Miga`).
6. **`createTrueSpiralHookGeometry()`:** gancho amasador helicoidal 3D forjado construido mediante `TubeGeometry` sobre una hélice cónica 3D.
7. **`createHelicalRounderTrackGeometry()`:** canaleta de boleado helicoidal 3D que envuelve 1,55 vueltas alrededor del tambor cónico invertido de la boleadora.

---

## 3. Materiales PBR y Texturas Procedurales (`src/engine3d/materials.ts`)

Todas las texturas de color se configuran en `THREE.SRGBColorSpace` y los mapas de microrrelieve/rugosidad en espacio lineal:

- **`createBrushedMetalTexture()`:** mapa anisotrópico de acero inoxidable cepillado (`bumpMap`) aplicado a mesas, tolvas, cámara de fermentación y horno.
- **`createWoodGrainTexture()`:** vetas direccionales y uniones de tablones de madera de arce para la mesa de formado y estibas.
- **`createDoughBumpTexture()`:** microrrelieve celular de masa hidratada para evitar apariencia plástica o artificial.
- **`createBreadCrustTexture()`:** gradiente de dorado Maillard en corona y flancos con moteado de tostado y ligero espolvoreo de harina.
- **`createCrumbAlveoliTexture()`:** matriz interna de miga color crema con distribución estocástica no repetitiva de **340 alvéolos irregulares** de distinto calibre y orientación.
- **`createSackTexture()`:** trama textil cruzada con costuras pespunteadas, franja impresa y rotulado normativo (`Decreto 1944`).
- **`createDigitalDisplayTexture()`:** pantallas digitales LCD/PID reactivas (en la Fase 3 actualiza dinámicamente el peso desde `0.0 g TARE` → `540.0 g` → `1000.0 g HARINA` → `1580.0 g +AGUA` → `1693.0 g LOTE`).

---

## 4. Cinemática Articulada y Sub-Fases Normalizadas (`0.00 – 1.00`)

Cada una de las 18 fases en `PHASE_3D_CONFIGS` (`src/engine3d/simulationConfig.ts`) define su secuencia cinemática de sub-operaciones (`subPhases`) gobernada por `phaseProgress` (`0..1`) y sincronizada con `delta`:

- **Pesaje (Fase 3):** giro de manivela del tamiz (`0.00–0.55`), caída de flujo de harina, crecimiento volumétrico del cono de harina, llenado gradual del vaso de agua (`0.45–0.80`) e incremento progresivo del indicador digital LCD.
- **Mezclado y Amasado (Fases 4–5):** apertura y cierre articulado de la rejilla protectora con enclavamiento (`0.00–0.15` y `0.90–1.00`), rotación coordinada inversa entre el gancho helicoidal 3D y la artesa sobre rodillos laterales, y deformación viscoelástica no uniforme de la masa junto a la barra rompe-masa.
- **Fermentaciones (Fases 6 y 11):** apertura/cierre de la puerta de cristal con bisagras de barril, generación de vapor desde la cuba inferior con resistencias calefactoras y abombamiento orgánico dependiente de `fermTime`, `fermTemp` y `fermHumidity`.
- **División, Boleado y Formado (Fases 7–10):** accionamiento de la palanca hidráulica lateral, descenso del cabezal y cuadrícula de cuchillas (`0.18–0.62`), separación radial gradual en 6 porciones de `80 g`, rotación orbital sobre la boleadora cónica helicoidal, descenso de campana translúcida de reposo (Fase 9) y rotación inversa de los dos rodillos laminadores (`formadora de rodillos`) que transforman las esferas en rollos de 4 pliegues (Fase 10).
- **Ciclo de Horneado de 12 Pasos (Fase 13):**
  1. `0.00–0.18`: desbloqueo de manija, apertura de puerta térmica (`-68°`) e introducción continua de la bandeja sobre los rieles.
  2. `0.18–0.45`: cierre hermético, encendido de las **2 turbinas posteriores de convección** e iluminación térmica, y expansión inicial (*oven spring*).
  3. `0.45–0.82`: gelatinización del almidón y transición cromática y de textura continua hacia corteza dorada Maillard.
  4. `0.82–1.00`: destello de torreta de fin de ciclo, apertura de puerta y extracción de la bandeja horneada.
- **Enfriamiento, Inspección con Corte de Miga, Empaque y Despacho (Fases 14–18):** deslizamiento al carro escabiladero con turbina de aire limpio, descenso de sonda termométrica de punzón (`< 35 °C`), apertura transversal de unidad testigo para inspección de alvéolos de la miga, bajada de mordaza térmica de sellado (`0.35–0.70`), descenso del cabezal etiquetador de lote/alérgenos (`0.70–0.92`) y apertura/cierre de las puertas traseras del furgón de distribución.

---

## 5. Sistema de 7 Cámaras y 4 Niveles de Calidad Adaptativa

- **7 Modos de Cámara (`CameraController.tsx`):** `Estación`, `Seguimiento` (rastrea en tiempo real el vector de posición del producto `trackedProductPos`), `Detalle` (macro sobre masa/miga), `Interior` (dentro de tolva, cámara de fermentación u horno), `General`, `Superior` y `Lateral`.
- **4 Niveles Gráficos (`ULTRA`, `HIGH`, `MEDIUM`, `LOW`):** control adaptativo de `dpr`, sombras direccionales (`2048 px` / `1024 px`), sombras de contacto (`ContactShadows` con `frames={1}` para máxima fluidez sin sobrecarga por fotograma), cantidad de partículas `InstancedMesh` y muestreador de FPS en tiempo real (`FpsSampler`).
