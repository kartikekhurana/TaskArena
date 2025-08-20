"use client";

import React, { useEffect, useMemo, useState } from "react";
import Axios from "@/lib/axios";
import toast from "react-hot-toast";
import socket from "@/lib/Socket";

type Role = "user" | "admin" | string;
type Status = "pending" | "in-progress" | "completed";
type Priority = "low" | "medium" | "high";

type User = {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  role: Role;
};

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  assignedTo?: User | string | null;
  dueDate?: string;       
  createdAt?: string;     
  updatedAt?: string;     
};

type Comment = {
  _id : string;
  content : string;
userId: User;
taskId : string;
createdAt : string;
updatedat? : string;
}

const TASKS_URL = "/task/all";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState<Priority>("low");
  const [formAssignee, setFormAssignee] = useState<string | "unassigned">("unassigned");
  const [formDueDate, setFormDueDate] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editMode , setEditMode] = useState(false);
  const [editingTaskId , setEditingTaskId] = useState<string | null>(null);
  const [comments , setComments] = useState<Comment[]>([]);
  const [commentInput , setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [currentUser , setCurrentUser] = useState<User | null>(null);
  const [editingCommentId , setEditingCommentId] = useState<string | null>(null);
  const [editingContent , setEditingContent] = useState("");

useEffect(()=>{
  async function fetchMe(){
    try {
      const {data} = await Axios.get('/auth/me');
      setCurrentUser(data.user);
    } catch (error : any) {
      console.error("error while fetching current user", error.response?.data?.error);
    }
  }
  fetchMe();
},[])

  useEffect(()=>{
if(!selectedTask?._id) return;
socket.connect();
socket.emit('join-room',selectedTask._id);

socket.on("recieve:comment",(comment)=>{
  setComments((prev)=>[...prev,comment]);
})
socket.on("recieve:update-comment",(updatedComment)=>{
  setComments((prev)=>prev.map((c)=>(c._id === updatedComment._id  ? updatedComment : c)));
})
socket.on('recieve:delete-comment',(commentId)=>{
  setComments((prev)=>prev.filter((c)=>c._id !== commentId))
})
return(()=>{
  socket.off("recieve:comment");
  socket.off("recieve:update-comment");
  socket.off("recieve:delete-comment");
  socket.disconnect();
})
  },[selectedTask?._id])

  async function fetchComments(taskId : string){
try {
  const {data} = await Axios.get(`/comment/${taskId}`);
  const list: Comment[] = Array.isArray(data) ? data : data?.comments ?? [];
setComments(list);
} catch (error : any) {
  console.error("Error fetching comments", error.response?.data || error.message);
  toast.error(error.response?.data?.error || "error while fetching comments");
}
  }

  async function addComment(){
    if(!selectedTask || !commentInput.trim()) return;
    try {
      const {data} = await Axios.post("/comment/add",{
        taskId : selectedTask._id,
        content : commentInput,
      });
      socket.emit("new:comment",{
        taskId : selectedTask._id,
        comment : data.comment,
      })
      setCommentInput("");
    } catch (error : any) {
      toast.error(error.response?.data?.error || "Error adding comment");
      console.error("error adding comment" , error.response?.data?.error);
    }
  }

  async function deleteComment(commentId : string){
if(!selectedTask) return;
try {
  await Axios.delete(`/comment/delete/${commentId}`);
  socket.emit("delete:comment",{
    taskId : selectedTask._id,
    commentId,
  });
  setComments((prev)=>prev.filter((c)=>c._id !== commentId));
  toast.success("comment deleted");
} catch (error : any) {
  toast.error(error.response?.data?.error || 'Error deleting comment');
  console.error("Error deleting comment",error.response?.data?.error);
}
  }

  async function updateComment(commentId : string , newContent : string){
    if(!selectedTask) return;
    try {
      const {data} = await Axios.patch(`/comment/update/${commentId}`,{
        content : newContent,
      })
      socket.emit("update:comment",{
        taskId : selectedTask._id,
        updateComment: data.comment,
      });
      setComments((prev)=>prev.map((c)=>(c._id === commentId ? data.comment : c)))
      setEditingCommentId(null);
      setEditingContent("");
    } catch (error : any) {
       toast.error(error.response?.data?.error || "Error updating comment");
    console.error("Error updating comment", error.response?.data?.error);
    }
  }

  async function fetchTasks() {
    try {
      setLoading(true);
      setError(null);
      const { data } = await Axios.get(TASKS_URL);
      const list: Task[] = Array.isArray(data) ? data : data?.tasks ?? [];
      setTasks(list);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

 async function handleDeleteTask(taskId : string) {
if(!confirm("Are you sure you want to delete this task?")) return ;
try {
    await Axios.delete(`/task/${taskId}`);
    toast.success("task deleted successfully");
    setSelectedTask(null);
    fetchTasks();
} catch (error : any) {
    console.error("error while deleting the task" , error.response?.data?.error);
    toast.error(error.response?.data?.error || "error while deleting the task");
}  
 }

  async function fetchUsers() {
    try {
      const { data } = await Axios.get("/user/all");
      const list: User[] = Array.isArray(data) ? data : data?.users ?? [];
      setUsers(list);
    } catch (e: any) {
  console.error("unable to fetch user :", e?.response?.data || e?.message || e);
}
  }

  useEffect(() => { fetchTasks(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter(t => {
      const matchesQ =
        !q ||
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        (typeof t.assignedTo === "object" && (t.assignedTo?.username?.toLowerCase().includes(q) || t.assignedTo?.email?.toLowerCase().includes(q)));

      const matchesStatus = status === "all" ? true : t.status === status;
      return matchesQ && matchesStatus;
    });
  }, [tasks, query, status]);

  const fmtDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString() : "—";

  const Assignee = ({ task }: { task: Task }) => {
    const a = task.assignedTo as any;
    if (!a) return <span className="text-slate-400 text-sm">Unassigned</span>;
    if (typeof a === "string") return <span className="text-slate-400 text-sm">ID: {a.slice(0, 6)}…</span>;
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
          {(a.username || a.email || "U").charAt(0).toUpperCase()}
        </div>
        <span className="text-slate-300 text-sm font-medium">{a.username || a.email || "User"}</span>
      </div>
    );
  };

  const Badge = ({ children, tone }: { children: React.ReactNode; tone: "blue" | "amber" | "green" | "purple" }) => {
    const tones: Record<string, string> = {
      blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${tones[tone]}`}>
        {children}
      </span>
    );
  };

  const priorityTone = (p: Priority) =>
    p === "high" ? "amber" : p === "medium" ? "purple" : "blue";
  const statusTone = (s: Status) =>
    s === "completed" ? "green" : s === "in-progress" ? "purple" : "amber";

  async function handleCreateTask() {
    try {
      const payload: any = {
        title: formTitle,
        description: formDescription || undefined,
        priority: formPriority,
        dueDate: formDueDate || undefined,
      };

      if (formAssignee !== "unassigned") {
        payload.assignedTo = formAssignee;
      }

      await Axios.post("/task/create-task", payload);
      setShowModal(false);
      setFormTitle("");
      setFormDescription("");
      setFormPriority("low");
      setFormAssignee("unassigned");
      setFormDueDate("");
      fetchTasks();
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Failed to create task");
    }
  }

async function handleUpdateTask() {
  if(! editingTaskId) return;
  try {
    const payload : any = {
      title : formTitle,
      description : formDescription || undefined,
      priority : formPriority,
      dueDate : formDueDate || undefined
    }
  if(formAssignee !== "unassigned"){
        payload.assignedTo = formAssignee;
  }
  await Axios.patch(`/task/${editingTaskId}`,payload);
  toast.success("Task Updated successfully");

  setShowModal(false);
  setEditMode(false);
  setEditingTaskId(null);

  setFormTitle("");
  setFormDescription("");
  setFormPriority("medium");
  setFormAssignee("unassigned");
  setFormDueDate('');

  fetchTasks();
  } catch (error : any) {
    toast.error(error.response?.data?.error || "Failed to update the task")
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Task Management
                </h1>
                <p className="text-slate-400 text-sm">Manage and track all project tasks</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors text-sm"
                  placeholder="Search tasks..."
                />
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="px-3 py-2.5 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={fetchTasks}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>

              <button
                onClick={() => {
                  setShowModal(true);
                  fetchUsers();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all transform hover:scale-105 text-sm shadow-lg"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Task
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                Loading tasks...
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 inline-block">
                {error}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No tasks found</h3>
              <p className="text-slate-400">Try adjusting your filters or create a new task</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-4 px-6 font-semibold text-slate-300 text-sm">Task</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-300 text-sm">Assignee</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-300 text-sm">Priority</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-300 text-sm">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-300 text-sm">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr
                      key={t._id}
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() => setSelectedTask(t)}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-white mb-1">{t.title}</div>
                          {t.description && (
                            <div className="text-sm text-slate-400 line-clamp-2">{t.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Assignee task={t} />
                      </td>
                      <td className="py-4 px-6">
                        <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                      </td>
                      <td className="py-4 px-6 text-slate-300 text-sm">{fmtDate(t.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editMode ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form
              onSubmit={e => {
                e.preventDefault();
                if (editMode) {
                  handleUpdateTask();
                } else {
                  handleCreateTask();
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors resize-none"
                  placeholder="Enter task description (optional)"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Assignee</label>
                <select
                  value={formAssignee}
                  onChange={e => setFormAssignee(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors"
                >
                  <option value="unassigned">Unassigned</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.username || user.email}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditMode(false);
                    setEditingTaskId(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  {editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Drawer */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTask(null)}
          />
          <div className="w-full max-w-lg bg-slate-800/95 backdrop-blur-sm border-l border-white/20 overflow-y-auto shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">{selectedTask.title}</h2>
                  <div className="flex items-center gap-2">
                    <Badge tone={statusTone(selectedTask.status)}>{selectedTask.status}</Badge>
                    <Badge tone={priorityTone(selectedTask.priority)}>{selectedTask.priority}</Badge>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {selectedTask.description && (
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-slate-300 text-sm leading-relaxed">{selectedTask.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs font-medium text-slate-400 mb-2">ASSIGNEE</div>
                  <Assignee task={selectedTask} />
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs font-medium text-slate-400 mb-2">DUE DATE</div>
                  <div className="text-slate-300 text-sm">{fmtDate(selectedTask.dueDate)}</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
                  onClick={()=>{
                    if(!selectedTask) return;
                    setEditMode(true);
                    setEditingTaskId(selectedTask._id);
                    setFormTitle(selectedTask.title);
                    setFormDescription(selectedTask.description || "" );
                    setFormPriority(selectedTask.priority);
                    setFormAssignee(
                      selectedTask.assignedTo
                        ? typeof selectedTask.assignedTo === "object"
                          ? selectedTask.assignedTo._id
                          : selectedTask.assignedTo
                        : "unassigned"
                    );
                    setFormDueDate(selectedTask.dueDate ? selectedTask.dueDate.split("T")[0] : "");
                    setShowModal(true);
                  }}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                
                <button 
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                  onClick={()=>handleDeleteTask(selectedTask._id)}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
                
                <button
                  className="flex-1 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-colors"
                  onClick={() => {
                    if (selectedTask?._id) {
                      fetchComments(selectedTask._id);
                      setShowComments(true);
                    }
                  }}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comments
                </button>
              </div>
              
              {/* Comments Section */}
              {showComments && (
                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Comments</h3>
                    <button
                      onClick={() => setShowComments(false)}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      Hide
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                    {comments.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto mb-3 bg-slate-700/50 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p className="text-slate-400 text-sm">No comments yet</p>
                      </div>
                    ) : (
                      comments.map((c) => (
                        <div key={c._id} className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
                                {(c.userId?.username || "U").charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-slate-300">
                                {c.userId?.username || "Anonymous"}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(c.createdAt).toLocaleString()}
                              </span>
                            </div>
                            {c.userId?._id === currentUser?._id && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    const newContent = prompt("Edit your comment:", c.content);
                                    if (newContent && newContent.trim() !== c.content) {
                                      updateComment(c._id, newContent.trim());
                                    }
                                  }}
                                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={()=>deleteComment(c._id)} 
                                  className="text-xs text-red-400 hover:text-red-300 transition-colors ml-2"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">{c.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-colors"
                    />
                    <button
                      onClick={addComment}
                      className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all transform hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}