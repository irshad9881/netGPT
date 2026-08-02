import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_KEY } from "./constants";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

export const getGeminiResponse = async (prompt) => {
  // Debug log to verify if the new API key is successfully loaded in the browser

  const modelsToTry = [
    "gemini-flash-latest",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-pro"
  ];
  
  let lastError = null;
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      let text = response.text();
      if (text) {
        text = text.replace(/```(json|csv|text)?/g, "").replace(/```/g, "").trim();
      }
      return text;
    } catch (error) {
      console.warn(`Gemini model ${modelName} failed, trying next fallback. Error:`, error);
      lastError = error;
    }
  }
  
  console.error("All Gemini models failed. Last error:", lastError);
  return null;
};