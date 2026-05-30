export const callAnthropic = async (apiKey, model, systemPrompt, userMessage) => {
  if (!apiKey) throw new Error("Please enter your API Key.");
  
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "API Error");
  }

  return {
    text: data.content[0].text,
    tokens: {
      input: data.usage.input_tokens,
      output: data.usage.output_tokens
    }
  };
};

export const callAnthropicJudge = async (apiKey, model, judgeCriteria, userMessage, responseA, responseB) => {
  const systemPrompt = `You are an expert AI evaluator.
Your task is to judge two different AI responses to the same user message.
Judge criteria: ${judgeCriteria}

You must output your evaluation strictly in XML format as follows:
<evaluation>
  <scoreA>[integer between 1 and 5]</scoreA>
  <scoreB>[integer between 1 and 5]</scoreB>
  <explanation>[detailed reasoning for your scores]</explanation>
</evaluation>

Do not include any other text outside the XML block.`;

  const userPrompt = `User Message:
${userMessage}

Response A:
${responseA}

Response B:
${responseB}`;

  const res = await callAnthropic(apiKey, model, systemPrompt, userPrompt);
  
  const text = res.text;
  
  // Parse XML using basic regex
  const scoreAMatch = text.match(/<scoreA>(.*?)<\/scoreA>/s);
  const scoreBMatch = text.match(/<scoreB>(.*?)<\/scoreB>/s);
  const explanationMatch = text.match(/<explanation>(.*?)<\/explanation>/s);
  
  const scoreA = scoreAMatch ? parseInt(scoreAMatch[1].trim(), 10) : 3;
  const scoreB = scoreBMatch ? parseInt(scoreBMatch[1].trim(), 10) : 3;
  const explanation = explanationMatch ? explanationMatch[1].trim() : "No explanation provided.";

  return {
    scoreA: isNaN(scoreA) ? 3 : scoreA,
    scoreB: isNaN(scoreB) ? 3 : scoreB,
    explanation
  };
};
