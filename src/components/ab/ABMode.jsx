import { useState } from 'react';
import ResponseColumn from './ResponseColumn';
import ScoreSelector from '../ScoreSelector';
import { useClaudeAPI } from '../../hooks/useClaudeAPI';
import { callAnthropicJudge } from '../../utils/claude';
import { Bot, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

export default function ABMode({ apiKey, apiModel, userMessage, onRunComplete, sysA, setSysA, sysB, setSysB }) {
  const apiA = useClaudeAPI();
  const apiB = useClaudeAPI();

  const [pendingScores, setPendingScores] = useState({ a: null, b: null });
  const [showScoring, setShowScoring] = useState(false);
  const [currentRunData, setCurrentRunData] = useState(null);

  // AI Judge State
  const [judgeCriteria, setJudgeCriteria] = useState("Evaluate based on helpfulness, accuracy, and clarity.");
  const [isJudging, setIsJudging] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleRunBoth = async () => {
    if (!userMessage) return;
    
    setShowScoring(false);
    setPendingScores({ a: null, b: null });
    setAiExplanation(null);
    setShowExplanation(false);
    
    // We use Promise.all to execute both requests simultaneously.
    const pA = apiA.execute(apiKey, apiModel, sysA, userMessage);
    const pB = apiB.execute(apiKey, apiModel, sysB, userMessage);
    
    let resA = null, resB = null;
    try {
      const [resultA, resultB] = await Promise.allSettled([pA, pB]);
      
      resA = resultA.status === 'fulfilled' ? resultA.value.text : 'Failed';
      resB = resultB.status === 'fulfilled' ? resultB.value.text : 'Failed';
      
      setCurrentRunData({
        id: Date.now(),
        userMessage,
        promptA: sysA,
        promptB: sysB,
        responseA: resA,
        responseB: resB,
        scoreA: null,
        scoreB: null,
        timestamp: new Date().toISOString()
      });
      setShowScoring(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAIJudge = async () => {
    setIsJudging(true);
    setAiExplanation(null);
    setShowExplanation(false);
    try {
      const res = await callAnthropicJudge(apiKey, apiModel, judgeCriteria, userMessage, currentRunData.responseA, currentRunData.responseB);
      setPendingScores({ a: res.scoreA, b: res.scoreB });
      setAiExplanation(res.explanation);
      setShowExplanation(true);
    } catch (err) {
      alert("AI Judge Error: " + err.message);
    } finally {
      setIsJudging(false);
    }
  };

  const isRunning = apiA.isLoading || apiB.isLoading;

  const handleSubmitScore = () => {
    if (currentRunData && pendingScores.a && pendingScores.b) {
      const completedRun = {
        ...currentRunData,
        scoreA: pendingScores.a,
        scoreB: pendingScores.b,
        aiExplanation: aiExplanation // Save explanation if there is one
      };
      
      let winner = "Tie";
      if (completedRun.scoreA > completedRun.scoreB) winner = "A";
      else if (completedRun.scoreB > completedRun.scoreA) winner = "B";
      completedRun.winner = winner;

      onRunComplete(completedRun);
      setShowScoring(false);
      setAiExplanation(null);
    }
  };

  return (
    <div>
      {/* AI Judge Settings */}
      <div className="mb-6 p-4 bg-[var(--color-dark-panel)] border border-[var(--color-dark-border)] rounded-md">
        <label className="block text-sm font-medium text-[var(--color-dark-text-muted)] mb-1">AI Judge Criteria</label>
        <textarea
          className="input-field min-h-[4rem]"
          value={judgeCriteria}
          onChange={(e) => setJudgeCriteria(e.target.value)}
          placeholder="e.g. Judge based on brevity, clarity, and adherence to JSON formatting."
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col">
          <ResponseColumn 
            title="Prompt A" 
            systemPrompt={sysA} setSystemPrompt={setSysA}
            isLoading={apiA.isLoading} error={apiA.error} response={apiA.response}
          />
          {showScoring && (
            <div className="mt-4 pt-3 border-t border-[var(--color-dark-border)]">
              <div className="text-sm text-[var(--color-dark-text-muted)] mb-2">Rate:</div>
              <ScoreSelector score={pendingScores.a} onScoreChange={(val) => setPendingScores(p => ({...p, a: val}))} />
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col">
          <ResponseColumn 
            title="Prompt B" 
            systemPrompt={sysB} setSystemPrompt={setSysB}
            isLoading={apiB.isLoading} error={apiB.error} response={apiB.response}
          />
          {showScoring && (
            <div className="mt-4 pt-3 border-t border-[var(--color-dark-border)]">
              <div className="text-sm text-[var(--color-dark-text-muted)] mb-2">Rate:</div>
              <ScoreSelector score={pendingScores.b} onScoreChange={(val) => setPendingScores(p => ({...p, b: val}))} />
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-8">
        {!showScoring ? (
          <button 
            onClick={handleRunBoth} 
            disabled={isRunning || !userMessage || !apiKey}
            className="btn-primary w-40"
          >
            Run Both
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center items-center gap-4">
              <button 
                onClick={handleAIJudge} 
                disabled={isJudging}
                className="btn-secondary flex items-center gap-2 px-6 py-2 border border-[var(--color-dark-border)] bg-[#2e2e48] rounded hover:bg-[#3e3e58] transition-colors"
              >
                {isJudging ? <Loader2 className="w-4 h-4 animate-spin text-[var(--color-primary)]" /> : <Bot className="w-4 h-4 text-[var(--color-primary)]" />}
                Auto-Score with AI
              </button>
              <button 
                onClick={handleSubmitScore} 
                disabled={!pendingScores.a || !pendingScores.b}
                className="btn-primary w-40"
              >
                Submit Score
              </button>
            </div>

            {aiExplanation && (
              <div className="w-full max-w-2xl mt-2 text-left bg-[#1e1e34] border border-[var(--color-dark-border)] rounded-md overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full p-3 flex justify-between items-center hover:bg-[#252540] transition-colors"
                >
                  <span className="font-semibold text-sm text-[var(--color-dark-text)] flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[var(--color-primary)]" /> AI Judge Reasoning
                  </span>
                  {showExplanation ? <ChevronUp className="w-4 h-4 text-[var(--color-dark-text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-dark-text-muted)]" />}
                </button>
                {showExplanation && (
                  <div className="p-4 border-t border-[var(--color-dark-border)] text-sm text-[var(--color-dark-text-muted)] whitespace-pre-wrap leading-relaxed bg-[#1a1a2e]">
                    {aiExplanation}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
