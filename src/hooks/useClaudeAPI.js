import { useState } from 'react';
import { callAnthropic } from '../utils/claude';

export function useClaudeAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const execute = async (apiKey, model, systemPrompt, userMessage) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await callAnthropic(apiKey, model, systemPrompt, userMessage);
      setResponse(res);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error, response, setResponse, setError };
}
