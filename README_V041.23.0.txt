BouYousef 2 — V041.23.0 — 15 Nov 2026
BASE: user uploaded BouYousef2_GitHub_Opening_Years_Verified_Update(2).zip
SCOPE: 11 dates with explicit verified sources + all 1154 places audited; compact language controls ع / E / 中, dates badge style.
IMPORTANT: 1154 cards were inventoried; this DOES NOT imply 1154 independently researched verified opening dates. No years were invented. Existing years are retained pending separate verification. Consult OPENING_YEARS_AUDIT_V041.23.0.csv.
Modified: data/guangzhou.js, data/other-cities.js, index.html, sw.js.
Added: assets/opening-language-v04123.css, data/language-toggle-v04123.js, audit CSVs, README.
NOT modified: Supabase, favorite data, city/market/mall images, store, Didi/AMAP links, arrival pages.
The compact language buttons call the same existing languageSelect change handler and preserve the existing translation engine.
Offline: service worker cache name changed. When online, re-download guide to refresh offline content. No cache clearing command provided, to preserve offline stored data.
Rollback: restore original ZIP, without overwriting user data or Supabase.
Tests: JS syntax/static references/ZIP checks executed. Real device and GitHub Pages / Supabase tests remain REQUIRED before production. No deployment was performed.
