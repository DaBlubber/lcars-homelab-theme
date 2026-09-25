# Gitea: Homelab LCARS theme

A colour theme and matching logo/favicons for **Gitea 1.27**. It changes no
templates and no files in the Gitea binary: theme, logo and favicons are all loaded
from Gitea's custom directory, so they survive updates.

`theme-lcars-homelab.css` sets all 297 variables of Gitea's built-in theme,
including the graded primary/secondary rows, diffs, console, ANSI and syntax
colours. Gold is the action colour, royal blue stays visible as the brand colour,
and success/warning/error follow the shared status colours. Code, diffs and the
console use values raised for readability.

## Install the theme

The file name defines the theme ID `lcars-homelab`. Copy it to

```text
$GITEA_CUSTOM/public/assets/css/theme-lcars-homelab.css
```

In the official Docker image `$GITEA_CUSTOM` is `/data/gitea`, so the path is
`/data/gitea/public/assets/css/theme-lcars-homelab.css`. Create the folders with the
UID/GID of the Gitea process if they do not exist.

Then add the ID to the theme list in `$GITEA_CUSTOM/conf/app.ini` - keep the
existing entries:

```ini
[ui]
THEMES = gitea-auto,gitea-light,gitea-dark,lcars-homelab
; optional: make it the default for users without their own choice
DEFAULT_THEME = lcars-homelab
```

Restart Gitea. Users pick it under **Settings → Appearance → Theme** as
**Homelab LCARS**; a saved personal choice beats the default.

## Logo and favicons

Gitea serves its logo and favicons from `/assets/img/…`; files with the same names
in `$GITEA_CUSTOM/public/assets/img/` replace them. Build them from
`assets/emblem--gitea.svg` (the emblem with a Git branch symbol):

```bash
node integrations/gitea/build-gitea-assets.mjs
```

and copy these five files from `integrations/gitea/assets/` - the names must match
exactly:

```text
logo.svg  favicon.svg  favicon.png (32 px)  logo.png (512 px)  apple-touch-icon.png (180 px)
```

Browsers cache favicons stubbornly; clear the site data or use a private window to
see the change.

## Fonts

Gitea 1.27 has no font variable in its theme contract, so a pure theme cannot set
Exo 2 and JetBrains Mono. The theme deliberately does not force them through
internal class names or template changes.

## After updating Gitea, check

1. Compare the variable names of the new built-in dark theme with this file -
   nothing missing or renamed, `--is-dark-theme: true` and
   `--theme-color-scheme: "dark"` unchanged.
2. Look at sign-in, dashboard, repository, issue/PR, code view with syntax colours,
   split and unified diff, Actions logs with ANSI output, forms, labels, charts and
   hover/active/focus states.
3. The theme ID is still in `[ui] THEMES`, and the CSS and the five image files are
   still served.

## Uninstall

Set a different default and let affected users choose another theme, remove
`lcars-homelab` from `THEMES` and delete the CSS file. For the logo, delete the
five files from `$GITEA_CUSTOM/public/assets/img/`. Restart Gitea - it falls back
to its built-in files.
