const generateMessage = require('./openai');

const startPrompt = [ // Starting prompt
    {
        role: "user",
        content: "Provide a conversation starter for someone speaking to a child"
    }
];
let converLen = 0;
const maxConverLen = 4; // Determines conversation length

const allAISent = [];
const allUserSent = [];

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

            const userSent = "I love trains. What about you?"; // *Actual user response goes here*
            allUserSent[converLen] = userSent;

            const newUserSent = { // Adds user sentence to prompt JSON to remember conversation
                role: "user",
                content: userSent
            };

            startPrompt.push(newAssistSent);
            startPrompt.push(newUserSent);

            converLen++;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

conversation();