export default function ModeToggle({ mode, setMode }) {
  const modes = [
    { id: 'single', label: 'Single Prompt' },
    { id: 'ab', label: 'A/B Compare' },
    { id: 'batch', label: 'Batch Eval' },
  ];

  return (
    <div className="flex w-fit mb-5 border border-[var(--color-dark-border)] rounded-md overflow-hidden bg-[var(--color-dark-panel)]">
      {modes.map(m => (
        <button
          key={m.id}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mode === m.id 
              ? 'bg-[var(--color-primary)] text-[#1a1a2e]' 
              : 'text-[var(--color-dark-text-muted)] hover:bg-[#2e2e48]'
          }`}
          onClick={() => setMode(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
