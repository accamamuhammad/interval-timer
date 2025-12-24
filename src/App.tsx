import { useEffect, useRef, useState } from "react";
import { useIntervalTimer, formatTime } from "./hooks/useIntervalTimer";
import { TimerDisplay } from "./components/TimerDisplay";
import { SettingsCard } from "./components/SettingsCard";
import { FullscreenModal } from "./components/FullscreenModal";

interface Exercise {
  id: string;
  name: string;
}

interface Config {
  workTime: number;
  restTime: number;
  roundReset: number;
  rounds: number;
  exercises: Exercise[];
}

const DEFAULT_CONFIG: Config = {
  workTime: 30,
  restTime: 30,
  roundReset: 30,
  rounds: 3,
  exercises: [{ id: crypto.randomUUID(), name: "Exercise 1" }],
};

const TimeAdjuster = ({ value, onInc, onDec }: { value: number; onInc: () => void; onDec: () => void }) => (
  <div className="flex items-center gap-10">
    <button className="text-5xl" onClick={onDec}>−</button>
    <div className="text-6xl font-bold">{formatTime(value)}</div>
    <button className="text-5xl" onClick={onInc}>+</button>
  </div>
);

export default function App() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem("interval-config");
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const { isRunning, phase, timeLeft, start } = useIntervalTimer(config);

  const beepRef = useRef<HTMLAudioElement | null>(null);
  const [activeModal, setActiveModal] = useState<"work" | "rest" | "reset" | "rounds" | null>(null);

  useEffect(() => {
    localStorage.setItem("interval-config", JSON.stringify(config));
  }, [config]);


const unlockAudio = () => {
  const audio = beepRef.current;
  if (!audio) return;
  audio.volume = 0;
  audio.play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1;
    })
    .catch(() => {});
};

  const handleStart = () => {
    unlockAudio();
    start();
  };

  const totalTime = (() => {
    const ex = config.exercises.length;
    if (!ex) return 0;
    const perRound =
      config.workTime * ex +
      config.restTime * (ex - 1) +
      config.roundReset;
    return perRound * config.rounds;
  })();

  const bg = {
    idle: "from-pink-500 to-red-500",
    work: "bg-emerald-500",
    rest: "bg-rose-500",
    reset: "bg-amber-500",
    finished: "bg-gray-800",
  }[phase];

  const adjustTime = (key: "workTime" | "restTime" | "roundReset" | "rounds", delta: number) => {
    setConfig((c: { [x: string]: number; }) => ({
      ...c,
      [key]: Math.max(0, c[key] + delta),
    }));
  };

  return (
    <div className={`min-h-screen text-white ${phase === "idle" ? `bg-linear-to-b ${bg}` : bg}`}>
      <audio ref={beepRef} src="/beep.mp3" preload="auto" />

      <TimerDisplay
        label="Interval Timer"
        time={isRunning ? formatTime(timeLeft) : formatTime(totalTime)}
      />

      {!isRunning && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2">
          <button
            onClick={handleStart}
            className="w-20 h-20 rounded-full bg-black/70 flex items-center justify-center text-2xl"
          >
            ▶
          </button>
        </div>
      )}

      <div className="fixed bottom-0 w-full bg-neutral-900 rounded-t-3xl p-4 space-y-3">
        <SettingsCard label="Work" value={formatTime(config.workTime)} onClick={() => setActiveModal("work")} />
        <SettingsCard label="Rest" value={formatTime(config.restTime)} onClick={() => setActiveModal("rest")} />
        <SettingsCard label="Exercises" value={config.exercises.length} onClick={function (): void {
          throw new Error("Function not implemented.");
        } } />
        <SettingsCard label="Rounds" value={`${config.rounds}x`} onClick={() => setActiveModal("rounds")} />
        <SettingsCard label="Round Reset" value={formatTime(config.roundReset)} onClick={() => setActiveModal("reset")} />
      </div>

      {/* Work Modal */}
      <FullscreenModal
        open={activeModal === "work"}
        title="Work Time"
        color="bg-emerald-500"
        onClose={() => setActiveModal(null)}
      >
        <TimeAdjuster
          value={config.workTime}
          onInc={() => adjustTime("workTime", 5)}
          onDec={() => adjustTime("workTime", -5)}
        />
      </FullscreenModal>

      {/* Rest Modal */}
      <FullscreenModal
        open={activeModal === "rest"}
        title="Rest Time"
        color="bg-rose-500"
        onClose={() => setActiveModal(null)}
      >
        <TimeAdjuster
          value={config.restTime}
          onInc={() => adjustTime("restTime", 5)}
          onDec={() => adjustTime("restTime", -5)}
        />
      </FullscreenModal>

      {/* Reset Modal */}
      <FullscreenModal
        open={activeModal === "reset"}
        title="Round Reset"
        color="bg-amber-500"
        onClose={() => setActiveModal(null)}
      >
        <TimeAdjuster
          value={config.roundReset}
          onInc={() => adjustTime("roundReset", 5)}
          onDec={() => adjustTime("roundReset", -5)}
        />
      </FullscreenModal>

      {/* Rounds Modal */}
      <FullscreenModal
        open={activeModal === "rounds"}
        title="Rounds"
        color="bg-indigo-600"
        onClose={() => setActiveModal(null)}
      >
        <div className="flex items-center gap-10">
          <button
            className="text-5xl"
            onClick={() => setConfig((c: Config) => ({ ...c, rounds: Math.max(1, c.rounds - 1) }))}
          >−</button>
          <div className="text-6xl font-bold">{config.rounds}</div>
          <button
            className="text-5xl"
            onClick={() => setConfig((c: Config) => ({ ...c, rounds: c.rounds + 1 }))}
          >+</button>
        </div>
      </FullscreenModal>
    </div>
  );
}
