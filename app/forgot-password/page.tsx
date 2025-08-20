"use client";

import Axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { FormEvent, use, useState } from "react";
import toast from "react-hot-toast";
import {motion} from 'framer-motion'
export default function ForgotPasswordPage(){
    const [email , setEmail] = useState("");
    const [isLoading , setIsLoading] = useState(false);
    const [emailsent , SetEmailSent] = useState(false);

    const router = useRouter();
    const handleSubmit = async( e : FormEvent) =>{
e.preventDefault();

if(!email){
    toast.error("please enter your email");
    return;
}
setIsLoading(true);
try {
    await Axios.post("/auth/forgot-password" , {email},{
      headers : {"Content-Type" : "<application/json"}
    });
    toast.success("Reset link sent to your email!");
SetEmailSent(true);
} catch (error : any) {
    toast.error(error.response?.data?.error || "Failed to sent email")
}finally{
    setIsLoading(false)
}
    }
    if(emailsent){
        return(
            <div className="min-h-screen bg-black relative flex items-center justify-center px-4">
                  <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-8 w-96 h-96 bg-purple-400/6 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 w-full max-w-md text-center">
            <motion.div initial={{opacity: 0 , scale:0.9}} animate={{opacity : 1, scale : 1}} transition={{duration: 0.5}} className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 rounded-2xl ">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
<h1 className="text-2xl font-bold text-white mb-4">Check Your Email</h1>
<p className="text-gray-400 mb-6">We&apos;ve sent a password reset link to <span className="text-white font-semibold">{email}</span></p>
<p className="text-sm text-gray-500 mb-8">The link will expire in 1hour. Check your spam folder if you don&apos;t see it </p>
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
        )
    }
    return (
        <div className="min-h-screen bg-black relative flex items-center justify-center px-4">
 <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-8 w-96 h-96 bg-purple-400/6 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/3 via-transparent to-blue-500/3 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 w-full max-w-md">
         <motion.div 
          initial={{opacity: 0, y: -20}} 
          animate={{opacity: 1, y: 0}} 
          transition={{duration: 0.6}}
          className="text-center mb-8"
        >
            <h1 className="text-4xl font-bold text-white mb-4">Forgot Password?</h1>
            <p className="text-gray-400 ">Enter your Email and we&apos;ll send a email Link</p>
        </motion.div>
        <motion.div
         initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.1}}
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl"
        >
<form onSubmit={handleSubmit} className="space-y-6">
   <label htmlFor="email" className="block text-sm font-medium text-gray-500">
    Email Address
   </label>
   <div className="relative">
    <input 
    type="email"
     id="email" 
     value={email} 
     onChange={(e)=>setEmail(e.target.value)}  
      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-500" 
      placeholder="Enter your email address"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
   </div>
    <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
</form>
<div className="mt-6 text-center">
    <button onClick={()=>router.push("/login")} className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">back to login</button>
</div>
        </motion.div>
      </div>
        </div>
    )
}