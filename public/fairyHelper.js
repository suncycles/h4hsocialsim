// Creates the helpful/guiding message displayed by the fairy
import {generateMessage} from '/openai.js';

export async function fairySentence(AIResponse) {
    try {
        let promptToAI = "provide a child a brief suggestion (8 words or less) for a possible way to respond to the following message (start by saying something like 'try saying'): " + AIResponse;
        const fairyPrompt = [                // Starting prompt for conversation()
        {
            role: "user",
            content: promptToAI
        }];
        const response = await generateMessage(fairyPrompt);            // Gets AI response from API in openai.js
        const provSentence = response[0].message.content;
        console.count("provsentence inside fairyhelper:"+provSentence);
        return provSentence;
    }
    catch (error) {
        console.error("Error:", error);
    }
}