type SettingsCardProps = {
  label: string;
  value: string | number;
  onClick: () => void;
};

export function SettingsCard({ label, value, onClick }: SettingsCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center bg-neutral-800 rounded-xl px-4 py-3"
    >
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </button>
  );
}
