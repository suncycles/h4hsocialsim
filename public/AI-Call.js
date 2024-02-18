const generateMessage = require('./openai');

const startPrompt = [ // Starting prompt
    {
        role: "user",
        content: "Provide a conversation starter for someone speaking to a child"
    }
];
let converLen = 0;
const maxConverLen = 4; // Determines conversation length

const allAISent = [];                                    // Stores all AI sentences
const allUserSent = [];                                  // Stores all User sentences    

async function conversation() {
    try {
        while (converLen < maxConverLen) {
            const response = await generateMessage(startPrompt);
            const provSentence = response[0].message.content;
            allAISent[converLen] = provSentence;

            const newAssistSent = { // Adds AI sentence to prompt JSON to remember conversation
                role: "assistant",
                content: provSentence
            };

            const userSent = "I love trains. What about you?"; // *Actual user response goes here* DELETE!!!!
            allUserSent[converLen] = userSent;

            const newUserSent = { // Adds user sentence to prompt JSON to remember conversation
                role: "user",
                content: userSent
            };

            startPrompt.push(newAssistSent);
            startPrompt.push(newUserSent);                      // Combines all sentences for openai.js call

            converLen++;
        }
    } catch (error) {
        console.error("Error:", error);
    }
    return [allAISent, allUserSent]; // Access with const [array1, array2] = conversation();
}

conversation();