# FIK TV remote contract
- Navigation axes are explicit. Up returns from the favorite rail into main controls; Down returns to favorites; Left and Right move predictably.
- Focus must be visible, never hover-only; focus feedback scale 1.04–1.07 with outline; animation 150–220ms; zero animation if reduced motion.
- Avoid traps in settings and grid. Focus restores to opener after closing a modal or exiting all-apps.
- Native `Back` closes modal, closes ambient, returns from Apps to Home, then exits FIK to system Home (does not intercept Home key).
- Keep all primary content within >=5% horizontal, >=5% vertical margin; artwork may bleed to screen edge.
- Text sizes judged from couch, not laptop. Contrast must remain sufficient over artwork.
- Content truth: only installed apps are launchable; do not invent recommendations, weather, recently watched, or availability.
