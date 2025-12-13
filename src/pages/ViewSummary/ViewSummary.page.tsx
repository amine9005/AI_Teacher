import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import ViewSummaryHeader from "./components/SummaryHeader.render";
import ChatSection from "@/components/DiscussionRoom/ChatSection";
import SummaryBox from "./components/SummaryBox.render";

const ViewSummary = () => {
  const { roomId } = useParams();
  const data = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomId as Id<"DiscussionRoom">,
  });
  const navigate = useNavigate();

  // console.log(data);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin size-10" />
      </div>
    );
  }

  if (!data.conversation) {
    navigate("/room/" + roomId);
  }

  return (
    <div className="w-full max-w-5xl mt-10">
      <div className="flex flex-col">
        <ViewSummaryHeader data={data} />
        <div className="grid grid-cols-1 col lg:grid-cols-5 gap-10 w-full mt-5">
          <div className="col-span-3">
            <SummaryBox summary={data.summary} />
          </div>
          <div className="col-span-2">
            <ChatSection
              conversation={data.conversation}
              enableFeedbackNotes={false}
              summaryPrompt={""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSummary;
