# TCG Label Printer

Chrome-extensie die van de kaarten in je TCG PowerTools listing-tab prijslabels
print op HERMA-etiketten 17,8 × 10 mm (270 per A4). Zie `docs/spec.md`.

## Installeren

1. Ga naar `chrome://extensions` en zet **Ontwikkelaarsmodus** aan.
2. Klik **Uitgepakte extensie laden** en kies deze map.
3. Pin de extensie via het puzzelstukje in de werkbalk.

## Gebruik

1. Upload je kaarten in TCG PowerTools en laat de listing-pagina openstaan.
2. Klik op het extensie-icoon, controleer "Start bij label" en klik **Printen**.
3. In de printdialoog: **Marges: Geen**, **Schaal: 100 %**, achtergrondafbeeldingen aan.
4. Klik na het printen op **Gelukt**: de volgende print begint dan na het laatste label.

Eerste keer: print via **Instellingen → Uitlijntest printen** een testvel op
gewoon papier en corrigeer eventuele verschuiving in mm.

## Ontwikkelen

- `npm test` draait de unit tests (Node 20+).
- `python3 -m http.server` in deze map en open `test/preview.html?start=200&month=9`
  voor een voorbeeld van de printpagina zonder de extensie te laden.
- Werkt de extensie niet meer na een update van TCG PowerTools, dan zit de
  aanpassing vrijwel zeker in `src/reader.js`.
