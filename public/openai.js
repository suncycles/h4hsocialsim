export async function generateMessage(startPrompt) {
  const apiKey = 'API_KEY';

  try {
      
    const response = await fetch('https://api.openai.com/v1/chat/completions', {        // Defines URL of API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({        // Combines initial values together, including the startPrompt JSON
        model: 'gpt-3.5-turbo',
        messages: startPrompt,
        max_tokens: 400             // Max tokens for a single message (tokens refer to output message size)
      })
    });

    const data = await response.json();       // Waits for and returns output JSON
    const AIResponse = data.choices;
    return AIResponse;
  } 
  catch (error) {
    console.error('Error:', error);
    return 'An error occurred while generating the response.';
  }
}
