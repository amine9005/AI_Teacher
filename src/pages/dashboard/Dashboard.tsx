import Features from "@/components/Dashboard/Features";
import Feedback from "@/components/Dashboard/Feedback.render";
import History from "@/components/Dashboard/History.render";

const Dashboard = () => {
  return (
    <div className="w-full max-w-5xl mt-10">
      <Features />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mt-5">
        <History />
        <Feedback />
      </div>
    </div>
  );
};

export default Dashboard;
