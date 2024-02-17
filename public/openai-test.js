const apiKey = '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';
const prompt = 'Start a conversation with a boy';

fetch('https://api.openai.com/v1/chat/completions', {
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
})
.then(response => response.json())
.then(data => {
  const AIResponse = data.choices[0].message.content
  console.log("Generated message", AIResponse);
})
.catch(error => {
  console.error('Error:', error);
});
