#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
manifest=app/src/main/AndroidManifest.xml
src=app/src/main/java/com/fik/tv/MainActivity.java
[ -f "$manifest" ] && [ -f "$src" ] || { echo 'Missing manifest or activity' >&2; exit 1; }
if grep -Eiq 'android\.permission\.(WRITE_SECURE_SETTINGS|QUERY_ALL_PACKAGES|SYSTEM_ALERT_WINDOW|RECEIVE_BOOT_COMPLETED|REQUEST_INSTALL_PACKAGES)|android\.intent\.category\.HOME|AccessibilityService|DeviceAdminReceiver|android\.permission\.INTERNET' "$manifest"; then echo 'BLOCKED: unsafe permission, receiver or Home replacement in manifest' >&2; exit 1; fi
if grep -Eiq 'Runtime\.getRuntime|ProcessBuilder|su -c|pm disable-user|pm uninstall --user|settings put|reboot\(' "$src"; then echo 'BLOCKED: dangerous device or shell operation in Android source' >&2; exit 1; fi
if ! grep -q 'applicationId .com.fik.tv.' app/build.gradle; then echo 'BLOCKED: applicationId changed' >&2; exit 1; fi
if ! grep -q 'onBackPressed\|KEYCODE_BACK' "$src"; then echo 'BLOCKED: no Back escape behavior' >&2; exit 1; fi
echo 'PASS: own-package Android app, no Home override, privileged permissions, startup receivers or dangerous shell operations.'
