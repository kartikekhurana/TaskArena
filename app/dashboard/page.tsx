"use client";
import Axios from "@/lib/axios";
import TaskModel from "@/models/Task.model";
import { easeInOut, motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";




type Role = "user" | "admin" | string;
type TaskStatus = "pending" | "in-progress" | "completed";

interface User {
    _id : string;
    username : string;
    avatar?:string;
    role: Role;
    isPro?:boolean;
}
interface Task {
    _id : string;
    title:string;
    description?:string;
    status:TaskStatus;
    createdAt?: string;
    updatedAt? : string;
    dueDate? : string;
    priority? : "low" | "medium" | "high"
}

const fadeUp : Variants = {
    hidden: {opacity : 0 , y : 16},
    visible : {opacity : 1 , y : 0 , transition : {duration : 0.45 , ease : easeInOut}}
}
const stagger : Variants = {
    hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
export default function DashboardPage(){
    const router = useRouter();
const [loading , setLoading] = useState(true);
const [me , setMe] = useState<User | null>(null);
const [tasks , setTasks] = useState<Task[]>([])


useEffect(()=>{
let mounted = true;
(async () =>{
    try {
        const [{data : meRes}, {data : myTasksRes}] = await Promise.all([
            Axios.get('/user/profile'),
            Axios.get('/user/my-tasks'),
        ]);
        if(!mounted) return;
        setMe(meRes.user);
        setTasks(myTasksRes.tasks || []);
    } catch (error : any) {
        console.error("dashboard error : ", error.response?.data?.error);
        toast.error(error?.response?.data?.error || "Failed to load dashboard");
    }finally{
        if(mounted) setLoading(false);
    }
})()
return ()=>{
    mounted = false
}
},[])
const counts = useMemo(() => {
    return {
        pending: tasks.filter(t => t.status === "pending").length,
        inProgress: tasks.filter(t => t.status === "in-progress").length,
        completed: tasks.filter(t => t.status === "completed").length,
    };
}, [tasks]);

const statusBadge = (s : TaskStatus) =>{
     const map: Record<TaskStatus, string> = {
      "pending": "bg-yellow-500/15 text-yellow-300 border-yellow-400/20",
      "in-progress": "bg-blue-500/15 text-blue-300 border-blue-400/20",
      "completed": "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
    };
    return `inline-flex items-center px-2.5 py-1 rounded-md text-xs border ${map[s]}`
};
const priorityDot = (p? : Task["priority"]) =>{
if(!p) return "bg-gray-500";
if(p === "high") return "bg-rose-500";
if(p === "medium") return "bg-amber-500" 
  return "bg-green-500";
}
 if (loading) {
    return (
      <main className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-40 bg-gray-800 rounded-lg animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-900/70 border border-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="mt-8 h-96 bg-gray-900/60 border border-gray-800 rounded-2xl animate-pulse" />
        </div>
      </main>
    );
  }

  return(
    <main className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
            <motion.section variants={stagger} initial="hidden" animate="visible" className="mb-8">
                <motion.div variants={fadeUp} className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 overflow-hidden flex items-center justify-center">
                            {
                                me?.avatar ? (
<img src={me.avatar} alt={me.username} className="w-full h-full object-cover" />
                                ) : (
<div className="text-lg font-semibold text-white">
    {me?.username?.charAt(0)?.toUpperCase() || "U"}
</div>
                                )
                            }
                        </div>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome , <span className="text-purple-400">{me?.username}</span></h1>
                    <div className="mt-1 inline-flex items-center gap-2">
                        <span className="text-xs text-gray-400">Role</span>
                        <span className="px-2 py-0.5 rounded-md text-xs bg-gray-900 border border-gray-800 text-gray-200">{me?.role || "user"}</span>
                        {
                            !me?.isPro && (
                                <span className="px-2 py-0.5 rounded-md text-xs bg-amber-500/15 border border-amber-400/20 text-amber-300">Free plan</span>
                            )
                        }
                    </div>

                    {
                        me?.isPro && (
                            <motion.button variants={fadeUp} whileHover={{scale:1.02}} whileTap={{scale : 0.98}} onClick={()=>router.push("/pricing")} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white border border-purple-500/30 hover:from-purple-500 hover:to-blue-500 transition">Upgrade to Pro     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg></motion.button>
                        )
                    }
                </motion.div>
            </motion.section>
            <motion.section
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
            >
{[
  { label: "Pending", value: counts.pending },
   { label: "In Progress", value: counts.inProgress },
   { label: "Completed", value: counts.completed },
          ].map((s,i)=>(
            <motion.div key={s.label} variants={fadeUp} className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5">
                <div className="text-sm text-gray-400">{s.label}</div>
                <div className="mt-2 text-2xl font-bold text-white">{s.value}</div>
            </motion.div>
          ))}
            </motion.section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.section
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 rounded-2xl bg-gray-900/40 border border-gray-800"
          >
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-center">
                <h2 className="text-white font-semibold">Recent Tasks</h2>
                <button onClick={()=>router.push('/dashboard/tasks')}  className=" ml-1 text-sm text-purple-300 hover:text-purple-200">View all</button>
            </div>
            <div className="divide-y divide-gray-800">
                {
                    tasks.slice(0,8).map((t)=>(
                        <div key={t._id} className="px-5 py-4 flex items-center gap-4">
                                <span className={`mt-1 w-2 h-2 rounded-full ${priorityDot(t.priority)}`} />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-white font-medium">{t.title}</p> 
                                        <span className={statusBadge(t.status)}>{t.status}</span>
                                    </div>
                                    {
                                        t.description && (
                                            <p className="text-sm text-gray-400  mt-1 line-clamp-2">{t.description}</p>     
                                        )
                                    }
                                    <div className="mt-2 text-xs text-gray-500">
                                        {
                                            t.updatedAt ? `Updated ${new Date(t.updatedAt).toLocaleString()}` : t.createdAt ? `Created ${new Date(t.createdAt).toLocaleString()} ` : null
                                         }

                                    </div>
                                </div>
                        </div>
                    ))
                }
                {
                    tasks.length === 0 && (
                        <div className="px-5 py-10 text-center text-gray-400">No tasks yet. Create your first task to get started</div>
                    
                    )
                }
            </div>
          </motion.section>
          <motion.section
           variants={stagger}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-gray-900/40 border border-gray-800 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-800">
                <h2 className="text-white font-semibold">Activity & tips</h2>
            </div>
            <div className="p-5 space-y-4">
                <motion.div variants={fadeUp} className="rounded-xl border border-gray-800 p-4 bg-gray-900/60">
                <div className="flex items-center gap-2 mb-1">
    <div className="w-1.5 h-1.5 rounded-full bg-green-400"/>
                <p className="text-sm text-white font-medium">Real-time</p>
                </div>
<p className="text-sm text-gray-400">New Comments & task updates arrives instantly via websockets</p>
                </motion.div>
                  <motion.div variants={fadeUp} className="rounded-xl border border-gray-800 p-4 bg-gray-900/60">
                <p className="text-sm text-white font-medium mb-1">Pro Tip</p>
                <p className="text-sm text-gray-400">
                  Use status to track progress. Completed tasks move to history automatically.
                </p>
              </motion.div>

              {!me?.isPro && (
                <motion.div variants={fadeUp} className="rounded-xl border border-purple-500/20 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                  <p className="text-sm text-white font-semibold mb-1">Unlock Pro</p>
                  <p className="text-sm text-gray-300 mb-3">Unlimited projects, priority support and advanced analytics.</p>
                  <button
                    onClick={() => router.push("/pricing")}
                    className="px-3 py-2 text-sm rounded-md bg-white text-black font-medium hover:bg-gray-100"
                  >
                    Upgrade
                  </button>
                </motion.div>
              )}
            </div>
          </motion.section>
            </div>
        </div>
    </main>
  )
}