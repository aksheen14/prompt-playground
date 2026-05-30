import { Star } from 'lucide-react';

export default function ScoreSelector({ score, onScoreChange, disabled, orientation = 'horizontal' }) {
  const containerClass = orientation === 'vertical' ? 'flex flex-col gap-1' : 'flex gap-1';
  const values = orientation === 'vertical' ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];

  return (
    <div className={containerClass}>
      {values.map(val => (
        <button
          key={val}
          onClick={() => onScoreChange(val)}
          disabled={disabled}
          className={`p-1.5 border rounded cursor-pointer transition-colors ${
            score === val 
              ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[#1a1a2e]' 
              : 'bg-[var(--color-dark-panel)] border-[var(--color-dark-border)] text-[var(--color-dark-text-muted)] hover:border-[var(--color-dark-border-hover)]'
          }`}
        >
          <Star className="w-4 h-4" fill={score >= val ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}
