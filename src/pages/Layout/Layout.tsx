import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="p-2 w-full flex flex-col justify-center items-center">
      <Outlet />
    </div>
  );
};

export default Layout;
