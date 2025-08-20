import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const isLoggedIn = async () => {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("accessToken")?.value;
    if (!token) {
      throw new Error("not logged in : No user found");
    }
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as jwt.JwtPayload;
    if (typeof decoded !== "string" && decoded.id) {
      return { id: decoded.id };
    } else {
      throw new Error("Invalid token payload");
    }
  } catch (error) {
    throw new Error("Unauthorized access");
  }
};
