type TimerDisplayProps = {
  label: string;
  time: string | number;
};

export function TimerDisplay({ label, time }: TimerDisplayProps) {
  return (
    <div className="pt-16 text-center">
      <h1 className="text-sm opacity-70">{label}</h1>
      <div className="text-6xl font-bold mt-6">{time}</div>
    </div>
  );
}
