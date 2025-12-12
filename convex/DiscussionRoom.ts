import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateDiscussionRoom = mutation({
  args: {
    coachingOption: v.string(),
    topic: v.string(),
    expertName: v.string(),
    createdBy: v.id("users"),
  },
  handler: async (ctx, { coachingOption, topic, expertName, createdBy }) => {
    const room = await ctx.db.insert("DiscussionRoom", {
      coachingOption,
      topic,
      expertName,
      createdBy,
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

export const SaveConversation = mutation({
  args: {
    id: v.id("DiscussionRoom"),
    conversation: v.any(),
  },
  handler: async (ctx, { id, conversation }) => {
    const room = await ctx.db.patch(id, {
      conversation,
    });
    return room;
  },
});

export const SaveSummary = mutation({
  args: {
    id: v.id("DiscussionRoom"),
    summary: v.any(),
  },
  handler: async (ctx, { id, summary }) => {
    const room = await ctx.db.patch(id, {
      summary,
    });
    return room;
  },
});

export const GetUserDiscussionRooms = query({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    const rooms = await ctx.db
      .query("DiscussionRoom")
      .filter((room) => room.eq(room.field("createdBy"), id))
      .order("desc")
      .collect();
    return rooms;
  },
});
