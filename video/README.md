# Hero background video — pending asset

This folder is where the real hero background video goes once Chimpun Callao supplies it.
It is intentionally empty in this delivery — no placeholder or stock video has been added.

## Expected file

```
video/chimpun-hero-cooking.mp4
```

The filename must match exactly, because `js/main.js` already points at this path via
`SITE_CONFIG.HERO_VIDEO_SRC` (see `js/main.js`, near the top of the file).

## How to enable it

1. Add the real video file at `video/chimpun-hero-cooking.mp4`.
2. Open `js/main.js` and change:
   ```js
   ENABLE_HERO_VIDEO: false,
   ```
   to:
   ```js
   ENABLE_HERO_VIDEO: true,
   ```
3. That's it — no other code changes are needed. The `<video>` element in `index.html`
   (`#hero-video`) is already wired up for this exact moment.

## What's already implemented and ready

- **Autoplay, muted, loop, playsinline** — the `<video>` tag already carries all four
  attributes, which is what allows autoplay to work reliably across mobile browsers.
- **`object-fit: cover`** — already set in `css/style.css` (`.hero-video` rule), so the
  video will fill the hero exactly like the current photo does, regardless of its native
  aspect ratio.
- **Fallback poster** — the `<video>` element's `poster` attribute points at the current
  ceviche photo (`images/hero-ceviche-jalea.jpg`), so if the video is ever slow to load or
  fails, that photo is what shows instead of a blank box.
- **`prefers-reduced-motion` support** — a media query in `css/style.css` hides the video
  and falls back to the static photo for visitors whose OS has "reduce motion" turned on.
- **Zero network cost while disabled** — with `ENABLE_HERO_VIDEO: false`, the `<source>`
  tag is never injected into the `<video>` element, so the browser never requests this
  file at all. That's why this folder can safely stay empty until the real video exists.
- **Error/stalled fallback** — `js/main.js` also listens for the video failing or stalling
  after it's enabled, and automatically hides it (falling back to the photo layer) if the
  eventual real file turns out to be broken or unreachable, rather than showing a blank
  black hero.

## Recommended video specs (once available)

- Format: `.mp4` (H.264), since that's the only `<source type>` currently wired up.
- Short, seamlessly loopable clip — a few seconds of cooking/food prep footage reads best
  as a background loop rather than a video with a clear beginning/end.
- No audio needed — the video plays muted by design (autoplay policies require this).
- Reasonably compressed file size, since it autoplays on page load for every visitor.
