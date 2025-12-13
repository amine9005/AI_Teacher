import { CoachingExpert, CoachingOptions } from "../../assets/Options";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/atoms/textarea/textarea";
import { useContext, useState } from "react";
import { Button } from "../ui/atoms/button/button";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router";
import { UserContext } from "@/context/userContext";
const SessionInputDialog = ({
  children,
  option,
}: {
  children: React.ReactNode;
  option: (typeof CoachingOptions)[0];
}) => {
  const [selectedExpert, setSelectedExpert] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { userData } = useContext(UserContext);

  const navigate = useNavigate();
  const createDiscussionRoom = useMutation(
    api.DiscussionRoom.CreateDiscussionRoom
  );

  const handleCreateDiscussionRoom = async () => {
    setButtonLoading(true);
    try {
      if (!userData) {
        console.log("user not logged in");
        return;
      }
      const result = await createDiscussionRoom({
        coachingOption: option.name,
        topic: selectedTopic,
        expertName: selectedExpert,
        createdBy: userData._id,
      });
      // console.log(result);
      setOpenModal(true);
      navigate(`/room/${result}`);
    } catch (error) {
      console.error(error);
    }
    setButtonLoading(false);
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl mb-2">{option.name}</DialogTitle>
          <DialogDescription asChild>
            <div>
              <h2 className="text-black text-md">
                Enter the necessary details:
              </h2>
              <Textarea
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="mt-2 h-30"
                placeholder="Your topic of interest is..."
              />
              <h2 className="text-black text-md mt-5">
                Select your coaching expert
              </h2>
              <div className="flex justify-between items-center gap-4  ">
                {CoachingExpert.map((expert, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedExpert(expert.name)}
                    className={`text-center mt-2 p-2 cursor-pointer hover:opacity-75 hover:scale-105 transition-all rounded-lg ${selectedExpert === expert.name ? "bg-blue-50 border-2 border-blue-500" : ""}`}
                  >
                    <img
                      className="rounded-lg w-24 h-24"
                      src={expert.avatar}
                      alt={expert.name}
                    />
                    <h2>{expert.name}</h2>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4 mt-2">
                <DialogClose asChild>
                  <Button className="w-24" variant={"outline"}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={() => handleCreateDiscussionRoom()}
                  disabled={buttonLoading || !selectedTopic || !selectedExpert}
                  className="w-24"
                >
                  Next
                  {buttonLoading ? (
                    <Loader2Icon className="size-5 animate-spin" />
                  ) : (
                    <ArrowRightIcon className="size-5" />
                  )}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SessionInputDialog;
