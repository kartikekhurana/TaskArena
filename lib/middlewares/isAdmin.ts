import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDB } from "../mongoose";
import User from "@/models/User.model";

export const isAdmin = async (userId: { id: any; }) => {
  try {
    await connectToDB();
    const cookieStore = cookies();
    const token = (await cookieStore).get("accessToken")?.value;

    if (!token) {
      throw new Error("User not logged in");
    }
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as jwt.JwtPayload;
    if (typeof decoded === "string" || !decoded.id) {
      throw new Error("Invalid token");
    }
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      throw new Error("Access denied : Not an admin");
    }
    return user;
  } catch (error) {
    throw new Error("Unauthorized : admin access Only");
  }
};
