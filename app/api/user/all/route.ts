import mongoose from "mongoose";
import User from '@/models/User.model'
import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/middlewares/isAdmin";
import { isLoggedIn } from "@/lib/middlewares/auth";



export async function GET(){
    try {
        await connectToDB();
        
const user = await isLoggedIn();
const admin = await isAdmin(user);
if(!admin){
    return NextResponse.json(
        {error : "unauthorized : admin only"},
        {status : 403}
    )
}
        const users = await User.find({},'-password');
        if(!users){
            return NextResponse.json(
                {error : "No users were found"},
                {status : 400}
            )
        }
        return NextResponse.json(
            {message : "Users fetched successfully",users},
            {status : 200}
        )
    } catch (error : any) {
        console.error("Error  while fetching the users : ", error.message);
        return NextResponse.json({
            error : error.message || "something went wrong while fetching the users"
        },{
            status: 500
        })
    }
}