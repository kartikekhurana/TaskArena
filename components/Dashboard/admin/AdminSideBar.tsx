"use client";
import Axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import React, { SetStateAction, useMemo, useState } from "react";



type SideBarProps = {
    isOpen : boolean;
setIsOpen : React.Dispatch<React.SetStateAction<boolean>>;
userRole : "user" | "admin" | string;
}

const AdminSideBar : React.FC<SideBarProps> = ({isOpen , setIsOpen , userRole}) => {
    const router = useRouter();
    const pathName = usePathname();

    const [collapsed , setCollapsed] = useState(false);

    const items = useMemo(
        () => [
            {
                label : "Overview",
                href : "/dashboard/admin",
                active : pathName === "/dashboard/admin",
                 icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12l9-7 9 7v7a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2v-7z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
            },
            {
                label : "users",
                href : "/dashboard/admin/users",
                active : pathName.startsWith("/dashboard/admin/users"),
                 icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 11c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4zM6 13c-2.761 0-5 2.686-5 6v2h10v-2c0-3.314-2.239-6-5-6z"
              fill="currentColor"
            />
            <path
              d="M18 13c-1.657 0-3 1.79-3 4v4h6v-4c0-2.21-1.343-4-3-4z"
              fill="currentColor"
              opacity=".6"
            />
          </svg>
        ),
            },
            {
                label : "tasks",
                href  : "/dashboard/admin/tasks",
                active: pathName.startsWith("/dashboard/admin/tasks"),
                  icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="3"
              y="4"
              width="18"
              height="16"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        ),
            },
        ],
        [pathName]
    );
    const sidebarVariants = {
        closed : {
            x: -320,
            transition:{type : "spring" as const , damping : 18 , stiffness : 240},
        },
        open : {
            x : 0,
             transition: { type: "spring" as const, damping: 18, stiffness: 240 },
        },
    };
    const overlayVariants = {
        closed : {opacity : 0},
        open : {opacity : 1}
    }
  return (
   <>
   <AnimatePresence>
    {
        isOpen && (
            <motion.div variants={overlayVariants} initial="closed" animate='open' exit='closed' onClick={()=>setIsOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"/>
        )
    }
   </AnimatePresence>
   <motion.aside
    variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className={[
          "fixed left-0 top-0 h-full z-[70] lg:z-40",
          "bg-gray-950/80 backdrop-blur-xl border-r border-white/10",
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
          "transition-[width] duration-300 ease-out",
          collapsed ? "w-20" : "w-72",
          "lg:translate-x-0 lg:static",
        ].join(" ")}
   >
<div className="relative">
 <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(80%_60%_at_10%_-10%,rgba(168,85,247,0.15),transparent_60%),radial-gradient(70%_50%_at_110%_-20%,rgba(59,130,246,0.15),transparent_60%)]" />
 <div className="relative flex items-center gap-3 px-4 py-4 border-b border-white/10">
   <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
   </div>
   {
    !collapsed && (
        <div className="min-w-0">
            <div className="flex items-center gap-2">
                <h1 className="text-white font-semibold truncate">TaskArena</h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">ADMIN</span>
            </div>
          <p className="text-xs text-gray-300">Control Center</p>
        </div>
    )
   }
       <button
              onClick={() => setCollapsed((v) => !v)}
              className="ml-auto hidden lg:flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <path
                    d="M15 6l-6 6 6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
 </div>
</div>
<nav className="px-3 py-3 space-y-1">
    {items.map((item )=>{
        const active = item.active;
        return (
            <button key={item.href}  onClick={() => {
    router.push(item.href);
    setIsOpen(false);
  }}
   className={[
                  "group relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition",
                  active
                    ? "bg-gradient-to-r from-purple-500/15 to-blue-500/15 text-white border border-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent",
                ].join(" ")}
  >
    <span className={[
        "flex items-center justify-center",
        collapsed ? "w-9" : "w-6",
        active ? "text-purple-300" : "text-gray-400 group-hover:text-white",
    ].join(" ")
    }>{item.icon}</span>
    {!collapsed && (
      <span className="font-medium truncate">{item.label}</span>
    )}
    {
        active && !collapsed && (
            <motion.span layoutId="adminActiveDot" className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400" />
        )
    }
     {collapsed && (
                  <span className="pointer-events-none absolute left-[76px] z-50 opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all rounded-md bg-gray-900 text-white text-xs px-2 py-1 border border-white/10 shadow-xl">
                    {item.label}
                  </span>
                )}
  </button>
        )
    })}
    <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <button onClick={async()=>{
        try {
            await Axios.post('/auth/logout');
            router.push('/login');
        } catch (error : any) {
            console.error("logout failed" ,error.response?.data?.error);
        }finally{
            setIsOpen(false)
        }
    }}
     className="group relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-400 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition"
    >
         <span
              className={[
                "flex items-center justify-center",
                collapsed ? "w-9" : "w-6",
                "group-hover:text-white",
              ].join(" ")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 17l5-5-5-5M21 12H9m4 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
             {!collapsed && <span className="font-medium">Logout</span>}

            {collapsed && (
              <span className="pointer-events-none absolute left-[76px] z-50 opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all rounded-md bg-gray-900 text-white text-xs px-2 py-1 border border-white/10 shadow-xl">
                Logout
              </span>
            )}
    </button>
</nav>
<div className="absolute inset-x-0 bottom-0 h-12 pointer-events-none bg-gradient-to-t from-purple-500/10 to-transparent" />
   </motion.aside>
   </>
  )
}

export default AdminSideBar
