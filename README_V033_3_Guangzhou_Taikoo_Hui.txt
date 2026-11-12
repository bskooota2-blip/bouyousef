BouYousef 3 — V033.3 Guangzhou Taikoo Hui (three-section listing)
Source: BouYousef3_V033_2_China_Arrival_Card_Navigation_Fix.zip
Date: 2026-11-11

Duplicates audit:
- 1 existing venue matched (gz-0009), previous label: تايكو هوي مول – براندات عالمية / Taikoo Hui / 广州太古汇.
- Original section: malls; old Chinese address: 天河区天河路383号.
- 0 new physical venue records created, 0 deleted; original Guangzhou record count remains 231.
- Updated gz-0009 in place and added section views: markets / malls / tourism.
- Existing Guangzhou markets subtype: الأسواق; malls subtype: أهم المجمعات التجارية; tourism uses its existing blank subtype.

Current names and address:
Arabic: مول تايكو هوي – غوانزو
English: Taikoo Hui Guangzhou
Chinese: 广州太古汇
Arabic address: رقم 383، شارع تيانخه، منطقة تيانخه، غوانزو، الصين
English address: 383 Tianhe Road, Tianhe District, Guangzhou, Guangdong, China
Chinese address: 广东省广州市天河区天河路383号
Metro: Shipaiqiao – 石牌桥站 – الخط 3؛ اتصال مباشر بالمول من مستوى M. رقم المخرج غير مؤكد.
Marked NEW with date: 11 نوفمبر 2026.

Changed program files:
- data/guangzhou.js: gz-0009 only (same record id).
- data/guangzhou-ui.js: section membership filter, section-specific classification, and address/alias search support.
- data/global-search.js: one indexed result per category, all three linked to same gz-0009 id.
- This README report.

Functions:
- Search in AMAP continues to generate a search URL for the Chinese address.
- DiDi destination-copy and Chinese copy actions use the existing action implementation.
- No unverified metro exit number was added.

Validation:
- Exactly 231 Guangzhou records retained.
- Exactly one record ID gz-0009; shown in three sections through a membership array.
- Untouched files are byte-identical to the source ZIP.
- Static JavaScript validation and zip integrity checked separately.
- No claim of successful external AMAP/DiDi operation without testing on a real phone.

Interactive Chromium tests completed (embedded local scripts, source ZIP unmodified):
- 1440px desktop: all three section listings displayed the same record once each; global search showed three Guangzhou section results; no JavaScript page errors. PASS.
- 390px mobile: same three section listings and global search behavior; no JavaScript page errors. PASS.
- Existing action controls displayed on all three cards (copy, DiDi destination copy, AMAP search). Real external AMAP/DiDi app launching was not tested.
- Source ZIP / changed ZIP passed archive integrity checks. Direct file:// and deployed GitHub Pages behavior were not tested.
- Existing Guangzhou database total is 231 records in V033.2 (not 221 as in older versions); unchanged at 231.
- An unrelated Shanghai Taikoo Hui is also present in global search and was not modified.
