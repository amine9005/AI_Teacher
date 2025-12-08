import { UserContext } from "@/context/userContext";
import { UserButton } from "@stackframe/react";
import { useContext } from "react";
import { Link } from "react-router";

const Navbar = () => {
  const user = useContext(UserContext);
  return (
    <div className="relative mx-auto my-2 flex max-w-7xl flex-col items-center justify-center">
      <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-linear-to-br from-violet-500 to-pink-500" />
          <h1 className="text-base font-bold md:text-2xl">Learn.AI</h1>
        </Link>
        {user.userData ? (
          <>
            <UserButton />
          </>
        ) : (
          <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Login
          </button>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
