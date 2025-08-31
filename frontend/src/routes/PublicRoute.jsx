import { useContext } from "react";
import { GlobalAuthContext } from "../store/AuthContext";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  let { loggedInUser } = useContext(GlobalAuthContext);
  return !loggedInUser ? children : <Navigate to={"/home"} />;
};

export default PublicRoute;
