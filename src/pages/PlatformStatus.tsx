import React from 'react';
import { Activity, ArrowLeft, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlatformStatus: React.FC = () => {
    const services = [
        { name: "AI Background Removal Engine", status: "operational", uptime: "99.99%" },
        { name: "API & Webhook Services", status: "operational", uptime: "99.95%" },
        { name: "User Authentication", status: "operational", uptime: "100%" },
        { name: "Image Storage & Hosting", status: "operational", uptime: "99.98%" },
        { name: "Billing & Subscriptions", status: "operational", uptime: "100%" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans py-20 transition-colors duration-300">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-bold mb-12 transition-colors group">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-600 dark:text-green-400">
                                <Activity className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white">System Status</h1>
                                <p className="text-slate-500 font-bold">Live platform performance</p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/50 rounded-full flex items-center gap-2 text-sm font-black">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            ALL SYSTEMS OPERATIONAL
                        </div>
                    </div>

                    <div className="space-y-4">
                        {services.map((service, index) => (
                            <div key={index} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{service.name}</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {service.uptime} uptime
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {service.status}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <div className="flex gap-4">
                            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
                            <div>
                                <p className="font-bold text-blue-900 dark:text-blue-100 mb-1">Scheduled Maintenance</p>
                                <p className="text-sm text-blue-700/80 dark:text-blue-300/80 leading-relaxed font-medium">
                                    We will be performing scheduled maintenance on our API processing nodes on Sunday, February 15th at 02:00 AM UTC. Estimated downtime: 15 minutes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
