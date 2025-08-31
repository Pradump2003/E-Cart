import { RouterProvider } from "react-router-dom";
import MyRoutes from "./routes/MyRoutes";
import { useContext, useEffect } from "react";
import { GlobalAuthContext } from "./store/AuthContext";
import { getCookie } from "./utilities/cookies";

const App = () => {
  let { setLoggedInUser } = useContext(GlobalAuthContext);
  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      setLoggedInUser(token);
    }
  }, []);
  return <RouterProvider router={MyRoutes} />;
};

export default App;
