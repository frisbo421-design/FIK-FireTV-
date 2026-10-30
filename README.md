# FIK / Fire TV — Apple-inspired 1080p home experience
**Source version 1.2.0**. Designed for Insignia NS-40F401NA26, Fire OS 7 / Android 9. **Browser-tested; not yet Android-compiled or tested on the physical Fire TV.**

## FIK design sources
FIK v0.3.8: `SKILL.md`, `core/KERNEL.md`, `router/ROUTER.md`, `router/LOAD-PROFILES.md`, `modes/APPLE-UI.md`, `modules/design/SURFACE-MODES.md`, `modules/design/UI.md`, `modules/design/COMPOSITION.md`, `core/CRITIC.md`.
Apple TV HIG: https://developer.apple.com/design/human-interface-guidelines/designing-for-tvos ; https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/ ; https://developer.apple.com/design/human-interface-guidelines/layout
Design goals: authentic installed-app icons via Android PackageManager, D-pad focus, generous safe area, one blue UI accent, 400/600/700 weight ladder, atmospheric art rather than fake recommendations, minimal copy. Background is an original procedural graphic (not NASA photography). No Internet permission, sign-in, analytics, or feeds. Local customization persists on TV. Browser demo uses clearly labeled sample apps.

## Fast build (GitHub Actions)
Create a **new repository** called `FIK-FireTV` and upload this source folder. GitHub Actions workflow `.github/workflows/build-apk.yml` compiles the APK. In Actions run "Build FIK Fire TV APK" and download artifact "FIK-FireTV-debug-apk"; extract `app-debug.apk`. This requires repository access; the ZIP itself is not an APK.

## Install over Wi-Fi with ADB
1. Fire TV → Settings → My Fire TV → About → click device name 7 times if needed → Developer Options → ADB Debugging ON.
2. On the TV Settings → My Fire TV → About → Network, find its local address.
3. On PC with `adb` installed, same Wi-Fi:
```
adb connect 192.168.1.42:5555
adb devices
adb install -r app-debug.apk
adb shell am start -n com.fik.tv/.MainActivity
```
Replace the IP. Confirm TV's authorization prompt. Android phone with a compatible Wi-Fi ADB app may also install an APK, once built. Do not expose ADB port 5555 to the internet. Turn off ADB when no longer needed.

## Limitations
Does not replace Amazon Home or remove ads from Amazon's own UI; that requires a separately tested, optional compatible home-button redirect. No risky system package removal. Fire OS may restrict which native apps are launchable. Only this Android build's installed-app detection can be verified on the real TV. Launch success will need hardware testing. This is not an Apple product and uses no proprietary Apple assets. Browser demo cannot launch native apps.

## Files
`app/src/main/assets` = UI and bundled background image. `app/src/main/java/com/fik/tv/MainActivity.java` = app discovery and launching bridge. `.github/workflows/build-apk.yml` = build automation.


## v1.2 — FIK TV safety / speed / polish pass
- Read `fik-skills/SKILL.md` first; includes a curated 2026 GitHub skills registry and architecture/design/performance constraints.
- Original Amazon HOME is untouched. No root, ADB package-disable steps, boot launch, privileged permissions, accessibility permissions or home remap.
- Added `scripts/verify-safety.sh` in CI. `scripts/install-safe.sh` is a dry run by default; requires `--confirm` and an explicit TV address to install only `com.fik.tv`.
- Original icons moved to lazy per-package load; 8 pinned tiles only at initial render; full app library builds on demand. App icon cache capped at 32.
- Premium visual update: focused installed app becomes the spotlight subject; original artwork remains restrained background. No fake recommendations.
- Back on home now requests System Home. The settings and library return from Back and restore focus.
- Removed full-card and modal CSS backdrop filters and delayed icon work; do not claim measurable Fire OS improvement before on-device profiling.
- Browser verification results: `FIK-TV-v1.2-browser-tests.json` separately attached, not proof of native device functioning.
- Recovery: FIK is a normal app. If it crashes, remote Home reaches Amazon Home by default. After device owner approval, remove only `com.fik.tv` through Fire TV's Manage Installed Applications or `adb uninstall com.fik.tv`. No Amazon package changes to undo.


## v1.2 — FIK TV safety / speed / polish pass
- Read `fik-skills/SKILL.md` first; includes a curated 2026 GitHub skills registry and architecture/design/performance constraints.
- Original Amazon HOME is untouched. No root, ADB package-disable steps, boot launch, privileged permissions, accessibility permissions or home remap.
- Added `scripts/verify-safety.sh` in CI. `scripts/install-safe.sh` is a dry run by default; requires `--confirm` and an explicit TV address to install only `com.fik.tv`.
- Original icons moved to lazy per-package load; 8 pinned tiles only at initial render; full app library builds on demand. App icon cache capped at 32.
- Premium visual update: focused installed app becomes the spotlight subject; original artwork remains restrained background. No fake recommendations.
- Back on home now requests System Home. The settings and library return from Back and restore focus.
- Removed full-card and modal CSS backdrop filters and delayed icon work; do not claim measurable Fire OS improvement before on-device profiling.
- Browser verification results: `FIK-TV-v1.2-browser-tests.json` separately attached, not proof of native device functioning.
- Recovery: FIK is a normal app. If it crashes, remote Home reaches Amazon Home by default. After device owner approval, remove only `com.fik.tv` through Fire TV's Manage Installed Applications or `adb uninstall com.fik.tv`. No Amazon package changes to undo.
