import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import bgImage from "../../../public/images/Untitled.jpg";
import { AxiosInstance } from "../../api/axiosInstance";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  let navigate = useNavigate();

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      let response = await AxiosInstance.post("/user/register", {
        userName: formData.username,
        email: formData.email,
        password: formData.password,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log("Error While Registering ");
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-end bg-gradient-to-br from-gray-100 to-gray-300 relative">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="Back Ground Image"
        className="absolute inset-0 h-full w-full object-fit"
      />

      {/* Form Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-10 mx-4 lg:mr-16">
        <h1 className="font-semibold text-3xl text-center text-black mb-3 font-serif">
          Register
        </h1>

        <form onSubmit={register} className="flex flex-col gap-3">
          <TextField
            id="username"
            name="username"
            label="Username"
            variant="outlined"
            value={formData.username}
            onChange={handleChange}
            autoComplete="off"
            size="small"
            fullWidth
          />

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
            type="password"
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
            size="small"
            fullWidth
          />

          <TextField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="off"
            size="small"
            fullWidth
          />

          <p className="text-sm text-gray-700 mb-2 mt-4 text-left">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login
            </Link>
          </p>

          <button
            type="submit"
            className="w-full bg-gray-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-gray-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
