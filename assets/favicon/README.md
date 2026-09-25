# Favicons

`favicon.svg` is an unchanged copy of `../emblem.svg`. `site.webmanifest` links the
192 and 512 px versions.

The raster files are rendered without network access and without extra packages:

```bash
node assets/favicon/build-icons.mjs
```

It writes PNGs with 16, 32, 48, 180, 192 and 512 px, the check file
`brand-check-24x24.png` and `favicon.ico` with 16/32/48 px. Before rendering it
verifies that the source still uses the brand colours `#1740bc` and `#eaa549`.
