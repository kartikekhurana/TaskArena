"use client";
import Axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { Plus, Filter, Search, Calendar, Flag, Clock, Zap, Target, CheckCircle2, Circle, PlayCircle, RefreshCcw, MessageCircle } from "lucide-react";
import Taskcomments from "@/components/Taskcomments";

type TaskStatus = "pending" | "in-progress" | "completed";
type TaskPriority = "low" | "medium" | "high";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const ,
      damping: 25,
      stiffness: 300
    }
  }
};

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  
  // TaskComments state
  const [showComments, setShowComments] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await Axios.get('/user/my-tasks');
      setTasks(data.tasks || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesFilter = filter === "all" || task.status === filter;
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                          task.description?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  const statusCounts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    "in-progress": tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length
  }), [tasks]);

  const getStatusConfig = (status: TaskStatus) => {
    const configs = {
      "pending": {
        bg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
        border: "border-amber-400/30",
        text: "text-amber-300",
        icon: Circle,
        glow: "shadow-amber-500/20"
      },
      "in-progress": {
        bg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
        border: "border-blue-400/30",
        text: "text-blue-300",
        icon: PlayCircle,
        glow: "shadow-blue-500/20"
      },
      "completed": {
        bg: "bg-gradient-to-br from-emerald-500/20 to-green-500/20",
        border: "border-emerald-400/30",
        text: "text-emerald-300",
        icon: CheckCircle2,
        glow: "shadow-emerald-500/20"
      }
    };
    return configs[status];
  };

  const getPriorityConfig = (priority?: TaskPriority) => {
    if (!priority) return { color: "bg-gray-500", glow: "" };
    const configs = {
      low: { color: "bg-green-500", glow: "shadow-lg shadow-green-500/30" },
      medium: { color: "bg-amber-500", glow: "shadow-lg shadow-amber-500/30" },
      high: { color: "bg-red-500", glow: "shadow-lg shadow-red-500/30" }
    };
    return configs[priority];
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await Axios.patch(`/task/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
      toast.success("Task updated successfully");
    } catch (error: any) {
      toast.error("Failed to update task");
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    return <Icon size={16} className={config.text} />;
  };

  // Comment handlers
  const handleOpenComments = (taskId: string) => {
    setActiveTaskId(taskId);
    setShowComments(true);
  };

  const handleCloseComments = () => {
    setShowComments(false);
    setActiveTaskId(null);
    return "";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="h-12 w-64 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl animate-pulse" />
            <div className="h-6 w-96 bg-gray-800 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gradient-to-r from-gray-900/30 to-gray-800/30 border border-gray-700 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Header */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" />
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                      My Tasks
                    </h1>
                  </div>
                  <p className="text-gray-400 text-lg">Manage your workflow with precision and style</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold overflow-hidden"
                  onClick={fetchTasks}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-3">
                    <RefreshCcw size={20} />
                    <span>Refresh Tasks</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { key: "all", label: "Total Tasks", icon: Target, gradient: "from-indigo-500 to-purple-600" },
              { key: "pending", label: "Pending", icon: Clock, gradient: "from-amber-500 to-orange-600" },
              { key: "in-progress", label: "In Progress", icon: Zap, gradient: "from-blue-500 to-cyan-600" },
              { key: "completed", label: "Completed", icon: CheckCircle2, gradient: "from-emerald-500 to-green-600" }
            ].map(({ key, label, icon: Icon, gradient }) => (
              <motion.button
                key={key}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(key as TaskStatus | "all")}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                  filter === key
                    ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-2xl"
                    : "bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 hover:border-gray-600/50"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <Icon size={24} className={`${filter === key ? "text-white" : "text-gray-400"} transition-colors`} />
                    <div className={`w-2 h-2 rounded-full ${filter === key ? "bg-white" : "bg-gray-600"} transition-colors`} />
                  </div>
                  <div className="text-left">
                    <div className={`text-3xl font-bold ${filter === key ? "text-white" : "text-gray-300"} transition-colors`}>
                      {statusCounts[key as keyof typeof statusCounts]}
                    </div>
                    <div className={`text-sm ${filter === key ? "text-gray-300" : "text-gray-500"} transition-colors`}>
                      {label}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Search & Controls */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative group">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search your tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 focus:bg-gray-900/70 transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* Tasks Display */}
          <motion.div variants={itemVariants} className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task, index) => {
                const statusConfig = getStatusConfig(task.status);
                const priorityConfig = getPriorityConfig(task.priority);
                
                return (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ 
                      type: "spring", 
                      damping: 25, 
                      stiffness: 300,
                      delay: index * 0.1 
                    }}
                    className="group relative"
                  >
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 ${statusConfig.glow} opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-all duration-500`} />
                    
                    {/* Task Card */}
                    <div className={`relative ${statusConfig.bg} backdrop-blur-xl ${statusConfig.border} border rounded-3xl p-8 transition-all duration-300`}>
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Priority Indicator */}
                          <div className={`w-4 h-4 rounded-full ${priorityConfig.color} ${priorityConfig.glow} mt-1 transition-all duration-300`} />
                          
                          <div className="flex-1 space-y-4">
                            {/* Header */}
                            <div className="flex items-center gap-4 flex-wrap">
                              <h3 className="text-xl font-bold text-white group-hover:text-gray-100 transition-colors">
                                {task.title}
                              </h3>
                              <div className={`flex items-center gap-2 px-3 py-1.5 ${statusConfig.bg} ${statusConfig.border} border rounded-full`}>
                                {getStatusIcon(task.status)}
                                <span className={`text-sm font-medium ${statusConfig.text} capitalize`}>
                                  {task.status.replace('-', ' ')}
                                </span>
                              </div>
                              {task.priority && (
                                <div className="px-3 py-1.5 bg-gray-800/50 border border-gray-600/50 rounded-full">
                                  <span className="text-sm text-gray-300 capitalize">
                                    {task.priority} Priority
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Description */}
                            {task.description && (
                              <p className="text-gray-400 text-lg leading-relaxed">
                                {task.description}
                              </p>
                            )}
                            
                            {/* Meta Info */}
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              {task.dueDate && (
                                <div className="flex items-center gap-2">
                                  <Calendar size={16} />
                                  <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>Created {new Date(task.createdAt || '').toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenComments(task._id)}
                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/20 rounded-xl font-medium transition-all flex items-center gap-2"
                          >
                            <MessageCircle size={16} />
                            Chat
                          </motion.button>
                          {task.status === "pending" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateTaskStatus(task._id, "in-progress")}
                              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/20 rounded-xl font-medium transition-all"
                            >
                              Start
                            </motion.button>
                          )}
                          {task.status === "in-progress" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateTaskStatus(task._id, "completed")}
                              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/20 rounded-xl font-medium transition-all"
                            >
                              Complete
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {/* Empty State */}
            {filteredTasks.length === 0 && (
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-400/10 rounded-3xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-gray-900/30 to-gray-800/20 backdrop-blur-xl border border-gray-700/30 rounded-3xl p-16 text-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  >
                    <Flag size={32} className="text-gray-300" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">No Tasks Found</h3>
                  <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                    {search ? "Try adjusting your search criteria" : "You're all caught up – waiting for your next assignment."}
                  </p>
                  {!search && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold"
                      onClick={fetchTasks}
                    >
                      Refresh Tasks
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* TaskComments Component */}
      {showComments && activeTaskId && (
        <Taskcomments 
          taskId={activeTaskId}
          isOpen={showComments}
          onClose={handleCloseComments}
        />
      )}
    
    </main>
  );
}