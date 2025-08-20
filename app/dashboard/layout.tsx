"use client";

import Sidebar from "@/components/Dashboard/SideBar";
import TopNav from "@/components/Dashboard/TopNav";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";

export  default function DashBoardLayout({
    children,
}:{
    children :React.ReactNode
}){
    const [isSideBarOpen , setIsSideBarOpen] = useState(false);
    return (
        <div className="flex h-screen bg-gray-950 text-white">
            <Sidebar isOpen={isSideBarOpen} setIsOpen={setIsSideBarOpen} userRole="user" onUpgrade={()=>console.log("Upgrade clicked")} />
            <div className="flex-1 flex flex-col ">
                <TopNav toggleSideBar={()=>setIsSideBarOpen(true)}></TopNav>
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
            <Toaster position="top-right"/>
        </div>
    )
}