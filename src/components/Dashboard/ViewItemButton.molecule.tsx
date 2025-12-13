import { Link } from "react-router";
import { Button } from "../ui/atoms/button/button";

type Prop = {
  children: React.ReactNode;
  route: string;
};
// molecule
const ViewItemButton = ({ children, route }: Prop) => {
  return (
    <Link to={route}>
      <Button
        variant={"outline"}
        className="opacity-100 lg:opacity-0 min-w-20 px-4 group-hover:opacity-100 transition-opacity ease-in-out duration-300 "
      >
        {children}
      </Button>
    </Link>
  );
};

export default ViewItemButton;
