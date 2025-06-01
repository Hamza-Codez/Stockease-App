import React, { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";

function Login() {

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(()=>{
    const userId = localStorage.getItem('adminId')
    
    if(userId){
      navigate("/home")
    }
  },[])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("Login successful:", userCredential.user.uid);
      localStorage.setItem("adminId", userCredential.user.uid);
      navigate("/home"); 
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    }
  };

  return (
<>
     <nav className="bg-white flex justify-center px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <Nav/>
      </nav>
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-4 sm:px-6 lg:px-8">
      <div className="w-[400px] h-[534px] max-w-md sm:max-w-lg lg:max-w-xl bg-white py-12 p-8 shadow-md rounded-lg">
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
            className="block w-full px-4 py-3 mt-2 border border-gray-300 rounded-md 
            shadow-sm "
          />
        </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none 
            "/>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#108587] hover:bg-[#0c7c6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
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
