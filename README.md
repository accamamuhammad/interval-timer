# Interval Timer

src/
├─ hooks/
│  └─ useIntervalTimer.js      ← core timer engine (state machine)
│
├─ components/
│  ├─ TimerDisplay.jsx         ← big timer (14:30 style)
│  ├─ SettingsCard.jsx         ← rows like Work / Rest / Rounds
│  └─ FullscreenModal.jsx      ← reusable colored modal
│
└─ App.jsx                     ← layout + config + storage
