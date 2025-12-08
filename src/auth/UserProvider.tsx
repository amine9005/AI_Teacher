import { useUser } from "@stackframe/react";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import type { User } from "@/lib/Types";
import { UserContext } from "@/context/userContext";
import { Outlet } from "react-router";

const UserProvider = () => {
  const user = useUser();
  const createUser = useMutation(api.users.CreateUser);
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const getUserOrSet = async () => {
      if (user) {
        const data = await createUser({
          name: user.displayName!,
          email: user.primaryEmail!,
        });
        setUserData(data);
      }
    };

    getUserOrSet();
  }, [createUser, user]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <Outlet />
    </UserContext.Provider>
  );
};

export default UserProvider;
