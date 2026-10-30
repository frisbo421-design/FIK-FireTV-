---
name: fik-tv-experience
version: 0.1.0
trigger: Apply for FIK TV launcher/interface design, speed work, D-pad navigation, Fire OS 7 installation or rollback.
---
# FIK TV — safe premium television experience

FIK v0.3.8 operating method: inspect device and source -> diagnose -> direct -> build -> critique -> verify -> correct -> ship only on evidence. This is a project-local skill, not a permanent global FIK style.

## Load boundaries
- TV look/feel: read `references/TV-DIRECTION.md` and FIK `modes/APPLE-UI.md` plus TV-specific HIG references.
- D-pad problems: read `references/REMOTE-CONTRACT.md`.
- Slow TV/app: read `references/PERFORMANCE.md` and measure before making changes.
- Sideload/install: read `references/SAFETY-AND-ROLLBACK.md`, then the in-repo safety check, and request owner approval for any device operation.
- External references are in `references/SOURCES.md`. Inspect before using; do not execute third-party shell scripts automatically.

## Non-negotiable guardrails
1. No root, bootloader changes, recovery flashing, or system partition writes.
2. Do not disable/uninstall Amazon/system packages, change default HOME or enable ADB on the owner's behalf.
3. Keep Amazon's launcher as HOME. FIK is an ordinary sideloaded TV app by default.
4. All TV commands must be local, explicit, minimal and reversible. Require a working Back exit and a System Home control.
5. Never install auto-start, accessibility listeners or Home-button remappers as part of initial app installation.
6. Never guarantee the TV cannot be bricked; test on device and preserve a recoverable path.
7. Disable network ADB after setup, and never expose TCP 5555 to the public internet.
8. No credentials, geolocation, telemetry, remote assets or network permission in v1.

## Verification gates
- `bash scripts/verify-safety.sh` passes.
- Browser/remote tests show no focus traps, Back works, and all settings reachable with arrows + OK.
- App only reports native installed apps when `FIKNative` bridge is present; browser demo labels samples.
- First paint shows shell/favorites without enumerating all icon bitmaps.
- Android compilation then real Fire OS 7 test are separate gates; do not claim success without them.
- The user must confirm safe ADB connection before installation.
