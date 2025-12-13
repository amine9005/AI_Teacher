import useGetHistory from "@/hooks/useGetHistory.hook";
import HistoryItems from "./HistoryItems.action";

const History = () => {
  const { history } = useGetHistory();
  // console.log("history: ", history);

  const lecture_history = history?.filter(
    (item) =>
      item.coachingOption === "Lecture on Topic" ||
      item.coachingOption === "Learn Language" ||
      item.coachingOption === "Focus on"
  );

  return (
    <div>
      <h2 className="text-xl font-bold">Your Previous Lectures</h2>
      {lecture_history && lecture_history.length > 0 ? (
        <HistoryItems history={lecture_history}></HistoryItems>
      ) : (
        <p className="text-gray-400">You don't have any previous lectures</p>
      )}
    </div>
  );
};

export default History;
