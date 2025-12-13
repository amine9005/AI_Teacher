import type { Doc } from "@convex/_generated/dataModel";
import moment from "moment";
import ViewItemButton from "./ViewItemButton.molecule";
import getAbstractImage from "@/helpers/getAbstractImage.helper";

type Props = {
  history: Doc<"DiscussionRoom">[];
};
const HistoryItems = ({ history }: Props) => {
  return (
    <div>
      {history.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between pb-2 cursor-pointer items-center border-b border-gray-300 group"
        >
          <div className="flex items-center justify-start gap-4 mt-2">
            <img
              src={getAbstractImage(item.coachingOption)}
              alt="img-abstract"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-bold">{item.topic}</h2>
              <p className="text-gray-600">{item.coachingOption}</p>
              <p className="text-gray-400 text-sm">
                {moment(item._creationTime).fromNow()}
              </p>
            </div>
          </div>
          <ViewItemButton route={`/summary/${item._id}`}>
            View Notes
          </ViewItemButton>
        </div>
      ))}
    </div>
  );
};

export default HistoryItems;
