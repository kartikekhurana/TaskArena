"use client";
import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Axios from "@/lib/axios";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userRole?: "user" | "admin" | string;
  onUpgrade: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, userRole = "user", onUpgrade }) => {
  const router = useRouter();
  const pathname = usePathname();


  const userNavItems = [
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13z" fill="currentColor"/>
        </svg>
      ),
      label: "Overview",
      href: "/dashboard",
      active: pathname === "/dashboard"
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z" fill="currentColor"/>
          <path d="M11 7h2v10h-2zm4 3h2v7h-2zm-8 2h2v5H7z" fill="currentColor"/>
        </svg>
      ),
      label: "My Tasks",
      href: "/dashboard/tasks",
      active: pathname.startsWith("/dashboard/tasks")
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
        </svg>
      ),
      label: "Profile",
      href: "/dashboard/profile",
      active: pathname === "/dashboard/profile"
    }
  ];

  const adminNavItems = [
    ...userNavItems,
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-1.1-.9-2-2-2s-2 .9-2 2V18H4zm5.5-7c.83 0 1.5-.67 1.5-1.5S10.33 8 9.5 8 8 8.67 8 9.5 8.67 11 9.5 11zm6.5 3.5c0 .83-.67 1.5-1.5 1.5S13 15.33 13 14.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5z" fill="currentColor"/>
        </svg>
      ),
      label: "Users",
      href: "/dashboard/admin/users",
      active: pathname.startsWith("/dashboard/admin/users")
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/>
        </svg>
      ),
      label: "Analytics",
      href: "/dashboard/admin/analytics",
      active: pathname === "/dashboard/admin/analytics"
    }
  ];

  const navItems = userRole === "admin" ? adminNavItems : userNavItems;

  const sidebarVariants: Variants = {
    closed: {
      x: -300,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300
      }
    }
  };

  const overlayVariants: Variants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  return (
    <>
    
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

   
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50 z-50 lg:relative lg:translate-x-0 lg:z-auto"
      >
        
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">TaskArena</h1>
              <p className="text-gray-400 text-xs">Dashboard</p>
            </div>
          </div>
        </div>


        <div className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => {
                router.push(item.href);
                setIsOpen(false); 
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                item.active
                  ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <div className={`${item.active ? "text-purple-400" : "text-gray-400"}`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
              
              {item.active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 bg-purple-400 rounded-full"
                />
              )}
            </motion.button>
          ))}
          <motion.button
  onClick={async () => {
    try {
      await Axios.post("/auth/logout");
      router.push("/login");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-800/50"
>
  <div className="text-gray-400">
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M16 17l5-5-5-5M21 12H9m4 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
  <span className="font-medium">Logout</span>
</motion.button>
        </div>

        {/* Pro Upgrade Section - Only show for non-pro users */}
        {!userRole?.includes('pro') && (
          <div className="absolute bottom-6 left-4 right-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span className="text-white font-semibold text-sm">Upgrade to Pro</span>
              </div>
              <p className="text-gray-400 text-xs mb-3">
                Unlock advanced features and unlimited tasks
              </p>
              <button 
               onClick={()=>router.push('/pricing')}
                className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                Upgrade Now
              </button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Sidebar;