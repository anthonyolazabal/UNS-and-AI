const { VertexAI, HarmCategory, HarmBlockThreshold } = require('@google-cloud/vertexai');
require('dotenv').config();

// Constants for project and location should be defined at the top level.
const PROJECT_ID = process.env.PROJECT_ID;
const LOCATION = process.env.LOCATION;

// Initialize Vertex AI with the necessary project and location information once.
const vertexAiOptions = { project: PROJECT_ID, location: LOCATION };
const vertex_ai = new VertexAI(vertexAiOptions);

// Define model names as constants to avoid magic strings and improve readability.
const GEMINI_PRO_MODEL_NAME = process.env.GEMINI_PRO_MODEL_NAME

// Safety settings can be moved outside of the model instantiation, 
// if they are static and reused across multiple instances.
const safetySettings = [{
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}];

// Instantiate models once outside of functions to avoid repeated initializations.
const generativeModelOptions = {
    model: GEMINI_PRO_MODEL_NAME,
    safety_settings: safetySettings,
    generation_config: { max_output_tokens: 512 },
};
const generativeModel = vertex_ai.preview.getGenerativeModel(generativeModelOptions);

// The streamGenerateContent function does not need to be an async declaration since it returns a Promise implicitly.
async function streamGenerateContent(promptInitText, question) {
    const request = {
        contents: [
            {
                role: 'user',
                parts: [{ text: promptInitText + question }]
            }
        ],
    };

    console.log(request)

    // Using implicit return for the async arrow function.
    let geminiResponse;
    try {
        const streamingResp = await generativeModel.generateContentStream(request);
        for await (const item of streamingResp.stream) {
            console.log('stream chunk: ', item.candidates[0].content.parts[0]);
        }
        const aggregatedResponse = await streamingResp.response;
        console.log("Original question: " + question)
        console.log('Gemini response: ', aggregatedResponse.candidates[0].content.parts[0].text);
        geminiResponse = aggregatedResponse.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('An error occurred during content generation:', error);
        geminiResponse = "An error occurred during content generation:" + error;
    }

    return geminiResponse;
}

module.exports = { streamGenerateContent };