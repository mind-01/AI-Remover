import React from 'react';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HelpFAQ: React.FC = () => {
    const faqs = [
        {
            q: "How does the AI background removal work?",
            a: "Our tool uses advanced deep learning models (SegFormer/RMBG) that analyze your image to identify the main subject and separate it from the background with pixel-perfect precision."
        },
        {
            q: "Is it really free?",
            a: "Yes, we offer a generous free tier for individual users. For high-volume API access or commercial features, we have Pro plans available."
        },
        {
            q: "What file formats are supported?",
            a: "We support JPG, PNG, and WebP formats. All processed images are returned as high-quality transparent PNGs."
        },
        {
            q: "Are my images stored on your servers?",
            a: "No. We value your privacy. Your images are processed in memory and are never stored on our servers unless you explicitly save them to your history while logged in."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans py-20 transition-colors duration-300">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-bold mb-12 transition-colors group">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Help & FAQs</h1>
                    </div>

                    <div className="space-y-8">
                        {faqs.map((faq, index) => (
                            <div key={index} className="space-y-3">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-start gap-2">
                                    <span className="text-blue-600 dark:text-blue-400 font-black">Q.</span>
                                    {faq.q}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-center text-slate-500 dark:text-slate-400 font-medium">
                            Still have questions? <Link to="/contact" className="text-blue-600 underline">Contact our support team</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
