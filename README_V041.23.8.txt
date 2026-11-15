BouYousef 2 V041.23.8 — Guangzhou compact opening-year badge

Changed files:
- index.html: cache-busting Guangzhou renderer reference v041238.
- data/guangzhou-ui.js: show existing verified opening/founding years as a sky-blue calendar badge adjacent to the place title.

No opening dates were invented or modified. Only records with a valid openingYear already in Guangzhou data get a badge. The compact card retains place names, metro station/line/exit where available, and Copy/DiDi/AMAP/Favorites buttons. Detailed addresses and notes remain hidden in Guangzhou cards but their source data is preserved.

Testing: ZIP integrity and JavaScript syntax checked. Browser visual behavior should be checked before deployment. GitHub not updated.

Rollback: restore index.html and data/guangzhou-ui.js from V041.23.7.
