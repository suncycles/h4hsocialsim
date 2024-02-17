const generateChatResponse = require('./openai'); 

const prompt = 'Start a conversation with a boy';

generateChatResponse(prompt)
  .then((response) => {
    console.log('Generated message:', response);
    // You can use the response as needed
  });