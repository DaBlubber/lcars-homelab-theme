# Nextcloud: Homelab LCARS family overlay

`nextcloud.css` is built for **Nextcloud 34** with the official app
`theming_customcss` (1.21). It calibrates Nextcloud's own variables, loads the two
fonts, makes text and targets a little larger and styles the guest/login pages.

## Division of labour

- **Custom CSS app** (`theming_customcss`) - carries `nextcloud.css`.
- **Built-in theming app** - keeps name, slogan, primary colour (`#f0ad55`),
  background colour (`#241c17`), logo, background image and favicon.

Use `assets/emblem--nextcloud.svg` as the logo. The CSS contains no logo or
background URL of its own; it uses the image of the theming app exactly once, on
the guest page.

## Light and dark

`nextcloud.css` sets **neither** `--color-main-background` nor `--color-main-text`.
Everyone keeps their personal light, dark or system choice. Borders, hover and
selection surfaces, status surfaces and status text are mixed with `color-mix()`
from the currently active Nextcloud colours, so light stays light and dark stays
dark. Gold stays the action colour in both modes. `color-mix()` is therefore a
browser requirement for this overlay.

Solid status colours with white text: error `#c23844` 5.33:1, warning `#965f00`
5.34:1, success `#2f7747` 5.45:1, information `#356ab7` 5.39:1. Gold `#f0ad55`
with its text colour `#241c17` reaches 8.63:1.

## Install

Save the current value first:

```sh
occ config:app:get theming_customcss customcss > nextcloud-customcss.backup.css
```

Then either paste the content of `nextcloud.css` (from your `build-dist.mjs`
output, so the font URLs point to your host) under **Administration settings →
Theming → Custom CSS**, or set it on the server:

```sh
occ config:app:set theming_customcss customcss --value="$(cat /path/to/nextcloud.css)"
```

`occ` stands for however you call it in your installation, e.g.
`sudo -u www-data php occ` or `docker exec -u www-data nextcloud php occ`.

Logo and background go through the normal theming app:

```sh
occ theming:config logo /absolute/path/to/emblem--nextcloud.svg
occ theming:config background /absolute/path/to/your-background.jpg
```

Reload the browser with an empty cache.

## Sign-in and motion

The guest page gets the background image of the theming app under a uniform black
dimming layer and a 90 % opaque, blurred card (fully opaque without
`backdrop-filter`). The header shows a calm gold end cap, form cards a narrow rail
and a **static** segmented footer. File lists, shares and the logged-in work area
get no elbows and no permanent motion. `prefers-reduced-motion: reduce` stops the
press reaction and all transitions.

## After installing or updating, check

- sign-in, password reset, error pages and public shares;
- light, dark and system setting in both operating system modes;
- files, photos and settings on desktop and a narrow phone;
- primary, secondary, tertiary and icon buttons with mouse and keyboard;
- error, warning, success and information messages;
- 200 % zoom, focus order and reduced motion;
- fonts loading from your theme host.

## Uninstall

Restore the saved value:

```sh
occ config:app:set theming_customcss customcss --value="$(cat nextcloud-customcss.backup.css)"
```

or clear it with `--value=''`. Name, slogan, colours, logo and background of the
theming app stay; reset them with `occ theming:config logo --delete` and
`occ theming:config background --delete` if you want Nextcloud's defaults back.
