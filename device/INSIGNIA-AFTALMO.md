# FIK TV — Verified target hardware

The following values were read from the user's actual Insignia Fire TV over authorized Wi-Fi ADB (Bugjaeger). Values are snapshots, not promises of future free RAM/storage.

- Hardware model: Insignia NS-40F401NA26 (TV Settings About screen)
- Android ro.product.model: AFTALMO
- Fire OS: 7.7.1.7 (PS7717/5741)
- Android API target: Android 9 / API 28 (Fire OS 7 family; API not separately verified by `getprop ro.build.version.sdk`)
- Accepted Android native CPU ABIs: `armeabi-v7a,armeabi`; **no arm64-v8a**.
- Display physical size (wm size): `1920x1080`
- Total RAM (MemTotal): `1540536 kB`, ~1.469 GiB
- RAM estimated available (MemAvailable): `598448 kB`, ~584 MiB (at observation)
- `/data` block: 3.8G total / 2.8G used / 893M available / 77% used
- CPU: four logical cores inferred from top (`400%cpu`), 378% idle across cores at one observed instant
- Swap: 511996 kB total, 218156 kB used at observed instant

## Build implications

1. The current app is Java + WebView. It bundles no `.so` native libraries. It can be published as a universal APK, without ARM ABI splits. If native dependencies are ever introduced, only ship `armeabi-v7a` binaries, not arm64-only builds.
2. Target API/minSdk should remain compatible with Fire OS 7; current minSdk=28, targetSdk=28.
3. Prefer 720p or 1080p static images, minimal GPU compositing, short optional video loops, WebView media off by default and no online dependencies.
4. Keep application APK below 30 MB if practical, and allow at least several hundred MB free after install. **Do not install while storage is critically low.**
5. Install ordinary app `com.fik.tv` only. No root, no Amazon package modifications, no home-role/category replacement, no auto-start, no privileged ADB settings, no firmware flash. Amazon Home remains functional.
6. Test remote BACK/HOME exits and force-stop/relaunch, app discovery and crash-free startup on the TV before claiming production readiness.

## Remaining verification

- Android SDK/API from `getprop ro.build.version.sdk` is optional extra confirmation; not needed for the current 32-bit ABI decision.
- No device-side app install or performance benchmark has yet taken place.
