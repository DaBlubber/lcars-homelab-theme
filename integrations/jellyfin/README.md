# Jellyfin: Homelab LCARS family overlay

`jellyfin.css` styles the Jellyfin **web client** in the warm family variant. Native
TV and phone/tablet apps do not load Jellyfin's custom CSS and stay unchanged; a
client that only shows the hosted web client in a web view may inherit the rules.

The overview combines a streaming-service structure with an LCARS signature: large,
dense media tiles and image-led rows, framed by the header, section registers, end
caps and one-sided card corners. Posters, thumbnails and backdrops keep their
colours - no `filter`, no changed opacity, no blend mode; only behind visible card
titles sits a neutral dark gradient at the bottom edge.

## What it does

- a level A sign-in page: dimmed background, a slow 90-second zoom, an LCARS rail
  fully inside the form card with three uneven pulse rhythms, the Jellyfin emblem,
  gold as the primary action and Homelab states for all fields, buttons and the
  checkbox; Quick Connect and password help as full-width rows below the card;
- larger overflow cards with less spacing, while normal library grids keep
  Jellyfin's responsive breakpoints;
- a header with a segmented block bar and end cap;
- section titles as spaced capitals with a colour block; clickable ones carry a
  mono register `REGISTER // 01`;
- card titles and the dark gradient only on pointer or keyboard focus on desktop,
  always visible on mobile;
- enlarging only via `transform: scale(1.075)` - neighbours are overlapped, not
  pushed, and the grid never re-flows;
- the same highlighted state for remote focus on TV layouts, with at least
  58 × 58 px targets;
- semantic progress colours: green for playback progress, gold for general progress
  and transcoding, red for recordings/errors, blue for information;
- everything switched off with `prefers-reduced-motion: reduce`.

The player stays calm on purpose: no glow or press animation while a film is
running; the normal focus ring stays for usability. A real hero banner would need
DOM changes, and Jellyfin's branding only accepts CSS - so there is none.

## Install

In the Jellyfin dashboard go to **Dashboard → General → Custom CSS** (stored in
`config/branding.xml` as `CustomCss`) and replace the content with a single import
from your theme host:

```css
@import url('https://theme.example.org/lcars-homelab/integrations/jellyfin/jellyfin.css');
```

Use the base URL you built with `tools/build-dist.mjs`; fonts, emblem and background
are loaded from the same place. Relative paths would not work, because imported
CSS resolves against the Jellyfin host.

Save, then reload the web client with an empty cache. The browser's developer tools
should show `jellyfin.css` and both WOFF2 files loading without errors.

## After updating Jellyfin, check

The rules are based on the classes of the 10.11 web client, among them
`.backgroundContainer`, `.standalonePage`, `.manualLoginForm`, `.cardBox`,
`.cardImageContainer`, `.cardOverlayContainer`, `.cardFooter`, `.itemsContainer`,
`.emby-scroller`, `.sectionTitle-cards`, `.sectionTitleTextButton`, `.skinHeader`
with the `headroom--*` states, `.layout-desktop`, `.layout-mobile`, `.layout-tv` and
`.show-focus`. After an update look at:

1. film, series, episode and collection rows - `.cardFooter` inside `.cardBox`;
2. the header when scrolling down and up;
3. enlarged first/last cards - not clipped by the scroller;
4. TV remote focus, scaling and 58 px targets;
5. mobile cards - titles do not cover badges or progress bars;
6. both section title variants with long titles;
7. sign-in at ~390, 1366, 1920 and 3840 px, with manual login, Quick Connect,
   wrong credentials and the spinner;
8. progress bars for playback, transcoding and recording;
9. the network panel for CORS, CSP or 404 errors on CSS and fonts.

## Uninstall

Empty the Custom CSS field (or set `<CustomCss />`), save and clear the web client
cache. Jellyfin goes back to its built-in styles.
