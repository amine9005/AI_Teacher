import { UserContext } from "@/context/userContext";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useContext } from "react";

const useUpdateUserTokens = () => {
  const { userData, setUserData } = useContext(UserContext);
  const updateUserTokensMutation = useMutation(api.users.UpdateUserTokens);

  // console.log("Installing hook");
  const updateUserTokens = async (text: string) => {
    const tokenCount = text.trim() ? text.split(/\s+/).length : 0;
    // console.log("tokenCount: ", tokenCount);
    const amount = userData!.credits - tokenCount;
    await updateUserTokensMutation({
      id: userData!._id,
      amount: amount,
    });
    // console.log("tokens updated ", amount);

    setUserData!({ ...userData!, credits: amount });
  };

  return { updateUserTokens };
};

export default useUpdateUserTokens;
