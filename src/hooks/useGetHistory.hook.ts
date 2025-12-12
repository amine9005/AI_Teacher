import { UserContext } from "@/context/userContext";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useConvex } from "convex/react";
import { useContext, useEffect, useState } from "react";

export default function useGetHistory() {
  const convex = useConvex();
  const { userData } = useContext(UserContext);
  const [history, setHistory] = useState<Doc<"DiscussionRoom">[]>();

  useEffect(() => {
    const getHistory = async () => {
      if (userData) {
        const history = await convex.query(
          api.DiscussionRoom.GetUserDiscussionRooms,
          { id: userData!._id! }
        );
        setHistory(history);
      }
    };
    getHistory();
  }, [userData, convex]);

  return { history };
}
