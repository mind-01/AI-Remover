import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PricingSection } from '../components/PricingSection';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

export const PricingPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
            <Header setShowDashboard={(_show, view) => {
                navigate('/', { state: { showDashboard: true, dashboardView: view || 'history' } });
            }} />

            <main className="pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <PricingSection />

                    {/* FAQ Mini Section for Pricing Page */}
                    <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
                        <div className="max-w-3xl mx-auto px-4 text-center">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h3>
                            <div className="space-y-6 text-left mt-8">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Can I cancel anytime?</h4>
                                    <p className="text-slate-500 dark:text-slate-400">Yes, you can cancel your subscription at any time from your account dashboard.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">What is "Unlimited Local Exports"?</h4>
                                    <p className="text-slate-500 dark:text-slate-400">Our tool removes backgrounds directly in your browser. Since no server costs are involved for standard processing, we offer unlimited exports for free users.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};
