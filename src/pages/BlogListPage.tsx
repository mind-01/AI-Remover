import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { supabase } from '../lib/supabase';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string;
    created_at: string;
    status: string;
}

export const BlogListPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            if (!supabase) return;
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setPosts(data || []);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setPosts([
                    {
                        id: '20',
                        title: 'The Future of AI Photo Editing: Beyond 2026',
                        slug: 'future-of-ai-background-removal-beyond-2026',
                        excerpt: 'What happens when background removal becomes "silent"? Explore the upcoming trends in generative AI, neural rendering, and 3D subject extraction.',
                        cover_image: '/blog/remove-background-no-upload-privacy.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '19',
                        title: 'Social Media Manager’s Guide: AI Background Removal (2026)',
                        slug: 'social-media-background-removal-guide-2026',
                        excerpt: 'Optimize your content workflow for Instagram, TikTok, and Facebook. Learn how to batch process creative assets for maximum engagement.',
                        cover_image: '/blog/remove-background-on-your-phone-free-ai-tool.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '18',
                        title: 'How to Remove Background from Glass & Water (2026 AI Guide)',
                        slug: 'remove-background-glass-transparent-objects',
                        excerpt: 'Master the hardest challenge in AI photo editing: transparency. Learn how to preserve refraction and highlights in glassware.',
                        cover_image: '/blog/remove-background-no-upload-privacy.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '17',
                        title: 'Video Editor’s Secret: Batch Removing Backgrounds for PNG Sequences',
                        slug: 'png-sequence-background-removal-video-editors',
                        excerpt: 'Learn how to process thousands of frames instantly using local AI. Perfect for Premiere Pro and DaVinci Resolve workflows.',
                        cover_image: '/blog/ai-background-remover-pro-editor-background.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '16',
                        title: 'Top 7 Free AI Background Removers (2026): No Sign-up Required',
                        slug: 'top-7-free-ai-background-remover-no-signup',
                        excerpt: 'Tired of login walls? Discover the best background removal tools that respect your privacy and don’t require an account.',
                        cover_image: '/blog/best-removebg-alternative-before-after.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '15',
                        title: 'Adobe Express vs. RemovePro: Privacy, Speed, and the Creator Dilemma',
                        slug: 'adobe-express-vs-removepro-privacy-speed',
                        excerpt: 'Compare Adobe Express’s powerful creative suite with RemovePro’s privacy-first local AI. Discover which tool is safer for sensitive projects.',
                        cover_image: '/blog/remove-background-no-upload-privacy.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '14',
                        title: 'Pixelcut vs. RemovePro: Automating E-commerce Workflows in 2026',
                        slug: 'pixelcut-vs-removepro-ecommerce-workflow',
                        excerpt: 'Discover the ultimate toolkit for high-volume product photography. Compare Pixelcut’s mobile-first automation with RemovePro’s pro-grade browser AI.',
                        cover_image: '/blog/nike-shoe-background-removal.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '13',
                        title: 'Photoroom vs. RemovePro: The 2026 AI Background Removal Tech Battle',
                        slug: 'photoroom-vs-removepro-comparison',
                        excerpt: 'Compare the titan of mobile e-commerce with the king of high-performance browser-AI. Discover which tool wins on accuracy and privacy.',
                        cover_image: '/blog/ai-background-remover-pro-editor-background.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '12',
                        title: 'Canva Pro Background Remover Free Alternative (2026 Guide)',
                        slug: 'canva-pro-background-remover-free-alternative',
                        excerpt: 'Stop paying for a subscription to remove backgrounds. Discover how to get Canva Pro quality isolation for free with RemovePro.',
                        cover_image: '/blog/nike-shoe-background-removal.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '11',
                        title: 'AI Background Remover vs Photoshop (2026) – Faster & Cheaper',
                        slug: 'ai-background-remover-vs-photoshop',
                        excerpt: 'In 2026, discovers why standalone AI tools are beating Photoshop on speed, cost, and workflow efficiency for pros.',
                        cover_image: '/blog/ai-background-remover-pro-editor-background.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '10',
                        title: 'How to Create a Budget Product Photography Studio Using AI (Save 80% on Costs – 2026 Guide)',
                        slug: 'budget-product-photography-studio-ai-guide',
                        excerpt: 'Save 80% on costs by building a DIY home studio. Learn how to use your smartphone and AI to create professional product photos with RemovePro.',
                        cover_image: '/blog/nike-shoe-background-removal.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '9',
                        title: 'AI Background Removal API Integration Guide (Developer Beta – 2026)',
                        slug: 'ai-background-removal-api-guide',
                        excerpt: 'Integrate RemovePro’s high-performance Subject-AI into your business workflow. Closed Beta access for REST API is now open for partners and Business users.',
                        cover_image: '/blog/ai-background-remover-pro-editor-background.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '8',
                        title: 'The Hair & Fur Detail Guide: Professional AI Background Removal',
                        slug: 'hair-fur-background-removal-guide',
                        excerpt: 'Master the toughest challenge in photo editing. Learn how to use AI to achieve pixel-perfect hair and fur cutouts without losing a single strand.',
                        cover_image: '/blog/hair-fur-detail-ai-background-removal.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '7',
                        title: 'How to Remove Background in Bulk for Etsy & Shopify Sellers',
                        slug: 'bulk-background-removal-etsy-shopify',
                        excerpt: 'Learn how to process 50+ product photos at once for Etsy and Shopify with local AI. Professional white backgrounds in one click.',
                        cover_image: '/blog/nike-shoe-background-removal.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '6',
                        title: 'How to Remove Background Without Uploading Your Image (Privacy Safe Method)',
                        slug: 'remove-background-without-uploading',
                        excerpt: 'Remove image backgrounds without uploading to any server. Private, local AI processing with full HD download – 100% free.',
                        cover_image: '/blog/remove-background-no-upload-privacy.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '5',
                        title: 'How to Remove Background for Amazon Product Photos (2026 Seller Guide)',
                        slug: 'how-to-remove-background-for-amazon-product-photos',
                        excerpt: 'Master the art of Amazon product photography. Learn exactly how to remove backgrounds and create pure white #FFFFFF background images that meet Amazon\'s strictest standards instantly.',
                        cover_image: '/blog/nike-shoe-background-removal.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '4',
                        title: 'How to Remove Background from Image on Mobile (Free & No App Required)',
                        slug: 'how-to-remove-background-on-mobile',
                        excerpt: 'Desktop-grade AI in your mobile browser. Learn how to remove backgrounds on the go without downloading any apps or sacrificing your privacy.',
                        cover_image: '/blog/remove-background-on-your-phone-free-ai-tool.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '3',
                        title: 'Best Free Remove.bg Alternative (No Upload, No Watermark)',
                        slug: 'best-free-remove-bg-alternative',
                        excerpt: 'Stop paying for credits. Discover why RemovePro is the best free alternative to Remove.bg for professional HD downloads with zero costs.',
                        cover_image: '/blog/best-removebg-alternative-before-after.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '2',
                        title: 'Free AI Background Remover Without Watermark (HD Quality)',
                        slug: 'free-ai-background-remover-without-watermark',
                        excerpt: 'Experience studio-quality background removal with zero watermarks and 100% on-device privacy. Professional results, completely free.',
                        cover_image: '/blog/free-ai-background-remover-before-after.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '1',
                        title: 'How to Remove Background Like a Pro (2026)',
                        slug: 'remove-background-like-pro',
                        excerpt: 'Learn secret industry tips for handling complex hair, tough shadows, and lighting matches to achieve commercial-grade results every time.',
                        cover_image: '/blog/ai-background-remover-pro-editor-background.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 gradient-bg">
            <Header setShowDashboard={(_show, view) => {
                navigate('/', { state: { showDashboard: true, dashboardView: view || 'history' } });
            }} />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight"
                        >
                            Our <span className="text-blue-600">Blog</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium"
                        >
                            Tips, tutorials, and insights into the world of AI-powered creative tools.
                        </motion.p>
                    </div>

                    <div className="max-w-xl mx-auto mb-16 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700 dark:text-slate-200"
                        />
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Loading articles...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            {filteredPosts.map((post, idx) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-[#f2f4f7] dark:bg-slate-900 rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col"
                                >
                                    <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden">
                                        <img
                                            src={post.cover_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                    </Link>

                                    <div className="p-10 flex flex-col flex-grow">
                                        <p className="text-[#8e5297] font-black uppercase tracking-[0.2em] text-[10px] mb-4">
                                            Product Updates
                                        </p>

                                        <Link to={`/blog/${post.slug}`} className="mb-6">
                                            <h2 className="text-3xl font-black text-[#2d333a] dark:text-white leading-[1.1] hover:text-blue-600 transition-colors line-clamp-3">
                                                {post.title} <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
                                            </h2>
                                        </Link>

                                        <div className="mt-auto text-sm font-bold text-slate-400">
                                            {new Date(post.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-slate-500 font-black uppercase tracking-widest">No articles found matching your search.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};
