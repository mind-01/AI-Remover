import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Code2, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_SNIPPETS = {
    javascript: {
        label: 'JavaScript',
        lang: 'js',
        code: `// API Integration Example
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
console.log(result.processed_url);`
    },
    python: {
        label: 'Python',
        lang: 'python',
        code: `# Python Example
import requests

url = "https://api.airemover.pro/v1/remove-bg"
payload = {
    "image_url": "https://example.com/image.jpg",
    "format": "png"
}
headers = {
    "X-API-Key": "YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
    },
    curl: {
        label: 'cURL',
        lang: 'bash',
        code: `# cURL Example
curl -X POST https://api.airemover.pro/v1/remove-bg \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image_url": "https://example.com/image.jpg",
    "format": "png"
  }'`
    },
    php: {
        label: 'PHP',
        lang: 'php',
        code: `// PHP Example
$client = new \\GuzzleHttp\\Client();

$response = $client->post('https://api.airemover.pro/v1/remove-bg', [
    'headers' => [
        'X-API-Key' => 'YOUR_API_KEY',
        'Content-Type' => 'application/json',
    ],
    'json' => [
        'image_url' => 'https://example.com/image.jpg',
        'format' => 'png',
    ],
]);

echo $response->getBody();`
    }
};

export const APISection: React.FC = () => {
    const [activeLang, setActiveLang] = useState<keyof typeof API_SNIPPETS>('javascript');
    const [copied, setCopied] = useState(false);
    const [displayedCode, setDisplayedCode] = useState('');

    useEffect(() => {
        setDisplayedCode('');
        const code = API_SNIPPETS[activeLang].code;
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedCode(code.slice(0, i));
            i += 5; // Speed up the typing
            if (i > code.length) clearInterval(interval);
        }, 10);
        return () => clearInterval(interval);
    }, [activeLang]);

    const handleCopy = () => {
        navigator.clipboard.writeText(API_SNIPPETS[activeLang].code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const highlightCode = (line: string) => {
        if (line.startsWith('//') || line.startsWith('#')) return 'text-slate-500 italic';
        if (line.includes('const') || line.includes('await') || line.includes('import') || line.includes('import')) return 'text-purple-400';
        if (line.includes('fetch') || line.includes('requests.post') || line.includes('curl')) return 'text-blue-300';
        if (line.includes('JSON') || line.includes('echo') || line.includes('print')) return 'text-amber-300';
        if (line.includes('"') || line.includes("'")) return 'text-emerald-400';
        return 'text-slate-300';
    };

    return (
        <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <div className="space-y-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100 dark:border-blue-800/50"
                            >
                                <Terminal className="w-4 h-4" />
                                For Developers
                            </motion.div>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white mb-6 leading-tight">
                                One API. <br />
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Endless Possibilities.</span>
                            </h2>
                            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
                                Seamlessly integrate our background removal technology into your own workflow. Built by developers, for developers.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: <Globe className="w-5 h-5" />, title: "REST API", desc: "Simple HTTP endpoints for any language." },
                                { icon: <Code2 className="w-5 h-5" />, title: "Enterprise Ready", desc: "Built to scale with your growing needs." },
                                { icon: <Cpu className="w-5 h-5" />, title: "Low Latency", desc: "Optimized processing in under 2 seconds." },
                                { icon: <Check className="w-5 h-5" />, title: "High Accuracy", desc: "Studio-grade precision with deep learning." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{item.title}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/api-docs" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none uppercase tracking-wide text-sm">
                                Explore Documentation
                            </Link>
                            <button className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase tracking-wide text-sm">
                                Get API Key
                            </button>
                        </div>
                    </div>

                    {/* Code Editor Mockup */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative z-10"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[2.5rem] blur-2xl pointer-events-none" />

                            <div className="relative bg-[#0F172A] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-800/80 backdrop-blur-xl">
                                {/* Window Header */}
                                <div className="flex items-center justify-between px-6 py-5 bg-slate-800/40 border-b border-slate-800/80">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                    </div>

                                    {/* Language Tabs */}
                                    <div className="flex gap-1 p-1 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                        {(Object.keys(API_SNIPPETS) as Array<keyof typeof API_SNIPPETS>).map((key) => (
                                            <button
                                                key={key}
                                                onClick={() => setActiveLang(key)}
                                                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${activeLang === key
                                                    ? 'bg-slate-700 text-white shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-300'
                                                    }`}
                                            >
                                                {API_SNIPPETS[key].label}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleCopy}
                                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 group relative"
                                        title="Copy Code"
                                    >
                                        <AnimatePresence mode="wait">
                                            {copied ? (
                                                <motion.div
                                                    key="check"
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.5, opacity: 0 }}
                                                >
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="copy"
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.5, opacity: 0 }}
                                                >
                                                    <Copy className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {copied && (
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest whitespace-nowrap">
                                                Copied!
                                            </div>
                                        )}
                                    </button>
                                </div>

                                {/* Code Content */}
                                <div className="p-8 h-[380px] overflow-y-auto font-mono text-sm custom-scrollbar">
                                    <pre className="leading-relaxed">
                                        <code>
                                            {displayedCode.split('\n').map((line, i) => (
                                                <div key={i} className="flex group/line">
                                                    <span className="text-slate-600 mr-6 inline-block w-4 text-right select-none opacity-50 font-sans">{i + 1}</span>
                                                    <span className={`${highlightCode(line)} whitespace-pre`}>
                                                        {line}
                                                    </span>
                                                    {i === displayedCode.split('\n').length - 1 && (
                                                        <motion.span
                                                            animate={{ opacity: [0, 1, 0] }}
                                                            transition={{ duration: 0.8, repeat: Infinity }}
                                                            className="w-2 h-4 bg-blue-400 ml-1 inline-block align-middle"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </code>
                                    </pre>
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="absolute -bottom-8 -right-8 bg-white dark:bg-slate-900/90 p-5 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 backdrop-blur-xl hidden md:block"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <svg className="w-12 h-12">
                                            <circle className="text-slate-100 dark:text-slate-800" strokeWidth="4" stroke="currentColor" fill="transparent" r="20" cx="24" cy="24" />
                                            <circle className="text-emerald-500" strokeWidth="4" strokeDasharray={125.6} strokeDashoffset={1.256} strokeLinecap="round" stroke="currentColor" fill="transparent" r="20" cx="24" cy="24" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-emerald-500">
                                            99%
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">API Reliability</p>
                                        <p className="text-slate-900 dark:text-white font-bold leading-tight">Industry Leading Uptime</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
