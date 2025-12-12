import type { Id } from "@convex/_generated/dataModel";

export type User = {
  name: string;
  email: string;
  credits: number;
  subscriptionId?: string;
  _id: Id<"users">;
};

export type Messages = {
  role: string;
  content: string;
};
