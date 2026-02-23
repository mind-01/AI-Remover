import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import config from next-sitemap.config.js
// Since it's ES module, we can import it
import config from '../next-sitemap.config.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const siteUrl = config.siteUrl || 'https://ai-remover-indol.vercel.app';

const staticRoutes = [
    '',
    '/privacy',
    '/terms',
    '/refund',
    '/help',
    '/contact',
    '/status',
    '/resources',
    '/pricing',
    '/api-docs',
    '/blog',
];

async function generateSitemap() {
    console.log('🚀 Generating sitemap using config from next-sitemap.config.js...');

    let blogRoutes = [];

    if (supabaseUrl && supabaseKey) {
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data: posts, error } = await supabase
                .from('blog_posts')
                .select('slug')
                .eq('status', 'published');

            if (error) {
                console.warn('⚠️ Could not fetch from Supabase (table might not exist yet):', error.message);
            } else {
                blogRoutes = (posts || []).map(post => `/blog/${post.slug}`);
                console.log(`📝 Found ${blogRoutes.length} blog posts from Supabase.`);
            }
        } catch (err) {
            console.error('❌ Supabase error:', err.message);
        }
    }

    // Fallback routes if none found in Supabase
    if (blogRoutes.length === 0) {
        console.log('ℹ️ No blog posts found in Supabase, adding default fallback routes.');
        blogRoutes = [
            '/blog/how-to-remove-background-on-mobile',
            '/blog/best-free-remove-bg-alternative',
            '/blog/free-ai-background-remover-without-watermark',
            '/blog/remove-background-like-pro'
        ];
    }

    const allRoutes = [...staticRoutes, ...blogRoutes];
    const date = new Date().toISOString();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
            .map(route => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${config.changefreq || 'daily'}</changefreq>
    <priority>${route === '' ? '1.0' : (config.priority || 0.7)}</priority>
  </url>`)
            .join('\n')}
</urlset>`;

    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);

    const outDir = config.outDir || 'dist';
    const distDir = path.join(process.cwd(), outDir);
    if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
        fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
        console.log(`✅ Sitemap and robots.txt written to /${outDir}`);
    }

    console.log('✅ Sitemap and robots.txt written to /public');
}

generateSitemap();
