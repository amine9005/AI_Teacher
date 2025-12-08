import Features from "@/components/Dashboard/Features";
import Feedback from "@/components/Dashboard/Feedback";
import History from "@/components/Dashboard/History";
import Navbar from "@/components/Navbar/Navbar";

const Dashboard = () => {
  return (
    <div className="w-full">
      <Navbar />
      <div className="relative p-2 mx-auto mt-20 flex max-w-5xl flex-col items-center justify-center">
        <Features />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mt-5">
          <History />
          <Feedback />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
