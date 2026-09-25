# oauth2-proxy: LCARS-Homelab sign-in and error pages

Templates for **oauth2-proxy 7.7** that give its sign-in and error pages the
LCARS-Homelab look. They keep exactly the variables, conditions and forms of the
original 7.7 templates and replace the default logo with the inline emblem.

![Sign-in page](../../docs/images/oauth2-sign-in.png)

Both pages are **completely self-contained**: CSS and emblem are inline, no fonts,
stylesheets or images are loaded from anywhere - they have to work when the user is
not signed in yet and your theme host may not be reachable. Only the standard
"Secured with OAuth2 Proxy" footer links out.

## Install

Put the `templates/` folder where oauth2-proxy can read it and start it with

```text
--custom-templates-dir=/path/to/templates
```

or `custom_templates_dir = "/path/to/templates"` in the config file. The file names
`sign_in.html` and `error.html` are part of the interface: oauth2-proxy loads them
with `ParseGlob` and derives the template names from the file names, which is why
the files have no `define` block of their own.

Then test: sign-in with redirect, the local login form (if you use
`--htpasswd-file`), and an error page (e.g. `/oauth2/sign_in` with an invalid
state).

## Uninstall

Remove the option and restart oauth2-proxy; it falls back to its built-in
templates.
