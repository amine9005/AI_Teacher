import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const GetDiscussionRoom = query({
  args: { id: v.id("DiscussionRoom") },
  handler: async (ctx, { id }) => {
    const room = await ctx.db.get(id);
    return room;
  },
});
