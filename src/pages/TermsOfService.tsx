import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsOfService: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 dark:border-slate-700">

                <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-bold transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                        <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Terms of Service</h1>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                        Effective Date: {new Date().toLocaleDateString()}
                    </p>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        By accessing or using the AI Background Remover service ("Service"), you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
                    </p>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Use License</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Permission is granted to temporarily download one copy of the materials (information or software) on AI Remover for personal, non-commercial transitory viewing only.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mt-2">
                        <li>modify or copy the materials;</li>
                        <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                        <li>attempt to decompile or reverse engineer any software contained on AI Remover's website;</li>
                    </ul>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Disclaimer</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        The materials on AI Remover's website are provided on an 'as is' basis. AI Remover makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Limitations</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        In no event shall AI Remover or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AI Remover's website.
                    </p>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Governing Law</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                    </p>

                </div>
            </div>
        </div>
    );
};
