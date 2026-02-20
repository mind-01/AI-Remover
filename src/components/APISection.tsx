import React, { useState } from 'react';
import { Terminal, Copy, Check, Code2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const APISection: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const codeSnippet = `// API Integration Example
const response = await fetch('https://api.airemover.pro/v1/remove-bg', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image_url: 'https://example.com/image.jpg',
    format: 'png',
    crop: true
  })
});

const result = await response.json();
console.log(result.processed_url);`;

    const handleCopy = () => {
        navigator.clipboard.writeText(codeSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-black uppercase tracking-widest mb-6">
                            <Terminal className="w-4 h-4" />
                            For Developers
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-6 leading-tight">
                            Build Your Own <span className="text-blue-600">AI Experience</span>
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                            Integrate our high-performance background removal engine into your web, mobile, or desktop applications with just a few lines of code.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: <Globe className="w-5 h-5" />, title: "REST API", desc: "Simple HTTP endpoints for rapid integration." },
                                { icon: <Code2 className="w-5 h-5" />, title: "Client SDKs", desc: "Native libraries for JS, Python, and Ruby." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-blue-600 dark:text-blue-400 shadow-sm shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 dark:text-white">{item.title}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link to="/api-docs" className="mt-10 inline-block px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-slate-200 dark:shadow-none">
                            Read API Docs
                        </Link>
                    </div>

                    {/* Code Editor Mockup */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />

                        <div className="relative bg-[#0F172A] rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
                            {/* Window Header */}
                            <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-800">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">example_request.js</div>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Code Content */}
                            <div className="p-8 overflow-x-auto">
                                <pre className="text-sm font-mono leading-relaxed">
                                    <code className="text-blue-400">
                                        {codeSnippet.split('\n').map((line, i) => (
                                            <div key={i} className="whitespace-pre">
                                                <span className="text-slate-600 mr-4 inline-block w-4 text-right select-none">{i + 1}</span>
                                                <span className={
                                                    line.startsWith('//') ? 'text-slate-500 italic' :
                                                        line.includes('const') || line.includes('await') ? 'text-purple-400' :
                                                            line.includes('fetch') ? 'text-blue-300' :
                                                                line.includes('JSON') ? 'text-amber-300' : 'text-slate-300'
                                                }>
                                                    {line}
                                                </span>
                                            </div>
                                        ))}
                                    </code>
                                </pre>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-black">
                                    99%
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Uptime</p>
                                    <p className="text-slate-800 dark:text-white font-bold leading-tight">API Reliability</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
