"use client";

import Axios from "@/lib/axios";
import socket from "@/lib/Socket";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
interface UserPopulated {
    _id: string;
    username: string;
    avatar?: string;
}
interface Comment{
    id : string;
    _id?: string;
    userId : string | UserPopulated;
    content : string;
    timestamp : string;
}

interface TaskCommentsProps{
    taskId : string;
    isOpen : boolean;
    onClose : () => string
}



const Taskcomments : React.FC<TaskCommentsProps> =  ({taskId , isOpen , onClose}) => {
    const [comments , setComments] = useState<Comment[]>([]);
    const [input , setInput]  = useState("");
    const [currentUserId , setCurrentUserId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    const fetchCurrentUser = async () => {
        try {
            const res = await Axios.get('/auth/me');
            setCurrentUserId(res.data.user._id);
        } catch (error: any) {
            console.error("Error fetching current user", error.response?.data?.error);
            toast.error(error.response?.data?.error || "Failed to fetch current user");
        }
    };
    fetchCurrentUser();
}, []);
    useEffect(()=>{
        if(!isOpen) return;

        const fetchComments = async () =>{
try {
    const res = await Axios.get(`/comment/${taskId}`);
    setComments(res.data.comments);
} catch (error : any) {
    console.log("error while fetching comment",error.response?.data?.error);
    toast.error(error.response?.data?.error || "error while fetching comment");
}
        }
        fetchComments();
        socket.emit("join-room",taskId);

        const OnRecieveComment = (comment : Comment) =>{
            setComments((prev)=>{
                if(prev.find((c)=>c.id === comment.id)) return prev;
                return [...prev , comment];
            })
        }
        const onRecieveUpdateComment = (updatedComment : Comment) =>{
            setComments((prev)=>prev.map((c)=>(c.id === updatedComment.id ? updatedComment : c)))
        }
        const onRecieveDeleteComment = (deletedComment : Comment) =>{
            setComments((prev)=>prev.filter((c)=>c.id !== deletedComment.id))
        }
        socket.on("recieve:comment",OnRecieveComment);
        socket.on("recieve:update-comment",onRecieveUpdateComment);
        socket.on("recieve:delete-comment",onRecieveDeleteComment);

        return()=>{
            socket.emit("leave:room",taskId);
            socket.off("recieve:comment",OnRecieveComment);
        socket.off("recieve:update-comment",onRecieveUpdateComment);
        socket.off("recieve:delete-comment",onRecieveDeleteComment);
        }
;    },[isOpen,taskId]);

useEffect(()=>{
    if(containerRef.current){
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
},[comments])


const handleSubmit = async(e : React.FormEvent) =>{
    e.preventDefault();
    const trimmed = input.trim();
    if(!trimmed) return;

    try {
        const res = await Axios.post('/comment/add',{taskId , content : trimmed});
        socket.emit("new:comment",{taskId,comment : res.data.comment});
        setInput("");
        toast.success("Comment added!");
    } catch (error : any) {
        console.log("error while adding comment",error.response?.data?.error);
    toast.error(error.response?.error?.error || "error while adding comment");
    }
}
  return (
 <AnimatePresence>
    {
        isOpen && (
            <motion.div
            initial={{x : "100%"}}
            animate={{x : 0}}
            exit={{x : "100%"}}
            transition={{type : "spring", stiffness:300 , damping : 30}}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg flex flex-col z-50"
            >
<header className="flex items-center justify-between p-4 border-b border-gray-200">
    <h2 className="text-xl font-semibold">Comments</h2>
    <button onClick={onClose} aria-label="Close comments drawer" className="text-gray-600 hover:bg-gray-900">X</button>
</header>
<div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
    {
        comments.map((comment)=>{
            const isCurrentUser = comment.userId === currentUserId;
           const username = typeof comment.userId === "object" 
    ? comment.userId.username 
    : "Anonymous";
           const date = comment.timestamp
    ? new Date(comment.timestamp)
    : comment._id
    ? new Date(parseInt(comment._id.substring(0, 8), 16) * 1000)
    : new Date(); 

            const timeString = isNaN(date.getTime())
    ? "Unknown time"
    : date.toLocaleString(undefined , {
        year: "2-digit",
        month : "2-digit",
        day : "2-digit",
        hour : "2-digit",
        minute : "2-digit"
      });
            return(
                <div key={comment.id || comment._id || `${comment.userId}-${comment.timestamp}`} className={`max-w-xs break-words p-3 rounded-lg shadow-lg ${isCurrentUser ? "ml-auto bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "mr-auto bg-gray-300 text-gray-900"}`}>
                    <div className="font-semibold text-sm">{username}</div>
                    <div className="mt-1 whitespace-pre-wrap">{comment.content}</div>
                    <div className="mt-1 text-xs opacity-70 text-right">{timeString}</div>
                </div>
            )
        })
    }
</div>
<form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
    <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Write a comment.." className="w-full rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 px-3 py-2 bg-gray-50 text-gray-900 placeholder-gray-400 transition-shadow"/>
</form>
            </motion.div>
        )
    }
 </AnimatePresence>
  )
}

export default Taskcomments
