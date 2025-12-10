"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { OpenAI } from "openai";

// const client = new OpenAI({
//   baseURL: "https://router.huggingface.co/v1",
//   apiKey: process.env.HF_TOKEN,
// });

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const GetResponse = action({
  args: {
    prompt: v.string(),
    agent: v.string(),
  },
  handler: async (_, { prompt, agent }) => {
    // console.log("agent: ", agent);
    // console.log("prompt: ", prompt);
    const chatCompletion = await client.chat.completions.create({
      // model: "deepseek-ai/DeepSeek-V3.2:novita",
      model: "gemma-3-27b-it",
      messages: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: agent,
        },
      ],
    });

    // console.log("response from db: ", JSON.stringify(response));

    return chatCompletion.choices[0].message;
  },
});
