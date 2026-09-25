# Keycloak: LCARS-Homelab login theme

A login theme for **Keycloak 26.7** that extends the built-in `keycloak.v2` theme
(PatternFly v5). It overrides **no Freemarker template**: username, one-time code,
password reset, session expiry, lockout, alerts and any future standard form are
still rendered by the parent theme and keep its markup. The theme only changes how
they look.

`login/resources/css/styles.css` works in three layers:

1. global `--pf-v5-global--*` tokens: dark surfaces, light text, gold as primary
   colour, links, status, lines, fonts, motion;
2. component variables for login, brand, form fields, buttons and alerts;
3. a few own rules for what PatternFly cannot express: the level A elbow and block
   bars, the emblem end cap, capitals with letter spacing, the background layers,
   the interaction glow and the press flash.

There are no PatternFly v4 selectors and no `!important`.

## Install

Copy the theme folder into Keycloak's theme directory:

```text
integrations/keycloak/lcars-homelab/  ->  /opt/keycloak/themes/lcars-homelab/
```

With Docker, mount it read-only:

```yaml
volumes:
  - ./lcars-homelab:/opt/keycloak/themes/lcars-homelab:ro
```

Build the favicon once (the parent template expects `resources/img/favicon.ico`):

```bash
node integrations/keycloak/build-favicon.mjs
```

Restart Keycloak (or clear its theme cache), then select the theme in the admin
console: **Realm settings → Themes → Login theme → lcars-homelab**.

Fonts are loaded from your theme host (see the main README, `build-dist.mjs`); the
emblem and background are part of the theme folder. Messages are provided in
English and German (`login/messages/`).

## Background and motion

The background slot is `--rl-background-image` at the top of `styles.css`; the
default is the drawn `resources/img/background.svg`. Use your own image by
pointing the variable at it (`url("../img/your-image.jpg")`). A uniform black layer
dims whatever is behind the console, and the image moves very slowly (100 → 102.5 %
over 90 seconds). The three rail blocks glow in deliberately uneven rhythms
(9.73 s, 11.89 s, 13.03 s), the footer bar runs two soft light fields and a scan
bar. `prefers-reduced-motion: reduce` switches all of it off.

The card has no forced minimum height. With `backdrop-filter` it is a 72 % opaque,
14 px blurred glass surface, without it a 96 % opaque surface. Even over a white
background pixel the label reaches 4.74:1 and normal text 11.04:1.

## After installing or updating Keycloak, check

- username and one-time code steps on desktop and a narrow phone;
- wrong password, temporary and permanent lockout;
- expired session and expired action;
- "forgot password", back to sign-in, registration if enabled;
- keyboard order and visible focus in Chrome and Firefox;
- long realm names and long error messages in the header end cap.

## Uninstall

Select the previous login theme in the realm, then remove the folder and restart
Keycloak if its theme cache still serves the old files.
