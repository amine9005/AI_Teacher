import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "react-router";
import type { Id } from "convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { CoachingExpert } from "@/assets/Options";
import DiscussionSection from "@/components/DiscussionRoom/DiscussionSection";

const DiscussionRoom = () => {
  const { roomId } = useParams();
  const [expert, setExpert] = useState<
    (typeof CoachingExpert)[0] | undefined
  >();

  const data = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomId as Id<"DiscussionRoom">,
  });

  useEffect(() => {
    const getExpert = () => {
      const _expert = CoachingExpert.find(
        (item) => item.name === data?.expertName
      );
      setExpert(_expert);
    };
    getExpert();
  }, [data]);

  console.log(data);
  console.log(expert);

  return (
    <div className="w-full mt-10 max-w-5xl">
      <h2 className="text-2xl font-bold">{data?.topic}</h2>
      <div className=" mt-5 lg:gap-4 grid grid-cols-1 lg:grid-cols-6">
        <DiscussionSection expert={expert} />
        <div className="max-lg:mt-10 col-span-2 flex flex-col justify-center items-center">
          <div className="w-full bg-secondary rounded-4xl h-[60vh] flex flex-col justify-center items-center">
            Chat Section
          </div>
          <h2 className="text-gray-400 mt-2 text-center text-sm">
            Conversation/Feedback will be automatically generated at the end of
            your conversation{" "}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DiscussionRoom;
