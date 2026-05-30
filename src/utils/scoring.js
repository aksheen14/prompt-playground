export const calculateAverages = (history) => {
  const scoredRuns = history.filter(r => r.scoreA !== null && r.scoreB !== null);
  if (scoredRuns.length === 0) return { avgA: 0, avgB: 0, overallWinner: null, scoredCount: 0 };

  const totalA = scoredRuns.reduce((sum, r) => sum + r.scoreA, 0);
  const totalB = scoredRuns.reduce((sum, r) => sum + r.scoreB, 0);

  const avgA = (totalA / scoredRuns.length).toFixed(1);
  const avgB = (totalB / scoredRuns.length).toFixed(1);

  let overallWinner = "Tie";
  if (parseFloat(avgA) > parseFloat(avgB)) overallWinner = "A";
  else if (parseFloat(avgB) > parseFloat(avgA)) overallWinner = "B";

  return { avgA, avgB, overallWinner, scoredCount: scoredRuns.length };
};
