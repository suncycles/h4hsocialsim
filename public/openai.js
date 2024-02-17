// openai request handling

async function generateMessage(prompt) {

  if (!prompt || typeof prompt !== 'string') {
    return 'Please provide a valid prompt.';
  }

  const apiKey = 'api-key';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{"role": "user", "content": prompt}],
        max_tokens: 50 // Specify any other parameters as needed
      })
    });

    const data = await response.json();
    const AIResponse = data.choices[0].message.content;
    return AIResponse;
  } catch (error) {
    console.error('Error:', error);
    return 'An error occurred while generating the response.';
  }
}

// Export the function
module.exports = generateMessage;
