import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in .env file");
}

// NEW endpoint with v1 and correct model
const endpoint = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

async function callGemini(prompt: string) {
  try {
    const response: any = await axios.post(
      `${endpoint}?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("✅ Gemini Response:", reply);
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
  }
}

// Example usage
callGemini("Explain how FAISS indexing works.");
