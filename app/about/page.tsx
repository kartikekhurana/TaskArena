"use client";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";


const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const backendFeatures = [
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
              stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Authentication & User Management",
    description: "Secure JWT-based authentication with role management, profile updates, and admin oversight capabilities.",
    features: ["JWT Access & Refresh Tokens", "Role-based Permissions", "Profile Management", "Admin Controls"]
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Task Management System",
    description: "Complete task lifecycle management with assignment capabilities, status tracking, and administrative oversight.",
    features: ["Task Creation & Assignment", "Status Tracking", "Personal & Admin Views", "Lifecycle Management"]
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Real-Time Communication",
    description: "WebSocket-powered chat system with instant notifications and room-based communication for seamless collaboration.",
    features: ["WebSocket Chat", "Instant Notifications", "Room-based Communication", "Real-time Updates"]
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Stripe Payment Integration",
    description: "Seamless Pro plan upgrades with secure payment processing, webhook handling, and subscription management.",
    features: ["Stripe Gateway", "Webhook Processing", "Subscription Management", "Secure Checkout"]
  }
];

const techStack = [
  { name: "Next.js", category: "Frontend", color: "from-blue-400 to-blue-600" },
  { name: "TypeScript", category: "Language", color: "from-purple-400 to-purple-600" },
  { name: "Node.js", category: "Backend", color: "from-green-400 to-green-600" },
  { name: "WebSocket", category: "Real-time", color: "from-orange-400 to-orange-600" },
  { name: "JWT", category: "Auth", color: "from-red-400 to-red-600" },
  { name: "Stripe", category: "Payments", color: "from-indigo-400 to-indigo-600" }
];

const stats = [
  { number: "99.9%", label: "Uptime", suffix: "" },
  { number: "100", label: "Response Time", suffix: "ms" },
  { number: "256", label: "Security", suffix: "-bit" },
  { number: "24/7", label: "Support", suffix: "" }
];

export default function AboutPage() {
  const router = useRouter();
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-8 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl"></div>
          <motion.div
            animate={{ 
              background: [
                "radial-gradient(circle at 30% 40%, rgba(147, 51, 234, 0.08) 0%, transparent 50%)",
                "radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)",
                "radial-gradient(circle at 30% 40%, rgba(147, 51, 234, 0.08) 0%, transparent 50%)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
            className="absolute inset-0"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              About{" "}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                TaskArena
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              A robust and scalable task management platform designed to empower teams 
              with seamless collaboration and efficient project tracking.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700"
            >
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 font-medium">Built with modern technologies</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center group"
              >
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 group-hover:border-purple-500/30 transition-all duration-300">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {stat.number}
                    <span className="text-purple-400">{stat.suffix}</span>
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Backend Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-purple-900/5 to-gray-900/20"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Powerful Backend Architecture
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built with security, real-time responsiveness, and scalability at its core
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {backendFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/20 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Modern Tech Stack
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built with cutting-edge technologies for optimal performance and developer experience
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 text-center hover:border-gray-600 transition-all duration-300"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${tech.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-white/20 rounded-lg"></div>
                </div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-purple-300 transition-colors duration-300">
                  {tech.name}
                </h3>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {tech.category}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Real-time Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Real-Time Collaboration
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience instant updates, notifications, and seamless team communication
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Notification Demo */}
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Notifications Panel */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white mb-6">Live Notifications</h3>
                  
                  {[
                    { type: "task", message: "New task assigned: 'Update API documentation'", time: "2s ago", color: "blue" },
                    { type: "comment", message: "Sarah commented on 'Design System'", time: "1m ago", color: "green" },
                    { type: "update", message: "Task status changed to 'In Progress'", time: "3m ago", color: "purple" },
                    { type: "chat", message: "New message in #development", time: "5m ago", color: "orange" }
                  ].map((notification, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + (i * 0.3) }}
                      className="flex items-center gap-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
                    >
                      <div className={`w-3 h-3 bg-${notification.color}-400 rounded-full animate-pulse`}></div>
                      <div className="flex-1">
                        <p className="text-white text-sm mb-1">{notification.message}</p>
                        <p className="text-gray-400 text-xs">{notification.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* WebSocket Status */}
                <div className="lg:pl-8">
                  <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                      <h4 className="text-white font-semibold">WebSocket Connection</h4>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-green-400 font-mono">Connected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Latency:</span>
                        <span className="text-white font-mono">&lt; 100ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Users:</span>
                        <span className="text-purple-400 font-mono">12 online</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Messages Today:</span>
                        <span className="text-blue-400 font-mono">1,247</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-12 h-12 bg-purple-500/20 rounded-xl border border-purple-400/30"
            />
            <motion.div
              animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
              className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-500/20 rounded-lg border border-blue-400/30"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-purple-500/5"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Experience TaskArena Today
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join the future of task management with our powerful, scalable platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 text-lg" onClick={()=>{router.push('/signup')}}>
                Get Started Free
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}