#!/usr/bin/env bash
set -euo pipefail
APK=${1:-app/build/outputs/apk/debug/app-debug.apk}
[ -f "$APK" ] || { echo "ERROR: APK not found at $APK" >&2; exit 2; }
# Any native binaries would need 32-bit armeabi-v7a support. Current app is intentionally Java/WebView only.
if unzip -Z1 "$APK" | grep -Eq '^lib/(arm64-v8a|x86_64)/'; then
  echo 'BLOCKED: 64-bit native libraries in this 32-bit target release' >&2; exit 1
fi
if unzip -Z1 "$APK" | grep -E '^lib/' | grep -q .; then
  echo 'NOTE: native libraries detected. Manually review ARM32 compatibility before sideloading.' >&2; exit 1
fi
BYTES=$(stat -c %s "$APK")
if [ "$BYTES" -gt 31457280 ]; then
  echo "BLOCKED: APK over 30 MiB target: $BYTES bytes" >&2; exit 1
fi
if command -v aapt >/dev/null; then
  aapt dump badging "$APK" | grep -E '^package:|^sdkVersion:|^targetSdkVersion:|^launchable-activity:'
fi
printf 'PASS: no bundled native code; size %s bytes. Device installation and QA still pending.\n' "$BYTES"
