import React, { createContext, useEffect, useState } from "react";
import { AxiosInstance } from "../api/axiosInstance";

export const GlobalAuthContext = createContext();

const AuthContext = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const getUserInfo = async () => {
    try {
      let response = await AxiosInstance.get("/user/me");
      setUserInfo(response.data.data);
      setLoggedInUser(true);
    } catch (error) {
      setLoggedInUser(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <GlobalAuthContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
        loading,
        getUserInfo,
        userInfo,
      }}
    >
      {children}
    </GlobalAuthContext.Provider>
  );
};

export default AuthContext;
