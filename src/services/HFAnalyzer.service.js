const { InferenceClient } = require("@huggingface/inference");
const { hfToken, hfModel } = require("../config/env");
const { buildRecruiterPrompt } = require("../prompts/recruiterExtractor.prompt");
// Configuration
const CHAT_MODEL = hfModel;

// Validation functions
const validateHuggingFaceToken = (token) => {
  if (!token) {
    throw new Error("HF_TOKEN not configured");
  }
};


const analyzeCVWithAI = async (cleanedText) => {
  validateHuggingFaceToken(hfToken);
  const hfClient = new InferenceClient(hfToken);
  const prompt = buildRecruiterPrompt(cleanedText);

  const chatCompletion = await hfClient.chatCompletion({
    model: CHAT_MODEL,
    messages: [{ role: "user", content: prompt }],
  });



  return JSON.parse(chatCompletion.choices[0].message.content);
};

// Alternative analysis function with custom model
// const analyzeCVWithCustomModel = async (cleanedText, model = CHAT_MODEL) => {
//     validateHuggingFaceToken(hfToken);

//     const hfClient = new InferenceClient(hfToken);
//     const prompt = buildChatPrompt(cleanedText);

//     const chatCompletion = await hfClient.chatCompletion({
//         model,
//         messages: [{ role: "user", content: prompt }],
//     });

//     return JSON.parse(chatCompletion.choices[0].message.content);
// };

// Health check for Hugging Face service
const checkHFServiceHealth = async () => {
  try {
    validateHuggingFaceToken(hfToken);
    const hfClient = new InferenceClient(hfToken);

    // Try a simple request to check if service is responsive
    await hfClient.chatCompletion({
      model: CHAT_MODEL,
      messages: [{ role: "user", content: "Say 'OK' if you're working." }],
      max_tokens: 10
    });

    return { healthy: true, message: "Hugging Face service is responsive" };
  } catch (error) {
    return {
      healthy: false,
      message: "Hugging Face service is unavailable",
      error: error.message
    };
  }
};

module.exports = {
  analyzeCVWithAI,
  // analyzeCVWithCustomModel,
  checkHFServiceHealth,
  validateHuggingFaceToken
};