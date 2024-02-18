export async function generateMessage(startPrompt) {
  const apiKey = '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';

  try {
      
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: startPrompt,
        max_tokens: 400
      })
    });

    const data = await response.json();
    const AIResponse = data.choices;
    return AIResponse;
  } 
  catch (error) {
    console.error('Error:', error);
    return 'An error occurred while generating the response.';
  }
}
export async function generateTestMessage(prompt) {
  return 'this is test dialogue';
}
