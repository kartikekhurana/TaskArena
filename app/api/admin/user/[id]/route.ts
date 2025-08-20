import { isAdmin } from "@/lib/middlewares/isAdmin";
import { isLoggedIn } from "@/lib/middlewares/auth";
import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import User from '@/models/User.model'

export async function DELETE(req : Request, {params} : {params : {id : string}}){
try {
    await connectToDB();
  const {id : requesterId} = await isLoggedIn();
  const admin = await isAdmin(requesterId);
  if(!admin){
    return NextResponse.json(
        {error : "unauthorized"},
        {status : 403}
    )
  }
  const {id} = params;
  if(requesterId === id){
    return NextResponse.json(
        {error : "Admins cannot delete themselves here"},
        {status : 400}
    )
  }
  const deletedUser = await User.findByIdAndDelete(id);
  if(!deletedUser){
    return NextResponse.json(
        {error : "user not found"},
        {status : 404}
    )
  }
return NextResponse.json(
    {error : "user deleted successfully"},
    {status: 200}
)
} catch (error : any) {
    console.error("something went wrong while deleting the user" , error.response?.data?.error);
    return NextResponse.json(
        {error : error.response?.data?.error || "something went wrong while deleting user"}
    )
}
}