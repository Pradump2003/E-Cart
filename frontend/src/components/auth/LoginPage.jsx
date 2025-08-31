import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import bgImage from "../../../public/images/Untitled.jpg";
import { AxiosInstance } from "../../api/axiosInstance";
import { GlobalAuthContext } from "../../store/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  let navigate = useNavigate();
  const { setLoggedInUser } = useContext(GlobalAuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      let response = await AxiosInstance.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });
      if (response.data.success) {
        setLoggedInUser(true);
        toast.success(response.data.message);
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-end bg-gradient-to-br from-blue-100 to-blue-300">
      <img
        src={bgImage}
        alt="Back Ground Image"
        className="absolute inset-0 h-full w-full object-fit"
      />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-10 mx-4 lg:mr-16">
        <h1 className="font-bold text-3xl text-center text-gray-700 mb-4 font-serif">
          Login
        </h1>
        <form>
          <div className="flex flex-col gap-4 mb-4">
            <TextField
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              size="small"
              fullWidth
            />

            <TextField
              id="password"
              name="password"
              label="Password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              autoComplete="off"
              size="small"
              fullWidth
            />
          </div>
          <p className="text-sm text-gray-700 mb-3 text-left">
            Don’t have an account?{" "}
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Resister
            </Link>
          </p>
          <div>
            <button
              onClick={login}
              className="w-full bg-gray-600 text-white font-bold py-2 rounded-lg shadow hover:bg-gray-700 transition cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
