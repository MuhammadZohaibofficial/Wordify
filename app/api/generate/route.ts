import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Groq client banayein
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { keyword, tone } = await request.json();

    // Input validation
    if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
      return NextResponse.json({ error: 'Keyword is required.' }, { status: 400 });
    }

    // AI ko call karein
    const chatCompletion = await groq.chat.completions.create({
      // Messages to send to the model
      messages: [
        {
          role: 'system',
          content: `You are "Wordify," a witty and creative social media expert. Your task is to generate 8 unique, short, and engaging captions. Provide the output ONLY as a valid JSON array of strings, with no other text, explanation, or markdown. For example: ["Caption 1", "Caption 2"]`
        },
        {
          role: 'user',
          content: `Generate captions for the keyword: "${keyword}" with a "${tone || 'neutral'}" tone.`,
        },
      ],
      // Model ka naam
      model: 'llama3-8b-8192',
      // Yeh line AI ko force karegi ke woh JSON format mein hi jawab de
      response_format: { type: "json_object" }, 
    });
    
    // AI se jawab lein
    const responseContent = chatCompletion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("AI returned an empty response.");
    }
    
    // Jawab ko user ko bhejein
    // Groq ke JSON mode mein, jawab { "captions": [...] } jaisa ho sakta hai,
    // isliye hum usay parse karke direct captions bhej rahe hain
    const responseObject = JSON.parse(responseContent);
    const captions = responseObject.captions || responseObject; // Handle both direct array and object cases

    return NextResponse.json({ captions });

  } catch (error: any) {
    // Error handling
    console.error("Error in Groq API call:", error);
    return NextResponse.json({ error: `Failed to generate captions from AI. Reason: ${error.message}` }, { status: 500 });
  }
          }
