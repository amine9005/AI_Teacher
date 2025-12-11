"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";

import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);

export const TextToSpeech = action({
  args: {
    prompt: v.string(),
    voice: v.string(),
  },
  handler: async (_, { prompt, voice }) => {
    console.log("textToSpeech");
    const audioBlob = await client.textToSpeech({
      provider: "replicate",
      model: "hexgrad/Kokoro-82M",
      inputs: prompt
        .replace(
          /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
          ""
        )
        .replace(/[|;$%@"<>()+'`,*]/g, ""),
      voice: voice,
    });

    const arrayBuffer = await audioBlob.arrayBuffer();

    return arrayBuffer;
  },
});

// Uncaught ProviderApiError: Failed to perform inference: - input.voice: voice must be one of the following: "af_alloy", "af_aoede", "af_bella", "af_jessica", "af_kore", "af_nicole", "af_nova", "af_river", "af_sarah", "af_sky", "am_adam", "am_echo", "am_eric", "am_fenrir", "am_liam", "am_michael", "am_onyx", "am_puck", "bf_alice", "bf_emma", "bf_isabella", "bf_lily", "bm_daniel", "bm_fable", "bm_george", "bm_lewis", "ff_siwis", "hf_alpha", "hf_beta", "hm_omega", "hm_psi", "if_sara", "im_nicola", "jf_alpha", "jf_gongitsune", "jf_nezumi", "jf_tebukuro", "jm_kumo", "zf_xiaobei", "zf_xiaoni", "zf_xiaoxiao", "zf_xiaoyi", "zm_yunjian", "zm_yunxi", "zm_yunxia", "zm_yunyang"
