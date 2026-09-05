# Este proyecto: Suisei — página scroll-animada para una exposición

> Este archivo sustituye al que traía el skill (era de otro proyecto, "My English",
> con Tauri y comandos Rust). **Aquí no hay backend, ni HTTP, ni rutas.**
> El contexto de contenido (paleta con significado, escenas, datos verificados,
> trajes) está en `CLAUDE.md` en la raíz y manda sobre este archivo.

## Qué es

Una página de una sola vista, animada por scroll, que acompaña una exposición
oral de ~13 min sobre Hoshimachi Suisei (tema: resiliencia). 12 escenas = 12
diapositivas de `guion.md`. Se proyecta en clase desde `dist/index.html`
(build de un solo archivo, abre desde `file://`). No se publica.

## Stack (el del skill, recortado a lo que se usa)

React 19 + TypeScript + Vite + MUI 5. **Sin** React Query, **sin** Zustand,
**sin** react-hook-form/Zod, **sin** router: no hay datos remotos, ni
formularios, ni navegación. Si algún día hacen falta, se añaden siguiendo el
skill. Alias `@/` → `src/`.

Scripts: `npm run dev` · `npm run typecheck` · `npm run build` (typecheck + build
single-file en `dist/`).

## Cómo se anima (regla de la casa)

- Hay **un solo bucle rAF** para toda la página: `common/helpers/scrollScrubber.ts`.
  Se consume con `useScrollScrub(onFrame)` (`common/hooks/`). El callback puede
  escribir en el DOM/canvas directamente y **nunca** hace `setState`: el scroll a
  60 fps no pasa por React.
- El progreso de una escena viaja al CSS como **custom properties** (`--p`,
  `--t`…) escritas por el hook sobre el elemento raíz de la escena; los
  componentes las leen en `sx` (`opacity: "var(--p)"`). Esta es la única
  excepción a "no CSS variables" del skill, y solo para progreso de animación.
  Colores, espaciado y radios siguen saliendo del tema.
- Reveals de una sola vez: `IntersectionObserver` dentro de un hook, que añade
  una clase o data-attribute al nodo; el componente define la transición en `sx`.
- Canvas (cielo, partículas de la firma): el componente es solo `<Box component="canvas" ref>`;
  el dibujo vive en un hook de `hooks/` o en `common/hooks/`.
- `useReducedMotion()` (`common/hooks/`) apaga scrubs y partículas; el contenido
  se muestra en su estado final.

## Estructura

```
src/
├─ main.tsx                       ThemeProvider + CssBaseline + <StoryPage/>
├─ common/
│  ├─ models/palette.ts           Palette const (único sitio con hex)
│  ├─ theme/theme.ts              tema MUI; variantes extra: display, label, jp
│  ├─ helpers/math.ts             clamp, lerp, phase, easings, hashNoise
│  ├─ helpers/scrollScrubber.ts   bucle rAF único + stickyProgressOf/entryProgressOf
│  ├─ hooks/useScrollScrub.ts, useReducedMotion.ts
│  └─ components/                 StarField, Nebula, ProgressComet, ClipFrame… (compartidos entre escenas)
└─ features/story/                una sola feature: la historia
   ├─ interfaces/StoryViewModels.ts   TimelinePointViewModel, FactViewModel, ClipViewModel
   ├─ helpers/                     contenido estático por escena (heroContent.ts, questionContent.ts…)
   ├─ hooks/                       el cerebro de cada escena (useHeroScene, useSignatureParticles…)
   ├─ components/{hero,question,origins,…}/   presentacionales, ≤200 líneas JSX
   ├─ containers/                  uno por escena, delgados: hook → componentes
   └─ pages/StoryPage.tsx          composición: fondo común + contenedores en orden
```

Una escena = un contenedor + su subcarpeta de componentes + su hook. Ninguna
escena importa de otra; lo que dos escenas necesitan sube a `common/`.

## Imágenes

Viven en `public/img/` y se referencian como `img/<archivo>` (ruta relativa, por
el `base: "./"`). Los 7 trajes tienen `.jpg` (original) y `.png` (fondo
transparente, generado por `scripts/clean_backgrounds.py`). Tabla y fechas en
`CLAUDE.md` §5. Siempre con pie de foto de crédito (© COVER Corp. / fan art),
uso solo en clase.

## Texto

La interfaz está **en español** (es lo que ve la clase). Comentarios de código en
inglés, breves. Nombres de código en inglés. Mensajes de commit en inglés.

## Lo que no se hace

- Nada de `<div>`/`<p>`/`<span>`/`<h*>` a pelo: `Box`, `Stack`, `Typography`.
- Ningún hex fuera de `palette.ts`; ningún `fontSize` suelto: variantes del tema.
- Nada de `setState` dentro de callbacks de scroll o rAF.
- Nada de `any`.
- Nada de librerías de animación ni de partículas: canvas y CSS a mano.
- Nada de datos inventados: cifras y fechas salen de `guion.md`/`CLAUDE.md`.
