BouYousef2 V041.23.7 – Guangzhou compact place cards

Base: V041.23.6_Guangzhou_Cards_Restored_Full.zip

Changed:
- data/guangzhou-ui.js: hide category/new/date-added chips, notes, contact, cautions, features, featured drinks and nearby text from Guangzhou place cards. Retain names in Arabic/English/Chinese, verified opening-year label, compact metro station/line/exit, copy/DiDi/AMAP and favorite heart. Original source data untouched.
- index.html: Guangzhou-only layout adjustments; versioned script reference to v041237.

Important: Favorite indicator and opening year remain visible where available. A place without confirmed year/metro will not show invented data. No deployment to GitHub.

Validation: JavaScript syntax check; ZIP CRC; original file preservation. Browser interaction not verified.

Rollback: restore index.html and data/guangzhou-ui.js from V041.23.6.
