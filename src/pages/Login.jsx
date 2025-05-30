import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
const Login = () => {
  const [creds, setCreds] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        "https://6838634d2c55e01d184d1b0f.mockapi.io/users"
      );
      const userExist = res.data.find(
        (user) =>
          user.username === creds.username && user.password === creds.password
      );
      if (userExist) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", creds.username);
        navigate("/");
      } else {
        Swal.fire({
          text: "Please find the credentials in the placeholders",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-200 relative overflow-hidden">
        <div className="flex flex-col items-center">
          <img
            src="https://tailwindflex.com/images/logo.svg"
            alt="Profile Picture"
            className="w-14 h-14 rounded-full mt-4"
          />
          <h2 className="text-xl font-semibold mt-2">Welcome Back!</h2>
          <p className="text-gray-500 text-sm">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="username"
            value={creds.username}
            onChange={(e) =>
              setCreds((prev) => ({ ...prev, username: e.target.value }))
            }
            placeholder="Amy or John"
            autoComplete="username"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md "
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Password
          </label>
          <div className="relative">
            <input
              value={creds.password}
              onChange={(e) =>
                setCreds((prev) => ({ ...prev, password: e.target.value }))
              }
              type="password"
              placeholder="password"
              autoComplete="current-password"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2 border-gray-300" />{" "}
              Remember me
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-center font-semibold">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
