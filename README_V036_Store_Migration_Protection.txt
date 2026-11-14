BouYousef 3 — V036 Store Migration Protection Report
Date: 2026-11-11
Source (read-only): BouYousef_V385_LV_Gallery_Display_Fix(4).zip
Destination baseline: BouYousef3_V035_1_Currency_Auto_Scroll_Fix.zip
Output: BouYousef3_V036_Store_Migration.zip

Scope:
- Replaced the generic Store "under construction" service page with an isolated Store view in the existing Store route; no sidebar item was added.
- Only the original index.html was modified, to hook the existing Store service to dedicated assets/store-v036.css and data/store-v036.js.
- No other previously present file was deleted or modified.

Migrated source content:
- Brand selector: CHANEL, BOTTEGA VENETA, DIOR, LOUIS VUITTON, GUCCI, FENDI, GOYARD, HERMES, LOEWE, LORO PIANA.
- Locked: GUCCI, FENDI, GOYARD, HERMES, LOEWE, LORO PIANA; Shoes locked. Locked routes refuse entry (even when directly using a hash).
- Open in source: CHANEL, BOTTEGA VENETA, DIOR, LOUIS VUITTON. DIOR has no populated product photo gallery in the V385 source and is shown with an honest no-products message.
- CHANEL photos copied unaltered: 75 distinct visible images.
- BOTTEGA VENETA photos copied unaltered: 62 files. 10 exact duplicate files were found; only 52 unique images are displayed. All original files remain in package.
- LOUIS VUITTON photos copied unaltered: 130 original images, all SHA-256 matched source. Displayed in original order (001 to 130), progressively through "Show more".
- Legacy BOTTEGA records (58) archived with original image files and product metadata, not displayed as duplicate storefront inventory, because the source suppresses the legacy gallery.
- Source-side Munira and MyWay/Shereefa fashion areas are hidden in source V385; only inactive/disabled entry labels have been carried over pending separate authorized activation. No fake inventory was generated.
- WhatsApp inquiry link copied from source. No shopping cart or new payment processing introduced.

Navigation and features:
- Home > Store > Categories > Bags > Brands > LV (and other open brands); back/forward history via hash and pushState.
- Images zoom and dismiss, original files unchanged.
- Progressive show-more (12 images per click); no duplicating cards.
- Existing login, arrivals, currency V035.1, cities, search, navigation/sidebar code not changed.

SHA-256 protection:
Baseline files: 234
Unchanged baseline files: 233
Changed baseline files: index.html ONLY
Deleted baseline files: 0
Added files: 341
Source ZIP and destination ZIP originals remain unmodified.
Source LV images: 130 out of 130 exact SHA-256 matches.
All 325 source product image files (130 LV + 75 CHANEL + 62 BOTTEGA + 58 legacy BOTTEGA) passed image verification.
See SHA256_V036_File_Comparison.csv for all before/after digests.

Browser tests: Chromium with a document-inline test harness, because direct file:// and localhost navigations were blocked in this environment.
Desktop 1440: Store open, Categories, Brands (10 entries, 6 locked), LV 12 initially, Show More to 130, zoom/close, history back/forward; no JavaScript errors or horizontal overflow in tested view.
Mobile 390: same tests, using the mobile sidebar opening; no JavaScript errors or horizontal overflow in tested view.
PNG test screenshots are provided separately. In the test harness the first 12 source LV photos were embedded as data URIs so image rendering could be inspected. Actual ZIP references the copied image files.
Other browser tabs: Source image integrity and presence verified; direct GitHub Pages deployment, real device touch, database login and external WhatsApp actions NOT tested.

Notes and limitations:
- UI for original hidden/disabled apparel categories was not activated without authorization; the V385 source has no displayed merchandise in them.
- The original V385 brand gallery had some hidden legacy Bottega product data; preserved in archival JSON rather than displayed twice.
- This is a review build. Do not mark V036 approved until the owner reviews it.
