"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY as string,
});

export const GetResponse = action({
  args: {
    prompt: v.string(),
  },
  handler: async (_, { prompt }) => {
    console.log("prompt: ", prompt);
    const response = await await openai.chat.completions.create({
      model: "tngtech/deepseek-r1t2-chimera:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    // console.log("response from db: ", JSON.stringify(response));

    return response.choices[0].message;
  },
});
