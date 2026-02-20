import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, STORAGE_BUCKET } from '../lib/supabase';

interface HistoryItem {
    id: string;
    original_url: string;
    processed_url: string;
    task_config: any;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    history: HistoryItem[];
    signOut: () => Promise<void>;
    refreshHistory: () => Promise<void>;
    addToHistory: (item: Omit<HistoryItem, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
    deleteHistoryItem: (id: string) => Promise<void>;
    deleteAllHistory: () => Promise<void>;
    uploadImage: (blob: Blob, path: string) => Promise<string | null>;
    updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const initializing = React.useRef(false);

    useEffect(() => {
        if (initializing.current) return;
        initializing.current = true;

        if (!supabase) {
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchHistory(session.user.id);
            }
            setLoading(false);
        }).catch((err: any) => {
            console.error('AuthContext: getSession crash:', err);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: Session | null) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                fetchHistory(session.user.id);
            } else {
                setHistory([]);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchHistory = async (userId: string) => {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('user_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setHistory(data);
        }
    };

    const signOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
    };

    const refreshHistory = async () => {
        if (user) await fetchHistory(user.id);
    };

    const addToHistory = async (item: any) => {
        if (!user || !supabase) return;

        const { error } = await supabase.from('user_history').insert([
            { ...item, user_id: user.id }
        ]);

        if (error) {
            console.error('Error adding to history:', error);
            throw error;
        }

        await fetchHistory(user.id);
    };

    const deleteHistoryItem = async (id: string) => {
        if (!user || !supabase) return;

        const { error } = await supabase
            .from('user_history')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting history item:', error);
            throw error;
        }

        await fetchHistory(user.id);
    };

    const deleteAllHistory = async () => {
        if (!user || !supabase) return;

        const { error } = await supabase
            .from('user_history')
            .delete()
            .eq('user_id', user.id);

        if (error) {
            console.error('Error clearing history:', error);
            throw error;
        }

        setHistory([]);
    };

    const uploadImage = async (blob: Blob, path: string): Promise<string | null> => {
        if (!user || !supabase) {
            console.warn('AuthContext: uploadImage skipped - No user or supabase');
            return null;
        }

        const fileName = `${user.id}/${Date.now()}-${path}`;
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, blob, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.error('Upload error:', error);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(data.path);

        return publicUrl;
    };

    const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
        if (!user || !supabase) return;

        const { error } = await supabase.auth.updateUser({
            data: data
        });

        if (error) {
            console.error('Error updating profile:', error);
            throw error;
        }

        // The user state will be updated by onAuthStateChange
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            loading,
            history,
            signOut,
            refreshHistory,
            addToHistory,
            deleteHistoryItem,
            deleteAllHistory,
            uploadImage,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
