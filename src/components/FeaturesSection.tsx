import React, { useState } from 'react';
import { Zap, Shield, Image as ImageIcon, Download, CheckCircle2, Wand2, MousePointer2, Loader2 } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
    // ✅ ADDED: Live Demo State
    const [demoStep, setDemoStep] = useState<'idle' | 'processing' | 'complete'>('idle');

    // ✅ ADDED: Live Demo Function
    const runLiveDemo = () => {
        setDemoStep('processing');
        setTimeout(() => {
            setDemoStep('complete');
        }, 2000);
    };

    const resetDemo = () => {
        setDemoStep('idle');
    };

    return (
        <section className="py-24 space-y-32">
            {/* How it Works - वैसा ही है */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest">Process</h2>
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight">How to remove background in seconds</h3>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                        Our advanced AI identifies subjects automatically and provides professional cutouts instantly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { step: '01', title: 'Upload Image', desc: 'Drag and drop your JPG or PNG image into the uploader. We support all common formats.', icon: ImageIcon },
                        { step: '02', title: 'AI Processing', desc: 'State-of-the-art AI removes the background with 100% precision in under 5 seconds.', icon: Wand2 },
                        { step: '03', title: 'Download Result', desc: 'Get your high-quality transparent PNG file ready for use in any project.', icon: Download },
                    ].map((item, idx) => (
                        <div key={idx} className="relative p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 hover:scale-[1.02] transition-all duration-300 group">
                            <div className="absolute top-8 right-10 text-6xl font-black text-slate-50 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity uppercase italic">
                                Step {item.step}
                            </div>
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-blue-100">
                                <item.icon className="w-6 h-6" aria-label={item.title} />
                            </div>
                            <h4 className="text-xl font-black text-slate-800 mb-2">{item.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Feature List */}
            <div className="bg-slate-900 py-24 rounded-[3.5rem] mx-4 sm:mx-8 px-8 overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h2 className="text-sm font-black text-blue-400 uppercase tracking-widest">Why Choose Us</h2>
                                <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                                    Professional Results<br />
                                    <span className="text-blue-400 underline decoration-blue-500 underline-offset-8">Without the Effort</span>
                                </h3>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg">
                                    Stop wasting hours in Photoshop. Our AI background remover gives you pixel-perfect cutouts with zero complexity.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { title: '100% Automatic', desc: 'No pixel selection needed' },
                                    { title: 'High Definition', desc: 'Preserves every detail' },
                                    { title: 'Smart Detection', desc: 'Perfect for hair & fur' },
                                    { title: 'Privacy First', desc: 'Files are never stored' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="p-1 px-2.5 rounded-lg border border-blue-500/20 bg-blue-500/10 mt-1">
                                            <CheckCircle2 className="w-4 h-4 text-blue-400" aria-label="Feature verified" />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-bold text-sm tracking-tight">{item.title}</h5>
                                            <p className="text-slate-500 text-xs font-medium mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ✅ UPDATED: Live Demo Section */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-transparent blur-2xl rounded-full" />
                            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                                <Zap className="w-5 h-5 text-white" aria-label="AI powered" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-white uppercase tracking-wider">AI Analysis</span>
                                                <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                    Online
                                                </span>
                                            </div>
                                        </div>

                                                                           {/* ✅ DYNAMIC IMAGE CONTAINER */}
                                    <div className="h-64 rounded-2xl bg-slate-900 border border-white/5 relative overflow-hidden">
                                        {/* 1. ORIGINAL IMAGE */}
                                        <div 
                                            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                                            style={{
                                                backgroundImage: `url('/demo/shoe-original.jpg')`,
                                                opacity: demoStep === 'complete' ? 0 : 1
                                            }}
                                        />

                                        {/* 2. RESULT IMAGE */}
                                        <div 
                                            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                                            style={{
                                                backgroundImage: `url('/demo/shoe-result.png')`,
                                                opacity: demoStep === 'complete' ? 1 : 0
                                            }}
                                        />
                                        
                                        {/* 3. PROCESSING OVERLAY */}
                                        {demoStep === 'processing' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-20">
                                                <div className="text-center space-y-3">
                                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                                                    <p className="text-xs font-black text-white uppercase tracking-widest">Removing Background...</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. SUCCESS OVERLAY */}
                                        {demoStep === 'complete' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-green-900/60 to-transparent z-30 pointer-events-none">
                                                <div className="text-center">
                                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-green-500/30">
                                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                                    </div>
                                                    <p className="text-xs font-black text-white uppercase tracking-widest drop-shadow-lg">Done! 0.4s</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* 5. BOTTOM INFO */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
                                        <div className="absolute bottom-5 left-6 right-6 z-10">
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Efficiency</p>
                                                    <p className="text-sm font-bold text-white tracking-tight">
                                                        {demoStep === 'complete' ? 'Background Removed!' : 'High-Precision Masking'}
                                                    </p>
                                                </div>
                                                <div className="p-2 bg-blue-600 rounded-lg">
                                                    <Shield className="w-4 h-4 text-blue-400" aria-label="Secure processing" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                        <div className="absolute bottom-5 left-6 right-6">
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Efficiency</p>
                                                    <p className="text-sm font-bold text-white tracking-tight">
                                                        {demoStep === 'complete' ? 'Background Removed!' : 'High-Precision Masking'}
                                                    </p>
                                                </div>
                                                <div className="p-2 bg-blue-600 rounded-lg">
                                                    <Shield className="w-4 h-4 text-blue-400" aria-label="Secure processing" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Speed', val: '0.4s' },
                                            { label: 'Accuracy', val: demoStep === 'complete' ? '100%' : '99.9%' }
                                        ].map(stat => (
                                            <div key={stat.label} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</span>
                                                <span className={`text-xl font-black tracking-tight italic ${
                                                    demoStep === 'complete' && stat.label === 'Accuracy' ? 'text-green-400' : 'text-white'
                                                }`}>
                                                    {stat.val}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO FAQ Section - वैसा ही है */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest italic flex items-center justify-center gap-2">
                        Common Questions
                    </h2>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">Frequently Asked Questions</h3>
                </div>

                <div className="space-y-6">
                    {[
                        { q: 'Is this background remover really free?', a: 'Yes! Our tool is completely free for individual use. You can upload images and download the transparent results without any subscription.' },
                        { q: 'What image formats do you support?', a: 'We support all common image formats including JPG, PNG, and WebP. The output is provided as a high-quality transparent PNG file.' },
                        { q: 'Is the AI background removal quality good?', a: 'Absolutely. We use professional-grade AI models trained to handle complex edges like hair, fur, and fine object details with pixel-perfect accuracy.' },
                        { q: 'Are my images secure?', a: 'Yes. We process images locally or via secure ephemeral sessions. Your files are never stored or sold to third parties.' }
                    ].map((faq, idx) => (
                        <div key={idx} className="p-8 bg-slate-50 rounded-3xl border border-slate-200 hover:border-blue-200 hover:bg-white transition-all cursor-default group">
                            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center justify-between">
                                {faq.q}
                                <MousePointer2 className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" aria-label="FAQ item" />
                            </h4>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};



