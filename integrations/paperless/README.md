# Paperless-ngx: brand only

Paperless-ngx (tested with 3.0.4) offers exactly two branding settings and **no way
to add custom CSS**:

- `PAPERLESS_APP_TITLE` - the visible application title;
- `PAPERLESS_APP_LOGO` - the logo.

This integration therefore only sets title and logo.

## Install

`PAPERLESS_APP_LOGO` must be a **path on the Paperless site**. Measured on 3.0.4:

- `/logo/...` inside the media directory (as documented) returns 404 - the media
  directory is not served over HTTP;
- an absolute URL does not work - Paperless strips the colon and prepends its own
  address;
- `/static/...` is served cleanly.

So mount the emblem into the static directory of the container:

```yaml
volumes:
  - ./assets/emblem--paperless.svg:/usr/src/paperless/static/emblem--paperless.svg:ro
environment:
  PAPERLESS_APP_TITLE: "Homelab Documents"
  PAPERLESS_APP_LOGO: "/static/emblem--paperless.svg"
```

(The nomad-jobs repository has a complete Nomad example of exactly this.)

## Uninstall

Remove both variables and the mount, then restart Paperless.
