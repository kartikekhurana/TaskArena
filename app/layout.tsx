
import Navbar from "@/components/Navbar";
import "./globals.css";
import {Inter} from 'next/font/google'
import Footer from "@/components/Footer";
import {Toaster} from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        />
      </head>
     <body className={`${inter.variable} bg-black text-white`}>
        <Navbar/>
        {children}
        <Toaster position="top-right" 
        toastOptions={{
          duration:4000,
          style:{
            background: "#0f0f0f",
              border: "1px solid #27272A",
            color: "#FAFAFA",
            borderRadius:"8px",
            padding:"16px 20px",
            fontSize:"14px",
             fontWeight: "500",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(8px)",
            minWidth: "320px",
            maxWidth: "400px",
          },
           success: {
            style: {
              background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)",
              border: "1px solid #10B981",
              borderLeft: "4px solid #10B981",
              color: "#FAFAFA",
            },
            iconTheme: {
              primary: '#10B981',
              secondary: '#0F0F0F',
            }
          },
           error: {
            style: {
              background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)",
              border: "1px solid #EF4444",
              borderLeft: "4px solid #EF4444",
              color: "#FAFAFA",
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: "#0F0F0F"
            }
          },
            loading: {
            style: {
              background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)",
              border: "1px solid #6366F1",
              borderLeft: "4px solid #6366F1",
              color: "#FAFAFA",
            },
            iconTheme: {
              primary: '#6366F1',
              secondary: '#0F0F0F',
            }
          },
           blank: {
            style: {
              background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)",
              border: "1px solid #374151",
              borderLeft: "4px solid #6B7280",
              color: "#FAFAFA",
            },
          }
        }}
        ></Toaster>
        <Footer/>
      </body>
    </html>
  );
}
