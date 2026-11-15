# PANUFACTURA — Simulador Interactivo del Proceso de Manufactura del Pan

Aplicación web interactiva con motor gráfico 3D en tiempo real para la enseñanza, visualización y análisis desde la **Ingeniería Industrial** del proceso de manufactura del **pan de sal tradicional tipo rollo (estilo pan blandito colombiano, sin relleno)**.

---

## 1. Descripción del proyecto

**PANUFACTURA** modela el ciclo completo de fabricación en una panadería artesanal/semi-industrial, integrando operaciones unitarias, transformación reológica y térmica de la masa, control estadístico e inocuidad alimentaria (BPM / HACCP), formulación por porcentaje panadero y un entorno 3D interactivo construido con **Three.js / React Three Fiber (WebGL 2)**.

---

## 2. Objetivo académico

Servir como herramienta interactiva de apoyo para la asignatura de **Procesos de Manufactura**, permitiendo:
- Comprender las **18 fases secuenciales** desde la recepción de materias primas hasta la distribución del producto terminado.
- Analizar la relación entre **variables operativas** (temperatura, tiempo, humedad relativa, velocidad de amasado) y los atributos de calidad del pan.
- Identificar **equipos, puntos críticos de control (PCC), defectos potenciales y mejoras de Ingeniería Industrial** (layout, balanceo, SMED, Poka-Yoke).

---

## 3. Características principales

- **Visor 3D en tiempo real (WebGL 2)** con iluminación física, sombras suaves, pisos epóxicos, estanterías, máquinas detalladas y cámara orbital con presets por estación.
- **Transformación continua de la masa en 3D:** desde ingredientes secos e hidratación, desarrollo de red de gluten, fermentación en bloque y cámara de fermentación, división en porciones, formado en rollos, horneado con *oven spring* y reacción de Maillard, hasta enfriamiento, empaque y distribución.
- **Efectos de simulación procedurales:** partículas de harina, vapor de fermentación, calor/convección en horno y flujo de aire en enfriamiento.
- **10 vistas especializadas:** Dashboard, Recorrido 3D del Proceso, Simulador de Variables, Formulación Piloto, Equipos y Maquinaria, Control de Calidad e Inocuidad, Diagrama de Flujo, Control de Lotes, Modo Presentación y Quiz de Evaluación.

---

## 4. Funcionamiento del simulador

El usuario puede navegar por las 18 fases en modo **Recorrido Guiado** o **Modo Presentación**, inspeccionar cada máquina haciendo clic directamente en la escena 3D (`InteractionManager`), alternar ángulos de cámara (`CameraController`) y ajustar parámetros críticos en el **Simulador de Variables** para observar el impacto técnico sobre volumen, miga, corteza y vida útil.

---

## 5. Fases de manufactura simuladas

1. Recepción de materias primas
2. Almacenamiento de insumos
3. Dosificación y pesaje (porcentaje panadero)
4. Tamizado de secos
5. Mezclado inicial e hidratación
6. Amasado intensivo (desarrollo de gluten)
7. Fermentación en bloque (primera fermentación)
8. División de la masa
9. Boleado / preformado
10. Reposo intermedio
11. Formado tipo rollo y latas
12. Fermentación final (cámara de crecimiento)
13. Barnizado / acondicionamiento previo al horno
14. Horneado (gelatinización, *oven spring*, Maillard)
15. Desmolde y enfriamiento en rejillas
16. Inspección de calidad final
17. Empaque y sellado
18. Almacenamiento y distribución

---

## 6. Tecnologías utilizadas

- **Frontend:** React 19 (`react`, `react-dom`), TypeScript (`~5.7.2`)
- **Empaquetador y estilos:** Vite 6 (`vite`, `@vitejs/plugin-react`), Tailwind CSS v4 (`@tailwindcss/vite`)
- **Motor Gráfico 3D:** Three.js (`^0.172.0`), React Three Fiber (`@react-three/fiber` `^9.0.0`), Drei (`@react-three/drei` `^10.0.0`), WebGL 2
- **Iconografía:** `lucide-react` (`^0.468.0`)

---

## 7. Arquitectura del motor gráfico 3D (`src/engine3d/`)

- `GraphicsEngine.tsx`: Canvas principal, configuración WebGL 2, sombras y fallback de contexto (`GraphicsFallback.tsx`).
- `simulationConfig.ts`: Mapeo de las 18 fases a estaciones, posiciones de cámara, estado de la masa y parámetros visuales.
- `materials.ts`: Materiales PBR (`MeshStandardMaterial`, `MeshPhysicalMaterial`) y texturas procedurales.
- `BakeryLighting.tsx` & `BakeryEnvironment.tsx`: Iluminación industrial, piso epóxico, paredes, mesas en acero inoxidable y entorno de planta.
- `machines/PlantMachines.tsx`: Modelos 3D procedurales de amasadora, divisora, cámara de fermentación, horno rotativo/convección, mesas de formado, rejillas y empaque.
- `DoughModel.tsx`: Geometría y sombreado dinámico de la masa según la fase activa.
- `SimulationEffects.tsx`: Sistemas de partículas e indicadores térmicos/higrométricos.
- `CameraController.tsx` & `InteractionManager.tsx`: Transiciones suaves de cámara y selección interactiva de equipos.

---

## 8. Estructura de carpetas

```text
app/
├── docs/
│   ├── arquitectura.md
│   ├── fuentes_y_referencias.md
│   └── Diagrama_Flujo_Manufactura_Pan.svg
├── src/
│   ├── components/         # Componentes reutilizables e ilustraciones
│   ├── data/               # Datos técnicos de fases, formulación, equipos, calidad y quiz
│   ├── engine3d/           # Motor gráfico 3D (Three.js / R3F / WebGL 2)
│   │   └── machines/       # Modelos 3D de maquinaria industrial
│   ├── views/              # Vistas principales de la aplicación
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

---

## 9. Requisitos del sistema

- **Node.js:** v18.0 o superior (recomendado v20 LTS o v22 LTS)
- **npm:** v9.0 o superior
- **Navegador:** Chrome, Edge, Firefox o Brave moderno con soporte **WebGL 2** y aceleración por hardware habilitada.

---

## 10. Instalación

```bash
git clone https://github.com/layonetlpz/Panufactura.git
cd Panufactura
npm install
```

> **Nota sobre Google Drive / unidades virtuales en Windows:** Si clonas o ejecutas el proyecto dentro de una unidad virtualizada (como `G:\Mi unidad\...` de Google Drive Desktop), `npm install` puede fallar con errores `EBADF` al crear enlaces o extraer paquetes. Se recomienda clonar y trabajar en un disco local **NTFS** (por ejemplo, `C:\Proyectos\Panufactura`).

---

## 11. Configuración

La aplicación funciona de forma autónoma sin variables de entorno ni backend externo. Todas las configuraciones de simulación se encuentran tipadas en `src/engine3d/simulationConfig.ts` y `src/data/`.

---

## 12. Ejecución en modo desarrollo

```bash
npm run dev
```

Abre en el navegador la URL local indicada por Vite (por defecto `http://localhost:5173`).

---

## 13. Compilación para producción

```bash
npm run build
```

Para previsualizar el bundle compilado en `dist/`:

```bash
npm run preview
```

---

## 14. Solución de problemas comunes

- **Pantalla en blanco o error de WebGL:** Verifica que tu navegador tenga habilitada la aceleración por hardware y soporte WebGL 2. La aplicación incluye `GraphicsFallback.tsx` para informar si el contexto 3D no está disponible.
- **Error `EBADF` en `npm install` (Windows):** Mueve el repositorio a una ruta local NTFS estándar fuera de carpetas sincronizadas en la nube (Google Drive / OneDrive bajo demanda).
- **Error de tipos al compilar:** Ejecuta `npx tsc -b` para verificar la integridad de TypeScript antes de `vite build`.

---

## 15. Equipo / Autor

Proyecto académico desarrollado para la asignatura de **Procesos de Manufactura** (Ingeniería Industrial).
- **Repositorio:** [layonetlpz/Panufactura](https://github.com/layonetlpz/Panufactura)
