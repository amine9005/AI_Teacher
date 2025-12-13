import { useUser } from "@stackframe/react";
import { Button } from "../ui/atoms/button/button";
import { CoachingOptions } from "@/assets/Options";
import { BlurFade } from "../ui/blur-fade";
import SessionInputDialog from "./SessionInputDialog";

const Features = () => {
  const user = useUser();
  return (
    <div className="w-full">
      <div className="flex p-4 gap-4 w-full justify-between items-center">
        <div>
          <h2 className="text-gray-500 font-medium">My Workspace</h2>
          <h2 className="text-3xl font-bold">
            Welcome Back {user?.displayName}
          </h2>
        </div>

        <Button>Profile</Button>
      </div>
      <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-10">
        {CoachingOptions.map((options, index) => (
          <SessionInputDialog key={index} option={options}>
            <BlurFade delay={0.25 + index * 0.05} inView>
              <div
                className="p-3 cursor-pointer hover:rotate-6 hover:bg-gray-300 transition-all rounded-3xl bg-secondary flex justify-center min-h-[150px] items-center flex-col text-center"
                key={index}
              >
                <img
                  src={options.icon}
                  alt={options.name}
                  className="w-[70px] h-[70px]"
                />
                <h2 className="mt-2">{options.name}</h2>
              </div>
            </BlurFade>
          </SessionInputDialog>
        ))}
      </div>
    </div>
  );
};

export default Features;
