import { Button } from "../ui/button";

type Prop = {
  children: React.ReactNode;
};

const ViewItemButton = ({ children }: Prop) => {
  return (
    <Button
      variant={"outline"}
      className="opacity-0 min-w-20 px-4 group-hover:opacity-100 transition-opacity ease-in-out duration-300 "
    >
      {children}
    </Button>
  );
};

export default ViewItemButton;
