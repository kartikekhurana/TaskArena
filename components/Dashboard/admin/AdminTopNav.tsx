"use client";
import Axios from "@/lib/axios";
import io from "socket.io-client";
import { Socket } from 'socket.io-client';
import { 
  Bell, 
  Menu, 
  Settings, 
  Users, 
  Shield, 
  BarChart3, 
  Activity,
  Search,
  ChevronDown,
  LogOut,
  User,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  isPro?: boolean;
}

interface Notification {
  id: string;
  message: string;
  read: boolean;
  type: 'task' | 'user' | 'system' | 'comment';
  timestamp: string;
  userId?: string;
  taskId?: string;
}

interface AdminTopNavProps {
  toggleSideBar: () => void;
}

const socketUrl = "/";

const AdminTopNav: React.FC<AdminTopNavProps> = ({ toggleSideBar }) => {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize user and socket
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await Axios.get('/user/profile');
        setUser(data.user);
        
        // Verify admin role
        if (data.user.role !== 'admin') {
          toast.error("Unauthorized: Admin access required");
          router.push('/dashboard');
          return;
        }
      } catch (error: any) {
        console.error("Error loading admin user:", error.message);
        toast.error(error?.response?.data?.error || "Failed to load admin profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    
    // Initialize socket connection
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [router]);

  // Socket event listeners for admin notifications
  useEffect(() => {
    if (socket && user) {
      // Admin-specific notification events
      const adminNotifyEvent = `notify:${user.id}`;
      const globalAdminEvent = 'admin:notification';
      
      const handleNotification = (notification: Notification) => {
        setNotifications(prev => [{
          ...notification,
          id: notification.id || Date.now().toString(),
          timestamp: notification.timestamp || new Date().toISOString()
        }, ...prev.slice(0, 49)]); // Keep max 50 notifications
        
        // Show toast for important notifications
        if (['user', 'system'].includes(notification.type)) {
          toast.success(`Admin: ${notification.message}`);
        }
      };

      const handleTaskNotification = (data: any) => {
        const notification: Notification = {
          id: Date.now().toString(),
          message: `New task activity: ${data.title || 'Task updated'}`,
          read: false,
          type: 'task',
          timestamp: new Date().toISOString(),
          taskId: data._id
        };
        handleNotification(notification);
      };

      const handleUserNotification = (data: any) => {
        const notification: Notification = {
          id: Date.now().toString(),
          message: `User activity: ${data.message}`,
          read: false,
          type: 'user',
          timestamp: new Date().toISOString(),
          userId: data.userId
        };
        handleNotification(notification);
      };

      // Listen to various admin events
      socket.on(adminNotifyEvent, handleNotification);
      socket.on(globalAdminEvent, handleNotification);
      socket.on('task:created', handleTaskNotification);
      socket.on('task:updated', handleTaskNotification);
      socket.on('task:deleted', handleTaskNotification);
      socket.on('user:registered', handleUserNotification);
      socket.on('user:upgraded', handleUserNotification);

      return () => {
        socket.off(adminNotifyEvent);
        socket.off(globalAdminEvent);
        socket.off('task:created');
        socket.off('task:updated');
        socket.off('task:deleted');
        socket.off('user:registered');
        socket.off('user:upgraded');
      };
    }
  }, [socket, user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = async () => {
    try {
      await Axios.post('/auth/logout');
      toast.success("Logged out successfully");
      router.push('/login');
    } catch (error: any) {
      toast.error("Logout failed");
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task': return '📋';
      case 'user': return '👤';
      case 'system': return '⚙️';
      case 'comment': return '💬';
      default: return '🔔';
    }
  };

  const getUserInitials = (username?: string) => {
    if (!username) return "A";
    const names = username.trim().split(" ");
    if (names.length === 0) return "A";
    if (names.length === 1) return names[0][0]?.toUpperCase() || "A";
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  if (loading) {
    return (
      <nav className="w-full bg-gray-900 border-b border-gray-800 text-white flex items-center justify-between px-4 py-3 md:py-4 fixed top-0 left-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-gray-700 animate-pulse rounded"></div>
          <div className="w-32 h-6 bg-gray-700 animate-pulse rounded"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-700 animate-pulse rounded-full"></div>
          <div className="w-8 h-8 bg-gray-700 animate-pulse rounded-full"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 border-b border-gray-700/50 text-white flex items-center justify-between px-4 py-3 md:py-4 fixed top-0 left-0 z-50 backdrop-blur-xl">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSideBar} 
          aria-label="Toggle Sidebar" 
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          <Menu size={20} />
        </motion.button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                TaskArena
              </h1>
              <p className="text-xs text-purple-400 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Center Section - Quick Stats (hidden on mobile) */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-4 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-green-400" />
            <span className="text-sm text-gray-300">System Active</span>
          </div>
          <div className="w-px h-4 bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-400" />
            <span className="text-sm text-gray-300">Online Users</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Quick Search - Hidden on mobile */}
        <div className="hidden md:block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Search"
          >
            <Search size={18} className="text-gray-400 hover:text-white" />
          </motion.button>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)} 
            aria-label="Notifications" 
            className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 max-h-96 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {/* Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-gray-700/50 to-gray-600/50 border-b border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Admin Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      <Bell size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 20).map((notification) => (
                      <motion.div 
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 border-b border-gray-700/30 hover:bg-gray-700/30 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-purple-500/5 border-l-2 border-l-purple-500' : ''
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${notification.read ? 'text-gray-300' : 'text-white font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Admin Profile Menu */}
        <div className="relative" ref={profileRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-gray-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <div className="relative">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                  {getUserInitials(user?.username)}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full border border-gray-900 flex items-center justify-center">
                <Crown size={8} className="text-white" />
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs text-purple-400">Administrator</p>
            </div>
            <ChevronDown size={14} className={`hidden sm:block text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-700/50">
                    <p className="text-sm font-medium text-white">{user?.username}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 flex items-center gap-3 transition-colors">
                    <User size={16} />
                    Profile Settings
                  </button>
                  
                  <div className="border-t border-gray-700/50 mt-1 pt-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default AdminTopNav;