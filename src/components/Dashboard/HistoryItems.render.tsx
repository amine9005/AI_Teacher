import type { Doc } from "@convex/_generated/dataModel";
import { CoachingOptions } from "../../assets/Options";
import moment from "moment";
import ViewItemButton from "./ViewItemButton.action";

type Props = {
  history: Doc<"DiscussionRoom">[];
};
const HistoryItems = ({ history }: Props) => {
  const getImage = (option: string) => {
    const item = CoachingOptions.find((item) => item.name === option);
    return item?.abstract ?? "/ab1.png";
  };

  return (
    <div>
      {history.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between pb-2 cursor-pointer items-center border-b border-gray-300 group"
        >
          <div className="flex items-center justify-start gap-4 mt-2">
            <img
              src={getImage(item.coachingOption)}
              alt="img-abstract"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-bold">{item.coachingOption}</h2>
              <p className="text-gray-600">{item.topic}</p>
              <p className="text-gray-400 text-sm">
                {moment(item._creationTime).fromNow()}
              </p>
            </div>
          </div>
          <ViewItemButton>View Notes</ViewItemButton>
        </div>
      ))}
    </div>
  );
};

export default HistoryItems;
