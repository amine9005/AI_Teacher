import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { name, email }) => {
    // if user does not exist, create it
    const userData = await ctx.db
      .query("users")
      .filter((u) => u.eq(u.field("email"), email))
      .collect();
    if (userData.length === 0) {
      const data = {
        name,
        email,
        credits: 50000,
      };
      const user = await ctx.db.insert("users", data);
      return { ...data, _id: user };
    }

    return userData[0];
  },
});

export const UpdateUserTokens = mutation({
  args: {
    id: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, { id, amount }) => {
    const user = await ctx.db.patch(id, {
      credits: amount,
    });
    return user;
  },
});
