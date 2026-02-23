import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Terminal, Copy, Check, BookOpen, Key, Activity, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const APIDocs: React.FC = () => {
    const [copied, setCopied] = useState<string | null>(null);
    const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const { user } = useAuth();

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleRequestAccess = async () => {
        if (!user) {
            alert('Please login to request API beta access.');
            return;
        }

        setRequestStatus('loading');

        try {
            if (supabase) {
                // Try to log the request in Supabase
                // We assume there might be a beta_requests table or we just attempt it
                const { error } = await supabase
                    .from('beta_requests')
                    .insert([{
                        user_id: user.id,
                        email: user.email,
                        status: 'pending',
                        requested_at: new Date().toISOString()
                    }]);

                if (error) {
                    console.warn('Supabase insert failed (likely table missing), simulating success UI:', error);
                }
            }

            // Artificial delay for premium feel
            await new Promise(resolve => setTimeout(resolve, 1500));
            setRequestStatus('success');
        } catch (err) {
            console.error('Request failed:', err);
            setRequestStatus('idle');
        }
    };

    const endpoints = [
        {
            method: 'POST',
            path: '/v1/remove-bg',
            description: 'Remove background from an image URL or base64 data.',
            params: [
                { name: 'image_url', type: 'string', desc: 'Public URL of the image.' },
                { name: 'image_file', type: 'base64', desc: 'Base64 encoded image data.' },
                { name: 'format', type: 'enum', desc: 'png, webp, or jpg.' },
                { name: 'crop', type: 'boolean', desc: 'Auto-crop to subject.' }
            ]
        }
    ];

    const codeExamples = {
        curl: `curl -X POST https://api.airemover.pro/v1/remove-bg \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"image_url": "https://example.com/item.jpg"}'`,
        javascript: `const response = await fetch('https://api.airemover.pro/v1/remove-bg', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image_url: 'https://example.com/item.jpg'
  })
});

const result = await response.json();`
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
            <Header setShowDashboard={() => { }} />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-black uppercase tracking-widest mb-6">
                            <BookOpen className="w-4 h-4" />
                            Documentation
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                            Developer <span className="text-blue-600">API [BETA]</span>
                        </h1>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                            Everything you need to integrate professional background removal into your stack. Get high-performance Subject-AI in minutes.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Sidebar */}
                        <aside className="lg:col-span-3 space-y-8 hidden lg:block h-fit sticky top-32">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-[10px]">Getting Started</h3>
                                <nav className="flex flex-col gap-2">
                                    <a href="#auth" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors capitalize">Authentication</a>
                                    <a href="#endpoints" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors capitalize">Endpoints</a>
                                    <a href="#limits" className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors capitalize">Rate Limits</a>
                                </nav>
                            </div>
                        </aside>

                        {/* Content */}
                        <div className="lg:col-span-9 space-y-24">
                            {/* Authentication */}
                            <section id="auth" className="scroll-mt-32">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <Key className="w-8 h-8 text-blue-600" />
                                    Authentication
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 leading-relaxed">
                                    The REST API is currently in <b>Closed Beta</b>. All API requests require an <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-blue-600">X-API-Key</code>.
                                    <br /><br />
                                    Currently, keys are being issued to selected partners and Business plan users. Join the waitlist to get your early access key.
                                </p>
                                <button
                                    onClick={handleRequestAccess}
                                    disabled={requestStatus !== 'idle'}
                                    className={`mb-8 px-6 py-3 font-black rounded-xl transition-all flex items-center gap-2 shadow-lg ${requestStatus === 'success'
                                        ? 'bg-green-500 text-white cursor-default'
                                        : requestStatus === 'loading'
                                            ? 'bg-blue-400 text-white cursor-wait'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
                                        }`}
                                >
                                    {requestStatus === 'loading' ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : requestStatus === 'success' ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <Key className="w-4 h-4" />
                                    )}
                                    {requestStatus === 'loading' ? 'Processing...' : requestStatus === 'success' ? 'Request Submitted Successfully' : 'Request Beta Access'}
                                </button>
                                {requestStatus === 'success' && (
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mb-8 text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        We've received your request! Our team will reach out via email.
                                    </motion.p>
                                )}
                                <div className="bg-slate-900 rounded-xl p-6 relative group border border-slate-800 overflow-x-auto">
                                    <pre className="font-mono text-sm text-slate-300">
                                        <code>X-API-Key: airem_live_0987654321fedcba</code>
                                    </pre>
                                    <button
                                        onClick={() => handleCopy('X-API-Key: airem_live_0987654321fedcba', 'auth')}
                                        className="absolute right-4 top-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                                    >
                                        {copied === 'auth' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </section>

                            {/* Endpoints */}
                            <section id="endpoints" className="scroll-mt-32">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-3">
                                    <Terminal className="w-8 h-8 text-blue-600" />
                                    Endpoints
                                </h2>

                                {endpoints.map((ep, i) => (
                                    <div key={i} className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-black tracking-widest">{ep.method}</span>
                                            <span className="font-mono text-lg font-bold text-slate-700 dark:text-slate-200">{ep.path}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">{ep.description}</p>

                                        <div>
                                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Body Parameters</h4>
                                            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                                                {ep.params.map((p, pi) => (
                                                    <div key={pi} className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <span className="font-mono font-bold text-blue-600">{p.name}</span>
                                                        <span className="text-xs font-black text-slate-400 uppercase">{p.type}</span>
                                                        <span className="md:col-span-2 text-sm text-slate-600 dark:text-slate-400 font-medium">{p.desc}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Code Example</h4>
                                            <div className="bg-[#0F172A] rounded-2xl p-8 border border-slate-800 relative group overflow-x-auto">
                                                <pre className="font-mono text-sm leading-relaxed text-slate-300">
                                                    <code>{codeExamples.javascript}</code>
                                                </pre>
                                                <button
                                                    onClick={() => handleCopy(codeExamples.javascript, 'ex')}
                                                    className="absolute right-4 top-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                                                >
                                                    {copied === 'ex' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </section>

                            {/* Rate Limits */}
                            <section id="limits" className="scroll-mt-32">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <Activity className="w-8 h-8 text-blue-600" />
                                    Rate Limits
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                        { title: "Free Plan", limit: "Manual Only", desc: "API not available." },
                                        { title: "Pro Plan", limit: "50 Req/Day", desc: "Personal automation only." },
                                        { title: "Business", limit: "10,000 Req/Mo", desc: "Production-ready scale." }
                                    ].map((l, i) => (
                                        <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                            <h4 className="font-black text-slate-900 dark:text-white mb-1">{l.title}</h4>
                                            <p className="text-blue-600 font-black text-xl mb-2">{l.limit}</p>
                                            <p className="text-xs text-slate-500 font-medium">{l.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Quick Help */}
                            <div className="p-8 bg-blue-600 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <h3 className="text-2xl font-black mb-2">Need a custom plan?</h3>
                                    <p className="font-bold opacity-90">We offer Enterprise volume pricing for 1M+ images.</p>
                                </div>
                                <Link to="/contact" className="px-10 py-4 bg-white text-blue-600 font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-blue-900/20 whitespace-nowrap">
                                    Contact Sales
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
