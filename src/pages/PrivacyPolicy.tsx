import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 dark:border-slate-700">

                <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-bold transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                        <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Information We Collect</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        We respect your privacy and are committed to protecting it. We only collect information that is necessary for the functionality of our AI Background Remover service.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mt-2">
                        <li><strong>Uploaded Images:</strong> Images are processed instantly and are automatically deleted from our servers after processing. We do not store your images.</li>
                        <li><strong>Account Information:</strong> If you create an account, we store your email address and basic profile information.</li>
                        <li><strong>Usage Data:</strong> We may collect anonymous usage statistics to improve our service performance.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. How We Use Your Information</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Your information is used solely for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mt-2">
                        <li>Providing and maintaining the Background Removal service.</li>
                        <li>Notifying you about changes to our service.</li>
                        <li>Providing customer support.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Data Security</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        We implement industry-standard security measures to ensure your data is protected during transmission and processing. All image processing happens in secure, temporary environments.
                    </p>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Third-Party Services</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        We may use third-party services for payments (e.g., Stripe) and authentication (e.g., Supabase). These services have their own privacy policies which we encourage you to review.
                    </p>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Contact Us</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        If you have any questions about this Privacy Policy, please contact us at support@airemover.com.
                    </p>

                </div>
            </div>
        </div>
    );
};
