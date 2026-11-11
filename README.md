# Lieyabull: workshop site

Personal site + game shelf + project bench + lab drawer. Eleventy, zero client dependencies.

## Develop (phone-friendly: shared storage forbids symlinks)

```bash
npm run install:phone   # = npm install --no-bin-links
npm run dev             # serve with live reload
npm run build           # output to _site/
```

Direct binary (no `.bin` symlinks on this phone): `node node_modules/@11ty/eleventy/cmd.cjs`.

## Add content (data-driven, no markup duplication)

Every entry carries both locales: keep the English field and add its `Hu` twin. Missing `Hu` values fall back to English, so partial translations are safe. The footer flag buttons switch languages (English default, choice persisted in `localStorage`); both locales ship in the HTML, CSS shows the active one.

- **Game** → append to `src/_data/games.json`: title, dir, kind (`solo`|`lan`), status, version, players, blurb, controls, plus `playersHu`, `blurbHu`, `controlsHu`, `repo` (folder URL), and `site` (playable URL) for solo games. LAN games get repo only. Never link a page that needs a server as if it were playable. Verify new URLs return 200 before committing.
- **Project** → append to `src/_data/projects.json`: slug, title, status, oneliner, body, tags, links (`{label, url}` → rendered as visit buttons), plus `onelinerHu`, `bodyHu`, `statusLabelHu`, and `noteHu` when a note exists. Only link repos that are public. Verify with `gh repo view`.
- **Experiment** → append to `src/_data/lab.json`: title, status (`note`|`placeholder`), tags, one honest paragraph, optional `repo`/`site` (rendered as visit buttons when present), plus `titleHu` when the title translates and `textHu`.
- **Now** → edit five fields in `src/_data/now.json` + `updated` date, and their `*Hu` twins.

## Design contract (don't regress)

Paper + ink logbook. No rounded-card grids, glass, gradients, purple/blue AI palette, Inter, centered hero, or entrance animations. Ledger rows + stamps + double rules. System serif + mono only (no webfonts). Touch targets ≥44px, nav scrolls horizontally on mobile, `<details>` for controls, filter works without JS (all visible) and enhances with it.
