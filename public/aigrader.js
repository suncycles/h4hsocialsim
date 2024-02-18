// Called by GraderCall.js to grade user responses
async function generateGrade(sentToGrade) {
    const apiKey = process.env.OPENAI_API_KEY;          // Key is saved locally
  
    try {
        
      const response = await fetch('https://api.openai.com/v1/chat/completions', {              // Provides url address of API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: {role: "user", content: sentToGrade},                  // Provides input parameter of conversation
          max_tokens: 50
        })
      });
  
      const data = await response.json();
      const AIGrades = data.choices[0].message.content;                 // Returns only the desired paragraph
      return AIGrades;
    } 
    catch (error) {
      console.error('Error:', error);
      return 'An error occurred while generating the response.';
    }
  }
  export async function generateGrade(sentToGrade) {
    return 'this is test dialogue';
  }
  