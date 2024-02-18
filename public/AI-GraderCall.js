// Combines user and AI responses and provides them to API in aigrader.js
import {generateGrade} from '/aigrader.js';

async function grader(AIArray, userArray) {
    // Specifies desired response from openAI API
    let improvementPrompt = "I will provide a list of: a brief set of provided sentences, followed by a response to that sentence. Grade the evenly-ordered set of sentences from 1 to 10 based on social appropriateness.\n";
    let i = 0;
    let arrayLen = userArray.length; 
    for (i; i < arrayLen; i++) {            // Combines all sentences in arrays for one API call
        improvementPrompt = improvementPrompt + "This was a provided sentence #" + i + ": " + AIArray[i];
        improvementPrompt = improvementPrompt + ".\nThis was my response: " + userArray[i] + ".\n\n";
    }
    const aiComments = await generateGrade(improvementPrompt);          // Calls API with combined string
    return aiComments;                                                  // Returns paragraph describing grades
}

let userArray = ["Im good. I love trains!", "the locomotive because it is fast"];           // TEST INPUT - DELETE
let AIArray = ["Hi how are you?", "whats your favorite train", "thats my favorite too!"];
grader(AIArray, userArray);