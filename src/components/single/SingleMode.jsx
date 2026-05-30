import { useClaudeAPI } from '../../hooks/useClaudeAPI';
import { Loader2 } from 'lucide-react';

export default function SingleMode({ apiKey, apiModel, userMessage, systemPrompt, setSystemPrompt }) {
  const { execute, isLoading, error, response } = useClaudeAPI();

  const handleRun = () => {
    if (!userMessage) return;
    execute(apiKey, apiModel, systemPrompt, userMessage).catch(() => {});
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-[var(--color-dark-text-muted)] mb-1">System Prompt</label>
        <textarea
          className="input-field system-textarea"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a helpful assistant..."
        />
      </div>

      <div className="text-center my-2">
        <button 
          onClick={handleRun} 
          disabled={isLoading || !userMessage || !apiKey}
          className="btn-primary w-32"
        >
          Run
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium text-[var(--color-dark-text-muted)]">Response</label>
          {isLoading && <span className="flex items-center text-sm text-[var(--color-dark-text-dim)] gap-1"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</span>}
        </div>
        
        <div className={`p-4 min-h-[4rem] bg-[var(--color-dark-panel)] border rounded-md whitespace-pre-wrap font-mono text-sm ${error ? 'border-[var(--color-error-border)] text-[var(--color-error)]' : 'border-[var(--color-dark-border)]'}`}>
          {error ? `Error: ${error}` : (response?.text || "Response will appear here.")}
        </div>
        
        {response?.tokens && (
          <div className="mt-2 text-xs text-[var(--color-dark-text-dim)]">
            Tokens: In {response.tokens.input} | Out {response.tokens.output}
          </div>
        )}
      </div>
    </div>
  );
}
