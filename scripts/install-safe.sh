#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -lt 2 ]; then
  echo 'Usage: bash scripts/install-safe.sh <TV-IP:5555> <app-debug.apk> [--confirm]' >&2
  echo 'First run is preview-only. Does not connect or install without --confirm.' >&2; exit 2
fi
serial="$1"; apk="$2"
[ -f "$apk" ] || { echo "APK not found: $apk" >&2; exit 2; }
if [ "${3:-}" != '--confirm' ]; then
  echo "PLAN ONLY: adb -s <TV> install -r <APK>; launch com.fik.tv/.MainActivity"
  echo 'Will not modify Amazon Home, system settings or any other installed package.'
  exit 0
fi
command -v adb >/dev/null || { echo 'ADB not installed.' >&2; exit 2; }
[[ "$serial" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:5555$ ]] || { echo 'Use explicit TV IPv4 address with :5555' >&2; exit 2; }
read -r -p 'Confirm the TV owner approved installation of this APK [type INSTALL]: ' ok
[ "$ok" = INSTALL ] || { echo 'Cancelled'; exit 0; }
adb connect "$serial"
sdk="$(adb -s "$serial" shell getprop ro.build.version.sdk | tr -d '\r')"
[[ "$sdk" =~ ^[0-9]+$ ]] && [ "$sdk" -ge 28 ] || { echo 'Not a supported Android API 28+ device'; exit 1; }
adb -s "$serial" install -r "$apk"
adb -s "$serial" shell am start -n com.fik.tv/.MainActivity
echo 'FIK launched. Verify Back -> System Home, then disable ADB debugging on the TV after testing.'
