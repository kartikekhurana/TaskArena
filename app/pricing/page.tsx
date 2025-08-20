'use client';

import {easeOut, motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


const pricingTiers = [
    {
        name:"Free",
        priceMonthly:0,
        priceYearly:0,
        features:[
            "Basic Task Management",
            'Up to 3 projects',
            "Community support",
        ],
    },
    {
        name:"Pro",
        priceMonthly:15,
        priceYearly:150,
        features:[
            "Unlimited projects",
            "priority support",
            "Advanced analytics",
            "Team collaborations"
        ],
        popular:true,
    },
    {
        name:"Enterprise",
        priceMonthly:50,
        priceYearly:250,
        features:[
            "Dedicated account manager",
            "Custom integrations",
            "Enhanced security",
            "24/7 support",
        ],
    }
]
const containerVariants = {
    hidden : {opacity : 0 , y : 20},
visible : (i = 1) =>({
opacity : 1,
y: 0 ,
transition: {
    staggerChildren : 0.2,
    delayChildren : 0.3 * i,
}
})
}
const cardVariants = {
    hidden : {opacity : 0 , y : 20},
    visible : {
        opacity : 1,
        y: 0,
        transition : {
            duration : 0.5 , 
            ease : easeOut
        }
    }
}
export default function PricingPage() {
    const [billing , setBilling]  = useState<"monthly" | "yearly">("monthly");
    const router = useRouter();

    const toggleBilling = () =>{
        setBilling(billing === "monthly" ? "yearly" : "monthly");
    }
    
 return (
       <main className='min-h-screen bg-black text-white px-6 py-16 max-w-7xl mx-auto'>
        <section className='text-center max-w-3xl mx-auto mb-16'>
            <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight'>Simple, Transparent Pricing</h1>
            <p className='mt-4 text-gray-300 text-lg md:text-xl'>Choose the plan that fits your workflow . No surprises, no hidden fees</p>
        </section>
        <section className='flex justify-end mb-8'>
            <div className='inline-flex items-center space-x-3 bg-gray-900 rounded-full p-1 select-none'>
                <span onClick={()=>setBilling("monthly")} className={`cursor-pointer px-4 py-2 rounded-full font-semibold transition-colors duration-300 ease-in-out ${ billing === "monthly" ? "bg-purple-700 text-white shadow-[0_0_10px_rgba(139,92,246,0,6)]" : "text-purple-400 hover:text-purple-500" }`}>Monthly</span>
                <span onClick={()=>setBilling("yearly")} className={`cursor-pointer px-4 py-2 rounded-full font-semibold transition-colors duration-300 ease-in-out ${ billing === "yearly" ? "bg-purple-700 text-white shadow-[0_0_10px_rgba(139,92,246,0.6)]" : "text-purple-400 hover:text-purple-500" }`}>Yearly</span>
            </div>
            <motion.section className='grid gap-8 md:grid-cols-3' variants={containerVariants} initial="hidden" animate="visible">
                {
                    pricingTiers.map((tier , index)=>{
                        const isPopular = tier.popular;
                        const price = billing === "monthly" ? tier.priceMonthly : tier.priceYearly;
                        const billingSuffix = billing === "monthly" ? "/mo" : "/yr";
                        return (
                            <motion.div key={tier.name} variants={cardVariants} custom={index} className={`relative flex flex-col bg-black border rounded-xl p-6 sm:p-8 shadow-lg transition-all duration-300 ease-in-out cursor-default border-purple-700 w-full sm:max-w-none ${isPopular ? "scale-105 shadow-[0_0_20px_rgba(139, 92, 246,0.7)] z-10" : "hover:shadow-[0_0_15px_rgba(139, 92, 246,0.5)]"}`}>
                                {
isPopular && (
    <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-700 text-black rounded-full px-4 py-1 text-sm font-semibold tracking-wide select-none'>Most popular</div>
)
                                }
                                <h3 className='text-lg sm:text-xl font-semibold mb-4 text-purple-400 select-none'>{tier.name}</h3>
                                <div className='flex items-baseline space-x-2 mb-6'>
                                    <span className='text-3xl sm:text-4xl font-semibold tracking-tight'>
                                        {price === 0 ? "Free" : `$${price}`}
                                    </span>
                                    {
                                        price !== 0 && (
                                            <span className='text-gray-400 text-base sm:text-lg select-none'>{billingSuffix}</span>
                                        )
                                    }
                                </div>
                                <ul className='flex-1 space-y-3 mb-8 text-sm sm:text-base'>
                                    {
                                        tier.features.map((feature)=>(
                                            <li key={feature} className='flex items-center space-x-3 text-gray-300'>
                                                <svg className='w-5 h-5 text-purple-500 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden="true">
<path strokeLinecap='round' strokeLinejoin='round' d="M5 13l4 4L19 7" />
                                                 </svg>
                                                 <span>{feature}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                                <button type='button' className='mt-auto w-full sm:w-auto px-8 py-3 rounded-lg font-medium text-white bg-black border border-purple-500/30 hover:border-purple-500 transition-all duration-300 ease-in-out' onClick={()=>{
                                    if(tier.priceMonthly === 0){
                                        router.push('/signup')
                                    }else{
                                        router.push('/payment')
                                    }
                                }}>
                                {tier.priceMonthly === 0 ? "Get Started" : "Choose Plan"}
                                </button>
                            </motion.div>
                        )
                    })
                }
            </motion.section>
        </section>
    </main>
 )
}