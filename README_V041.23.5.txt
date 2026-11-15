BouYousef 2 – V041.23.5 – Guangzhou Metro Compact

Changes:
- Guangzhou location cards show ONLY a station name, metro line number(s) and exit(s) if confirmed in the existing source.
- Removes route instructions, travel times, distance guidance and AMAP verification prose from the metro line.
- For records containing only unverified guidance and no station, no metro row is shown.
- Source addresses and the complete original metro text remain unchanged in data/guangzhou.js.
- Other card fields (including notes, names, opening year, favourites and AMAP/DiDi) are unchanged.
- Cache bust on index.html from guangzhou-ui.js?v=041234 to ?v=041235.
- No GitHub deployment performed.

Changed files:
index.html
data/guangzhou-ui.js

Testing: JS syntax checked; ZIP integrity checked. Browser visual testing and button interaction should be verified before production deployment.

Rollback: restore the previous index.html and data/guangzhou-ui.js from V041.23.4.
