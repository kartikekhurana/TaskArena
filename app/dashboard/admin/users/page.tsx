"use client";
import { motion, AnimatePresence } from 'framer-motion';
import toast from "react-hot-toast";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Crown, 
  Shield, 
  User, 
  Mail, 
  Calendar, 
  Activity,
  MoreVertical,
  UserCheck,
  UserX,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  RefreshCw,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Axios from '@/lib/axios';

interface User{
    _id : string ;
    username : string;
    email : string;
    avatar? : string;
    role : 'user' | "admin";
    ispro? : boolean 
    createdAt: string;
    updatedAt: string;
}
interface UserModalData { 
    user : User | null
    isOpen : boolean;
    mode : 'view' | 'edit'
}

export default function AdminUserPage(){
const [users ,setUsers] = useState<User[]>([]);
const [filteredUsers , setFilteredUsers] = useState<User[]>([]);
const [loading , setLoading] = useState(false);
const [refershing , setRefreshing] = useState(false);

const [searchTerm , setSearchTerm] = useState('');
const [roleFilter , setRoleFilter] = useState<"all" | "user" | "admin">('all');
const [proFilter , setProFilter] = useState<'all' | "pro" | "free">('all');
const [sortBy , setSortBy] = useState<"newest" | "oldest" | "name" | "email">('newest');

const [modal , setModal] = useState<UserModalData>({
    user : null,
    isOpen : false,
    mode: "view"
})
 const stats = {
    totalUsers: users.length,
    proUsers: users.filter(u => u.ispro).length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    activeUsers: users.filter(u => u.updatedAt && 
      new Date(u.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length
  }
  useEffect(()=>{
    fetchUsers();
  },[]);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, roleFilter, proFilter, sortBy]);

  const fetchUsers = async() =>{
try {
    setRefreshing(true);
    const response = await Axios.get('/user/all');
    setUsers(response.data.users || []);
} catch (error : any) {
    console.error("failed to fetch users" ,error.response?.data?.error);
    toast.error(error.response?.data?.error || "failed to fetch users");
}finally{
    setLoading(false);
    setRefreshing(false);
}
  }
  
  const filterAndSortUsers = () => {
    // eslint-disable-next-line prefer-const
    let filtered = users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesPro = proFilter === 'all' || 
                        (proFilter === 'pro' && user.ispro) ||
                        (proFilter === 'free' && !user.ispro);
      
      return matchesSearch && matchesRole && matchesPro;
    });

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.username.localeCompare(b.username);
        case 'email':
          return a.email.localeCompare(b.email);
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  };
const updateUserRole = async(userId : string , newRole : 'user' | "admin") =>{
try {
    await Axios.patch(`/user/role/${userId}`,{role :newRole});
    toast.success(`User role updated to ${newRole}`);
   setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      setModal({ user: null, isOpen: false, mode: 'view' });
} catch (error :any) {
    console.error("Failed to update user Role " , error.response?.data?.error);
    toast.error(error.response?.data?.error || 'Failed to update user Role');
}

}
const deleteUser = async(userId : string) =>{
    if(!confirm(`Are you sure you want to delete this user ? this action cannot be undone`)){
        return;
    }
    try {
        await Axios.delete(`/admin/user/${userId}`);
        toast.success('user deleted successfully');
        setUsers(prev => prev.filter(user =>user._id !== userId));
        setModal({user : null , isOpen : false  , mode: 'view'});
    } catch (error : any) {
        console.error('Failed to delete user:', error.response?.data?.error);
      toast.error(error.response?.data?.error || 'Failed to delete user');
    }
}
 const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            change > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            <TrendingUp size={12} />
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
    </motion.div>
  );
  const UserCard = ({ user }: { user: User }) => (
    <motion.div
      layout
      className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-700/40 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gray-700 overflow-hidden flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-medium text-white">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {user.ispro && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
                <Crown size={12} className="text-white" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-white truncate">{user.username}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                user.role === 'admin' 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {user.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
            <p className="text-sm text-gray-400 truncate">{user.email}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
              {user.updatedAt && (
                <span className="flex items-center gap-1">
                  <Activity size={12} />
                  Active {new Date(user.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setModal({ user, isOpen: true, mode: 'view' })}
            className="p-2 hover:bg-gray-600/50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={16} className="text-gray-400" />
          </button>
          <button
            onClick={() => setModal({ user, isOpen: true, mode: 'edit' })}
            className="p-2 hover:bg-gray-600/50 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit3 size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const UserModal = () => {
    if (!modal.isOpen || !modal.user) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setModal({ user: null, isOpen: false, mode: 'view' })}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {modal.mode === 'edit' ? 'Edit User' : 'User Details'}
              </h2>
              <button
                onClick={() => setModal({ user: null, isOpen: false, mode: 'view' })}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gray-700 overflow-hidden flex items-center justify-center">
                    {modal.user.avatar ? (
                      <img src={modal.user.avatar} alt={modal.user.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-medium text-white">
                        {modal.user.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {modal.user.ispro && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
                      <Crown size={14} className="text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{modal.user.username}</h3>
                  <p className="text-gray-400">{modal.user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      modal.user.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {modal.user.role === 'admin' ? 'Administrator' : 'User'}
                    </span>
                    {modal.user.ispro && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Pro Member
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-400">Joined</p>
                  <p className="text-white">{new Date(modal.user.createdAt).toLocaleDateString()}</p>
                </div>
                {modal.user.updatedAt && (
                  <div className="space-y-1">
                    <p className="text-gray-400">Last Active</p>
                    <p className="text-white">{new Date(modal.user.updatedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {modal.mode === 'edit' && (
                <div className="space-y-4 pt-4 border-t border-gray-700/50">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">User Role</label>
                    <select
                      value={modal.user.role}
                      onChange={(e) => updateUserRole(modal.user!._id, e.target.value as 'user' | 'admin')}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value="user">User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => deleteUser(modal.user!._id)}
                      className="flex-1 px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-600/30 transition-colors"
                    >
                      Delete User
                    </button>
                    <button
                      onClick={() => setModal({ user: null, isOpen: false, mode: 'view' })}
                      className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };
if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-gray-900/50 border border-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-900/50 border border-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
 return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage all registered users and their permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={refershing}
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-300 hover:bg-purple-600/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={refershing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="from-blue-500 to-blue-600"
          change={12}
        />
        <StatCard
          title="Pro Members"
          value={stats.proUsers}
          icon={Crown}
          color="from-amber-500 to-amber-600"
          change={8}
        />
        <StatCard
          title="Administrators"
          value={stats.adminUsers}
          icon={Shield}
          color="from-purple-500 to-purple-600"
          change={-2}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Activity}
          color="from-emerald-500 to-emerald-600"
          change={15}
        />
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'admin')}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={proFilter}
            onChange={(e) => setProFilter(e.target.value as 'all' | 'pro' | 'free')}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="all">All Members</option>
            <option value="pro">Pro Members</option>
            <option value="free">Free Members</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name' | 'email')}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="email">Email A-Z</option>
          </select>
        </div>
      </motion.div>

      {/* Users Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-12">
          <UserX size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* User Modal */}
      <UserModal />
    </div>
  );
}
