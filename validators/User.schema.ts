import z from "zod";
export const registerUserSchema = z.object({
  username: z
    .string()
    .min(2, { message: "username must be at least 2 characters " }),
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, "password must be 6 characters long"),
  avatar: z.string().optional(),
  role: z.enum(["user", "admin"]).optional(),
});
export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const LoginUserSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, "password must be 6 characters long"),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, "password must be 6 characters long"),
  token: z.string(),
});
