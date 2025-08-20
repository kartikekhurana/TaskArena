"use client";
import Axios from "@/lib/axios";
import {motion} from 'framer-motion';


import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ResetPasswordPage(){
    const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const router = useRouter();
const params = useParams();
const token = params.token; 

  const handleSubmit = async(e : React.FormEvent) =>{
    e.preventDefault();
    if(!password || !confirmPassword){
        toast.error("All fields are required");
        return;
    }
    if(password !== confirmPassword){
toast.error("passwords do not match");
return;
    }
    if(!token){
        toast.error("Invalid or missing token");
        return;
    }
    setIsLoading(true);
    try {
       await Axios.post(
  "/auth/reset-password",
  { token, password }, 
  { headers: { "Content-Type": "application/json" } }
);
toast.success("Password reset successful!");
setResetDone(true);
    } catch (error : any) {
        toast.error(error.response?.data?.error || "Failed to reset password");
    }finally{
        setIsLoading(false);
    }
  }
  if (resetDone) {
    return (
      <div className="min-h-screen bg-black relative flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-8 w-96 h-96 bg-purple-400/6 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 w-full max-w-md text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 rounded-2xl">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Password Reset Successful</h1>
            <p className="text-gray-400 mb-6">Your password has been updated successfully!</p>
            <motion.button
              onClick={() => router.push("/login")}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              Back to Login
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }
return (
    <div className="min-h-screen bg-black relative flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-8 w-96 h-96 bg-purple-400/6 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/3 via-transparent to-blue-500/3 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Reset Password</h1>
          <p className="text-gray-400">Enter your new password to update your account</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-500">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-500"
            />
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-500">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-500"
            />
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => router.push("/login")} className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">back to login</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}