BouYousef 3 — V033.4 — Addition of Taikoo Li Julong Wan Guangzhou

SOURCE: BouYousef3_V033_3_Guangzhou_Taikoo_Hui_Three_Sections.zip

WHY THE PREVIOUS UPDATE WAS WRONG:
V033.3 updated Taikoo Hui Guangzhou (广州太古汇) in Tianhe District, but the requested Taikoo Li is a different venue: 广州聚龙湾太古里 in Liwan District. They are separate locations and should never share the same address or metro line.

DATA CHANGES:
- Added NEW independent physical venue record gz-0232: مول تايكو لي جولونغ وان – غوانزو / Taikoo Li Julong Wan Guangzhou / 广州聚龙湾太古里.
- Address: 广东省广州市荔湾区芳村大道东146-166号.
- Metro: 大冲口站, Line 11, Exit D (check entrance pin in AMAP).
- Published in 3 sections using one record: markets / malls / tourism.
- Category views use existing category names and no new category was created.
- Added alias search terms for Taikoo Li, separately from Taikoo Hui.
- Removed incorrect 'تايكو لي' alias from existing Taikoo Hui record gz-0009; this is a disambiguation correction, not a record deletion.
- Marked as new: 11 November 2026.
- Original Guangzhou record count: 231. Updated: 232.
- Image assets untouched; no new images added.

SOURCES:
- Swire Properties official release (2026-09-29): https://www.swireproperties.com/en/media/press-releases/2026/20260929_tlg-phase-one-launch/
- AMAP address listing: https://map.gaode.com/place/B0L3TM79FI
- Guangzhou Daily metro Line 11 Exit D: https://news.dayoo.com/gzrbrmt/202512/24/170646_54909719.htm

CHANGED FILES:
- data/guangzhou.js
- README_V033_4_Guangzhou_Taikoo_Li.txt (new report)

PRESERVED:
- All original ZIP contents; all other files byte-identical to V033.3.
- Taikoo Hui record remains (gz-0009), without wrong alias.
- Existing action button behavior (copy, DiDi destination copy, AMAP search) is unchanged.

LIMITATIONS:
- Live launch in AMAP and DiDi on a real phone and GitHub deployment are not tested.
- Metro exits may change; source confirms D but map pin should be checked when visiting.
