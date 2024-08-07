import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
  });
  
  export async function POST(request:NextRequest){
    try {
     const  { messages } = await request.json();
      const completion = await openai.chat.completions.create({
        messages,
        model: "gpt-4o-mini",
      });
      return NextResponse.json(completion.choices[0].message.content);
    } catch (error) {
      console.log(error);
    }
  };
