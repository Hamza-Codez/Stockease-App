import React, { useState } from "react";
import { authApi, userProfileApi } from "../services/firebaseApi";
import { Link, useNavigate } from "react-router-dom";
import navIcon from "../assets/img/navIcon.png";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await authApi.signUp(formData.email, formData.password);
      const uid = userCredential.user.uid;
      const email = userCredential.user.email || "";
      const displayName = formData.displayName?.trim() || email.split("@")[0] || "User";
      await userProfileApi.set(uid, { email, displayName });
      localStorage.setItem("adminId", uid);
      localStorage.setItem("userDisplayName", displayName);
      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => navigate("/home"), 2000);
      setFormData({ email: "", password: "", confirmPassword: "", displayName: "" });
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed");
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
    <div className="flex max-h-screen items-center justify-center pt-12 bg-gradient-to-b from-[#eff5f4] to-[#FFFFFF] px-4 sm:px-6 lg:px-8">
      <div className="w-[25rem] pb-12 max-w-md sm:max-w-lg lg:max-w-xl bg-white p-8 shadow-md rounded-lg">
        {/* Title */}
        <h2 className="text-start pb-3 text-2xl font-bold text-[#108587]">Create New Account</h2>
        
        {/* Error / Success Messages */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Signup Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <label
              htmlFor="email"
              className="absolute -top-2 left-3 z-10 px-2 text-xs font-medium text-[#108587] bg-white"
            >
              Email Address
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

          <div className="relative">
            <label
              htmlFor="displayName"
              className="absolute -top-2 left-3 z-10 px-2 text-xs font-medium text-[#108587] bg-white"
            >
              Display Name (optional)
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="How we'll greet you"
              className="block w-full px-4 py-3 mt-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="relative">
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

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="absolute -top-2 left-3 z-10 px-2 text-xs font-medium text-[#108587] bg-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`block w-full px-4 py-3 mt-2 border rounded-md shadow-sm ${
                formData.password &&
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
            />
            {formData.password &&
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
              )}
          </div>

          <div>
            <button
              type="submit"
              className="cursor-pointer w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#108587] hover:bg-[#0e6f70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#108587]"
            >
              Sign Up
            </button>
          </div>
        </form>


        {/* Login Link */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[#108587] hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
   </>
  );
}

export default Signup;
