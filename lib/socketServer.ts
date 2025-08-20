import { Server } from "socket.io";
import type { Server as httpServer } from "http";

let io: Server;

export function initSocket(server: httpServer) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    io.on("connection", (socket) => {
      console.log("User connected : ", socket.id);
      socket.on("disconnect", () => {
        console.log("User disconnected : ", socket.id);
      });
      socket.on("join-room", (taskId: string) => {
        socket.join(taskId);
        console.log(`Socket ${socket.id} joined room : ${taskId}`);
      });
      socket.on("new:comment", (data) => {
        const { taskId, comment } = data;
        if (taskId) {
          io.to(taskId).emit("recieve:comment", comment);
        }
      });
      socket.on("update:comment", (data) => {
        const { taskId, updateComment } = data;
        if (taskId) {
          io.to(taskId).emit("recieve:update-comment", updateComment);
        }
      });
      socket.on("delete:comment", (data) => {
        const { taskId, commentId } = data;
        if (taskId) {
          io.to(taskId).emit("recieve:delete-comment", commentId);
        }
      });
      socket.on("notify", ({ userId, type, message }) => {
        io.emit(`notify:${userId}`, { type, message });
      });
socket.on("leave-room",(taskId : string)=>{
  socket.leave(taskId);
  console.log(`Socket ${socket.id} left room : ${taskId}`);
  
})
    });
  }
  return io;
}
export function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}
export function notifyTaskAssigned(userId: string, task: any) {
  getIO().emit(`task:assigned:${userId}`, task);
}
export function notifyTaskUpdated(taskId: string, updatedTask: any) {
  getIO().to(taskId).emit(`task:updated`, updatedTask);
}
export function notifyTaskDeleted(taskId: string) {
  getIO().to(taskId).emit("task:deleted", taskId);
}
