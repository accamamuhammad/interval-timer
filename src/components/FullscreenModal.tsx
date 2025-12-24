export function FullscreenModal({ open, color, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 text-white ${color}`}>
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onClose} className="text-xl">✕</button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}