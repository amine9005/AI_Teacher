import { CoachingOptions, type CoachingExpert } from "@/assets/Options";
import { useRef, useState } from "react";
import { UserButton } from "@stackframe/react";
import { Button } from "@/components/ui/atoms/button/button";
import RecordRTC from "recordrtc";
import { StreamingTranscriber } from "assemblyai";
import { useAction, useMutation } from "convex/react";

import { api } from "../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import type { Id } from "convex/_generated/dataModel";
import type { Messages } from "@/lib/Types";
import useUpdateUserTokens from "@/hooks/useUpdateUserTokens";
// import type { LiveServerMessage } from "@google/genai";
// import Speaker from "speaker";

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
  conversation: Messages[];
  setEnableFeedbackNotes: React.Dispatch<React.SetStateAction<boolean>>;
  setConversation: React.Dispatch<React.SetStateAction<Messages[]>>;
};

const DiscussionSection = ({
  expert,
  data,
  conversation,
  setEnableFeedbackNotes,
  setConversation,
}: Props) => {
  const getResponse = useAction(api.aiResponse.GetResponse);
  const textToSpeech = useAction(api.textToSpeech.TextToSpeech);
  const [enableMic, setEnableMic] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const recorder = useRef<RecordRTC>(null);
  const realtimeTranscriber = useRef<StreamingTranscriber>(null);
  const generateToken = useAction(api.getToken.GetToken);
  const [transcript, setTranscript] = useState("");
  const option = CoachingOptions.find(
    (option) => option.name === data?.coachingOption
  );
  const AGENT = option?.prompt.replace("{user_topic}", data?.topic as string);
  const audioRef = useRef<MediaStream | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const saveConversation = useMutation(api.DiscussionRoom.SaveConversation);
  const { updateUserTokens } = useUpdateUserTokens();

  const generateAudioMessage = async (text: string) => {
    console.log("awaiting audio");

    const audioBuffer = await textToSpeech({
      prompt: text,
      voice: "af_bella",
    });
    if (!audioBuffer) {
      console.log("No audio generated");
      return;
    }
    const audioBlob = new Blob([audioBuffer], { type: "audio/wav" });
    setAudioUrl(URL.createObjectURL(audioBlob));

    console.log("audio ref ", audioPlayer.current);

    if (audioPlayer.current) {
      audioPlayer.current.src = audioUrl!;
    }

    // const audio = new Audio(audioUrl);
    // audio.play();
  };

  // console.log("PROMPT ", AGENT);

  const startRecording = async () => {
    try {
      recorder.current = new RecordRTC(audioRef.current!, {
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

          try {
            const buffer = await blob.arrayBuffer();
            //   console.log(buffer);
            realtimeTranscriber.current.sendAudio(buffer);
          } catch (error) {
            console.log("unable to send audio ", error);
          }
        },
      });

      recorder.current.startRecording();
    } catch (error) {
      console.error("Failed to record ", error);
      setEnableMic(false);
      setButtonLoading(false);
    }
  };

  const getAudio = async () => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      try {
        audioRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch (error) {
        console.error("Failed to get user media ", error);
        setEnableMic(false);
        setButtonLoading(false);
        audioRef.current = null;
        window.alert("Please enable your microphone and try again.");
      }
    }
  };

  const say_hello = async () => {
    const response = await getResponse({
      prompt: "",
      agent: AGENT as string,
    });
    if (!response) {
      console.error("Failed to get response");
      handle_disconnect();
      return;
    }
    updateUserTokens(response.content ? response.content : "");
    await generateAudioMessage(response.content ? response.content : "");
    // console.log("response: ", response);
    setConversation((prev) => [
      ...prev,
      { role: "assistant", content: response.content ? response.content : "" },
    ]);
    // console.log("ai response: ", aiResponse);
    setButtonLoading(false);
    setEnableMic(true);
  };

  const handle_connect = async () => {
    setButtonLoading(true);

    await getAudio();

    if (!audioRef.current) {
      return;
    }

    const token = await generateToken();

    if (token.length === 0) {
      console.error("Failed to get token");
      handle_disconnect();
      return;
    }

    realtimeTranscriber.current = new StreamingTranscriber({
      token,
      sampleRate: 16000,
      endOfTurnConfidenceThreshold: 0.85,
    });

    startRecording();

    await say_hello();

    realtimeTranscriber.current.on("open", async () => {
      console.log("Session opened");
    });

    realtimeTranscriber.current.on("error", (error) => {
      console.error("Error:", error);
      handle_disconnect();
    });
    realtimeTranscriber.current.on("close", (code, reason) =>
      console.log("Session closed:", code, reason)
    );

    realtimeTranscriber.current.on(
      "turn",
      async (turn) => {
        if (!turn.transcript) {
          return;
        }
        if (audioPlayer.current) {
          audioPlayer.current.pause();
        }
        //
        if (turn.transcript) {
          setTranscript(turn.transcript);
        }

        if (turn.end_of_turn) {
          // setUserMessage(userMessage + " " + turn.transcript);
          updateUserTokens(turn.transcript);
          setConversation((prev) => [
            ...prev,
            { role: "user", content: turn.transcript },
          ]);

          const response = await getResponse({
            prompt: turn.transcript,
            agent: AGENT as string,
          });

          if (!response) {
            console.error("Failed to get response");
            return;
          }

          await generateAudioMessage(response.content ? response.content : "");
          updateUserTokens(response.content ? response.content : "");
          setConversation((prev) => [
            ...prev,
            {
              role: "assistant",
              content: response.content ? response.content : "",
            },
          ]);
        }
      }
      //   console.log("Transcript:", turn);
    );

    try {
      await realtimeTranscriber.current.connect();
    } catch (error) {
      console.log("Error connecting:", error);
    }
  };

  const handle_disconnect = async () => {
    if (recorder.current) {
      recorder.current.stopRecording();
      recorder.current = null;
    }
    if (audioRef.current) {
      audioRef.current.getTracks().forEach((track) => track.stop());
    }
    setButtonLoading(true);
    await realtimeTranscriber.current?.close();
    console.log("conversation: ", conversation);
    await handle_save_conversation();

    setEnableMic(false);
    setButtonLoading(false);
    setEnableFeedbackNotes(true);
  };

  // console.log("conversation: ", conversation);

  const handle_save_conversation = async () => {
    await saveConversation({
      id: data!._id!,
      conversation: conversation,
    });
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
        <audio src={audioUrl} ref={audioPlayer} autoPlay />
        <div className="absolute bottom-10 right-10 p-5 px-10 bg-gray-200 rounded-lg">
          <UserButton />
        </div>
      </div>{" "}
      {enableMic ? (
        <Button
          disabled={buttonLoading}
          variant={"destructive"}
          className="w-32 mt-5"
          onClick={() => handle_disconnect()}
        >
          Disconnect
          {buttonLoading && <Loader2 className="animate-spin size-5" />}
        </Button>
      ) : (
        <Button
          disabled={buttonLoading}
          className="w-32 mt-5"
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
