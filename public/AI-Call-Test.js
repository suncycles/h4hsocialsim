const generateMessage = require('./openai'); 

const prompt = [
    {
      role: "user",
      content: "Provide a conversation starter for someone speaking to a child"
    }
  ];

generateMessage(prompt)
  .then((response) => {
    console.log(response);
    // You can use the response as needed
  });