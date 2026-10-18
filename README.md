# rodzman.github.io

Personal site, published with GitHub Pages at https://rodzman.github.io/.

A single hand-written `index.html`: no build step and no dependencies apart
from Google Fonts.

- **Languages:** English and Portuguese (pt-BR). The first visit follows the
  browser language: `pt-*` browsers get Portuguese, everyone else gets English.
  The EN/PT toggle saves the visitor's choice, and `?lang=pt` or `?lang=en`
  forces a language. English is in the HTML itself; Portuguese strings live
  in the `PT` object at the bottom of the file, keyed by `data-i18n`.
- **Theme:** follows the system light/dark setting. The ◐ button overrides it
  and remembers the choice.

## Preview locally

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```
