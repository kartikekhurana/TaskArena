"use client";

import Axios from '@/lib/axios';
import {motion , easeOut} from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';


const fadeInUp = {
    hidden:{ opacity : 0 , y : 20},
    visible : {opacity : 1 , y : 0 , transition : {duration : 0.6 , ease : easeOut}}
}
const cardVariants = {
    hidden : {opacity : 0 , y : 30 , scale : 0.95},
    visible : {
        opacity : 1,
        y : 0,
        scale : 1,
        transition : {duration : 0.7 , ease : easeOut}
    }
}
const features = [
  "Unlimited projects & tasks",
  "Advanced team collaboration",
  "Priority customer support",
  "Detailed analytics & insights",
  "Custom integrations",
  "Advanced security features"
];

export default function PaymentPage(){
    const [isLoading , setIsLoading] = useState(false);
    const paymentHandle = async()=>{
setIsLoading(true);
try {
    const response = await Axios.post('/payment/create-session',{},{
        headers:{
'Content-Type' : "application/json",
        },
        withCredentials: true
    })
const data = response.data;
if(data.error){
toast.error(`Error : ${data.error}`)
}
if(data.url){
    window.location.href = data.url
}else{
    toast.error('Something went wrong . please try again ')
}
} catch (error : any) {
    console.error("Payment error : ", error.message);
    if(error.response?.data?.error){
        toast.error(` Error : ${error.response?.data?.error}`);
    }else if(error.message){
        toast.error(`Error : ${error.message}`)
    }else{
      toast.error('Something went wrong . please try again ')
    }
}finally{
    setIsLoading(false)
}
    }
    return (
        <main className='min-h-screen bg-black text-white px-6 py-16 max-w-6xl mx-auto'>
              <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg text-center"
      >
        <div className='flex items-center justify-center gap-2 text-yellow-300 mb-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className='font-semibold'>Demo Enviroment</span>
        </div>
        <p className='text-yellow-200 text-sm'>
            This is a demonstration of payment integration logic. <strong>Do not enter real payment information.</strong>
            All transactions for testing purposes only
        </p>
      </motion.div>
      <motion.section className='text-center max-w-3xl mx-auto mb-12' initial="hidden" animate="visible" variants={fadeInUp}>
<h1 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-4'>Upgrade to <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Pro</span></h1>
<p className='text-gray-300 text-lg md:text-xl'>Unlock the full potential of TaskArena with advanced features designed for professional teams</p>
      </motion.section>
      <div className='grid lg:grid-cols-2 gap-12 items-start'>
        <motion.div initial="hidden" animate="visible" variants={cardVariants} className='space-y-8'>
            <div className='bg-black border border-purple-700 rounded-xl p-8 shadow-[0_0_20px_rgba(139,92,246,0.3)] '>
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h3 className='text-2xl font-bold text-purple-400'>Pro Plan</h3>
                        <p className='text-gray-400'>Perfect for growing teams</p>
                    </div>
                    <div className='text-right'>
                         <div className="text-3xl font-bold text-white">$15.00</div>
                <div className="text-gray-400 text-sm">one-time payment</div>
                    </div>
                </div>
                <div className='space-y-3'>
                    <h4 className='text-lg font-semibold text-white mb-4'>What&apos;s included</h4>
                    {
                        features.map((feature , index)=>(
                            <motion.div key={index} initial={{opacity: 0 ,x:-20 }}   animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="flex items-center space-x-3">  <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className='text-gray-300'>{feature}</span>
                  </motion.div>
                        ))
                    }
                </div>
            </div>
            <motion.div  initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <div className='flex items-center gap-3 mb-3'>
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
               <h4 className="text-lg font-semibold text-white">30-Day Money Back Guarantee</h4>
                </div>
                <p className="text-gray-400 text-sm">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </p>
            </motion.div>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={cardVariants}   className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
        <div className='mb-8'>
            <h3 className='text-2xl font-bold text-white mb-2'>Secure Checkout</h3>
            <p className='text-gray-400'>You&apos;ll be redirected to Stripe for secure payment processiing</p>
        </div>
        <div className='bg-black/50 border border-gray-700/50 rounded-lg p-6 mb-8'>
        <h4 className='font-semibold text-white mb-4'>Order Summary</h4>
        <div className='flex justify-between items-center mb-3'>
            <span className='text-gray-300'>TaskArena Pro Access</span>
            <span className="text-white">$15.00</span>
        </div>
        <div className='borer-t border-gray-700 pt-3'>
            <div className='flex justify-between items-center'>
                <span className='text-lg font-semibold text-white'>Total</span>
                <span className='text-2xl font-semibold text-purple-400'>$15.00</span>
            </div>
        </div>
        </div>
         <motion.button
            onClick={paymentHandle}
            disabled={isLoading}
            className="w-full bg-white text-black font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Complete Secure Payment
              </>
            )}
          </motion.button>
          <div className='mt-6 flex items-center justify-center gap-2 text-sm text-gray-400'>
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Powered by stripe . PCI DSS Compalint</span>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <p className="text-sm text-gray-400 text-center mb-3">Accepted Payment Methods</p>
            <div className="flex justify-center items-center gap-3">
              {['Visa', 'Mastercard', 'American Express', 'PayPal'].map((method) => (
                <div key={method} className="bg-gray-800 rounded px-3 py-2 text-xs text-gray-400 border border-gray-700">
                  {method}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-16 text-center"
      >
        <p className="text-gray-400 mb-4">
          Questions about upgrading? <a href="#" className="text-purple-400 hover:text-purple-300 underline">Contact our support team</a>
        </p>
        <p className="text-sm text-gray-500">
          By completing this purchase, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
       <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-8 w-96 h-96 bg-purple-400/6 rounded-full blur-3xl"></div>
        <motion.div
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.03) 0%, transparent 50%)"
            ]
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute inset-0"
        />
      </div>
        </main>
    )
}