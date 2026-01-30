import React, { useEffect, useState } from "react";
import { authApi, userProfileApi } from "../services/firebaseApi";
import { Link, useNavigate } from "react-router-dom";
import navIcon from "../assets/img/navIcon.png";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("adminId")) navigate("/home");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await authApi.signIn(formData.email, formData.password);
      const uid = userCredential.user.uid;
      const email = userCredential.user.email || "";
      let profile = await userProfileApi.get(uid);
      if (!profile) {
        await userProfileApi.set(uid, { email, displayName: email.split("@")[0] || "User" });
        profile = { displayName: email.split("@")[0] || "User" };
      }
      const displayName = profile.displayName || email.split("@")[0] || "User";
      localStorage.setItem("adminId", uid);
      localStorage.setItem("userDisplayName", displayName);
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
<>
     <nav className="bg-white flex justify-center px-4 sm:px-6 lg:px-8 border-b border-gray-200 py-3.5">
        <div className="flex items-center gap-2.5">
          <img className="h-8 w-8" src={navIcon} alt="Logo" />
          <span className="text-2xl font-bold text-[#108587] leading-tight">Stockease</span>
        </div>
      </nav>
    <div className="flex max-h-screen items-center justify-center bg-gradient-to-b from-[#eff5f4] to-[#FFFFFF] py-11 px-4 sm:px-6 lg:px-8">
      <div className="w-[400px] h-[384px] max-w-md sm:max-w-lg lg:max-w-xl bg-white py-12 p-8 shadow-md rounded-lg">
        {/* Title */}
        <h2 className=" text-2xl font-bold text-[#108587]">Welcome Back</h2>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form  autoComplete="off" className="mt-6 space-y-8" onSubmit={handleSubmit}>
        <div className="relative">
          <label 
            htmlFor="email" 
            className="absolute -top-2 left-3 z-10 px-2 text-xs font-medium text-[#108587] bg-white"
          >
            Email address
          </label>
          
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="block w-full px-4 py-3 mt-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="relative mt-4">
          <label 
            htmlFor="password" 
            className="absolute -top-2 left-3 z-10 px-2 text-xs font-medium text-[#108587] bg-white"
          >
            Password
          </label>
          
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="block w-full px-4 py-3 mt-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>


          <div>
            <button
              type="submit"
              className="cursor-pointer w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#108587] hover:bg-[#0c7c6b] "
            >
              Log in
            </button>
          </div>
        </form>

        {/* Signup Link */}
        <div className="mt-4 text-center text-sm text-gray-600">
          New here?{" "}
          <Link to="/signup" className="font-medium text-[#108587] hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
</>
  );
}

export default Login;
