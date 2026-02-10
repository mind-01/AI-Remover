import React from 'react';
import { Layers, Github, Twitter, Mail, Shield, Lock, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2.5">
                            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
                                <Layers className="w-4 h-4 text-white" aria-label="AI Remover PRO logo" />
                            </div>
                            <span className="text-lg font-black text-slate-800 tracking-tight">
                                AI Remover <span className="text-blue-600">PRO</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Professional-grade background removal using state-of-the-art AI technology. 100% automatic and high-precision outputs for creators.
                        </p>
                        <div className="flex items-center space-x-4">
                            {/* ✅ FIXED: Added aria-label and proper href */}
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow us on Twitter"
                                className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all border border-slate-200 hover:border-blue-200 shadow-sm"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            {/* ✅ FIXED: Changed to # or your actual repo */}
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); alert('GitHub repository coming soon!') }}
                                aria-label="View our GitHub"
                                className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-all border border-slate-200 hover:border-slate-300 shadow-sm"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            {/* ✅ FIXED: Added aria-label */}
                            <a
                                href="mailto:support@airemover.pro"
                                aria-label="Email us at support@airemover.pro"
                                className="p-2 bg-white rounded-lg text-slate-400 hover:text-red-500 transition-all border border-slate-200 hover:border-red-200 shadow-sm"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Tools */}
                    <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Online Tools</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Background Remover', available: true },
                                { name: 'Image Quality Booster', available: false },
                                { name: 'Transparent PNG Maker', available: false },
                                { name: 'Object Eraser', available: false }
                            ].map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.available ? "/" : "#"}
                                        onClick={!item.available ? (e) => { e.preventDefault(); alert(`${item.name} - Coming soon!`) } : undefined}
                                        aria-label={item.name}
                                        className="text-sm text-slate-500 hover:text-blue-600 font-bold transition-colors flex items-center gap-2 group"
                                    >
                                        <div className="w-1 h-1 bg-slate-300 rounded-full group-hover:bg-blue-600 transition-colors" />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Resources</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'How it Works', available: true },
                                { name: 'API Documentation', available: false },
                                { name: 'Developer Tools', available: false },
                                { name: 'Blog', available: false }
                            ].map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.available ? "#how-it-works" : "#"}
                                        onClick={!item.available ? (e) => { e.preventDefault(); alert(`${item.name} - Coming soon!`) } : undefined}
                                        aria-label={item.name}
                                        className="text-sm text-slate-500 hover:text-blue-600 font-bold transition-colors flex items-center gap-2 group"
                                    >
                                        <div className="w-1 h-1 bg-slate-300 rounded-full group-hover:bg-blue-600 transition-colors" />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Legal & Support</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Privacy Policy', icon: Shield, available: false },
                                { name: 'Terms of Service', icon: Lock, available: false },
                                { name: 'Help Center', icon: Globe, available: false }
                            ].map((item) => (
                                <li key={item.name}>
                                    <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); alert(`${item.name} - Coming soon!`) }}
                                        aria-label={item.name}
                                        className="text-sm text-slate-500 hover:text-blue-600 font-bold transition-colors flex items-center gap-2 group"
                                    >
                                        <item.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" aria-hidden="true" />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[13px] text-slate-400 font-bold tracking-tight">
                        © {new Date().getFullYear()} AI Remover PRO. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                            System Status: Operational
                        </span>
                        <div className="flex items-center gap-2 text-[13px] text-slate-400 font-bold">
                            Made with <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-label="sparkles" /> for creators
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};