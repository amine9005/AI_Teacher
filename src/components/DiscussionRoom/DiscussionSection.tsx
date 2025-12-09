import { CoachingOptions, type CoachingExpert } from "@/assets/Options";
import { useRef, useState } from "react";
import { UserButton } from "@stackframe/react";
import { Button } from "@/components/ui/button";
import RecordRTC from "recordrtc";
import { StreamingTranscriber } from "assemblyai";
import { useAction } from "convex/react";

import { api } from "../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import type { Id } from "convex/_generated/dataModel";
import type { Messages } from "@/lib/Types";
type Props = {
  expert: (typeof CoachingExpert)[0] | undefined;
  data:
    | {
        _id: Id<"DiscussionRoom">;
        _creationTime: number;
        conversation?: JSON;
        coachingOption: string;
        topic: string;
        expertName: string;
      }
    | null
    | undefined;
  //   conversation: Messages[];
  setConversation: React.Dispatch<React.SetStateAction<Messages[]>>;
};

const DiscussionSection = ({ expert, data, setConversation }: Props) => {
  const [enableMic, setEnableMic] = useState(false);
  const recorder = useRef<RecordRTC>(null);
  const realtimeTranscriber = useRef<StreamingTranscriber>(null);
  const [silenceTimeout, setSilenceTimeout] = useState<
    NodeJS.Timeout | undefined
  >();
  const generateToken = useAction(api.getToken.GetToken);
  const [transcript, setTranscript] = useState("");
  const [userTurn, setUserTurn] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const getResponse = useAction(api.aiResponse.GetResponse);

  const say_hello = async () => {
    setUserTurn(false);

    const option = CoachingOptions.find(
      (option) => option.name === data?.coachingOption
    );
    const PROMPT = option?.prompt.replace(
      "{user_topic}",
      data?.topic as string
    );
    console.log("PROMPT ", PROMPT);

    const response = await getResponse({
      prompt: PROMPT as string,
    });
    if (!response) {
      console.error("Failed to get response");
      return;
    }
    // console.log("response: ", response);
    setConversation((prev) => [
      ...prev,
      { role: "assistant", content: response.content as string },
    ]);
    // console.log("ai response: ", aiResponse);
    setUserTurn(true);
    setButtonLoading(false);
    setEnableMic(true);
  };

  const handle_connect = async () => {
    setButtonLoading(true);

    const token = await generateToken();
    if (!token) {
      console.error("Failed to get token");
      setButtonLoading(false);
      return;
    }

    realtimeTranscriber.current = new StreamingTranscriber({
      token,
      sampleRate: 16000,
    });

    realtimeTranscriber.current.on("open", async () => {
      await say_hello();
    });

    realtimeTranscriber.current.on("error", (error) => {
      console.error("Error:", error);
      handle_disconnect();
    });
    realtimeTranscriber.current.on("close", (code, reason) =>
      console.log("Session closed:", code, reason)
    );

    realtimeTranscriber.current.on("turn", async (turn) => {
      if (!turn.transcript) {
        return;
      }
      //   console.log("Transcript:", turn);
      if (turn.transcript) {
        setTranscript(turn.transcript);
      }

      //   console.log(turn);
      if (turn.end_of_turn) {
        // console.log("end of turn");
        setConversation((prev) => [
          ...prev,
          { role: "user", content: turn.transcript },
        ]);

        if (!userTurn) {
          //   console.log("awaiting ai response");
          //   console.log("prompt: ", turn.transcript);
          const response = await getResponse({ prompt: turn.transcript });

          if (!response) {
            console.error("Failed to get response");
            return;
          }
          setConversation((prev) => [
            ...prev,
            { role: "assistant", content: response.content as string },
          ]);
          setUserTurn(true);
          //   console.log("response: ", response);

          //   console.log("ai response: ", aiResponse);
        }
        // console.log("user Done speaking");
        // conversation.push({ role: "user", content: turn.transcript });
      }
    });

    try {
      await realtimeTranscriber.current.connect();
    } catch (error) {
      console.log("Error connecting:", error);
    }

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      //   setEnableMic(true);
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
              if (!realtimeTranscriber.current) return;
              // Reset the silence detection timer on audio input
              clearTimeout(silenceTimeout);

              const buffer = await blob.arrayBuffer();
              //   console.log(buffer);
              console.log(userTurn);

              if (enableMic) {
                console.log("Transcribing ");
                realtimeTranscriber.current.sendAudio(buffer);
              }

              //console.log(buffer)

              // Restart the silence detection timer
              setSilenceTimeout(
                setTimeout(() => {
                  setUserTurn(false);

                  //   console.log("User stopped talking");
                  // Handle user stopped talking (e.g., send final transcript, stop recording, etc.)
                }, 3000)
              );
            },
          });
          recorder.current?.startRecording();
        })
        .catch((err) => console.error(err));
    }
  };

  const handle_disconnect = async () => {
    if (recorder.current) {
      setButtonLoading(true);
      recorder.current.stopRecording();
      await realtimeTranscriber.current?.close();
      //   console.log("conversation: ", conversation);
      recorder.current = null;
      setEnableMic(false);
      setButtonLoading(false);
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
          disabled={buttonLoading}
          variant={"destructive"}
          className="w-28 mt-5"
          onClick={() => handle_disconnect()}
        >
          Disconnect
          {buttonLoading && <Loader2 className="animate-spin size-5" />}
        </Button>
      ) : (
        <Button
          disabled={buttonLoading}
          className="w-28 mt-5"
          onClick={() => handle_connect()}
        >
          Connect
          {buttonLoading && <Loader2 className="animate-spin size-5" />}
        </Button>
      )}
      <div>
        <h2>{transcript}</h2>
      </div>
    </div>
  );
};

export default DiscussionSection;
