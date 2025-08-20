import z from "zod";
export const CreateTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "descpription must be 10 characters long"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z
    .enum(["pending", "in-progress", "completed"])
    .default("in-progress"),
  dueDate: z.string().optional(),
  assignedTo: z.string().min(1, "Assigned user Id is required"),
});
