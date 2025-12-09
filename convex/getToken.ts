"use node";

import { action } from "./_generated/server";
import { AssemblyAI } from "assemblyai";

export const GetToken = action({
  args: {},
  handler: async () => {
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLY_AI_API_KEY as string,
    });
    const token = await client.streaming.createTemporaryToken({
      expires_in_seconds: 300,
    });

    return token;
  },
});
