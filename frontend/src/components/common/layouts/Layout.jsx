import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useContext } from "react";
import { GlobalAuthContext } from "../../../store/AuthContext";

const Layout = () => {
  let { loggedInUser } = useContext(GlobalAuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer position="bottom-right" />

      {/* Navbar hidden on login/register */}
      {loggedInUser && <Navbar />}

      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer hidden on login/register */}
      {loggedInUser && <Footer />}
    </div>
  );
};

export default Layout;
