"use client";
import Axios from "@/lib/axios";
import io from "socket.io-client";
import { Socket } from 'socket.io-client'
import {Bell , Menu} from 'lucide-react'
import {motion , AnimatePresence} from 'framer-motion'
import { useEffect, useState } from "react";
import toast from "react-hot-toast";





interface User {
    id:string,
    name : string , 
    avatarUrl? : string
}
interface Notification {
    id : string,
    message : string ,
    read : boolean
}
interface TopNavProps {
    toggleSideBar : () => void
}
const socketUrl = "/"

const TopNav: React.FC<TopNavProps> = ({ toggleSideBar }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
const [socket , setSocket] = useState<Socket | null>(null)
 const [showNotifications , setShowNotifications] = useState(false);


 useEffect(()=>{

    const fetchUser = async () =>{
       try {
         const {data} = await Axios.get('/user/profile');
         setUser(data.user);
         toast.success("User loaded successfully");
       } catch (error : any) {
        console.error("error while loading the user : ",error.message);
        toast.error(error?.response?.data?.error || "Failed to load user");
       }
    }
    fetchUser();
    const newSocket = io(socketUrl);
    setSocket(newSocket);

 },[])

 useEffect(()=>{
if(socket && user){
    const eventName = `notify:${user.id}`;
    const handleNotifications = (notification : Notification) =>{
        setNotifications(prev => [notification , ...prev])
    };
    socket.on(eventName ,handleNotifications );
    return (()=>{
        socket.off(eventName , handleNotifications)
    })
}
 },[socket , user])

 const unreadCount = notifications.filter(n => !n.read).length;

const getUserInitials = (name?: string) => {
    if (!name) return ""; 
    const names = name.trim().split(" ");
    if (names.length === 0) return "";
    if (names.length === 1) return names[0][0]?.toUpperCase() || "";
    return (names[0][0] + names[1][0]).toUpperCase();
};
 return (
    <nav className="w-full bg-gray-900 text-white flex items-center justify-between px-4 py-3 md:py-4 shadow-md fixed top-0 left-0 z-50">
        <button onClick={toggleSideBar} aria-label="Toggle SideBar" className="focus:outline-none">
            <Menu size={24} />
        </button>
        <div className="text-lg font-semibold flex-1 text-center md:text-left md:flex-none md:ml-4">TaskArena</div>
        <div className="flex items-center space-x-4 relative ">
            <button onClick={()=>setShowNotifications(prev => !prev)} aria-label="Notifications" className="relative focus:outline-none">
                <Bell size={24}/>
                {
                    unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full px-1.5 font-bold">{unreadCount}</span>
                    )
                }
                </button>
                <AnimatePresence>
                    {
                        showNotifications && (
                            <motion.div initial={{opacity : 0 , y : -10}} animate={{opacity : 1 , y : 0}} exit={{opacity : 0 , y : -10}} transition={{duration : 0.2}} className="absolute right-0 mt-12 w-72 max-h-80 overflow-y-auto bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 ">
                                {
                                    notifications.length === 0 ? (
                                        <div className="p-4 text-gray-400 text-center ">No Notifications</div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className={`p-3 border-b border-gray-700 cursor-default ${n.read ? "text-gray-400" : "text-white font-semibold"}`}>
                                                {n.message}
                                            </div>
                                        ))
                                    )
                                }
                            </motion.div>
                        )
                    }
                </AnimatePresence>
                {
                    user? (
user.avatarUrl? (
    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover"/>
) : (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold uppercase select-none ">{getUserInitials(user.name)}</div>
)
                    ):(
<div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse"></div>
                    )
                }
        </div>
    </nav>
 )
}


export default TopNav