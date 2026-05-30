import { useState, useEffect } from 'react';

export default function APIKeyInput({ onKeyChange, onModelChange }) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('claude-sonnet-4-6');

  useEffect(() => {
    const savedKey = localStorage.getItem('claudeApiKey');
    if (savedKey) {
      setApiKey(savedKey);
      onKeyChange(savedKey);
    }
    const savedModel = localStorage.getItem('claudeModel');
    if (savedModel) {
      setModel(savedModel);
      if (onModelChange) onModelChange(savedModel);
    } else {
      if (onModelChange) onModelChange(model);
    }
  }, [onKeyChange, onModelChange]);

  const handleKeyChange = (e) => {
    const val = e.target.value;
    setApiKey(val);
    localStorage.setItem('claudeApiKey', val);
    onKeyChange(val);
  };

  const handleModelChange = (e) => {
    const val = e.target.value;
    setModel(val);
    localStorage.setItem('claudeModel', val);
    if (onModelChange) onModelChange(val);
  };

  return (
    <div className="mb-4 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <label htmlFor="api-key" className="block text-sm font-medium text-[var(--color-dark-text-muted)] mb-1">API Key</label>
        <input
          type="password"
          id="api-key"
          className="input-field"
          value={apiKey}
          onChange={handleKeyChange}
          placeholder="sk-ant-..."
          autoComplete="off"
        />
        <p className="text-xs text-[var(--color-dark-text-dim)] mt-1">Your API key never leaves your browser.</p>
      </div>
      <div className="flex-1">
        <label htmlFor="model" className="block text-sm font-medium text-[var(--color-dark-text-muted)] mb-1">Model Name</label>
        <input
          type="text"
          id="model"
          className="input-field"
          value={model}
          onChange={handleModelChange}
          placeholder="claude-sonnet-4-6"
          autoComplete="off"
        />
        <p className="text-xs text-[var(--color-dark-text-dim)] mt-1">Editable in case your account has model restrictions.</p>
      </div>
    </div>
  );
}
