// Combines user and AI responses and provides them to API in aigrader.js
import {generateGrade} from '/aigrader.js';

export async function grader(AIArray, userArray) {
    // Specifies desired response from openAI API
    let improvementPrompt = "I will provide a list of: a brief set of provided sentences, followed by a response to that sentence. Grade the sentences from 1 to 10 based on social appropriateness with a brief explaination for each.\n";
    let intGradesPrompt = "I will provide a list of: a brief set of provided sentences, followed by a response to that sentence. Provide only a list of grades of the evenly-ordered set of sentences from 1 to 10 based on social appropriateness"
    let defaultString = "";

    let i = 0;
    let arrayLen = userArray.length; 
    for (i; i < arrayLen; i++) {            // Combines all sentences in arrays for one API call
        defaultString = defaultString + "This was a provided sentence #" + i + ": " + AIArray[i];
        defaultString = defaultString + ".\nThis was my response: " + userArray[i] + ".\n\n";
    }
    improvementPrompt = improvementPrompt + defaultString;
    intGradesPrompt = intGradesPrompt + defaultString;
    const aiIntGrades = await generateGrade(intGradesPrompt);          // Calls API with combined string
    const aiComments = await generateGrade(improvementPrompt);         // Calls API with combined string
    return [aiComments, aiIntGrades];                                  // Returns paragraph describing grades
}

let userArray = ["Im good. I love trains!", "the locomotive because it is fast"];           // TEST INPUT - DELETE
let AIArray = ["Hi how are you?", "whats your favorite train", "thats my favorite too!"];
grader(AIArray, userArray);