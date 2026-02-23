import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, Eye, EyeOff, Loader2, ArrowLeft, Image as ImageIcon, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    cover_image: string;
    status: 'draft' | 'published';
    created_at: string;
}

export const BlogAdminPage: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        cover_image: '',
        status: 'draft'
    });

    useEffect(() => {
        if (user) fetchPosts();
    }, [user]);

    const fetchPosts = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (err) {
            console.error('Error fetching admin posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!supabase || !user) return;
        setLoading(true);
        try {
            // Basic validation
            if (!currentPost.title || !currentPost.slug || !currentPost.content) {
                throw new Error("Title, Slug, aur Content bharna zaroori hai.");
            }

            const postData = {
                ...currentPost,
                author_id: user.id,
                updated_at: new Date().toISOString()
            };

            let error;
            if (currentPost.id) {
                const { error: err } = await supabase
                    .from('blog_posts')
                    .update(postData)
                    .eq('id', currentPost.id);
                error = err;
            } else {
                const { error: err } = await supabase
                    .from('blog_posts')
                    .insert([postData]);
                error = err;
            }

            if (error) throw error;

            setIsEditing(false);
            setCurrentPost({ title: '', slug: '', content: '', excerpt: '', cover_image: '', status: 'draft' });
            fetchPosts();
        } catch (err: any) {
            console.error('Error saving post:', err);
            alert(`Galti: ${err.message || 'Post save nahi ho paya. Console check karein.'}`);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        const updates: Partial<BlogPost> = { title: newTitle };

        // Auto-generate slug if it's currently empty or was previously auto-generated
        if (!currentPost.slug || currentPost.slug === generateSlug(currentPost.title || '')) {
            updates.slug = generateSlug(newTitle);
        }

        setCurrentPost({ ...currentPost, ...updates });
    };

    const handleDelete = async (id: string) => {
        if (!supabase || !confirm('Are you sure you want to delete this post?')) return;
        try {
            const { error } = await supabase.from('blog_posts').delete().eq('id', id);
            if (error) throw error;
            fetchPosts();
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <Header setShowDashboard={() => { }} />
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Admin Protected</h1>
                    <p className="text-slate-500 font-bold">Please login to access the blog dashboard.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Header setShowDashboard={() => { }} />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Blog <span className="text-blue-600">Admin</span></h1>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage your SEO content and tutorials</p>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setCurrentPost({ title: '', slug: '', content: '', excerpt: '', cover_image: '', status: 'draft' });
                                }}
                                className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest text-sm"
                            >
                                <Plus className="w-5 h-5" />
                                New Article
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div
                                key="editor"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-blue-900/5"
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-900 flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                                        <ArrowLeft className="w-4 h-4" /> Cancel
                                    </button>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setCurrentPost({ ...currentPost, status: currentPost.status === 'published' ? 'draft' : 'published' })}
                                            className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${currentPost.status === 'published'
                                                ? 'bg-green-50 border-green-100 text-green-600'
                                                : 'bg-slate-50 border-slate-100 text-slate-400'
                                                }`}
                                        >
                                            {currentPost.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                            {currentPost.status}
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="px-6 py-2 bg-slate-900 dark:bg-blue-600 text-white font-black rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all uppercase tracking-widest text-xs"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Post
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Article Title</label>
                                            <input
                                                type="text"
                                                value={currentPost.title}
                                                onChange={handleTitleChange}
                                                placeholder="Enter a catchy title..."
                                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold focus:ring-2 focus:ring-blue-600/20 outline-none"
                                            />
                                            <p className="text-[10px] text-slate-500 font-medium ml-4 tracking-wide italic">Bilkul waisa hi heading jo aap blog ke upar dikhana chahte hain.</p>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">URL Slug</label>
                                            <input
                                                type="text"
                                                value={currentPost.slug}
                                                onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                                                placeholder="how-to-remove-bg"
                                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold font-mono focus:ring-2 focus:ring-blue-600/20 outline-none"
                                            />
                                            <p className="text-[10px] text-slate-500 font-medium ml-4 tracking-wide italic">Ye URL ka hissa hota hai. Sirf chote aksharon aur dash (-) ka use karein. Example: <b>background-kaise-hataye</b></p>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Excerpt (Summary)</label>
                                            <textarea
                                                value={currentPost.excerpt}
                                                onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                                placeholder="Short description for the grid view..."
                                                rows={3}
                                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold focus:ring-2 focus:ring-blue-600/20 outline-none resize-none"
                                            />
                                            <p className="text-[10px] text-slate-500 font-medium ml-4 tracking-wide italic">Search results mein dikhne wali 1-2 lines ki summary.</p>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Cover Image URL</label>
                                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center gap-3">
                                                <ImageIcon className="w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={currentPost.cover_image}
                                                    onChange={(e) => setCurrentPost({ ...currentPost, cover_image: e.target.value })}
                                                    placeholder="e.g. https://images.unsplash.com/photo-xxx.jpg"
                                                    className="bg-transparent border-none focus:outline-none w-full font-bold"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-medium ml-4 tracking-wide italic">Online image ka link (jaise Unsplash ya Google) paste karein. Iske aakhir mein .jpg hona chahiye.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Content (Write Article Here)</label>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] h-full min-h-[400px]">
                                            <textarea
                                                value={currentPost.content}
                                                onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                                                placeholder="Apna blog yahan likhein. Aap paragraph aur headings use kar sakte hain..."
                                                className="w-full h-full bg-transparent border-none focus:outline-none font-medium p-6 resize-none leading-relaxed text-lg"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium ml-4 tracking-wide italic text-center">Yahan apna pura article likhein. Yahan link paste nahi karna hai, content likhna hai.</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                {loading && posts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Fetching your articles...</p>
                                    </div>
                                ) : posts.length === 0 ? (
                                    <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold">No articles yet. Click "New Article" to get started!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {posts.map((post) => (
                                            <div
                                                key={post.id}
                                                className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
                                            >
                                                <div className="flex items-center gap-6 flex-1">
                                                    <div className="w-24 h-16 rounded-xl overflow-hidden shadow-md">
                                                        <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="font-black text-slate-900 dark:text-white line-clamp-1">{post.title}</h3>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${post.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                                                                }`}>
                                                                {post.status}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                                                                {new Date(post.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Link
                                                        to={`/blog/${post.slug}`}
                                                        className="p-3 text-slate-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setCurrentPost(post);
                                                            setIsEditing(true);
                                                        }}
                                                        className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                                    >
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(post.id)}
                                                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
};
