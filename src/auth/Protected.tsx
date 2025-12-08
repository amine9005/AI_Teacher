import { useUser } from "@stackframe/react";
import { Outlet } from "react-router";
export default function Protected() {
  useUser({ or: "redirect" });
  return <Outlet />;
}
