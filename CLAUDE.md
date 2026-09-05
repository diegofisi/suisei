# Suisei — página scroll-animada para exposición (contexto del proyecto)

Léeme completo antes de tocar código. Este archivo resume todo lo decidido en el chat previo.

## 1. Objetivo
Convertir una exposición oral de ~13 min sobre **Hoshimachi Suisei** (hololive, gen 0) con tema
**resiliencia** en una **página web de una sola vista, animada por scroll**. La página acompaña al
expositor en clase (no se publica). 12 escenas = las 12 diapositivas de `guion.md`.

Estado actual: proyecto **Vite + React 19 + TS + MUI 5** en esta carpeta (raíz = proyecto), siguiendo
`.claude/skills/frontend` (leer `references/project.md`, que ata el skill a este proyecto). Escenas 1–3
construidas en `src/features/story/`. Faltan las escenas 4–12 con el mismo lenguaje visual.
El preview HTML antiguo quedó en `files/suisei-web/index.html` solo como referencia.

## 2. Dirección de diseño (ya aprobada)
Estilo pedido: "colores de Suisei, estilo de Sakura Miko". Página única y fresca, nada de
plantilla genérica.

Paleta (CSS vars en `:root`):
- `--sky #0B1230` noche profunda (fondo) · `--sky-2 #121D4A` nebulosa
- `--comet #5EC8F2` azul cometa → **Suisei "la estrella"** (logros, fechas, hitos)
- `--sakura #F6A5C0` rosa sakura (guiño a Miko) → **"la persona detrás"** (rechazo, mesera, llanto, dudas)
- `--gold #F2D68B` dorado → solo para el destino (Budokan / 2025)
- `--ice #EAF4FF` texto

Regla: los dos colores cuentan algo; el rosa nunca es decoración.

Tipografía (Google Fonts): `Syne` 700/800 para display, `Sora` 300/400/600 para cuerpo,
`Zen Kaku Gothic New` 900 para el japonés (星街すいせい).

Motivos: cielo de estrellas en canvas con parallax (12 % estrellas rosadas), trazo del cometa que
se dibuja al cargar, **cometa lateral fijo** a la derecha que baja de 2018 a 2026 con el progreso
total de la página, "recortes" (figure.clip) que se abanican con el scroll.

Técnica: React 19 + TS + MUI 5 (Vite). Un solo bucle rAF (`common/helpers/scrollScrubber.ts`) para
todo lo que depende del scroll; los hooks escriben CSS custom properties (`--p`, `--t`) y `data-*`
en el DOM, nunca `setState` a 60 fps. Reveals de una vez con `IntersectionObserver`. Canvas para el
cielo y para las partículas de la firma (escena 1, efecto tipo página "Astra" de OpenAI: la nube de
estrellas converge en la firma de Suisei, `public/img/firma.jpg`). Respeta `prefers-reduced-motion`,
responsive (<760px apila todo). `npm run build` genera `dist/index.html` de un solo archivo que abre
desde `file://` (más `dist/img/`). Sin localStorage, sin router, sin datos remotos.

## 3. Estructura de escenas (mapear 1:1 con guion.md)
1. Portada — hecha. Título + nube de partículas en espiral que, al hacer scroll, dibuja la firma.
2. Pregunta rectora — hecha. Palabras se encienden por scroll; línea de tiempo 2018→2026 con 8 puntos
   y miniaturas circulares de los trajes (ver §5).
3. Inicios 2018 — hecha. Año que se rellena, contador 6.000, recortes (render indie, emblema, tarjeta
   tipográfica), pull quote rosa.
4. Rechazo y terquedad — rosa dominante. Frase "Yo soy Hoshimachi Suisei" ya aparece al final de la 3 como puente.
5. INoNaKa Music / hololive 2019 — cambio de color a azul (giro).
6. Aceleración 2020–2021 — "cohete de tres etapas": 3D debut, Oricon, 1M subs, 1st live.
7. Consolidación 2022–2024 — THE FIRST TAKE, Bibbidiba, Spectra of Nova.
8. Budokan "SuperNova" (01/02/2025) — dorado. Aquí va el flashback 2018 (ver §4).
9. Video "Orbital Period" — embed local `<video>` de 60–90 s, controles visibles, autoplay NO.
10. Actualidad 2026 — Studio STELLAR, ROCK IN JAPAN, gira Once Upon a Stellar, GUM & DROP.
11. Tres pilares de resiliencia — tres tarjetas.
12. Cierre — el público cantando "comet" en el end roll; frase final.
Después: sección "Preguntas".

## 4. Datos verificados de los conciertos (fuente: hololive.hololivepro.com/events)
- 1st Solo Live "STELLAR into the GALAXY" — 21/10/2021, Toyosu PIT.
- 2nd Solo Live "Shout in Crisis" — 28/01/2023, TOKYO GARDEN THEATER.
- Live Tour 2024 "Spectra of Nova" — 14/11 Saitama Super Arena, 10/12 Osaka, 28/12 Fukuoka.
- 日本武道館 Live "SuperNova" — 01/02/2025, Nippon Budokan. Setlist clave:
  M12 繭と心 → **video de entreacto: ella caminando con sus trajes sucesivos de hololive +
  declaraciones pasadas → rebobinado a 2018 → frase "mi sueño es el Budokan"** →
  M13 "comet -TAKU INOUE Remix-" (estrena traje indie rediseñado por Saekiyahiro, canta llorando)
  → Stellar Stellar → NEXT COLOR PLANET → MC + "Orbital Period" (nueva) → encore. End roll: público
  canta la melodía de "comet" a capela. Ese video cae aprox. min 65–80 del show.
- Live "SuperNova: REBOOT" — 21/02/2026, K Arena Yokohama (reposición; repite el segmento con variaciones).
Páginas: suisei2ndlive.hololivepro.com · spectraofnova.hololivepro.com · supernova.hololivepro.com
(hoy muestra REBOOT) · hololive.hololivepro.com/events/supernova/ (reporte oficial con fotos).

## 5. Línea de tiempo de trajes (imágenes ya renombradas)
Convención real en disco: `public/img/AAAA-MM_slug.jpg` (original) + `.png` (fondo transparente,
generado con `python scripts/clean_backgrounds.py`). En código se referencian como `img/<archivo>`. Las 7 imágenes son renders generados con Gemini
a partir de los diseños oficiales: sirven como recorte de la web, **no** como fuente oficial.

| Archivo en `public/img/` | Traje | Fecha / evento | Diseño |
|---|---|---|---|
| `2018-03_indie-original.jpg` | Diseño indie original: boina blanca, chaleco negro, corbata celeste con estrella, falda plisada blanca, capa de constelaciones, botas blancas | Etapa indie / INNK Music (2018–2019) | Ella misma |
| `2019-12_hololive-default.jpg` | 1.er traje hololive: boina a cuadros con coronita, chaqueta y falda a cuadros grises, calcetines desparejos (rodilla azul + muslo negro), botines negros | dic. 2019 | Teshima Nari |
| `2020-11_hololive-2nd-amakara.jpg` | 2.º traje hololive, tema **甘辛ミックス** ("dulce-picante"): boina negra, lazos verdes, chaqueta azul quitable, faldita negra con volantes, medias naranjas, capa estrellada | 12/11/2020 | Teshima Nari |
| `2021-10_stellar-into-the-galaxy.jpg` | Traje de la 1.ª solo live: corona dorada, mangas blancas abullonadas, corpiño azul con dorado, capa-falda galaxia | 21/10/2021, Toyosu PIT | Saekiyahiro |
| `2023-01_shout-in-crisis.jpg` | Traje de la 2.ª solo live: cuello alto negro acanalado, arnés de correas, sobrefalda plisada negra con paneles de rosas rojas, guantes y botines negros | 28/01/2023, TOKYO GARDEN THEATER | Saekiyahiro |
| `2024-03_oriental-suit.jpg` | 東洋風スーツ (traje oriental, 8.º modelo 2D): negro y dorado, cuello mao, capa corta con cadenas, pantalón, tacones. Tema "gángster oriental años 20", hay 2 colores | 15/03/2024 | Ishihara Tatsuya (diseño) + Saekiyahiro (confección) |
| `2025-02_budokan-comet.jpg` | Traje **comet** del Budokan: el traje indie "vestido de gala" — boina blanca, corbata degradada, gran lazo rosa, falda de volantes tornasolados (prisma), sandalias | 01/02/2025, Nippon Budokan, estreno en "comet -TAKU INOUE Remix-" | Saekiyahiro |

Otras imágenes en `public/img/`: `2018-03_perfil-debut.png` (ficha de perfil del debut, escena 3), `firma.jpg` (firma manuscrita, negro sobre blanco → partículas de
la escena 1), `emblema.jpg`, `studio-stellar.jpg` (logo, punto 2026), `supernova-kv.jpg`,
`the-first-take.jpg`, `ft-songs-284.jpg`, `retrato-amakara.jpg`, `corbata-estrella.jpg`,
`chibi-risa.jpg`, `chibi-headpat.jpg`, `chibi-gun.jpg`, `meme-3d.jpg` (fan art; solo con crédito).

**Faltan** para completar la línea de tiempo:
- **2024-11 Spectra of Nova** — el traje real de la gira **no** es el de rosas (ese es Shout in
  Crisis). Key visual oficial: pelo corto tipo bob, blusa blanca de mangas anchas, cinturón-corsé
  negro con hebillas doradas, falda negra larga, guantes negros. (Corrige lo que decía este archivo
  en la versión anterior.)
- **2026 Studio STELLAR** — nuevo traje por defecto desde el **30/08/2026**, blanco y azul, con
  tacones de estrella con konpeitō. En febrero de 2026 hubo además el traje del "SuperNova: REBOOT".
Si hay que podar uno, el prescindible es `2020-11` (no es un hito narrativo).

## 6. Imágenes y derechos
Material de COVER Corp. Uso solo en clase, siempre con crédito de fuente visible (pie de foto
pequeño). No publicar. Key visuals y fotos oficiales: páginas de eventos. Capturas del video del
"caminar": fans en X, hashtag #かけめぐるほしまち (Budokan) / #かけめぐるほしまち再 (REBOOT).

## 7. Preferencias del usuario para este trabajo
- Español. Nivel técnico intermedio (web, scripts); explicarle las decisiones, no solo entregarlas.
- Quiere lo más actual de la web y un acabado profesional/único; nada que parezca plantilla.
- Marcar en el guion datos a verificar y transiciones que se puedan apretar (pedido pendiente).

## 8. Próximos pasos sugeridos
1. Revisar las escenas 1–3 con el usuario (`npm run dev`) y ajustar ritmo/pacing.
2. Construir escenas 4–12: un contenedor + hook + subcarpeta de componentes por escena, reutilizando
   los componentes de `origins/` (FactsList, ClipFan, PullQuote, YearReveal) subiéndolos a `common/`
   cuando los use una segunda escena.
3. Escena 9: `<video>` local con el corte de "Orbital Period" (60–90 s), controles visibles, sin autoplay.
4. Conseguir los dos trajes que faltan (Spectra of Nova 2024-11 y Studio STELLAR 2026-08).
5. `npm run build`, probar `dist/index.html` en 1920×1080 (proyector) y con `prefers-reduced-motion`.
