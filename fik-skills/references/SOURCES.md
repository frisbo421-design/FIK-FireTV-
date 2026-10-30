# Curated GitHub skill / implementation references — 2026-10-29
Status means **reviewed as a reference**, not installed or executed from third-party code.

| Reference | Mechanism used by FIK TV | Boundary |
|---|---|---|
| https://github.com/ehmo/platform-design-skills/tree/main/skills/tvos | tvOS 10-foot / focus-first / content-first design | Extract principles; no Apple brand or copyrighted media copied |
| https://github.com/DevelopersCoffee/10-foot-design/tree/main/skills/android-tv-design | Android TV safe areas, legibility, D-pad focus | Platform-independent guidance; adjust to real hardware |
| https://github.com/ykswang/apple-hig-skill | Apple HIG structured routing and focus patterns | Read relevant tvOS docs, not the complete corpus |
| https://github.com/android/skills/tree/main/profilers/android-profiler | Performance evidence, startup, frame timeline, memory pressure | Requires adb/dev tooling; don't infer measurements |
| https://github.com/android/skills/tree/main/tv/leanback-to-compose-tv-migration | FocusRequester + native TV composition patterns | Consider only on an approved native Compose migration; current UI uses WebView |
| https://github.com/iFan6oy/tv-focus-navigation-kit | Focus restoration, nav zones and scroll-race avoidance | Analyze algorithms; don't blindly transplant Compose code |
| https://github.com/android/tv-samples | Official Android TV focus and UI examples + benchmarks | Gradle samples larger than current minimal WebView build |
| https://github.com/paisanos-io/tv-makeover | TV diagnosis and rollback-first agent skill | Do NOT use optional debloat/extreme-performance scripts |
| https://github.com/ohernandezdev/android-tv-tune | Read-only diagnostics, PSS/CPU baseline before optimization | Do NOT run package-disable scripts; their warning notes factory-reset risk |
| https://github.com/toolicious/home-on-fire | Optional accessibility-driven Home redirect on Fire OS 7 | NOT integrated; untested on Fire OS 7.7.1.7; introduces delay/permission risk |
| https://github.com/hamdalaa/tvhome | Apple-style native Compose TV interaction study | Reference, not source copied; check license before reuse |

No GitHub source code was pasted into this project. Project files embody FIK-authored rules extracted from publicly documented patterns.
