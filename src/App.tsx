import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { stackClientApp } from "./stack/client";
import Dashboard from "./pages/dashboard/Dashboard";
import Protected from "./auth/Protected";
import UserProvider from "./auth/UserProvider";
import LandingPage from "./pages/LandingPage/LandingPage";
import DiscussionRoom from "./pages/DiscussionRoom/DiscussionRoom";
import Navbar from "./components/Navbar/Navbar";
import Layout from "./pages/Layout/Layout";

function HandlerRoutes() {
  const location = useLocation();

  return (
    <StackHandler app={stackClientApp} location={location.pathname} fullPage />
  );
}

export default function App() {
  return (
    <Suspense fallback={"Loading..."}>
      <BrowserRouter>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <Navbar />
            <Routes>
              <Route element={<UserProvider />}>
                <Route element={<Layout />}>
                  <Route path="/handler/*" element={<HandlerRoutes />} />
                  <Route path="/" element={<LandingPage />} />
                  <Route element={<Protected />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/room/:roomId" element={<DiscussionRoom />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </StackTheme>
        </StackProvider>
      </BrowserRouter>
    </Suspense>
  );
}
