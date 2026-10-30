# Fire OS 7 / limited-memory performance profile
## Baseline first
Read-only ADB: `adb -s SERIAL shell dumpsys meminfo com.fik.tv` after app is running; `adb -s SERIAL shell dumpsys gfxinfo com.fik.tv`; `adb -s SERIAL shell getprop ro.build.version.sdk`; user may capture screen via `screencap`. Do not quote figures before running these on hardware.
## Redesign implementation
- Enumerate label/pkg first; defer PNG generation until a tile is visible.
- Render only home favorites at initial boot; all-app grid is built on demand. Do not maintain duplicate icon bitmaps.
- Cache icons bounded to 32; decode native icons at 80px for 1080p UI. Release references on view exit.
- Disable heavy full-screen CSS backdrop blur and animated filters on the low-memory TV; avoid autoplay video/continuous particles.
- One low-frequency clock timer and no network calls, WebView multiwindow, ads or analytics.
- Keep APK asset payload small; use one prepared JPEG background and native app icons.
- Benchmark cold start, focus response time, jank and PSS on device versus previous build; optimize measurements, not myths about free RAM.
