export async function generateMessage(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: prompt,
        max_tokens: 50
      })
    });

    const data = await response.json();
    const AIResponse = data.choices;
    return AIResponse;
  } catch (error) {
    console.error('Error:', error);
    return 'An error occurred while generating the response.';
  }
}