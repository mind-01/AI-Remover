import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export const PricingSection: React.FC = () => {
    const plans = [
        {
            name: "Free",
            price: "$0",
            desc: "For hobbyists & individuals",
            features: [
                "Unlimited Local Exports",
                "Standard resolution",
                "Community support",
                "Privacy-first processing"
            ],
            cta: "Get Started",
            popular: false
        },
        {
            name: "Pro",
            price: "$19",
            desc: "For professional creators",
            features: [
                "Unlimited images",
                "Ultra-HD resolution",
                "Priority email support",
                "No watermarks",
                "History cloud-sync",
                "Batch processing"
            ],
            cta: "Go Pro",
            popular: true
        },
        {
            name: "Business",
            price: "$49",
            desc: "For teams & developers",
            features: [
                "Unlimited team members",
                "API access (1k req/mo)",
                "Custom Slack support",
                "SLA guarantee",
                "Advanced batch tools"
            ],
            cta: "Contact Sales",
            popular: false
        }
    ];

    return (
        <section id="pricing" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-4">Pricing Plans</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Simple, Transparent Pricing</h3>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                        Choose the plan that fits your creative workflow. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white dark:bg-slate-800 p-8 rounded-3xl border transition-all duration-300 flex flex-col
                                ${plan.popular
                                    ? 'border-blue-500 shadow-2xl shadow-blue-200/50 dark:shadow-none scale-105 z-10'
                                    : 'border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-900/50 shadow-xl shadow-slate-200/50 dark:shadow-none'
                                }
                            `}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 ring-4 ring-white dark:ring-slate-900">
                                    <Sparkles className="w-3 h-3" />
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="mb-8 text-center md:text-left">
                                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">{plan.name}</h4>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{plan.price}</span>
                                    <span className="text-slate-400 font-bold">/mo</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{plan.desc}</p>
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium text-sm">
                                        <div className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 shrink-0">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 group
                                    ${plan.popular
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }
                                `}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Looking for something else? <a href="#" className="text-blue-600 underline">Chat with our team</a>.
                    </p>
                </div>
            </div>
        </section>
    );
};
