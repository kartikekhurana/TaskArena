import jwt, { SignOptions, Secret } from "jsonwebtoken";
import type { StringValue } from "ms";

export const generateAccessToken = (userId: string): string => {
  const payload = { id: userId };
  const secret: Secret = process.env.ACCESS_TOKEN_SECRET!;
  const expiresIn: StringValue = (process.env.ACCESS_TOKEN_EXPIRES_IN ||
    "1h") as StringValue;
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};

export const generateRefreshToken = (userId: string): string => {
  const payload = { id: userId };
  const secret: Secret = process.env.REFRESH_TOKEN_SECRET!;
  const expiresIn: StringValue = (process.env.REFRESH_TOKEN_EXPIRES_IN ||
    "7d") as StringValue;
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};
