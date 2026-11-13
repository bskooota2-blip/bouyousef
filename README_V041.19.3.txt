BouYousef 2 V041.19.3

Fix: next/previous/index buttons now place the NEW PHOTO at the top of the visible screen, not the guide progress index. JS waits for photo decode and scrolls after DOM layout settles. Explicit image dimensions prevent layout shift. HTML uses ?v=041193 to bypass browser cache.

Only modified arrival.html, index.html, data/arrival-guide-v041-19-0.js and README. All existing images and site assets preserved. No deployment performed.

If your live site still shows the old behavior after upload, check that GitHub Pages has finished deploying the updated index.html, arrival.html, and JavaScript file, then hard-refresh (Ctrl+F5) and verify the JS URL contains ?v=041193.
