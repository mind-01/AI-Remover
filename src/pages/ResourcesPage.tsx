import React from 'react';
import { BookOpen, ArrowLeft, Download, FileCode, Video, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResourcesPage: React.FC = () => {
    const resources = [
        {
            title: "API Documentation",
            desc: "Integrate our background removal engine directly into your app or workflow with our robust API.",
            icon: <FileCode className="w-6 h-6" />,
            color: "blue"
        },
        {
            title: "Asset Library",
            desc: "Download high-quality background images, transparent stickers, and design elements for your projects.",
            icon: <Download className="w-6 h-6" />,
            color: "green"
        },
        {
            title: "Video Tutorials",
            desc: "Learn how to get professional results for products, portraits, and complex objects in minutes.",
            icon: <Video className="w-6 h-6" />,
            color: "amber"
        },
        {
            title: "Design Templates",
            desc: "Ready-to-use layouts for Instagram, TikTok, and e-commerce platforms optimized for cutouts.",
            icon: <Layout className="w-6 h-6" />,
            color: "purple"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans py-20 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-bold mb-12 transition-colors group">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Resources</h1>
                    </div>
                    <p className="text-xl text-slate-500 font-bold max-w-2xl">Everything you need to create stunning visuals and integrate our technology into your projects.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {resources.map((res, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all group">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110
                                ${res.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                                ${res.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : ''}
                                ${res.color === 'amber' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                                ${res.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                            `}>
                                {res.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{res.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
                                {res.desc}
                            </p>
                            <button className="text-sm font-black text-blue-600 dark:text-blue-400 flex items-center gap-2 group/btn">
                                Learn More
                                <ArrowLeft className="w-4 h-4 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
