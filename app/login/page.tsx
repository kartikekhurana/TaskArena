"use client";
import Axios from "@/lib/axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {motion} from 'framer-motion'
export default function LoginPage() {
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [showPassword , setShowPassword] = useState(false);
    const [isLoading , setIsLoading] = useState(false);
const router = useRouter();

    const handleSubmit = async (e:FormEvent) =>{
        e.preventDefault();
        if(!email || !password){
            toast.error("Please fill in all details");
        }
        setIsLoading(true);
        try {
          const {data} = await Axios.post("/auth/login",{email , password});
            toast.success("Login successfull");
            
const role = data.user.role;
if(role === "admin"){
  router.push("/dashboard/admin")
}else{
  router.push('/dashboard');
}
        } catch (error : any) {
            toast.error(error.response?.data?.error || "Login failed");
        }finally{
        setIsLoading(false);
        }
    }
    return (
<div className="min-h-screen bg-black relative flex items-center justify-center px-4">
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-8 w-96 h-96 bg-purple-400/6 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/3 via-transparent to-blue-500/3 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 w-full max-w-md">
        <motion.div initial={{opacity : 0 , y : -20}} animate={{opacity : 1, y:0}} transition={{duration : 0.6}} className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white max-w-md">Welcome back</h1>
            <p className="text-gray-400">Sign in to your TaskArena account</p>
        </motion.div>
        <motion.div initial={{opacity: 0 , y: 20}} animate={{opacity : 1, y : 0}} transition={{duration:0.6 , delay:0.1}} className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
<form onSubmit={handleSubmit} className="space-y-6">
    <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
        </label>
        <div className="relative">
            <input type="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-500" placeholder="Enter your email"/>
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
        </div>
    </div>
    <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <div className="relative">
            <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-500" placeholder="Enter your password" />
             <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
        </div>
    </div>
    <div className="text-right">
        <button type="button" onClick={()=>router.push('/forgot-password')} className="text-sm text-purple-400">Forgot you password?</button>
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
</form>
<div className="mt-6 text-center">
    <p className="text-gray-400">Don&apos;t have an account?{''}</p>
    <a href="/signup" className="text-purple-400 hover:text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">Sign up</a>
</div>
        </motion.div>
      </div>
</div>
    )
}