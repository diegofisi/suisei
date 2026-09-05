# Suisei — página scroll-animada para exposición (contexto del proyecto)

Léeme completo antes de tocar código. Este archivo resume todo lo decidido en el chat previo.

## 1. Objetivo
Convertir una exposición oral de ~13 min sobre **Hoshimachi Suisei** (hololive, gen 0) con tema
**resiliencia** en una **página web de una sola vista, animada por scroll**. La página acompaña al
expositor en clase (no se publica). 12 escenas = las 12 diapositivas de `guion.md`.

Estado actual: `index.html` tiene las **escenas 1–3 terminadas** como preview aprobado por el
usuario. Faltan las escenas 4–12 con el mismo lenguaje visual.

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

Técnica: HTML/CSS/JS vanilla en un solo archivo, `IntersectionObserver` para reveals de una vez,
handler de scroll con `requestAnimationFrame` para animaciones "scrub" (sticky sections altas +
`progressOf(el)`), respeta `prefers-reduced-motion`, responsive (<760px apila todo).
Sin frameworks. Sin localStorage.

## 3. Estructura de escenas (mapear 1:1 con guion.md)
1. Portada — hecha. Hueco `.slot` para key visual oficial (PNG con fondo transparente).
2. Pregunta rectora — hecha. Palabras se encienden por scroll; línea de tiempo se dibuja.
   **PENDIENTE:** agregar puntos **2024** y **2026** (ver §5). La línea debe terminar en 2026.
3. Inicios 2018 — hecha. Contador 6.000, recortes, pull quote rosa.
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

## 5. Línea de tiempo de trajes (para renombrar imágenes y para la escena 2)
Convención de nombre: `img/AAAA-MM_slug.png`
- 2018-03_indie-original — traje que ella misma dibujó (vestido gris/negro, corbata celeste con estrella).
- 2019-12_hololive-default — rediseño de Teshima Nari: boina y traje a cuadros azules, coronita.
- 2020-03_3d-debut — el default en 3D (Yatsurugi). Alternativa: traje idol 2nd fes (dic. 2020).
- 2021-10_stellar-into-the-galaxy — traje de concierto (Saekiyahiro). Alt.: uniforme sailor.
- 2023-01_shout-in-crisis — traje de la 2nd live. Alt.: 5.º modelo 2D vestido negro/dorado (dic. 2022).
- 2024-11_spectra-of-nova — chaqueta de una manga, falda larga con rosas blancas (negro/rojo y blanco/azul). **FALTA en la línea actual.**
- 2025-02_budokan-comet — traje indie rediseñado "dress-up".
- 2026-02_studio-stellar — traje nuevo desde Studio STELLAR (estrenado en REBOOT). **FALTA; la línea debe acabar aquí.**
Si hay que podar uno: 2020 (es el mismo traje de 2019 en 3D).

Las fotos del usuario están en `C:\Users\USER\Desktop\Suisei` → copiar a `img/` y renombrar con la
convención. Identificar el traje viendo la imagen; no hay búsqueda inversa.

## 6. Imágenes y derechos
Material de COVER Corp. Uso solo en clase, siempre con crédito de fuente visible (pie de foto
pequeño). No publicar. Key visuals y fotos oficiales: páginas de eventos. Capturas del video del
"caminar": fans en X, hashtag #かけめぐるほしまち (Budokan) / #かけめぐるほしまち再 (REBOOT).

## 7. Preferencias del usuario para este trabajo
- Español. Nivel técnico intermedio (web, scripts); explicarle las decisiones, no solo entregarlas.
- Quiere lo más actual de la web y un acabado profesional/único; nada que parezca plantilla.
- Marcar en el guion datos a verificar y transiciones que se puedan apretar (pedido pendiente).

## 8. Próximos pasos sugeridos
1. Copiar y renombrar imágenes en `img/`; reemplazar los `.slot` y `.clip .img` por `<img>` con `loading="lazy"`.
2. Extender la línea de tiempo de la escena 2 a 8 puntos (2018–2026); el cometa lateral pasa a terminar en 2026 (ya lo hace).
3. Construir escenas 4–12 reutilizando `.facts`, `.clips`, `.pull`, `.counter`, `.year`.
4. Escena 9: `<video>` local con el corte de "Orbital Period" (60–90 s).
5. Probar en 1920×1080 (proyector) y con `prefers-reduced-motion`.
