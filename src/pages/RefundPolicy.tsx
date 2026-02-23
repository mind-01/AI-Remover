import React from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RefundPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 dark:border-slate-700">

                <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-bold transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                        <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Refund Policy</h1>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                        Last Refund Policy Update: {new Date().toLocaleDateString()}
                    </p>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Customer Satisfaction Guarantee</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        We strive to provide the best AI background removal service possible. If you are not completely satisfied with our service, we are here to help.
                    </p>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Refund Eligibility</h3>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mt-2">
                        <li>**Technical Issues:** If the service failed to process your images due to a technical error on our end, you are eligible for a full refund of credits used.</li>
                        <li>**Quality Issues:** If the output quality is significantly below standard (and not due to low-quality input), we will review your case for a potential refund.</li>
                        <li>**Subscription Charges:** Refund requests for subscription renewals must be made within 7 days of the billing date, provided no credits have been used in the new billing cycle.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Non-Refundable Items</h3>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mt-2">
                        <li>Credits used for successful image processing.</li>
                        <li>Requests made after 30 days of purchase.</li>
                        <li>Account termination due to violation of Terms of Service.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">How to Request a Refund</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        To initiate a refund request, please email our support team at **support@airemover.com** with your:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mt-2">
                        <li>Account Email Address</li>
                        <li>Transaction ID / Receipt</li>
                        <li>Reason for the request (with screenshots if applicable)</li>
                    </ul>
                    <p className="text-slate-600 dark:text-slate-400 mt-4">
                        We aim to process all refund requests within 5-7 business days.
                    </p>

                </div>
            </div>
        </div>
    );
};
