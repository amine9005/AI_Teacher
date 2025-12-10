import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({});
const model = "gemini-2.5-flash-native-audio-preview-09-2025";
const config = { responseModalities: [Modality.AUDIO] };

async function main() {
  const session = await ai.live.connect({
    model: model,
    callbacks: {
      onopen: function () {
        console.debug("Opened");
      },
      onmessage: function (message) {
        console.debug(message);
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

  console.debug("Session started");
  // Send content...

  session.close();
}

main();
