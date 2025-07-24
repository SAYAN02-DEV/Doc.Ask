import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config(); // Load GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function parseSentenceToJSON(sentence: string): Promise<object> {
  const prompt = `
You will be given an input sentence that may contain personal, medical, location, or policy-related information.

- If you can extract structured data from the input, return a **valid JSON object** with relevant key-value pairs.
- If no structured information is extractable, return only:

  {
    "message": "Could not extract structured data."
  }

Now extract data from:
"${sentence}"
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Attempt to extract JSON
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;

    const jsonString = text.substring(jsonStart, jsonEnd);
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (err) {
    console.error('[Gemini Error]', err);
    return { message: 'Something went wrong while processing the input.' };
  }
}
