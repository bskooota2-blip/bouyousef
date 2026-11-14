BouYousef 2 V041.20.1 — Mobile Instagram/menu layout fix

Base: V041.20.0 Offline Full.
Changed: index.html (added scoped stylesheet), offline-files-v04120.json (add stylesheet for optional offline download).
Added: assets/mobile-social-v04120-1.css.

At mobile viewports up to 680px, the social row is a four-column grid containing WeChat, Snapchat, WhatsApp and Instagram. The menu has reserved space at upper right; signout (if shown) sits on a separate row. Desktop styles and functionality are unchanged. The images, city data, auth and service worker are unchanged.

Installation: upload the FULL zip contents to existing GitHub Pages root. To use update-only package, merge its contents into the existing V041.20.0 full project; do not replace the entire site with update-only.

Checks: archive CRC, required files present, HTML stylesheet link exists, CSS media scoped, files referenced in offline list. Browser interaction should be checked on actual mobile device before deployment approval.
