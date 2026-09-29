# TCG Label Printer — spec

Chrome-extensie (Manifest V3) die de kaarten uit de actieve listing-tab van
TCG PowerTools (`new.tcgpowertools.com/listing-and-appraisal`) uitleest en een
printklare A4 maakt voor HERMA-etiketten 17,8 × 10 mm (10 × 27 = 270 per vel).

## Gebruik

1. Klik op het extensie-icoon terwijl de TCG PowerTools-tab actief is.
2. Popup toont aantal labels, maand + kleur en "Start bij label" (standaard waar de
   vorige print eindigde; aanpasbaar; knop "Nieuw vel" zet op 1).
3. "Printen" opent een printpagina in een nieuwe tab met de printdialoog.
4. Na de dialoog vraagt de printpagina "Gelukt?" — pas bij bevestiging schuift de
   teller door (zo telt een geannuleerde print niet mee).

## Regels

- Eén label per exemplaar (aantal = `attributes[0]` van het artikel).
- Alle artikelen in het grid van de actieve listing-tab.
- Prijs = `newPrice` (valt terug op `attributes[4]`), afgerond op € 0,50,
  half naar boven (3,24 → 3,00; 3,25 → 3,50), minimum 0,50.
- Weergave zonder euroteken, met komma: `3,50`, `4,00`.
- Maandcode = maand van printen: kleurbalk in de maandkleur + jaar `JJ` (bijv. `26`).
- Conditie rechtsonder (`newCondition`, valt terug op `attributes[1]`), bijv. `NM`.
- Verder dan label 270 → volgende pagina, weer vanaf label 1.
  Volgende start = ((start − 1 + aantal) mod 270) + 1.

## Maandkleuren (standaard, aanpasbaar in opties)

Elke maand een eigen basiskleurnaam, zodat ze niet te verwarren zijn:
01 rood, 02 oranje, 03 geel, 04 lichtgroen, 05 donkergroen, 06 grijs,
07 lichtblauw, 08 donkerblauw, 09 paars, 10 roze, 11 bruin, 12 zwart.

## Vel-geometrie (uit HERMA Word-template)

A4 210 × 297 mm, label 17,8 × 10 mm, 10 kolommen met steek 20,4 mm,
27 rijen met steek 10 mm, marge links 4,3 mm, boven 13,5 mm.
Opties bevatten een uitlijncorrectie X/Y in mm. Printen op 100 %, marges "Geen".

## Onderdelen

- `src/reader.js` — functie die in de pagina (MAIN world) de React-props van het
  grid leest en `[{name, set, quantity, condition, price}]` teruggeeft. Enige plek die van
  TCG PowerTools' interne structuur afhangt.
- `src/pricing.js` — afronden en formatteren.
- `src/layout.js` — geometrie, label-index → pagina/positie, volgende start.
- `src/months.js` — standaardkleuren en maandcode.
- `src/settings.js` — lezen/schrijven van `chrome.storage.local`.
- `src/render.js` — bouwt de printpagina-DOM.
- `popup.*`, `print.*`, `options.*` — de drie extensiepagina's.

## Niet in scope

Printen zonder dialoog, kaartnamen op labels, andere etiketformaten.

## Testen

`node --test` voor pricing, layout en months. Reader handmatig tegen de live
pagina; printpagina visueel via `test/preview.html`.
