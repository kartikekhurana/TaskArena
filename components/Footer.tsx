"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Pricing", href: "/pricing" },
      { name: "Features", href: "#features" }
    ],
    project: [
      { name: "Source Code", href: "https://github.com/kartikekhurana/taskarena" },
      { name: "Documentation", href: "/docs" },
    ],
    developer: [
      { name: "My Portfolio", href: "https://portfolio-chi-beige-90.vercel.app" },
      { name: "Other Projects", href: "https://github.com/kartikekhurana" },
      { name: "LinkedIn", href: "https://www.linkedin.com/in/kartike-khurana/" },
      { name: "Contact Me", href: "mailto:your-email@example.com" }
    ]
  };

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/kartikekhurana",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/kartike-khurana/",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: "Portfolio",
      href: "https://portfolio-chi-beige-90.vercel.app",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
        </svg>
      )
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <>
      {/* Separator line matching navbar */}
      <div className="w-full border-b border-gray-800" style={{ borderWidth: '0.2px' }} />
      
      <footer className="bg-black text-white relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          >
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <img src="/images/taskArena.png" className="h-10 w-auto" alt="TaskArena" />
                <span className="text-white font-semibold text-2xl select-none">
                  TaskArena
                </span>
              </Link>
              
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                A portfolio project showcasing modern full-stack development with real-time features, 
                secure authentication, and scalable architecture.
              </p>
              
              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["Next.js", "TypeScript", "Node.js", "WebSocket"].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Product Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Project Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Project
              </h3>
              <ul className="space-y-3">
                {footerLinks.project.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center gap-1"
                    >
                      {link.name}
                      {link.href.startsWith('http') && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Developer Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Developer
              </h3>
              <ul className="space-y-3">
                {footerLinks.developer.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center gap-1"
                    >
                      {link.name}
                      {link.href.startsWith('http') && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Project Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 pt-8 border-t border-gray-800"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-white mb-1">5+</div>
                <div className="text-sm text-gray-400">Backend APIs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">Real-time</div>
                <div className="text-sm text-gray-400">WebSocket Chat</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">JWT</div>
                <div className="text-sm text-gray-400">Authentication</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">Stripe</div>
                <div className="text-sm text-gray-400">Payments</div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 pt-8 border-t border-gray-800"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>© {currentYear} TaskArena - Portfolio Project</span>
                <div className="hidden md:flex items-center gap-2">
                  <span>Built with</span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-red-400"
                  >
                    ♥
                  </motion.span>
                  <span>by</span>
                  <Link
                    href="https://portfolio-chi-beige-90.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Kartike Khurana
                  </Link>
                </div>
              </div>
              
              {/* Mobile developer credit */}
              <div className="md:hidden flex items-center gap-2 text-sm text-gray-400">
                <span>Built with</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-red-400"
                >
                  ♥
                </motion.span>
                <span>by</span>
                <Link
                  href="https://portfolio-chi-beige-90.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
                >
                  Kartike Khurana
                </Link>
              </div>

              {/* Portfolio Project Badge */}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400">Portfolio Project</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating accent elements */}
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
      </footer>
    </>
  );
};

export default Footer;