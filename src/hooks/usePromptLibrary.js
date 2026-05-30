import { useState, useEffect, useCallback } from 'react';
import { defaultPrompts } from '../utils/defaultPrompts';

const STORAGE_KEY = 'promptLibrary';

export function usePromptLibrary() {
  const [prompts, setPrompts] = useState([]);
  const [error, setError] = useState(null);

  // Initialize from localStorage or default
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPrompts(parsed);
          return;
        }
      }
      
      // If no valid stored data, seed with defaults
      setPrompts(defaultPrompts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPrompts));
    } catch (err) {
      setError("Could not read from local storage. Using defaults.");
      setPrompts(defaultPrompts);
    }
  }, []);

  const savePrompts = useCallback((newPrompts) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrompts));
      setPrompts(newPrompts);
      setError(null);
    } catch (err) {
      setError("Could not save to local storage.");
      setPrompts(newPrompts);
    }
  }, []);

  const addPrompt = useCallback((name, content) => {
    const newPrompt = {
      id: Date.now(),
      name,
      content,
      createdAt: new Date().toISOString().split('T')[0]
    };
    savePrompts([...prompts, newPrompt]);
  }, [prompts, savePrompts]);

  const deletePrompt = useCallback((id) => {
    savePrompts(prompts.filter(p => p.id !== id));
  }, [prompts, savePrompts]);

  const clearLibrary = useCallback(() => {
    savePrompts([]);
  }, [savePrompts]);

  return { prompts, addPrompt, deletePrompt, clearLibrary, error };
}
