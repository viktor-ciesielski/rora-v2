# rora-v2

The website for Rora — roramake.ca.

It is a plain static site: three files and no build step, no framework and no
dependencies to install. Whatever you use to host it, you are uploading these
files as they are.

## Looking at it

Double-click `index.html` and it opens in your browser. That is the whole
process.

(If you'd rather serve it properly — some browsers are fussy about local files —
run `python3 -m http.server` in this folder and open http://localhost:8000.)

## What's in here

| File | What it is |
| --- | --- |
| `index.html` | Every word on the page. This is the file to edit for copy changes. |
| `assets/css/site.css` | All the styling: colours, type, spacing, layout. |
| `assets/js/site.js` | The motion — hero artwork, scroll reveals, parallax, cursor. |
| `assets/img/` | Screenshots of the demos. |
| `assets/favicon.svg` | The little icon in the browser tab. |

## Still to replace

This is a first draft. Anything with a dotted underline on the page is a
placeholder:

- **A second demo.** The work section shows one project. To add the barbershop
  demo later, copy the Vesari `<article class="piece wide rv">` block in
  `index.html`, point the `<img>` at a new screenshot in `assets/img/`, and
  rewrite the caption.
- **Response time and availability** in the contact section — confirm or cut
  them.

The Vesari slot is real: `assets/img/demo-vesari.jpg` is the demo captured
running. Note the 3D model in it carries a visible Omega logo, so swap the model
or reshoot before the site goes public.

Contact details are real: viktor@roramake.ca and 438-855-3303.

## Putting it online

Any static host will take this folder as-is:

- **Netlify** — drag the folder onto app.netlify.com, or connect this repo and
  leave the build command empty with the publish directory set to `/`.
- **Vercel** — import the repo, framework preset "Other", no build command.
- **GitHub Pages** — Settings → Pages → deploy from branch `main`, folder `/`.

Then point roramake.ca at whichever one you pick.

## Notes

- The page adapts to light and dark mode, works down to phone width, and turns
  all motion off for visitors whose device asks for reduced motion.
- The fonts (Archivo, Instrument Sans, DM Mono) load from Google Fonts, so the
  page needs an internet connection to look right.
