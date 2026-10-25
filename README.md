# 12-Week Recomp — web app

Your tracker, packaged to install on an iPhone home screen. No App Store, no build step,
no dependencies. Everything is in this folder.

```
index.html               the app (your original file + iOS meta tags)
manifest.webmanifest     name, icons, standalone display
sw.js                    service worker — makes it work offline
icons/                   180 / 192 / 512 px app icons + favicon
splash/                  startup screens (12 iPhone sizes)
.nojekyll                tells GitHub Pages to serve files as-is
```

## What was added to your HTML

Everything is inside `<head>`, plus one script before `</body>`. Your app code is untouched.

| Added | Why |
| --- | --- |
| `apple-mobile-web-app-capable=yes` | launches fullscreen, no Safari chrome |
| `apple-mobile-web-app-title` | home-screen label: **Recomp** |
| `apple-mobile-web-app-status-bar-style=black-translucent` | content runs under the status bar |
| `apple-touch-icon` (180px) | the home-screen icon |
| `apple-touch-startup-image` ×12 | replaces the white flash on launch |
| `manifest.webmanifest` | standalone display, theme colour, icons |
| `theme-color` | tinted status bar, already in your file |
| service worker | full offline launch |
| CSS block | stops text-selection callouts on the UI, keeps them on inputs |

Your app already had `viewport-fit=cover` and `env(safe-area-inset-*)` padding, so the
notch and home indicator are handled.

## Deploy (GitHub Pages)

Full step-by-step is in the chat. Short version:

```bash
cd recomp-pwa
git init -b main
git add .
git commit -m "12-week recomp web app"
git remote add origin https://github.com/YOURNAME/recomp.git
git push -u origin main
```

Then repo → **Settings → Pages** → Source: *Deploy from a branch* → **main** / **/ (root)** → Save.
Live at `https://YOURNAME.github.io/recomp/` in about a minute.

## Install on the iPhone

Open that URL in **Safari** (not Chrome — only Safari can install) → Share button →
**Add to Home Screen** → Add.

## Updating the app later

Edit `index.html`, then bump the cache name in `sw.js`:

```js
const CACHE = 'recomp-v2';   // was v1
```

Commit and push. On the phone, open the app, wait a second, close and reopen it.
The page itself is network-first, so a plain refresh picks up changes even without a
version bump — but bumping the cache forces the icons and manifest to refresh too.

## Keep your logs

`localStorage` is tied to the exact URL. Stick to one hostname (e.g. always
`YOURNAME.github.io`) and your data follows you. Moving between the local `.html` file,
Netlify and GitHub Pages will mean three separate sets of logs — use **Help → Backup
and restore** to carry data across. Installed web apps also keep storage permanently:
Safari's 7-day unused-site cleanup does not apply to home-screen apps.
