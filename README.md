# TaskArena 🛠️

**TaskArena** is a sleek, modern task management platform designed to streamline project workflows and team collaboration. It empowers users and admins with real-time task tracking, dynamic communication via integrated chat & comments, and powerful notification systems — all wrapped in a clean, professional, and intuitive UI.

Whether you’re managing projects solo or coordinating across teams, TaskArena keeps everything organized, transparent, and on schedule — helping you get things DONE efficiently.

---

## 🌟 Features

- **User Authentication**: Sign up, login, and secure JWT-based authentication.  
- **Task Management**: Create, update, assign, and track tasks with due dates and priorities.  
- **Comments & Chat**: Real-time commenting system with live updates using WebSockets.  
- **Notifications**: Custom, dark-themed notifications for task updates and comments.  
- **Payment Integration**: Stripe-powered payments for premium access.  
- **Password Reset**: Forgot password flow with JWT-secured reset links via email.  
- **Dark Theme UI**: Sleek, modern dark mode design with interactive cards and animations.  
- **Responsive Design**: Mobile-first design, optimized for desktop and mobile devices.  

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion  
- **Backend**: Node.js, Express (API Routes via Next.js App Router), MongoDB (Mongoose)  
- **Real-time**: WebSockets (Socket.IO)  
- **Authentication**: JWT with access & refresh tokens  
- **Payments**: Stripe Checkout  
- **Email**: Nodemailer for password reset and notifications  
- **Deployment**: Vercel  

---

## ⚡ Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/taskarena.git
cd taskarena

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT Authentication
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email_user
SMTP_PASS=your_email_password
SMTP_FROM="TaskArena 🛠️ <your_email_user>"

# Frontend URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Server
PORT=3000

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# API
API_URL=http://localhost:3000/api
This now includes **all required environment variables** and the steps to install dependencies and start the development server.  