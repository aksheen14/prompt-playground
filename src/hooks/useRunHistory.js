import { useState } from 'react';

export function useRunHistory() {
  const [runHistory, setRunHistory] = useState([]);

  const addRun = (run) => {
    setRunHistory(prev => [run, ...prev]);
  };

  const updateRunScore = (id, scoreA, scoreB) => {
    setRunHistory(prev => prev.map(run => {
      if (run.id === id) {
        let winner = "Tie";
        if (scoreA > scoreB) winner = "A";
        else if (scoreB > scoreA) winner = "B";
        
        return { ...run, scoreA, scoreB, winner };
      }
      return run;
    }));
  };

  return { runHistory, addRun, updateRunScore };
}
