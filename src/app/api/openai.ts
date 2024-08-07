import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
  });
  
  export default async (req:NextApiRequest, res:NextApiResponse) => {
    const  { messages } = req.body;
    try {
      const completion = await openai.chat.completions.create({
        messages,
        model: "gpt-4o-mini",
      });
      res.status(200).json(completion.choices[0].message.content);
    } catch (error) {
      console.log(error);
    }
  };
