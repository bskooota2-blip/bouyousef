BouYousef 2 — V041.22.0 | Language and Search Update
Base: V041.21.0 Full ZIP
Scope: language preferences, localized city-card interface, category filters, multilingual internal search, offline bundle list.

Implemented:
- Arabic / English / Chinese language preference persisted on this device.
- Main navigation, city headings, listings and filter controls follow language selection.
- Non-Guangzhou city cards prefer original verified name in selected language if available (ar/en/zh), retaining original Arabic name as a supporting reference.
- Original Arabic descriptions, notes, region labels and unverified category terms are retained rather than machine translated. A full professional translation of narrative content was NOT performed.
- Search uses existing Arabic/English/Chinese names and aliases; global search results are shown in chosen interface language when data exists.
- Existing filters (including Favorites), AMAP and DiDi destinations and city records unchanged.
- Offline download manifest now contains the localization helper; users should redownload the offline pack after deployment.
- Versioned JS URLs reduce stale browser cache behavior.

Tests: Node JavaScript syntax checks succeeded; ZIP integrity and unchanged-asset hash verification succeeded. Automated interactive Chromium testing was blocked by the environment, so mobile/desktop interaction and live Supabase must be tested before publishing.

Install: Use FULL zip as one complete project, or overlay UPDATE ONLY on the exact V041.21.0 full project. Do not publish directly before testing.
Rollback: restore the full V041.21.0 project archive. Supabase schema was not altered.
External search engine SEO: no claim of newly indexed pages; indexing depends on the public URL, search crawler and site architecture.
