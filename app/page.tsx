"use client";
import { motion, Variants, easeOut } from "framer-motion";
import { useRouter } from "next/navigation";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.7, ease: easeOut }
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const lines = [
  "Collaborate in real-time, assign and track tasks with precision,",
  "and keep your entire team in perfect sync—all within a beautifully",
  "simple, distraction-free workspace designed for productivity."
];

const features = [
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Enterprise Security",
    description: "Bank-grade encryption and role-based access control ensure your data stays protected while enabling seamless collaboration."
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Lightning Fast",
    description: "Real-time updates, instant notifications, and sub-100ms response times keep your team moving at the speed of thought."
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Smart Automation",
    description: "Intelligent task routing, automated progress tracking, and predictive analytics that adapt to your team's workflow."
  }
];

export default function Home() {
  const router = useRouter();
  return (
    <>
      <div className="relative w-full bg-black">
        <main className="relative min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -left-4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 -right-8 w-96 h-96 bg-purple-400/6 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/3 via-transparent to-blue-500/3 rounded-full blur-3xl"></div>
            
            {/* Animated gradient mesh */}
            <motion.div
              animate={{ 
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)"
                ]
              }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="absolute inset-0"
            />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              
              {/* Left Content */}
              <motion.div
                className="text-left max-w-2xl"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white mb-6"
                >
                  Build better products
                  <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    with your team
                  </span>
                </motion.h1>
                
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-8 space-y-1"
                >
                  {lines.map((line, i) => (
                    <motion.div key={i} variants={lineVariants}>
                      {line}
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200" onClick={()=>router.push('/pricing')}>
                    Start building
                  </button>
                </motion.div>
              </motion.div>

              {/* Right Visualization */}
              <motion.div
                className="relative h-[400px] sm:h-[500px] lg:h-[600px]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {/* Floating Geometric Shapes */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 3, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                  className="absolute top-12 left-8 w-16 h-16 border border-gray-700 rounded-xl opacity-40"
                />
                <motion.div
                  animate={{ 
                    y: [0, 15, 0],
                    rotate: [0, -2, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }}
                  className="absolute bottom-20 right-12 w-12 h-12 border border-purple-400/30 rounded-full"
                />

                {/* Main Analytics Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20, rotateX: 5 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  className="absolute top-8 left-0 w-full max-w-sm bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-gray-400 text-sm">Team velocity</div>
                      <div className="text-white text-2xl font-bold">+32.1%</div>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                      30d
                    </div>
                  </div>
                  
                  {/* Mini Chart */}
                  <div className="relative h-20 flex items-end justify-between gap-1 mb-4">
                    {[45, 52, 48, 63, 58, 71, 68, 78, 74, 82, 79, 85].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.6, delay: 0.8 + (i * 0.05) }}
                        className="flex-1 bg-gradient-to-t from-purple-500/60 to-purple-400/20 rounded-sm"
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-400">Active: 12</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-400">Done: 47</span>
                    </div>
                  </div>
                </motion.div>

                {/* Task Progress Card */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute top-1/2 right-0 w-40 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-4 shadow-xl"
                >
                  <div className="text-gray-400 text-sm mb-3">Sprint progress</div>
                  
                  <div className="relative w-16 h-16 mx-auto mb-3">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-gray-700"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={176}
                        initial={{ strokeDashoffset: 176 }}
                        animate={{ strokeDashoffset: 44 }}
                        transition={{ duration: 2, delay: 1 }}
                        className="text-purple-400"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span 
                        className="text-white text-sm font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        75%
                      </motion.span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-white text-lg font-semibold">18/24</div>
                    <div className="text-gray-500 text-xs">tasks complete</div>
                  </div>
                </motion.div>

                {/* Floating Metrics */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="absolute bottom-8 left-1/4 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-800 px-3 py-2 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Online: 8</span>
                  </div>
                </motion.div>

                {/* Subtle accents */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute top-1/4 right-1/4 w-1 h-1 bg-purple-400/50 rounded-full"
                />
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-purple-900/5 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Built for modern teams
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to ship faster and collaborate better
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group relative bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 lg:p-8 hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-purple-400 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SURPRISE: Interactive Command Palette Demo */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900/20 to-black relative overflow-hidden">
        {/* Purple ambient lighting */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-purple-500/4 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Work at the speed of thought
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Command palette, keyboard shortcuts, and AI assistance built right in
            </p>
            <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm text-gray-400">
              <kbd className="bg-gray-700 px-2 py-1 rounded text-xs font-mono">⌘</kbd>
              <kbd className="bg-gray-700 px-2 py-1 rounded text-xs font-mono">K</kbd>
              <span>to open command palette</span>
            </div>
          </motion.div>

          {/* Interactive Command Palette Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative max-w-2xl mx-auto"
          >
            {/* Command Palette Container */}
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <motion.div
                    className="flex-1 text-white text-lg"
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      create new task
                    </motion.span>
                    <motion.div 
                      className="inline-block w-0.5 h-6 bg-purple-400 ml-1"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Command Results */}
              <div className="p-2 space-y-1">
                {[
                  { icon: "📝", title: "Create new task", desc: "Add a task to current project", shortcut: "⌘N" },
                  { icon: "👥", title: "Assign to team member", desc: "Quick assignment workflow", shortcut: "⌘A" },
                  { icon: "📊", title: "View project analytics", desc: "Open detailed insights", shortcut: "⌘D" },
                  { icon: "🎯", title: "Set task priority", desc: "Update priority level", shortcut: "⌘P" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + (i * 0.1) }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                      i === 0 ? 'bg-purple-500/10 border border-purple-500/20' : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <div className={`font-medium ${i === 0 ? 'text-purple-300' : 'text-white'}`}>
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-400">{item.desc}</div>
                    </div>
                    <kbd className="bg-gray-700 px-2 py-1 rounded text-xs font-mono text-gray-300">
                      {item.shortcut}
                    </kbd>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-700/50 bg-gray-800/30">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <kbd className="bg-gray-700 px-1.5 py-0.5 rounded">↑</kbd>
                      <kbd className="bg-gray-700 px-1.5 py-0.5 rounded">↓</kbd>
                      <span>navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="bg-gray-700 px-1.5 py-0.5 rounded">↵</kbd>
                      <span>select</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="bg-gray-700 px-1.5 py-0.5 rounded">esc</kbd>
                    <span>close</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements around command palette */}
            <motion.div
              animate={{ y: [0, -10, 0], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-lg border border-purple-400/30"
            />
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 w-6 h-6 bg-blue-500/20 rounded-full border border-blue-400/30"
            />
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-purple-500/5"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to transform your workflow?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already building better products with TaskArena
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg" onClick={()=>{
                router.push("/signup")
              }}>
                Start free trial
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}