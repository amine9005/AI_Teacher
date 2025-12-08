import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateDiscussionRoom = mutation({
  args: {
    coachingOption: v.string(),
    topic: v.string(),
    expertName: v.string(),
  },
  handler: async (ctx, { coachingOption, topic, expertName }) => {
    const room = await ctx.db.insert("DiscussionRoom", {
      coachingOption,
      topic,
      expertName,
    });
    return room;
  },
});
