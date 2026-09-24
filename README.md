# LCARS Homelab Theme

*[Deutsche Version](README.de.md)*

A consistent **LCARS-inspired look for self-hosted tools**: one set of CSS tokens and
components, plus ready-made integrations for the login and admin pages of common
home-lab services. Everything is plain CSS/SVG and dependency-free Node scripts – no
build chain, no web fonts from third-party CDNs. Documentation is mostly in German.

## What's inside

| Path | What |
|---|---|
| `css/tokens.css`, `css/components.css`, `css/brand.css` | colour roles, spacing, geometry, typography, motion; components for the full (`.lcars-a`) and fallback (`.lcars-b`) style, plus a warmer `.lcars-family` variant |
| `reference/index.html` | offline reference page showing every component and state |
| `errors/` | self-contained error pages 404/500/502/503/504 (inline CSS and emblem, no JS) – e.g. for Traefik |
| `assets/` | emblem (base + per-app variants), logo, favicons |
| `integrations/keycloak/` | login theme (`parent=keycloak.v2`) |
| `integrations/gitea/` | variable-based theme and logo/favicon assets |
| `integrations/jenkins/`, `jellyfin/`, `nextcloud/` | stylesheets for the respective custom-CSS hooks |
| `integrations/guacamole/` | Guacamole extension with a library-free JAR builder |
| `integrations/oauth2-proxy/` | self-contained sign-in and error templates |
| `integrations/paperless/` | branding options (Paperless has no custom CSS) |
| `integrations/windows/`, `android/` | Windows 11 theme with wallpapers and a generated sound scheme; Android wallpapers and adaptive icons |

Each integration folder has its own README with install, verification and rollback
steps, including the versions it was tested with.

## Using the CSS

```html
<link rel="stylesheet" href="/lcars-homelab-theme/css/brand.css">

<main class="lcars-a">
  <!-- full LCARS bridge -->
</main>
```

Interaction states use real `:hover`, `:focus-visible`, `:active`, `:disabled` and
`aria-invalid`; the `is-*` classes only exist so the reference page can show all
states at once.

## Rebuilding images

All raster images (favicons, app icons, wallpapers, the Guacamole JAR, the sound
scheme) are generated from code – Node.js only, no npm packages:

```bash
node assets/favicon/build-icons.mjs
node integrations/gitea/build-gitea-assets.mjs
node integrations/keycloak/build-favicon.mjs
node integrations/android/build-icons.mjs
node integrations/android/build-wallpapers.mjs
node integrations/windows/build-wallpapers.mjs
node integrations/windows/build-sounds.mjs
node integrations/guacamole/build-extension.mjs
```

## Background image

Integrations read their background from the CSS variable `--rl-background-image`,
which defaults to a dark gradient (Keycloak uses the drawn `hintergrund.svg`). Set
your own image there.

## Fonts

The CSS expects **Exo 2** and **JetBrains Mono** as variable WOFF2 files in `fonts/`
(see `fonts/README.md`); both are available under the SIL Open Font License. Until
they are present, the stacks fall back to system fonts.

## Not affiliated

LCARS is a design associated with Star Trek. This project only borrows the general
shape language (rounded bars, colour blocks); it contains no Star Trek logos,
insignia or other trademarked assets and is not affiliated with or endorsed by the
rights holders.

## License

Code, CSS, SVG and generated images: [MIT](LICENSE).
