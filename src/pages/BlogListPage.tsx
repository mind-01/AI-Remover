import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, Loader2 } from 'lucide-react';
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
                        id: '4',
                        title: 'How to Remove Image Background on Mobile (No App Required!)',
                        slug: 'how-to-remove-background-on-mobile',
                        excerpt: 'Learn how to use RemovePro AI locally on your mobile browser for instant, private background removal without downloading any apps.',
                        cover_image: '/blog/remove-background-on-your-phone-free-ai-tool.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '3',
                        title: 'Best Free Remove.bg Alternative (No Upload, No Watermark) – RemovePro',
                        slug: 'best-free-remove-bg-alternative',
                        excerpt: 'Are you tired of paying for Remove.bg credits? Discover the best free Remove.bg alternative that requires no signup, no upload, and provides watermark-free HD downloads.',
                        cover_image: '/blog/nike-shoe-background-removal.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '2',
                        title: 'Free AI Background Remover Without Watermark (HD Quality) – RemovePro',
                        slug: 'free-ai-background-remover-without-watermark',
                        excerpt: 'Looking for a free AI background remover without watermark? Use RemovePro to remove image backgrounds instantly in high quality.',
                        cover_image: '/blog/ai-background-remover-upload-interface.webp',
                        created_at: new Date().toISOString(),
                        status: 'published'
                    },
                    {
                        id: '1',
                        title: 'How to Remove Background Like a Pro',
                        slug: 'remove-background-like-pro',
                        excerpt: 'Learn the secrets to achieving pixel-perfect cutouts using our advanced AI technology.',
                        cover_image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200',
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredPosts.map((post, idx) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none group hover:scale-[1.02] transition-all duration-500"
                                >
                                    <Link to={`/blog/${post.slug}`} className="block relative h-64 overflow-hidden">
                                        <img
                                            src={post.cover_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
                                    </Link>

                                    <div className="p-8 space-y-4">
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                <Calendar className="w-3 h-3 text-blue-600" />
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                <Clock className="w-3 h-3 text-amber-500" />
                                                5 min read
                                            </span>
                                        </div>

                                        <Link to={`/blog/${post.slug}`}>
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight hover:text-blue-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                        </Link>

                                        <p className="text-slate-500 dark:text-slate-400 font-medium line-clamp-3 leading-relaxed">
                                            {post.excerpt}
                                        </p>

                                        <Link
                                            to={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs group/link pt-2"
                                        >
                                            Read More
                                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                                        </Link>
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
