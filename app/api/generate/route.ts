import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// API Key ko environment variable se lena
const API_KEY = process.env.GEMINI_API_KEY;

// Agar API key nahi hai to foran error dein
if (!API_KEY) {
  throw new Error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: Request) {
  try {
    const { keyword, tone } = await request.json();

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required.' }, { status: 400 });
    }

    // Hum Google ka naya aur fast model istemal kar rahe hain jo nayi library ke sath chalta hai
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are "Wordify," a witty social media expert. Generate 8 short, engaging captions for a social media post.
    The user's keyword is: "${keyword}"
    The desired tone is: "${tone || 'neutral'}"
    Rules: Use emojis. Keep it concise. Provide the output ONLY as a valid JSON array of strings. Example: ["Caption 1", "Caption 2"]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // AI ke jawab ko saaf karna taake woh hamesha JSON ho
    const cleanedText = responseText.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');

    let captions;
    try {
        captions = JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", cleanedText);
        throw new Error("AI returned an invalid format. Could not parse JSON.");
    }

    return NextResponse.json({ captions });

  } catch (error: any) {
    console.error("Error in Gemini API call:", error);
    return NextResponse.json({ error: `Failed to generate captions from AI. Reason: ${error.message}` }, { status: 500 });
  }
  }
