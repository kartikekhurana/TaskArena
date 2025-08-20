"use client";

import AdminSideBar from "@/components/Dashboard/admin/AdminSideBar";
import AdminTopNav from "@/components/Dashboard/admin/AdminTopNav";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({children} : {children: React.ReactNode}){
    const [isSideBarOpen , setIsSideBarOpen] = useState(false);
    return (
        <div className="flex h-screen bg-gray-950 text-white">
            <AdminSideBar isOpen={isSideBarOpen} setIsOpen={setIsSideBarOpen} userRole="admin"/>
            <div className="flex-1 flex flex-col">
                <AdminTopNav toggleSideBar={()=>setIsSideBarOpen(true)} />
                    <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
            <Toaster position="top-right"/>
        </div>
    )
}