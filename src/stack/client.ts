import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router";

export const stackClientApp = new StackClientApp({
  // You should store these in environment variables
  projectId: import.meta.env.VITE_STACKFRAME_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACKFRAME_PUBLISHABLE_CLIENT_KEY,
  tokenStore: "cookie",
  redirectMethod: {
    useNavigate,
  },
});
