# StitchCraft iPhone

The iPhone/Home Screen edition of StitchCraft Studio 2.8. It is a static,
offline-capable PWA: the entire studio is contained in `index.html`, with
`mobile.js` adding install/update guidance and `sw.js` caching the app shell.

## Use it

Open the GitHub Pages address in Safari, then choose **Share → Add to Home
Screen → Open as Web App → Add**. Launch the new icon once while online so the
service worker can cache the studio; after that it works without a connection.

The first Home Screen launch starts with its own browser storage. Export a JSON
backup from the desktop app and import it inside the installed app if you want
to carry projects across. Safari and the Home Screen app can keep separate data;
there is no automatic sync.

## Files

- `index.html` — StitchCraft Studio 2.8, with the iPhone install/status panel.
- `mobile.js` — Home Screen detection, offline status, update and storage controls.
- `sw.js` — versioned offline cache.
- `manifest.webmanifest` — standalone PWA metadata.
- `icon-180.png`, `icon-192.png`, `icon-512.png` — Home Screen icons.
- `setup.html` — longer install, travel and backup guide.

The source studio lives in the main StitchCraft project. Rebuild its
`dist/StitchCraft.html`, then regenerate this file with the iPhone head tags,
safe-area CSS and `#phone-install` panel. Keep the panel ID and let Studio place
it below its own navigation; Studio deliberately leaves `#phone-install` visible
when switching views.
