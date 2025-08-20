"use client";
import {easeOut, motion} from 'framer-motion';

const containerVariants = {
    hidden : {opacity : 0  },
    visible : {
        opacity: 1,
        transition:{
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
}
const itemVariants = {
    hidden : {opacity : 0 , y : 15},
visible : {opacity : 1 , y : 0, transition : {duration : 0.5 , ease: easeOut}}
}

function DocItem({
  title,
  desc,
  endpoint,
}: {
  title: string;
  desc: string;
  endpoint?: string;
}) {
  return (
    <motion.li
      variants={itemVariants}
      className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-5 border border-gray-800 hover:border-purple-500 transition-colors duration-300 cursor-default"
    >
      <h3 className="text-xl font-semibold text-purple-400 mb-1">{title}</h3>
      {endpoint && (
        <code className="block mb-2 px-2 py-1 bg-gray-800 rounded text-sm text-green-400 font-mono">
          {endpoint}
        </code>
      )}
      <p className="text-gray-300">{desc}</p>
    </motion.li>
  );
}

export default function DocsPage() {
    return (
<main className='min-h-screen bg-black text-white px-6 py-16 max-w-5xl mx-auto'>
    <motion.section initial="hidden" animate="visible" variants={containerVariants} className='mb-16 text-center'>
<motion.h1 variants={itemVariants} className='text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent'>
    TaskArena API Documentation
</motion.h1>
<motion.p variants={itemVariants} className='text-lg text-gray-400 max-w-3xl mx-auto'>
    Explore TaskArena&apos;s backend API endpoints, authentication flows, and real-time feautures. Get started quickly with clear clear usage examples and detailed descriptions 
</motion.p>
    </motion.section>
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className='space-y-12'>
        <section>
          <motion.h2 variants={itemVariants} className='text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                   1️⃣ Authentication 
            </motion.h2>
            <motion.ul variants={containerVariants} className='space-y-4'>
<DocItem title='Signup' desc='POST /api/auth/register - To register a new user' endpoint='POST /api/auth/register'></DocItem>
<DocItem title='Login' desc='POST /api/auth/login - To login a new user' endpoint='POST /api/auth/login'></DocItem>
<DocItem title='Logout' desc='POST /api/auth/Logout - To logout a user' endpoint='POST /api/auth/logout'></DocItem>
<DocItem title='View profile' desc='POST /api/auth/me - To see a user profile' endpoint='POST /api/auth/me'></DocItem>
<DocItem title='Reset password' desc='POST /api/auth/reset-password - To reset a user password' endpoint='POST /api/auth/reset-password'></DocItem>
            </motion.ul>
            <motion.h2 variants={itemVariants} className='text-3xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-8 '>
                    2️⃣ User Management
            </motion.h2>
            <motion.ul variants={containerVariants} className='space-y-4'>
                <DocItem title='Get Profile' desc='GET /api/user/profile - Retrieve current user details.'endpoint='GET /api/user/profile' ></DocItem>
                <DocItem title='To see tasks' desc='GET /api/user/my-tasks - Retrieve current user tasks on dashboard.'endpoint='GET /api/user/profile' ></DocItem>
                <DocItem title='Update Profile' desc="PATCH /api/user/update - Update username and avatar in one request" endpoint='PATCH /api/user/profile'></DocItem>
                <DocItem title='Update password' desc='PATCH /api/user/update-password - To update password in the profile section of dashboard.'endpoint='GET /api/user/profile' ></DocItem>
                <DocItem title='Delete Account' desc="DELETE /api/user/delete-account - Self-delete user account" endpoint='DELETE /api/user/delete-account'></DocItem>
                <DocItem title='Role Management' desc="PATCH /api/user/role/[id] - Admin can change a user's role" endpoint='PATCH /api/user/role/:id'></DocItem>
                <DocItem title='Get All Users' desc='GET /api/user/all - Admin only: retrieve all users' endpoint='GET /api/user/all'></DocItem>
                <DocItem title='Get specific tasks' desc='GET /api/user/[id]/tasks - Admin only: retrieve tasks based on profile' endpoint='GET /api/user/[id]/tasks'></DocItem>
            </motion.ul>
        </section>
        <section>
            <motion.h2 variants={itemVariants} className='text-3xl font-semibold mb-6 bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                          4️⃣ Task Management
            </motion.h2>
            <motion.ul variants={containerVariants} className='space-y-4'>
                 <DocItem
              title="Create Task"
              desc="POST /api/task/create-task - Assign a new task to a user."
              endpoint="POST /api/task/create-task"
            />
            <DocItem
              title="Update Task"
              desc="PATCH /api/task/[taskId] - Update task details or status (pending, in-progress, completed)."
              endpoint="PATCH /api/task/[taskId]"
            />
            <DocItem
              title="Delete Task"
              desc="DELETE /api/task/[taskId] - Remove a task."
              endpoint="DELETE /api/task/[taskId]"
            />
            <DocItem
              title="Get tasks as admin or user"
              desc="GET /api/task[taskId] - Retrieve tasks as admin or user."
              endpoint="GET /api/task/[taskId]"
            />
            <DocItem
              title="Get All Tasks"
              desc="GET /api/task/all - to get all the tasks"
              endpoint="GET /api/task/all"
            />
                </motion.ul>
        </section>
        <section>
                  <motion.h2
            variants={itemVariants}
            className="text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            5️⃣ Comments System</motion.h2>
             <motion.ul variants={containerVariants} className="space-y-4">
            <DocItem
              title="Add Comment"
              desc="POST /api/comments/add - Add a comment to a task."
              endpoint="POST /api/comments/add"
            />
            <DocItem
              title="Get Comments for a Task"
              desc="GET /api/comments/[taskId] - Retrieve comments for a specific task."
              endpoint="GET /api/comments/[taskId]"
            />
            <DocItem
              title="Update Comment"
              desc="PATCH /api/comments/[id] - Modify a comment."
              endpoint="PATCH /api/comments/[id]"
            />
            <DocItem
              title="Delete Comment"
              desc="DELETE /api/comments/[id] - Remove a comment."
              endpoint="DELETE /api/comments/[id]"
            />
          </motion.ul>
        </section>
        <section>
            <motion.h2 variants={itemVariants} className="text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                5️⃣ Payment System (Pro Upgrade)
                 <motion.ul variants={containerVariants} className="space-y-4">
            <DocItem
              title="Stripe Integration"
              desc="Create checkout session API, webhook to update user Pro status, Stripe CLI tested."
              endpoint=""
            />
          </motion.ul>
            </motion.h2>
        </section>
    </motion.div>
</main>
    )

}