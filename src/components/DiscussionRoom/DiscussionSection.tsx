import type { CoachingExpert } from "@/assets/Options";
import { useRef, useState } from "react";
import { UserButton } from "@stackframe/react";
import { Button } from "@/components/ui/button";
import RecordRTC from "recordrtc";
import { StreamingTranscriber } from "assemblyai";
import { useAction } from "convex/react";

import { api } from "../../../convex/_generated/api";
type Props = {
  expert: (typeof CoachingExpert)[0] | undefined;
};

const DiscussionSection = ({ expert }: Props) => {
  const [enableMic, setEnableMic] = useState(false);
  const recorder = useRef<RecordRTC>(null);
  const realtimeTranscriber = useRef<StreamingTranscriber>(null);
  const [silenceTimeout, setSilenceTimeout] = useState<
    NodeJS.Timeout | undefined
  >();
  const generateToken = useAction(api.getToken.GetToken);

  const handle_connect = async () => {
    const token = await generateToken();
    if (!token) {
      console.error("Failed to get token");
      return;
    }

    realtimeTranscriber.current = new StreamingTranscriber({
      token,
      sampleRate: 16000,
    });

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      setEnableMic(true);
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          recorder.current = new RecordRTC(stream, {
            type: "audio",
            mimeType: "audio/webm;codecs=pcm",
            recorderType: RecordRTC.StereoAudioRecorder,
            timeSlice: 250,
            desiredSampRate: 16000,
            numberOfAudioChannels: 1,
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            ondataavailable: async (blob) => {
              // if (!realtimeTranscriber.current) return;
              // Reset the silence detection timer on audio input
              clearTimeout(silenceTimeout);

              const buffer = await blob.arrayBuffer();
              console.log(buffer);

              //console.log(buffer)

              // Restart the silence detection timer
              setSilenceTimeout(
                setTimeout(() => {
                  console.log("User stopped talking");
                  // Handle user stopped talking (e.g., send final transcript, stop recording, etc.)
                }, 2000)
              );
            },
          });
          recorder.current?.startRecording();
        })
        .catch((err) => console.error(err));
    }
  };

  const handle_disconnect = () => {
    if (recorder.current) {
      recorder.current.stopRecording();
      recorder.current = null;
      setEnableMic(false);
    }
  };
  return (
    <div className="lg:col-span-4 flex flex-col justify-center items-center">
      <div className="relative w-full bg-secondary rounded-4xl flex flex-col justify-center items-center h-[60vh]">
        <img
          src={expert?.avatar}
          alt={expert?.name}
          width={100}
          height={100}
          className="w-[100px] h-[100px] rounded-full animate-pulse "
        />
        <div className="text-gray-500">{expert?.name}</div>

        <div className="absolute bottom-10 right-10 p-5 px-10 bg-gray-200 rounded-lg">
          <UserButton />
        </div>
      </div>{" "}
      {enableMic ? (
        <Button
          variant={"destructive"}
          className="w-28 mt-5"
          onClick={() => handle_disconnect()}
        >
          Disconnect
        </Button>
      ) : (
        <Button className="w-28 mt-5" onClick={() => handle_connect()}>
          Connect
        </Button>
      )}
    </div>
  );
};

export default DiscussionSection;
