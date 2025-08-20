"use client";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <>
     <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 flex-shrink-0 cursor-pointer">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/images/taskArena.png" className="h-10 w-auto" />
              <span className="text-white font-semibold text-2xl select-none">
                TaskArena
              </span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-10 text-sm font-normal">
            {["Home", "About", "Pricing" , "Docs"].map((page) => (
              <Link
                key={page}
            href={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                className="relative px-3 py-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-500 ease-in-out"
              >
                {page}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm font-normal">
            {/* Login button styled same as nav links */}
            <Link
              href="/login"
              className="relative px-3 py-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-500 ease-in-out"
            >
              Log in
            </Link>
            {/* Sign Up button stays white with black text */}
            <Link
              href="/signup"
              className="bg-white text-black px-4 py-2 rounded-md font-light hover:bg-gray-200 transition-colors duration-500 ease-in-out"
            >
              Sign Up
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white outline-none">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-black px-6 py-6 space-y-4">
          <Link
            href="/"
            className="block text-white hover:text-gray-400 transition-colors duration-500 ease-in-out"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block text-white hover:text-gray-400 transition-colors duration-500 ease-in-out"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/pricing"
            className="block text-white hover:text-gray-400 transition-colors duration-500 ease-in-out"
            onClick={() => setMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="block text-white hover:text-gray-400 transition-colors duration-500 ease-in-out"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block text-white hover:text-gray-400 transition-colors duration-500 ease-in-out"
            onClick={() => setMenuOpen(false)}
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
<div className="w-full border-b border-gray-800 mt-2" style={{ borderWidth: '0.2px' }} />
    </>
   
  );
};

export default Navbar;
