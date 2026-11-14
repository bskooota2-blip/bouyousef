V022 – Shenzhen / Guangzhou Design Review
Base: BouYousef3_V021_Windows_Compatible.zip
Source: BouYousef_V385_LV_Gallery_Display_Fix(2).zip (data already imported in V021)
Only Shenzhen-specific data and rendering logic adjusted; shared index contains a scoped city class and Shenzhen bottom-nav rule. Guangzhou data and its JS unchanged.

Total before: 165; after: 165; IDs preserved: 165/165.
Counts before: {'markets': 51, 'tourism': 40, 'dining': 36, 'hotels': 26, 'transport': 10, 'mosques': 2}
Counts after: {'markets': 35, 'malls': 16, 'tourism': 40, 'dining': 36, 'hotels': 26, 'transport': 10, 'mosques': 2}
Moved markets to malls: 16 (she-0036 through she-0051), based on clearly labeled shopping centers.
No places were added or deleted. No duplicates removed automatically (a street/market may also be a tourist attraction).

Source limitations:
- Hotels are labeled 'غير مصنفة' because hotel star ratings have not been independently verified.
- Metro, exit and Chinese full addresses are not inferred; fields that are missing remain absent.
- Some names, notes and Chinese strings are imperfect in the V385-derived data and were retained to prevent accidental alteration.
- Branchless coffee chains and hotel chains include a caution to verify the branch.
- she-0165 prayer facilities are not presented as a verified mosque.
- Shenzhen West Station operating status requires confirmation.
- Maps open an AMAP keyword search, not a guaranteed exact pin.
- Source restaurant type headings are based on source grouping; halal status is NOT asserted for any unverified restaurant.

Shenzhen V022 implementation:
- Reuse Guangzhou gz-panel, gz-place, gz-place-main, gz-place-side, gz-buttons, gz-action and info layout.
- Category filtering, search, show more and global search target preserved.
- Four feature descriptions, four nearby cities, and practical transport tips.
- Bottom navigation back to top / home enabled for Shenzhen.
- Floating global search unchanged.

Remaining checks: browser interactions, phone layout, clicks on mapping/clipboard (depend on network and browser permissions). Results are recorded separately below.

Browser test (Chromium, inline local assets; 1440x900 and 390x900): PASSED.
- 8 section buttons rendered; all 8 sections opened.
- Category counts: markets 35, malls 16, dining 36, tourism 40, hotels 26, transport 10, mosques/prayer listings 2.
- Information contains 4 feature cards and 4 nearby destinations.
- Pagination reveals all 35 market records; electronics filter shows 12; section search works.
- Global search for هوا تشيانغ بي returns 9 results.
- Bottom home navigation works; Guangzhou market section still renders 32 first-page cards.
- No JavaScript page errors and no document-level horizontal overflow at tested sizes.
- External AMAP navigation, DiDi app handoff and OS clipboard permissions were not verified end-to-end.
- Source name/address accuracy and hotel stars are not independently confirmed.
