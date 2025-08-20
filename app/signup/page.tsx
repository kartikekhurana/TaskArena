"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { animate, motion } from "framer-motion";
import Axios from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
type SignupFormData = {
    username : string;
    email : string ;
    password : string;
    role : string;
    confirmPassword: string
    avatar : string | File | null;
}
type Errors = {
    username?: string;
    email?: string;
    password?: string;
  confirmPassword?: string;
  avatar?: string
  submit?: string
}
export default function SignupPage() {
     const router = useRouter();
const [formData ,setFormData] = useState<SignupFormData>({
    username:"",
    email:"",
    password:"",
    confirmPassword:"",
    role:"user",
    avatar:null
})
const [avatarPreview , setAvatarPreview] = useState<string | null>(null);
const [errors , setErrors] = useState<Errors>({});
const [isLoading , setIsLoading] = useState(false);
const [showPassword , setShowPassword] = useState(false);
const [showConfirmpassword , setShowConfirmPassword] = useState(false);

const validateForm = () : boolean =>{
const newErrors : Errors = {};
if (!formData.username.trim()){
    newErrors.username = "Username is required";
}else if(formData.username.length < 3 || formData.username.length > 20){
    newErrors.username = "Username must be between 3 and 20 characters"
}
if (!formData.email.trim()){
    newErrors.email = "Email is required";
}else if(!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)){
    newErrors.email = "Invalid email format";
}
if(!formData.password.trim()){
    newErrors.password = "Password is required";
}else if(formData.password.length < 6 || formData.password.length > 20){
    newErrors.password = "Password must be between 6 and 20 characters"
}
if(!formData.confirmPassword.trim()){
    newErrors.confirmPassword = "Please confirm your password";
}if(formData.confirmPassword !== formData.password){
    newErrors.confirmPassword = "Passwords do not match"
}
if(formData.avatar instanceof File){
    const file = formData.avatar;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif" , "image/webp"];
    if(!allowedTypes.includes(file.type)){
        newErrors.avatar = "Invalid file type. Only JPEG, PNG, JPG, GIF, and WEBP are allowed.";
    }
    const maxSize = 5* 1024 * 1024;
   if(file.size > maxSize){
    newErrors.avatar = "File size should not exceed 5MB"
   }
}
setErrors(newErrors);
return Object.keys(newErrors).length === 0;
}
const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const target = e.target as HTMLInputElement & { name: keyof SignupFormData };
  const { name, value, type } = target;

  if (name === "avatar" && type === "file" && target.files && target.files[0]) {
    const file = target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Invalid file type. Only JPEG, PNG, JPG, GIF, and WEBP are allowed."
      }));
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        avatar: "File size should not exceed 5MB"
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      avatar: file
    }));
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result ? ev.target.result.toString() : null);
    reader.readAsDataURL(file);
    if (errors.avatar) {
      setErrors((prev) => ({
        ...prev,
        avatar: ""
      }));
    }
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({
        ...prev,
        [name as keyof Errors]: ""
      }));
    }
  }
};
const handleSubmit = async (e: FormEvent) =>{
    e.preventDefault();
    if(!validateForm()) return ;
    setIsLoading(true);
try {
const data = new FormData();
data.append("username", formData.username);
data.append("email",formData.email);
data.append("password",formData.password);
data.append("role",formData.role);
if(formData.avatar && typeof formData.avatar !== "string"){
    data.append("avatar",formData.avatar);
}
await Axios.post("/auth/register", data,{
    headers : {
        "Content-Type" : "multipart/form-data"
    }
}); 
toast.success("Account created successfully");
setTimeout(()=>{
    router.push('/login');
},1500)
} catch (error : any) {
    if(error.response?.data?.errors){
        setErrors(error.response.data.errors);
        toast.error("Please fix the highlighted errors.");
        
    }else{
        setErrors({
            submit : error.message || "Registration failed please try again"
        })
      toast.error("An unexpected error occurred. Please try again.");
    }
}finally{
        setIsLoading(false);
    }
}
return (
   <div className="min-h-screen bg-black relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-8 w-96 h-96 bg-purple-400/6 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/3 via-transparent to-blue-500/3 rounded-full blur-3xl"></div>
      <motion.div animate={{
          background: [
              "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)"
            ]
      }}/>
    </div>
    <div className="relative z-10 w-full max-w-md">
        <motion.div initial={{opacity : 0 ,y:-20}} animate={{opacity : 1, y : 0}} transition={{duration:0.6}}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Join TaskArena</h1>
            <p className="text-gray-400">Create your account and start building better products with your teams</p>
        </motion.div>
       <motion.div 
       initial={{opacity:0 , y:20}}
       animate={{opacity:1 , y:0}}
       transition={{duration:0.6 , delay:0.1}}
       className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 sm:p-8 shadow-2xl"
       >
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                </label>
                <div className="relative">
                    <input 
                        type="text" 
                        id='username' 
                        name="username" 
                        value={formData.username} 
                        onChange={handleInputChange}   
                        className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-white placeholder-gray-500 ${
                            errors.username 
                              ? 'border-red-500 focus:ring-red-500/20' 
                              : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500/20'
                          }`} 
                          placeholder="Enter your username"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
                {
                    errors.username && (
                        <motion.p initial={{opacity:0 , y:-10}} animate={{opacity : 1 , y: 0}} className="mt-2 text-sm text-red-400">{errors.username}</motion.p>
                    )
                }
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-white placeholder-gray-500 ${
                            errors.email 
                              ? 'border-red-500 focus:ring-red-500/20' 
                              : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500/20'
                          }`}
                          placeholder="Enter your email"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                  </div>
                  {errors.email && (
                    <motion.p initial={{opacity : 0 , y: -10}} animate={{opacity:1 , y:0}} className="mt-2 text-sm text-red-400">{errors.email}</motion.p>
                  )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                </label>
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        id="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-white placeholder-gray-500 ${
                            errors.password 
                              ? 'border-red-500 focus:ring-red-500/20' 
                              : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500/20'
                          }`}
                          placeholder="Enter your password" 
                    />
                    <button 
                        type="button" 
                        onClick={()=>setShowPassword(!showPassword)} 
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
                {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-400"
                    >
                      {errors.password}
                    </motion.p>
                  )}
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <input 
                        type={showConfirmpassword ? "text" :"password"}  
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleInputChange}  
                        className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-white placeholder-gray-500 ${
                            errors.confirmPassword 
                              ? 'border-red-500 focus:ring-red-500/20' 
                              : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500/20'
                          }`}
                          placeholder="Confirm your password"
                    />
                    <button 
                        type="button" 
                        onClick={()=>setShowConfirmPassword(!showConfirmpassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    >
                        {showConfirmpassword ? (
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
                {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-400"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
            </div>

            <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-300 mb-2">
                    Avatar URL <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="relative">
                    <input 
                        type="url" 
                        id="avatar" 
                        name="avatar" 
                        value={typeof formData.avatar === "string" ? formData.avatar : ""} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-500"
                        placeholder="https://example.com/avatar.jpg"  
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select 
                    id="role" 
                    name="role" 
                    value={formData.role} 
                    onChange={handleInputChange}  
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 text-white"
                >  
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-400">{errors.submit}</p>
                    </div>
                  </motion.div>
                )}

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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
            Login
              </a>
            </p>
          </div>
       </motion.div>
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-purple-400 hover:text-purple-300">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
          </p>
        </motion.div>
    </div>
   </div>
)
}