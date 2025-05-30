import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../components/Layout";
import Chatroom from "../pages/Chatroom";
import Login from "../pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Chatroom /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
