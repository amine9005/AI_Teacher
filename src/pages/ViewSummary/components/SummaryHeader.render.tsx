import getAbstractImage from "@/helpers/getAbstractImage.helper";
import type { Doc } from "@convex/_generated/dataModel";
import moment from "moment";

type Props = {
  data: Doc<"DiscussionRoom">;
};
const ViewSummaryHeader = ({ data }: Props) => {
  return (
    <div className="flex justify-between items-center ">
      <div className="flex justify-start items-center gap-4">
        <img
          src={getAbstractImage(data.coachingOption)}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h2 className="font-bold text-xl">{data.topic}</h2>
          <h2 className="font-bold text-gray-500 text-md">
            {data.coachingOption}
          </h2>
        </div>
      </div>
      <p className="text-gray-700">{moment(data._creationTime).fromNow()}</p>
    </div>
  );
};

export default ViewSummaryHeader;
