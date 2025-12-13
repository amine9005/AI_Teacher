"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { OpenAI } from "openai";

// const client = new OpenAI({
//   baseURL: "https://router.huggingface.co/v1",
//   apiKey: process.env.HF_TOKEN,
// });

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  // defaultHeaders: {
  //   "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
  //   "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  // },
});

// const client = new OpenAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
// });

export const GetResponse = action({
  args: {
    prompt: v.string(),
    agent: v.string(),
  },
  handler: async (_, { prompt, agent }) => {
    // console.log("agent: ", agent);
    // console.log("prompt: ", prompt);
    const chatCompletion = await client.chat.completions.create({
      model: "tngtech/deepseek-r1t2-chimera:free",
      // model: "gemma-3-27b-it",
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
      temperature: 0.7,
    });

    // console.log("response from db: ", JSON.stringify(response));

    return chatCompletion.choices[0].message;
  },
});

export const GenerateNotes = action({
  args: {
    conversation: v.any(),
    agent: v.string(),
  },

  handler: async (_, { conversation, agent }) => {
    // console.log("agent: ", agent);
    // console.log("prompt: ", prompt);
    const conversationAsString = JSON.stringify(conversation);
    const chatCompletion = await client.chat.completions.create({
      model: "tngtech/deepseek-r1t2-chimera:free",
      // model: "gemma-3-27b-it",
      messages: [
        {
          role: "user",
          content: conversationAsString,
        },
        {
          role: "assistant",
          content: agent,
        },
      ],
      temperature: 0.7,
    });

    // console.log("response from db: ", JSON.stringify(response));

    return chatCompletion.choices[0].message;
  },
});
