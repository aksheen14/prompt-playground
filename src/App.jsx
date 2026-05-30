import { useState } from 'react';
import APIKeyInput from './components/APIKeyInput';
import ModeToggle from './components/ModeToggle';
import SingleMode from './components/single/SingleMode';
import ABMode from './components/ab/ABMode';
import BatchMode from './components/batch/BatchMode';
import RunHistory from './components/RunHistory';
import PromptLibrary from './components/PromptLibrary';
import { useRunHistory } from './hooks/useRunHistory';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [apiModel, setApiModel] = useState('claude-sonnet-4-6');
  const [userMessage, setUserMessage] = useState('');
  const [mode, setMode] = useState('batch'); // Let's set default to batch to make testing easier
  
  const [sysSingle, setSysSingle] = useState('You are a helpful assistant.');
  const [sysBatch, setSysBatch] = useState('You are a helpful assistant.');
  const [sysA, setSysA] = useState('You are a helpful assistant.');
  const [sysB, setSysB] = useState('You are a concise assistant.');

  const { runHistory, addRun } = useRunHistory();

  const handleLoadPrompt = (target, content) => {
    if (target === 'single') setSysSingle(content);
    else if (target === 'batch') setSysBatch(content);
    else if (target === 'a') setSysA(content);
    else if (target === 'b') setSysB(content);
  };

  return (
    <div className="app-shell">
      <main className="main-content">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-6">
          <div className="flex-1">
            <h1>Prompt Playground</h1>
            <ModeToggle mode={mode} setMode={setMode} />
            <APIKeyInput onKeyChange={setApiKey} onModelChange={setApiModel} />
          </div>

          <div className="md:w-80 flex-shrink-0">
            <PromptLibrary 
              mode={mode} 
              onLoadPrompt={handleLoadPrompt}
              currentPromptSingle={sysSingle}
              currentPromptBatch={sysBatch}
              currentPromptA={sysA}
              currentPromptB={sysB}
            />
          </div>
        </div>

        {/* Bottom Section */}
        {mode !== 'batch' && (
          <div className="field mb-6">
            <label htmlFor="user-message" className="block text-sm font-medium text-[var(--color-dark-text-muted)] mb-1">User Message</label>
            <textarea
              id="user-message"
              className="input-field"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message here..."
            />
          </div>
        )}

        {mode === 'single' && (
          <SingleMode 
            apiKey={apiKey} 
            apiModel={apiModel}
            userMessage={userMessage} 
            systemPrompt={sysSingle}
            setSystemPrompt={setSysSingle}
          />
        )}

        {mode === 'batch' && (
          <BatchMode 
            apiKey={apiKey} 
            apiModel={apiModel}
            systemPrompt={sysBatch}
            setSystemPrompt={setSysBatch}
          />
        )}

        {mode === 'ab' && (
          <div id="compare-panel">
            <ABMode 
              apiKey={apiKey} 
              apiModel={apiModel}
              userMessage={userMessage} 
              onRunComplete={addRun} 
              sysA={sysA}
              setSysA={setSysA}
              sysB={sysB}
              setSysB={setSysB}
            />
            <RunHistory history={runHistory} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
