import { useContext } from "react";
import { GlobalAuthContext } from "../store/AuthContext";
import { Navigate } from "react-router-dom";

const UserPrivate = ({ children }) => {
  let { loggedInUser, loading } = useContext(GlobalAuthContext);
  if (loading) {
    <h1>Loading .....</h1>;
  }
  return loggedInUser ? children : <Navigate to={"/login"} />;
};

export default UserPrivate;
