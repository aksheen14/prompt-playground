import { Loader2 } from 'lucide-react';

export default function ResponseColumn({ 
  title, 
  systemPrompt, 
  setSystemPrompt, 
  isLoading, 
  error, 
  response 
}) {
  return (
    <div className="flex-1 min-w-0">
      <h2 className="text-base font-semibold text-[var(--color-dark-text-muted)] mb-3">{title}</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--color-dark-text-muted)] mb-1">System Prompt</label>
        <textarea
          className="input-field system-textarea"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a helpful assistant..."
        />
      </div>

      <div className="flex items-center gap-2 mb-1 h-6">
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
  );
}
