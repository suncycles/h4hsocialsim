const apiKey = 'my_key';

async function generateMessage(prompt) {

  if (!prompt || typeof prompt !== 'string') {
    return 'Please provide a valid prompt.';
  }

  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{"role": "user", "content": prompt}],
    max_tokens: 50
  })
  })
    .then(response => response.json())
    .then(data => {
      const AIResponse = data.choices[0].message.content
      console.log("Generated message: ", AIResponse);
  })
    .catch(error => {
      console.error('Error:', error);
  });
}

module.exports = generateMessage;
