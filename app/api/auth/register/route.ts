import { registerUserSchema } from "@/validators/User.schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User.model";

import {
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/generateTokens";
import { cookies } from "next/headers";
import { upload } from "@/lib/multer";
import fs from 'fs/promises';



export async function POST(request : NextRequest){

  try {
    await connectToDB();
  
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const email = formData.get("email" ) as string;
    const password = formData.get('password') as string;
    const role = (formData.get('role') as string) || "user";
    const avatarFormValue = formData.get('avatar');
    
    const isValidFile = (value: any): value is File => {
      return value instanceof File && value.size > 0;
    };

    if(!username || !email || !password ){
      return NextResponse.json(
        {error : "Username , email and password are required"},
        {status : 400}
      )
    }
    
    const parseData = registerUserSchema.parse({
      username: username,
      email,
      password,
      role
    })
    
    const existingUser = await User.findOne({email});
    if(existingUser){
      return NextResponse.json({
        error : "User already exists"
      },{
        status : 400
      })
    }
    
    let avatarPath : string | null = null;
    if(isValidFile(avatarFormValue)){
      const avatarFile = avatarFormValue;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg", "image/webp"];
      if(!allowedTypes.includes(avatarFile.type)){
        return NextResponse.json({
          error:"Invalid file type. Allowed types are jpeg, png, gif, jpg, webp"
        },{
          status:400
        })
      }
      const maxSize = 5 * 1024 * 1024;
      if(avatarFile.size > maxSize){
        return NextResponse.json({
          error :"File size should not exceed 5MB"
        },{
          status : 400
        })
      }
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = avatarFile.name.split('.').pop();
      const baseName = avatarFile.name.split('.').slice(0,-1).join('.');
      const fileName = `${baseName}-${uniqueSuffix}.${ext}`; // Fixed space issue
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const path = await import('path');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-pictures')
      try {
        await fs.access(uploadDir);
      } catch (error) {
        await fs.mkdir(uploadDir, {recursive: true})
      }
      const filePath = path.join(uploadDir,fileName);
      await fs.writeFile(filePath , buffer);

      avatarPath= `/uploads/profile-pictures/${fileName}`;
    }
    
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
      username,
      email,
      password : hashedPassword,
      role,
      avatar : avatarPath
    })
    
    console.log("User inserted:", user);
    
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    

    const cookieStore = await cookies();
    
    const response = NextResponse.json({
      user :{
        _id : user._id,
        username : user.username, 
        email : user.email,
        role: user.role,
        avatar : user.avatar
      },
      message : "User registered successfully",
    },{
      status: 201
    })
    

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 
    });
    
    response.cookies.set("refreshToken", refreshToken, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60
    });
    
    return response;
    
  } catch (error : any) {
    console.error("Error in user registration:",error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors
        },
        { status: 400 }
      );
    }
    return NextResponse.json({
      error : error.message || "something went wrong while registering user",
    },{
      status: 500
    })
  }
}