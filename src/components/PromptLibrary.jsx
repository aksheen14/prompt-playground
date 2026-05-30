import { useState } from 'react';
import { Save, Trash2, X } from 'lucide-react';
import { usePromptLibrary } from '../hooks/usePromptLibrary';

export default function PromptLibrary({ mode, onLoadPrompt, currentPromptSingle, currentPromptBatch, currentPromptA, currentPromptB }) {
  const { prompts, addPrompt, deletePrompt, clearLibrary, error } = usePromptLibrary();
  
  // Save Modal State
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveTarget, setSaveTarget] = useState('a'); // 'a', 'b', 'single', or 'batch'

  // Load Modal State
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [promptToLoad, setPromptToLoad] = useState(null);
  const [loadTarget, setLoadTarget] = useState('a'); // 'a', 'b', 'both'

  const handleSave = () => {
    if (!saveName.trim()) return;
    
    let contentToSave = '';
    if (mode === 'single') contentToSave = currentPromptSingle;
    else if (mode === 'batch') contentToSave = currentPromptBatch;
    else if (saveTarget === 'a') contentToSave = currentPromptA;
    else contentToSave = currentPromptB;

    addPrompt(saveName.trim(), contentToSave);
    setShowSaveModal(false);
    setSaveName('');
  };

  const handleLoadClick = (prompt) => {
    if (mode === 'single' || mode === 'batch') {
      onLoadPrompt(mode, prompt.content);
    } else {
      setPromptToLoad(prompt);
      setShowLoadModal(true);
    }
  };

  const confirmLoad = () => {
    if (promptToLoad) {
      if (loadTarget === 'both') {
        onLoadPrompt('a', promptToLoad.content);
        onLoadPrompt('b', promptToLoad.content);
      } else {
        onLoadPrompt(loadTarget, promptToLoad.content);
      }
    }
    setShowLoadModal(false);
    setPromptToLoad(null);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all saved prompts?")) {
      clearLibrary();
    }
  };

  return (
    <>
      <aside className="bg-[var(--color-dark-panel)] border border-[var(--color-dark-border)] rounded-md overflow-hidden flex flex-col h-full max-h-[10.5rem]">
        <div className="p-3 border-b border-[var(--color-dark-border)] bg-[#1e1e34]">
          <span className="font-semibold text-sm">Prompt Library ({prompts.length})</span>
        </div>

        <div className="p-2 flex gap-2 border-b border-[var(--color-dark-border)]">
          <button 
            onClick={() => {
              if (mode === 'ab') setSaveTarget('a');
              setShowSaveModal(true);
            }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium bg-[var(--color-primary)] text-[#1a1a2e] rounded hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <Save size={14} /> Save Current
          </button>
          <button 
            onClick={handleClearAll}
            className="px-2 py-1.5 text-xs font-medium text-[var(--color-dark-text-muted)] border border-[var(--color-dark-border)] rounded hover:bg-[#2e2e48] transition-colors"
            title="Clear All"
          >
            Clear
          </button>
        </div>

        {error && <div className="p-2 text-xs text-[var(--color-error)]">{error}</div>}

        <ul className="overflow-y-auto flex-1 p-2 space-y-1">
          {prompts.map(p => (
            <li key={p.id} className="group flex items-center justify-between p-2 hover:bg-[#2e2e48] rounded cursor-pointer border-b border-[var(--color-dark-border)] last:border-0" onClick={() => handleLoadClick(p)}>
              <div className="overflow-hidden flex-1">
                <div className="text-sm font-medium text-[var(--color-dark-text)] truncate" title={p.name}>{p.name}</div>
                <div className="text-xs text-[var(--color-dark-text-dim)] truncate" title={p.content}>{p.content}</div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deletePrompt(p.id); }}
                className="p-1.5 text-[var(--color-error)] opacity-0 group-hover:opacity-100 hover:bg-[#3a2a2a] rounded transition-opacity"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-dark-panel)] border border-[var(--color-dark-border)] rounded-lg p-5 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[var(--color-dark-text)]">Save Prompt</h3>
              <button onClick={() => setShowSaveModal(false)} className="text-[var(--color-dark-text-muted)] hover:text-white"><X size={18} /></button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-dark-text-muted)] mb-1">Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Expert Coder" 
                value={saveName} 
                onChange={e => setSaveName(e.target.value)} 
                autoFocus
              />
            </div>
            {mode === 'ab' && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-[var(--color-dark-text-muted)] mb-1">Save from</label>
                <select className="input-field" value={saveTarget} onChange={e => setSaveTarget(e.target.value)}>
                  <option value="a">Prompt A</option>
                  <option value="b">Prompt B</option>
                </select>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 text-sm border border-[var(--color-dark-border)] rounded hover:bg-[#2e2e48]">Cancel</button>
              <button onClick={handleSave} disabled={!saveName.trim()} className="btn-primary py-2 px-4 text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal (A/B mode only) */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-dark-panel)] border border-[var(--color-dark-border)] rounded-lg p-5 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[var(--color-dark-text)]">Load "{promptToLoad?.name}"</h3>
              <button onClick={() => setShowLoadModal(false)} className="text-[var(--color-dark-text-muted)] hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-xs text-[var(--color-dark-text-dim)] mb-4 line-clamp-3">{promptToLoad?.content}</p>
            <div className="mb-5">
              <label className="block text-sm font-medium text-[var(--color-dark-text-muted)] mb-1">Load into</label>
              <select className="input-field" value={loadTarget} onChange={e => setLoadTarget(e.target.value)}>
                <option value="a">Prompt A</option>
                <option value="b">Prompt B</option>
                <option value="both">Both A and B</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowLoadModal(false)} className="px-4 py-2 text-sm border border-[var(--color-dark-border)] rounded hover:bg-[#2e2e48]">Cancel</button>
              <button onClick={confirmLoad} className="btn-primary py-2 px-4 text-sm">Load</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
