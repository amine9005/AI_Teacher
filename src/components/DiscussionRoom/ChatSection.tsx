import type { Messages } from "@/lib/Types";
import { Button } from "../ui/button";
import { useAction } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  conversation: Messages[];
  enableFeedbackNotes: boolean;
  summaryPrompt: string;
  // setConversation:React.Dispatch<React.SetStateAction<Messages[]>>
};

const ChatSection = ({
  conversation,
  enableFeedbackNotes,
  summaryPrompt,
}: Props) => {
  const generateNotes = useAction(api.aiResponse.GenerateNotes);
  const [loading, setLoading] = useState(false);
  const generate_feedback_notes = async () => {
    setLoading(true);
    try {
      const response = await generateNotes({
        conversation: JSON.stringify(conversation),
        agent: summaryPrompt,
      });
      console.log("response: ", response);
    } catch (error) {
      console.debug(error);
    }
    setLoading(false);
  };

  return (
    <div className="max-lg:mt-10 col-span-2 flex flex-col justify-center items-center">
      <div className="w-full bg-secondary rounded-4xl h-[60vh] flex flex-col p-4 overflow-y-scroll">
        {conversation.map((item, idx) => (
          <div
            className={`flex mt-2 ${item.role === "user" ? "justify-end" : ""}`}
            key={idx}
          >
            <h2
              key={idx}
              className={`flex w-fit p-4 rounded-2xl max-w-[85%]  ${item.role === "user" ? " bg-blue-400" : " bg-gray-300"}`}
            >
              {item.content}
            </h2>
          </div>
        ))}
      </div>
      {enableFeedbackNotes ? (
        <Button
          className="mt-3"
          disabled={loading}
          onClick={() => generate_feedback_notes()}
        >
          Generate Feedback/Notes
          {loading && <Loader2 className="animate-spin size-5" />}
        </Button>
      ) : (
        <h2 className="text-gray-400 mt-2 text-center text-sm">
          Conversation/Feedback will be automatically generated at the end of
          your conversation{" "}
        </h2>
      )}
    </div>
  );
};

export default ChatSection;
