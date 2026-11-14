V031.1 — Beijing UI and City Information Repair — 10 November 2026
Base: BouYousef3_V031_Beijing_Complete_Update.zip
Output: BouYousef3_V031_1_Beijing_UI_Content_Fix.zip

Records preserved: 136. IDs unchanged. No non-Beijing city record modified.

FIXED
- Beijing city information: populated four nearby-city journeys with no invented fixed travel times; six practical transport tips.
- Beijing information page uses Guangzhou-matching full-width information layout.
- Beijing dining: removed ambiguous near-duplicate filters (كافيهات/الكافيهات); placed chain names under cafes and bakeries as appropriate; generic search entries under explicit "دلائل عامة — فرع غير محدد"; Chinese named restaurants under "المطاعم الصينية" without unverified halal claims.
- Beijing hotels: separated two hotels verified as five-star by Forbes Travel Guide 2026, with explicit notice that Forbes classification is not the same as the Chinese government hotel star category; other hotels left "غير مصنفة" pending official classification. No 3-star/4-star filters created without verified data.
- Beijing transport: airports and railway stations categorized, with corresponding icons.
- Filters are generated from actual categories only (no empty categories).
- Legacy records kept even if their branch is not precise; warning labels explain this.
- Files changed: data/other-cities.js (only Beijing data), data/other-cities-ui.js (Beijing-scoped additions).

PRIMARY SOURCES:
https://www.forbestravelguide.com/award-winners (2026 Forbes ratings)
https://www.peninsula.com/en/beijing/5-star-luxury-hotel-wangfujing
https://english.beijing.gov.cn/latest/news/202412/t20241225_3973421.html (Beijing railway stations)
https://english.beijing.gov.cn/latest/news/202512/t20251224_4360124.html (Beijing–Tianjin services)

NOT VERIFIED: All hotel's official Chinese-government star classifications; live AMAP/DiDi destination selection; every previous record's status. 3-star/4-star filters were intentionally not added because no reliably verified hotel record belongs to them yet.

CATEGORY COUNTS:
dining: المطاعم الصينية=4, دلائل عامة — فرع غير محدد=7, الكافيهات=8, المخابز=4
hotels: 5 نجوم (تصنيف فوربس)=2, غير مصنفة=17
transport: المطارات=2, محطات القطارات=8

QA TESTS RUN:
- node --check on both edited JavaScript files: passed.
- Full 136 Beijing identifiers unchanged, all other city records deep-equal to V031: passed.
- 4 populated nearby-city table rows; 6 populated travel tips: passed static data checks.
- Dining category duplicate names removed: passed static data checks.
- ZIP CRC test: passed.
- Chromium page-render test: NOT RUN (browser navigation was blocked by environment administrator, including file:// and local HTTP), so responsive UI and interaction checks are NOT claimed.
