import { calculateAverages } from '../utils/scoring';

export default function RunHistory({ history }) {
  if (history.length === 0) return null;

  const { avgA, avgB, overallWinner, scoredCount } = calculateAverages(history);

  return (
    <div className="mt-8 p-5 bg-[var(--color-dark-panel)] border border-[var(--color-dark-border)] rounded-lg">
      <h2 className="text-lg font-semibold text-[var(--color-dark-text-muted)] mb-4">Run History</h2>
      
      {scoredCount === 0 ? (
        <p className="text-sm text-[var(--color-dark-text-dim)]">No scored runs yet.</p>
      ) : (
        <>
          <ul className="divide-y divide-[var(--color-dark-border)] mb-4">
            {history.filter(r => r.scoreA !== null).map((run, i) => (
              <li key={run.id} className="py-3 text-sm">
                <div className="font-medium text-[var(--color-dark-text)] mb-1">
                  Run {history.length - i} — "{run.userMessage.length > 50 ? run.userMessage.substring(0, 50) + '...' : run.userMessage}"
                </div>
                <div className="text-[var(--color-dark-text-dim)] flex gap-4">
                  <span>Prompt A: {run.scoreA}/5</span>
                  <span>Prompt B: {run.scoreB}/5</span>
                  <span className="text-[var(--color-primary-hover)] font-medium">
                    {run.winner === 'Tie' ? 'Tie' : `Winner: ${run.winner} ✅`}
                  </span>
                  {run.aiExplanation && <span className="ml-auto text-[var(--color-primary)] opacity-80 flex items-center gap-1">🤖 AI Scored</span>}
                </div>
                {run.aiExplanation && (
                  <div className="mt-2 p-2 bg-[#1a1a2e] border border-[var(--color-dark-border)] rounded text-xs text-[var(--color-dark-text-muted)] line-clamp-2" title={run.aiExplanation}>
                    {run.aiExplanation}
                  </div>
                )}
              </li>
            ))}
          </ul>
          
          <div className="pt-3 border-t border-[var(--color-dark-border)] text-sm font-medium text-[var(--color-dark-text-muted)]">
            <div className="mb-2">Overall: Prompt A avg {avgA} &nbsp;&nbsp; Prompt B avg {avgB}</div>
            <div className="text-[var(--color-primary-hover)]">
              {overallWinner === 'Tie' ? "It's a tie overall!" : `Prompt ${overallWinner} is winning overall! ✅`}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
