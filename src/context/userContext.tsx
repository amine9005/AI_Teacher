import { createContext } from "react";
import type { User } from "@/lib/Types";

export const UserContext = createContext<{
  userData: User | undefined;
  setUserData:
    | React.Dispatch<React.SetStateAction<User | undefined>>
    | undefined;
}>({ userData: undefined, setUserData: undefined });
