import FeedbackItems from "./FeedbackItems.render";
import useGetHistory from "@/hooks/useGetHistory.hook";

const Feedback = () => {
  const { history } = useGetHistory();

  const feedback_history = history?.filter(
    (item) =>
      item.coachingOption === "Q&A Preparation" ||
      item.coachingOption === "Mock Interview"
  );

  return (
    <div>
      <h2 className="text-xl font-bold">Feedback</h2>

      {feedback_history && feedback_history.length > 0 ? (
        <FeedbackItems history={feedback_history}></FeedbackItems>
      ) : (
        <p className="text-gray-400">You don't have any previous feedback</p>
      )}
    </div>
  );
};

export default Feedback;
