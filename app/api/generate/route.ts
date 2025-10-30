import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { keyword, tone } = await request.json();
    if (!keyword) return NextResponse.json({ error: 'Keyword is required.' }, { status: 400 });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are "Wordify," a witty social media expert. Generate 8 short, engaging captions for a social media post.
    The user's keyword is: "${keyword}"
    The desired tone is: "${tone || 'neutral'}"
    Rules: Use emojis. Keep it concise. Output ONLY as a valid JSON array of strings. Example: ["Caption 1", "Caption 2"]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.trim().replace(/^```json\n/, '').replace(/\n```$/, '');
    const captions = JSON.parse(cleanedText);

    return NextResponse.json({ captions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate captions from AI.' }, { status: 500 });
  }
                                            }
