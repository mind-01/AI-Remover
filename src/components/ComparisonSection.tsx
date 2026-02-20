import React from 'react';
import { Check, X, Shield, Zap, Lock, Palette } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
    const features = [
        { name: "Pixel-Perfect Edge Detection", pro: true, others: false, icon: <Zap className="w-5 h-5" /> },
        { name: "100% Privacy (Local Processing)", pro: true, others: false, icon: <Lock className="w-5 h-5" /> },
        { name: "Custom Backgrounds & Gradients", pro: true, others: "Basic", icon: <Palette className="w-5 h-5" /> },
        { name: "No Watermarks on Free Plan", pro: true, others: false, icon: <Shield className="w-5 h-5" /> },
        { name: "Batch Image Processing", pro: true, others: "Pro Only", icon: <Zap className="w-5 h-5" /> },
        { name: "Ultra-HD Export Quality", pro: true, others: false, icon: <Zap className="w-5 h-5" /> }
    ];

    return (
        <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-4">The Better Choice</h2>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-6">How We Compare</h3>
                </div>

                <div className="overflow-hidden bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-8 text-sm font-black text-slate-400 uppercase tracking-widest">Key Features</th>
                                <th className="p-8 text-center bg-blue-600/5">
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">AI Remover PRO</span>
                                    </div>
                                </th>
                                <th className="p-8 text-center text-sm font-black text-slate-400 uppercase tracking-widest">Generic Tools</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {features.map((feature, index) => (
                                <tr key={index} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-8 text-slate-700 dark:text-slate-300">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-500">
                                                {feature.icon}
                                            </div>
                                            <span className="font-bold">{feature.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center bg-blue-600/5">
                                        <div className="flex justify-center">
                                            <div className="p-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
                                                <Check className="w-5 h-5 font-black" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center text-slate-400 font-bold">
                                        <div className="flex justify-center flex-col items-center">
                                            {typeof feature.others === "string" ? (
                                                <span className="text-xs uppercase tracking-widest">{feature.others}</span>
                                            ) : feature.others ? (
                                                <Check className="w-5 h-5 text-slate-300" />
                                            ) : (
                                                <X className="w-5 h-5 text-red-300 dark:text-red-900/30" />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h4 className="text-xl font-black text-blue-900 dark:text-blue-100">Ready to get the best results?</h4>
                        <p className="text-blue-700 dark:text-blue-300 font-medium">Join 50,000+ creators who trust AI Remover PRO everyday.</p>
                    </div>
                    <button className="px-10 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none whitespace-nowrap">
                        Try it Now - It's Free
                    </button>
                </div>
            </div>
        </section>
    );
};
