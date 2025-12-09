import Features from "@/components/Dashboard/Features";
import Feedback from "@/components/Dashboard/Feedback";
import History from "@/components/Dashboard/History";

const Dashboard = () => {
  return (
    <div className="w-full max-w-5xl mt-20">
      <Features />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mt-5">
        <History />
        <Feedback />
      </div>
    </div>
  );
};

export default Dashboard;
