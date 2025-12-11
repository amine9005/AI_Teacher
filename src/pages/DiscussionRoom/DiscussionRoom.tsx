import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "react-router";
import type { Id } from "convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { CoachingExpert, CoachingOptions } from "@/assets/Options";
import DiscussionSection from "@/components/DiscussionRoom/DiscussionSection";
import ChatSection from "@/components/DiscussionRoom/ChatSection";
import type { Messages } from "@/lib/Types";

const DiscussionRoom = () => {
  const { roomId } = useParams();
  const [expert, setExpert] = useState<
    (typeof CoachingExpert)[0] | undefined
  >();
  // console.log(roomId);

  const data = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomId as Id<"DiscussionRoom">,
  });
  const [conversation, setConversation] = useState<Messages[]>([
    // { role: "assistant", content: "AI Msg" },
    // { role: "user", content: "User Msg" },
  ]);
  const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
  const [summaryPrompt, setSummaryPrompt] = useState<string>("");
  useEffect(() => {
    const getExpert = () => {
      const _expert = CoachingExpert.find(
        (item) => item.name === data?.expertName
      );
      const _prompt = CoachingOptions.find(
        (item) => item.name === data?.coachingOption
      )?.summeryPrompt;
      // console.log(_prompt);
      // console.log(data);
      setExpert(_expert);
      setSummaryPrompt(_prompt!);
    };
    getExpert();
  }, [data]);

  // console.log(data);
  // console.log(expert);

  return (
    <div className="w-full mt-10 max-w-5xl">
      <h2 className="text-2xl fontF-bold">{data?.topic}</h2>
      <div className=" mt-5 lg:gap-4 grid grid-cols-1 lg:grid-cols-6">
        <DiscussionSection
          expert={expert}
          data={data}
          setEnableFeedbackNotes={setEnableFeedbackNotes}
          conversation={conversation}
          setConversation={setConversation}
        />
        <ChatSection
          summaryPrompt={summaryPrompt}
          enableFeedbackNotes={enableFeedbackNotes}
          conversation={conversation}
        />
      </div>
    </div>
  );
};

export default DiscussionRoom;
