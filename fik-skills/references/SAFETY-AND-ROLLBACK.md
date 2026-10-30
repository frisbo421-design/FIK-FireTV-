# No-brick deployment procedure
Risk cannot be zero. Standard APK install of an ordinary app has much less systemic risk than root/firmware or package modification.

1. Confirm exact device/Fire OS, space available, same LAN, TV remotely controllable before connecting.
2. Verify no dangerous permissions, HOME handler, accessibility receiver, overlay, auto boot receiver, or commands that mutate system packages.
3. Build APK and run static + browser tests; require an actual real-TV smoke test before offering Home-button redirect.
4. Install only `com.fik.tv` via `adb install -r` after `--confirm` and user permission. Do not enable ADB remotely.
5. Test Back and System Home escape, TV remote and installed app launch. If trouble, uninstall only `com.fik.tv` using user-approved action. Keep Amazon Home intact.
6. Never auto-run `pm disable-user`, `pm uninstall --user 0`, `settings put`, `cmd package set-home-activity`, `reboot`, or vendor debloat.
7. On success, turn off ADB debugging on TV. No hardcoded IPs or tokens in saved scripts/logs.
8. Optional redirect (not bundled): only after the user separately approves and sees exact compatibility, permissions and escape procedure. `home-on-fire` notes an app-switch lock on Fire OS 7 and lacks direct verification for user's Fire OS 7.7.1.7.
