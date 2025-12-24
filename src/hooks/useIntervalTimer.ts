import { useEffect, useRef, useState } from "react";

export const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export type Exercise = {
  id: string;
  name: string;
};

export type WorkoutConfig = {
  workTime: number;
  restTime: number;
  roundReset: number;
  rounds: number;
  exercises: Exercise[];
};

export function useIntervalTimer(config: WorkoutConfig) {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<
    "idle" | "work" | "rest" | "reset" | "finished"
  >("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [round, setRound] = useState(1);

  const intervalRef = useRef<number | null>(null);

  const start = () => {
    setIsRunning(true);
    setPhase("work");
    setRound(1);
    setExerciseIndex(0);
    setTimeLeft(config.workTime);
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t > 1) return t - 1;

        if (phase === "work") {
          if (exerciseIndex < config.exercises.length - 1) {
            setPhase("rest");
            return config.restTime;
          } else {
            setPhase("reset");
            return config.roundReset;
          }
        }

        if (phase === "rest") {
          setExerciseIndex((i) => i + 1);
          setPhase("work");
          return config.workTime;
        }

        if (phase === "reset") {
          if (round < config.rounds) {
            setRound((r) => r + 1);
            setExerciseIndex(0);
            setPhase("work");
            return config.workTime;
          } else {
            setIsRunning(false);
            setPhase("finished");
            return 0;
          }
        }

        return 0;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, phase, exerciseIndex, round, config]);

  return {
    isRunning,
    phase,
    timeLeft,
    exerciseIndex,
    round,
    start,
  };
}
