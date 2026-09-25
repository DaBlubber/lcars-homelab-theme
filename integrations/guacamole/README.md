# Guacamole: Homelab LCARS extension

A branding extension for **Apache Guacamole 1.6**. The work area is level B: dark,
calm surfaces, spaced headings, one-sided LCARS edges and clear reaction states. The
sign-in page comes close to level A with an elbow, a moving block bar, the emblem
and a dimmed background. The remote desktop image itself is never styled; in shared
sessions only `.client-tile-header` changes.

## Contents

- `guac-manifest.json` - the extension manifest (namespace `lcars-branding-ns`);
- `skins/lcars/css/lcars.css` - the stylesheet;
- `translations/en.json` - sets `APP.NAME` to `Homelab Remote Access`;
- `build-extension.mjs` - a dependency-free, deterministic JAR builder;
- `guacamole-lcars-branding.jar` - the built extension.

Guacamole serves extension CSS only as part of its virtual `/app.css`, not as files
of their own, so relative image paths in the CSS would point nowhere. Fonts,
emblem and background are therefore loaded by absolute URL from your theme host.
**Build the JAR with your base URL** - `tools/build-dist.mjs` does that for you and
leaves the finished JAR in `dist/integrations/guacamole/`. To rebuild by hand after
changing manifest, CSS or translation:

```bash
node build-extension.mjs [output.jar]
```

## Sign-in details

Guacamole's floating field labels are replaced by fixed labels above the fields;
empty, filled and focused fields take the same space, and focus only turns the
label gold. The "Sign in with: OPENID" block of the SSO extension is placed as a
second grid row directly below the card, in the same style. The background zooms
slowly over 90 seconds, three rail blocks pulse in uneven rhythms and the top bar
runs two light fields and a scan bar. `prefers-reduced-motion: reduce` stops all of
it. Normal text stays at 13.38:1 or better even over a white background pixel.

## Install

Copy the JAR into Guacamole's extension directory (`GUACAMOLE_HOME/extensions/`;
with the official Docker image, mounting the file into `/opt/guacamole/extensions/`
is known to work), remove any other branding extension so only one stylesheet is
loaded, and restart Guacamole - it reads extensions only at start. Clear the
browser cache afterwards.

## After installing or updating, check

1. Browser title and app name show `Homelab Remote Access`.
2. `lcars.css` wins over Guacamole's core rules.
3. Sign-in, continuation/MFA dialog and error message in narrow and wide windows.
4. Connections, groups, recent connections and settings: colours, focus, click area.
5. Shared session: only the tile header is styled, the remote image is unchanged.
6. Menu, dialogs, notifications, file transfer and the danger button.
7. The OpenID block directly below the card.
8. Reduced motion is completely calm.
9. Fonts, emblem and background load from your theme host without CORS or 404 errors.

## Uninstall

Remove the JAR from the extension directory (put back a previous branding
extension if you had one) and restart Guacamole.
