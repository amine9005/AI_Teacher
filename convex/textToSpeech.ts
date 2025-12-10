"use node";
import { GoogleGenAI, Modality } from "@google/genai";
import { v } from "convex/values";
import { action } from "./_generated/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.5-flash-native-audio-preview-09-2025";
const responseQueue: any[] = [];
const audioQueue: any = [];

async function waitMessage() {
  while (responseQueue.length === 0) {
    await new Promise((resolve) => setImmediate(resolve));
  }
  return responseQueue.shift();
}

async function messageLoop() {
  // Puts incoming messages in the audio queue.
  while (true) {
    const message = await waitMessage();
    if (message.serverContent && message.serverContent.interrupted) {
      // Empty the queue on interruption to stop playback
      audioQueue.length = 0;
      continue;
    }
    if (
      message.serverContent &&
      message.serverContent.modelTurn &&
      message.serverContent.modelTurn.parts
    ) {
      for (const part of message.serverContent.modelTurn.parts) {
        if (part.inlineData && part.inlineData.data) {
          audioQueue.push(Buffer.from(part.inlineData.data, "base64"));
        }
      }
    }
  }
}

export const TextToSpeech = action({
  args: {
    prompt: v.string(),
    voice: v.string(),
  },
  handler: async (_, { prompt, voice }) => {
    console.log("textToSpeech");
    const config = {
      responseModalities: [Modality.AUDIO],
      systemInstruction:
        "You are a helpful and friendly AI assistant and your job is to read the User Text in a clear voice. IMPORTANT Don't add any other speech ONLY READ THE MESSAGE",
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
      },
      outputAudioTranscription: {},
    };
    const session = await ai.live.connect({
      model: model,
      callbacks: {
        onopen: function () {
          console.debug("Opened a text to speech session");
        },
        onmessage: function (message) {
          responseQueue.push(message);
        },
        onerror: function (e) {
          console.debug("Error:", e.message);
        },
        onclose: function (e) {
          console.debug("Close:", e.reason);
        },
      },
      config: config,
    });

    // console.debug("Session started");
    // Send content...
    console.log("prompt: ", prompt);
    session.sendClientContent({ turns: prompt, turnComplete: true });
    messageLoop();

    console.log("audioQueue: ", audioQueue);
    session.close();

    return audioQueue[0];
  },
});
