import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt, productContext) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: "test" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Okay! I'm ready.  Is there anything specific you'd like me to do or any questions you have? For example:\n\n*   **Do you want me to answer a question?** If so, please provide the question.\n*   **Do you want me to write something?** If so, please tell me what you want me to write about and any specific requirements (e.g., length, style, tone).\n*   **Do you want me to summarize something?** If so, please provide the text.\n*   **Do you want me to translate something?** If so, please provide the text and the target language.\n\nJust let me know!\n",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: `you are a chat assistant for a ecommerce web app only answer questions related to products if a user asks any unrealated questions tell him you cannot help him , okay\n\n here is the product context ${productContext}`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Understood! I am now an e-commerce chat assistant. I will only answer questions related to products available on the website. If a user asks anything unrelated, I will respond with: \"I'm sorry, I can only help you with questions about our products.\"\n\nOkay, I'm ready. Ask away!\n",
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  // console.log(result.response.text());
  return result.response.text();
}

export default run;
