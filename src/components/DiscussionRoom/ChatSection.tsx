import type { Messages } from "@/lib/Types";
import { Button } from "../ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Id } from "@convex/_generated/dataModel";
import { useParams } from "react-router";

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
  const saveSummary = useMutation(api.DiscussionRoom.SaveSummary);
  const { roomId } = useParams();
  const generate_feedback_notes = async () => {
    setLoading(true);
    try {
      const response = await generateNotes({
        conversation: JSON.stringify(conversation),
        agent: summaryPrompt,
      });

      await saveSummary({
        summary: response.content as string,
        id: roomId as Id<"DiscussionRoom">,
      });
    } catch (error) {
      console.debug(error);
    }
    setLoading(false);
  };

  return (
    <div className="max-lg:mt-10 col-span-2">
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
        <div className="flex items-center justify-center w-full">
          <Button
            className="mt-5  w-full"
            disabled={loading}
            onClick={() => generate_feedback_notes()}
          >
            Generate Feedback/Notes
            {loading && <Loader2 className="animate-spin size-5" />}
          </Button>
        </div>
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
