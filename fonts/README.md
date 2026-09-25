# Fonts

Two files, no external requests:

| File | Family | Weights | Size |
|---|---|---|---|
| `Exo2-Variable.woff2` | Exo 2 | 400-800 (variable) | 40 KB |
| `JetBrainsMono-Variable.woff2` | JetBrains Mono | 400-700 (variable) | 31 KB |

**Why only two files:** both families are variable fonts. Downloading the weights
400 to 800 one by one gives the same file five times. One file per family with
`font-weight: 400 800` covers all weights and saves about 210 KB.

Character set: **latin** (U+0000-00FF plus punctuation), including German umlauts
and ß. For other scripts add the matching subsets and extend the `unicode-range` in
`../css/tokens.css`.

The `@font-face` rules are in `../css/tokens.css` and use `font-display: swap`.
Without the files every page stays readable through full system font fallbacks.
When serving: MIME type `font/woff2`, CORS for the hosts that embed them, long
immutable caching.

## License

Both fonts are licensed under the **SIL Open Font License 1.1**, which allows
self-hosting and redistribution together with the license:

- Exo 2 - Copyright 2013 The Exo 2 Project Authors (https://github.com/NDISCOVER/Exo-2.0),
  license text: `OFL-Exo2.txt`
- JetBrains Mono - Copyright 2020 The JetBrains Mono Project Authors
  (https://github.com/JetBrains/JetBrainsMono), license text: `OFL-JetBrainsMono.txt`
