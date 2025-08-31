import React, { Children } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/common/layouts/Layout";
import RegisterPage from "../components/auth/RegisterPage";
import LoginPage from "../components/auth/LoginPage";
import Home from "../components/Home";
import Products from "../components/Products";
import UserPrivate from "./UserPrivate";
import PublicRoute from "./PublicRoute";

export let MyRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "/home",
        element: (
          <UserPrivate>
            <Home />
          </UserPrivate>
        ),
      },
      {
        path: "/products",
        element: (
          <UserPrivate>
            <Products />
          </UserPrivate>
        ),
      },
    ],
  },
]);

export default MyRoutes;
