"use client";
import Axios from "@/lib/axios";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Users, 
  ClipboardList, 
  TrendingUp, 
  Activity,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Crown,
  Calendar,
  MessageSquare,
  DollarSign,
  Zap,
  Eye,
  Edit3,
  Trash2,
  UserX,
  Shield,
  Star,
  BarChart3,
  Filter,
  Search,
  RefreshCw,
  Plus,
  Settings
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";



interface User{
    _id : string;
    username : string;
    email : string;
    avatar? : string;
    role : string;
    isPro?: boolean;
    createdAt : string
     updatedAt?  : string
}

interface Task{
    _id : string;
    title : string ;
    description : string;
    status : 'pending' | "in-progress" | "completed";
    priority : "low" | "medium" | "high";
    assignedTo? : User;
    createdAt : string;
    updatedAt  : string;
    dueDate? : string;
}
interface Comment { 
    _id : string;
    content : string;
    taskId : string; 
    author : User;
    createdAt : string;
    updatedAt? : string;
}

interface DashBoardData {
    users : User[];
    tasks : Task[];
    recentComments : Comment[];
    stats : {
        overdueTasks: any;
        totalUsers : number;
        totalTasks : number;
proUsers : number;
pendingTasks : number;
inProgressTasks : number;
completedTasks : number;
recentSignups : number;
revenue : number;
activeUsers : number;
completionRate : number;
    };
}

export default function AdminDashBoard() {
    const [loading , setLoading] = useState(true);
    const [refreshing , setRefreshing] = useState(false);
    const [data , setData] = useState<DashBoardData>({
        users : [],
        tasks : [],
        recentComments : [],
        stats : {
            totalUsers : 0,
            totalTasks : 0,
            proUsers: 0,
            pendingTasks : 0,
            inProgressTasks : 0,
            completedTasks : 0,
            overdueTasks: 0,
            recentSignups : 0,
            revenue : 0,
            activeUsers : 0,
            completionRate : 0,
        }
    })
const [selectedUserId , setSelectedUserId] = useState<string>("");
const [userTasks , setUserTasks] = useState<Task[]>([]);
const [taskComments , setTaskComments] = useState<{[taskId : string] : Comment[]}>({});
const [showUserModal , setShowUserModal] = useState(false);
const [showTaskModal , setTaskModal] = useState(false);
const[editingUser , setEditingUser] = useState<User | null>(null);

useEffect(()=>{
fetchDashBoardData();
},[])

const fetchDashBoardData = async() =>{
    try {
        setRefreshing(true);
        const userRes = await Axios.get('/user/all');
        const users = userRes.data.users || [];

        const myStatsRes = await Axios.get('/user/stats').catch(() => ({ 
        data: { pending: 0, inProgress: 0, completed: 0, overdue: 0 } 
      }));
      const myStats = myStatsRes.data;

 const myTasksRes = await Axios.get('/user/my-tasks').catch(() => ({ data: { tasks: [] } }));
      const myTasks = myTasksRes.data.tasks || [];
   
       const recentTaskIds = myTasks.slice(0, 5).map((t: { _id: any; }) => t._id);
      const commentsPromises = recentTaskIds.map((taskId: any) => 
        Axios.get(`/comment/${taskId}`).catch(() => ({ data: { comments: [] } }))
      );
      const commentResult = await Promise.all(commentsPromises);
      const recentComment = commentResult.flatMap(result =>result.data.comments || []).slice(0,10);

      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const stats = {
        totalUsers : users.length,
        totalTasks : myTasks.length,
        proUsers : users.filter((u : User)=>u.isPro).length,
        pendingTasks : myStats.pending || 0 ,
        inProgressTasks : myStats.inProgress || 0,
        completedTasks : myStats.completed || 0,
        overdueTasks : myStats.overdue || 0,
      recentSignups: users.filter((u: User) => new Date(u.createdAt) > lastWeek).length,
        revenue: users.filter((u: User) => u.isPro).length * 29,
        activeUsers: users.filter((u: User) => u.updatedAt && new Date(u.updatedAt) > lastWeek).length,
        completionRate: myTasks.length > 0 ? Math.round((myStats.completed / myTasks.length) * 100) : 0
      }
      setData({
        users : users.slice().sort((a : User , b : User)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        tasks : myTasks.slice().sort((a : Task , b : Task)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        recentComments : recentComment,
        stats
      })
    } catch (error :any) {
        console.error("Admin Dashboard error : ",error.response?.data?.error);
        toast.error("Dashboard error : ", error.response?.data?.error);
    }finally{
        setLoading(false);
        setRefreshing(false)
    }
}
const fetchUserTasks = async(userId : string) =>{
try {
 toast("Individual task viewing requires specific task ID");
 setUserTasks([]);
} catch (error : any) {
    console.error("fetch user task error :" , error.response?.data?.error);
}
}
const fetchTaskComments = async(taskId : string) =>{
    try {
        const res = await Axios.get(`/comment/${taskId}`);
        setTaskComments(prev =>({
            ...prev , [taskId] : res.data.comments || []
        }))
    } catch (error : any) {
        console.error("failed to fetch task comments : ",error.response?.data?.error);

    }
}
 const UpdateUserRole = async(userId : string , newRole : string) =>{
    try {
        await Axios.patch(`/user/role/${userId}`,{role : newRole});
        toast.success(`User role updated to ${newRole}`);
        fetchDashBoardData();
    } catch (error : any) {
        console.error("user role updation error : ",error.response?.data?.error);
        toast.error(error.response?.data?.error || "Failed to update user role")
    }
 }
  const deletedTask = async(taskId : string) =>{
    try {
        await Axios.delete(`/task/${taskId}`);
        toast.success("Task deleted successfully");
        fetchDashBoardData()
    } catch (error :any) {
        console.error("Failed to delete the task : ", error.response?.data?.error);
           toast.error(error.response?.data?.error || "Failed to update task");
    }
  }
   const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      await Axios.patch(`/task/${taskId}`, { status }); 
      toast.success("Task status updated");
      fetchDashBoardData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update task");
    }
  };


   const StatCard = ({ title, value, icon: Icon, color, trend, onClick }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/60 transition-all cursor-pointer backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            trend > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            <TrendingUp size={12} />
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
    </motion.div>
  )


   const UserCard = ({ user }: { user: User }) => (
    <motion.div
      layout
      className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-700/40 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-700 overflow-hidden flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-medium text-white">
                {user.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-white">{user.username}</p>
              {user.isPro && <Crown size={14} className="text-amber-400" />}
            </div>
            <p className="text-xs text-gray-400">{user.email}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedUserId(user._id);
              fetchUserTasks(user._id);
            }}
            className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
            title="View Tasks"
          >
            <Eye size={14} className="text-gray-400" />
          </button>
          <button
            onClick={() => {
              setEditingUser(user);
              setShowUserModal(true);
            }}
            className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit3 size={14} className="text-gray-400" />
          </button>
          <select
            value={user.role}
            onChange={(e) => UpdateUserRole(user._id, e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded text-xs px-2 py-1 text-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
   const TaskCard = ({ task }: { task: Task }) => {
    const statusColors = {
      'pending': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'in-progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'completed': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    };

    const priorityColors = {
      'high': 'bg-red-500',
      'medium': 'bg-amber-500',
      'low': 'bg-green-500'
    };

    return (
      <motion.div
        layout
        className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-700/40 transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-3 h-3 rounded-full ${task.priority ? priorityColors[task.priority] : 'bg-gray-500'}`} />
            <div className="flex-1">
              <h3 className="font-medium text-white truncate">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-400 line-clamp-2 mt-1">{task.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTaskComments(task._id)}
              className="p-1.5 hover:bg-gray-600/50 rounded-lg transition-colors"
              title="View Comments"
            >
              <MessageSquare size={14} className="text-gray-400" />
            </button>
            <button
              onClick={() => deletedTask(task._id)}
              className="p-1.5 hover:bg-red-600/50 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs border font-medium ${statusColors[task.status]}`}>
              {task.status.replace('-', ' ')}
            </span>
            {task.assignedTo && (
              <span className="text-xs text-gray-500">
                → {task.assignedTo.username}
              </span>
            )}
          </div>
          <select
            value={task.status}
            onChange={(e) => updateTaskStatus(task._id, e.target.value as Task['status'])}
            className="bg-gray-700 border border-gray-600 rounded text-xs px-2 py-1 text-white"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {taskComments[task._id] && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <h4 className="text-xs font-medium text-gray-300 mb-2">Recent Comments</h4>
            <div className="space-y-2">
              {taskComments[task._id].slice(0, 2).map((comment) => (
                <div key={comment._id} className="bg-gray-700/30 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-white">{comment.author.username}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

if(loading){
    return(
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                   <div className="h-8 w-64 bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-gray-800 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-gray-900/50 border border-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-900/50 border border-gray-800 rounded-2xl animate-pulse" />
          <div className="h-96 bg-gray-900/50 border border-gray-800 rounded-2xl animate-pulse" />
        </div>
        </div>
    )
}
return(
    <div className="space-y-6">
       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Control Center</h1>
        <p className="text-gray-400">Comprehensive platform management and analytics</p>
        </div>
        <div className="flex items-center gap-3">
            <button disabled={refreshing} onClick={fetchDashBoardData}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-300 hover:bg-purple-600/30 transition-colors disabled:opacity-50"
            >
<RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
Refresh
            </button>
             <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
            <Activity size={16} className="text-green-400" />
            <span className="text-sm text-green-300">Live System</span>
          </div>
        </div>
      </motion.div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={data.stats.totalUsers}
          icon={Users}
          color="from-blue-500 to-blue-600"
          trend={12}
        />
        <StatCard
          title="Total Tasks"
          value={data.stats.totalTasks}
          icon={ClipboardList}
          color="from-purple-500 to-purple-600"
          trend={8}
        />
        <StatCard
          title="Pro Subscriptions"
          value={data.stats.proUsers}
          icon={Crown}
          color="from-amber-500 to-amber-600"
          trend={25}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${data.stats.revenue}`}
          icon={DollarSign}
          color="from-emerald-500 to-emerald-600"
          trend={18}
        />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Recent Signups (7d)"
          value={data.stats.recentSignups}
          icon={UserCheck}
          color="from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Active Users"
          value={data.stats.activeUsers}
          icon={Zap}
          color="from-pink-500 to-pink-600"
        />
        <StatCard
          title="Completion Rate"
          value={`${data.stats.completionRate}%`}
          icon={BarChart3}
          color="from-teal-500 to-teal-600"
        />
        <StatCard
          title="Overdue Tasks"
          value={data.stats.overdueTasks}
          icon={AlertCircle}
          color="from-red-500 to-red-600"
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm"
        >
              <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">User Management</h2>
<div className="flex items-center gap-3">
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg">
    <Crown size={14} className="text-amber-400" />
                <span className="text-xs text-gray-300">{data.stats.proUsers} Pro</span>
    </div>
      <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                View All ({data.stats.totalUsers})
              </button>
</div>
              </div>
               <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {data.users.slice(0, 8).map((user) => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          </div>
        </motion.div>
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm"
        >
          <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Task Management</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-gray-300">{data.stats.pendingTasks}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-gray-300">{data.stats.inProgressTasks}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-gray-300">{data.stats.completedTasks}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {data.tasks.slice(0, 6).map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
       <AnimatePresence>
        {selectedUserId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm"
          >
            <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                User Tasks - {data.users.find(u => u._id === selectedUserId)?.username}
              </h2>
              <button
                onClick={() => setSelectedUserId("")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userTasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
              {userTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No tasks found for this user
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
         <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm"
      >
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold text-white">Recent Activity & Comments</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.recentComments.map((comment) => (
              <motion.div
                key={comment._id}
                className="flex items-start gap-4 p-4 bg-gray-800/40 rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={16} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{comment.author.username}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{comment.content}</p>
                </div>
              </motion.div>
            ))}
            {data.recentComments.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No recent comments
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
)
}