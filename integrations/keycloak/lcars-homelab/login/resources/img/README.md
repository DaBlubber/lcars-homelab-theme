# Background slot

`background.svg` is the default: a drawn LCARS background with a dark, empty centre,
segmented bars at the edges and a slow scanning light.

The active image is chosen only through `--rl-background-image` at the top of
`../css/styles.css`. To use a photo, put it into this folder and point the variable
at it, e.g. `url("../img/background.jpg")`. The uniform dimming, the 90-second zoom
(100 → 102.5 %) and switching it all off for `prefers-reduced-motion: reduce` are in
the same stylesheet; no templates or JavaScript are involved.

An image fills every aspect ratio with `cover`, so very wide windows cut off the top
and bottom of a 3:2 photo - a wider source shows more. If the image is missing, the
black ground carries the page, and the opaque login console keeps its checked text
contrasts regardless of the background.
