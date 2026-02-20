import React, { useState } from 'react';
import { ImageComparison } from './ImageComparison';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

export const SamplesSection: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    const [activeTab1, setActiveTab1] = useState('Products');
    const [activeTab2, setActiveTab2] = useState('People');

    const categoryKeys = ['products', 'people', 'animals', 'cars', 'graphics'] as const;
    const categories = ['Products', 'People', 'Animals', 'Cars', 'Graphics'];

    const sampleImages: Record<string, { before: string, after: string, overlay?: string, isTransparent?: boolean }> = {
        'Products': {
            before: 'https://img.freepik.com/free-photo/white-background-with-white-clouds_1340-23424.jpg?q=80&w=1000',
            after: '/samples/blue_bg.jpg',
            overlay: '/samples/brown_bag_cutout.png',
            isTransparent: true
        },
        'People': {
            before: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjczNC0xMTAuanBn.jpg',
            after: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8zMF9waG90b19vZl9hX3lvdW5nX2luZGlhbl93b21hbl9zbWlsaW5nX2lzb2xhdGVfNGNiZGJlMDMtNzc0ZC00MmE1LWJmYjAtZDBiZDUzYWEwY2I0LnBuZw.png'
        },
        'Animals': {
            before: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L25zMTA0MDgtaW1hZ2Uta3d5YndnbW8uanBn.jpg',
            after: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8yN19waG90b19vZl9hX3B1Z19kb2dfc2l0dGluZ19pc29sYXRlZF9vbl93aGl0ZV9iYV82OWI5NmI1MC02YjI4LTQ3NzQtYTljMS00MTYxNzg2ZjhjNDkucG5n.png'
        },
        'Cars': {
            before: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L25zOTQ1Ni1pbWFnZS1rd3llNnhnbi5qcGc.jpg',
            after: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTMvcmF3cGl4ZWxfb2ZmaWNlXzE1X3Bob3RvX29mX2FfbHV4dXJ5X3doaXRlX3Nwb3J0c19jYXJfaXNvbGF0ZWRfb25fXzM4OTJlNmYyLTMwNjUtNDRjNS05YjYwLTc0MjI3YzRjM2UyZC5wbmc.png'
        },
        'Graphics': {
            before: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcyMy0wMDlhXzEuanBn.jpg',
            after: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA3L3Jhd3BpeGVsX29mZmljZV8yNF93YXRlcmNvbG9yX2lsbHVzdHJhdGlvbl9vZl9hX2J1dHRlcmZseV9pc29sYXRlZF83ZTUxYmQ2NC0wMjY4LTQzODAtYTVmMC0wNjE3OTNlMTM4YjEucG5n.png'
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 space-y-32 py-24 border-t border-slate-100">

            {/* 1. Stunning Quality Section */}
            <section className="text-center space-y-12">
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">{t.samples.stunningTitle}</h2>
                    <div className="flex flex-wrap justify-center gap-2">
                        {categoryKeys.map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab1(categories[categoryKeys.indexOf(key)])}
                                className={cn(
                                    "px-5 py-2 rounded-full text-xs font-bold transition-all",
                                    activeTab1 === categories[categoryKeys.indexOf(key)]
                                        ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105"
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                )}
                            >
                                {t.samples.categories[key]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <ImageComparison
                        beforeImage={sampleImages[activeTab1].before}
                        afterImage={sampleImages[activeTab1].after}
                        overlayImage={sampleImages[activeTab1].overlay}
                        isTransparentOverlay={sampleImages[activeTab1].isTransparent}
                        className="max-h-[500px]"
                    />
                    <button className="mt-8 text-blue-600 font-bold text-sm flex items-center gap-2 mx-auto hover:gap-3 transition-all">
                        {t.samples.seeMore} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* 2. Efficiency Boost Section */}
            <section className="flex flex-col lg:flex-row items-center gap-16">
                <div className="w-full lg:w-1/2">
                    <div className="grid grid-cols-3 gap-4 p-8 bg-slate-100 rounded-[3rem] shadow-inner relative overflow-hidden">
                        {[
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1542493591-7a0927502747?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1526170315870-efffd0ad46b4?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1525966222034-adc38cf1391e?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop',
                        ].map((src, i) => (
                            <div key={i} className="aspect-square bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transform hover:scale-105 transition-transform">
                                <img src={src} alt="Sample" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                    <h2 className="text-4xl font-black text-slate-800 leading-tight">
                        {t.samples.efficiencyTitle}
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        {t.samples.efficiencyDesc1}
                    </p>
                    <div className="space-y-4">
                        <p className="text-slate-600 text-sm font-medium">
                            {t.samples.efficiencyDesc2}
                        </p>
                        <p className="text-slate-600 text-sm">
                            {t.samples.efficiencyDesc3}
                        </p>
                    </div>
                    <div className="pt-4 flex flex-col gap-3">
                        <button className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                            {t.samples.integrations} <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                            {t.samples.apiDocs} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. Just Picture It Section */}
            <section className="text-center space-y-12">
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">{t.samples.pictureTitle}</h2>
                    <div className="flex flex-wrap justify-center gap-2">
                        {categoryKeys.map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab2(categories[categoryKeys.indexOf(key)])}
                                className={cn(
                                    "px-5 py-2 rounded-full text-xs font-bold transition-all",
                                    activeTab2 === categories[categoryKeys.indexOf(key)]
                                        ? "bg-slate-900 text-white shadow-lg"
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                )}
                            >
                                {t.samples.categories[key]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: t.samples.labels.original, src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800' },
                        { label: t.samples.labels.transparent, src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&bg=transparent', transparent: true },
                        { label: t.samples.labels.newBg, src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800' },
                        { label: t.samples.labels.endless, grid: true }
                    ].map((item, i) => (
                        <div key={i} className="space-y-3">
                            <div className={cn(
                                "aspect-[3/4] rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100",
                                item.transparent && "checkered-bg"
                            )}>
                                {item.grid ? (
                                    <div className="grid grid-cols-2 grid-rows-2 h-full gap-1">
                                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" className="w-full h-full object-cover" alt="" />
                                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" className="w-full h-full object-cover" alt="" />
                                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" className="w-full h-full object-cover" alt="" />
                                        <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop" className="w-full h-full object-cover" alt="" />
                                    </div>
                                ) : (
                                    <img src={item.src} className="w-full h-full object-cover" alt={item.label} />
                                )}
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Blog & Updates Section */}
            <section className="space-y-16">
                <div className="flex justify-between items-end">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">{t.blog.title}</h2>
                    <button className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                        {t.blog.seeMore} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(t.blog.posts || translations.en.blog.posts).map((blog: any, i: number) => (
                        <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{blog.date}</p>
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{blog.title}</h3>
                        </div>
                    ))}
                </div>

                <div className="pt-24 border-t border-slate-100">
                    <div className="bg-slate-900 rounded-[4rem] p-12 lg:p-20 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                            <div className="space-y-4 max-w-xl">
                                <h2 className="text-4xl font-black text-white leading-tight">{t.newsletter.title}</h2>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    {t.newsletter.desc}
                                </p>
                            </div>
                            <div className="w-full lg:w-auto relative max-w-md">
                                <div className="flex p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                    <input
                                        type="email"
                                        placeholder={t.newsletter.placeholder}
                                        className="bg-transparent border-none text-white px-6 py-3 focus:ring-0 flex-grow placeholder:text-slate-500 font-medium"
                                    />
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all">
                                        {t.newsletter.subscribe}
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-4 px-6 text-center lg:text-left">
                                    {t.newsletter.privacyNote}
                                </p>
                            </div>
                        </div>
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full -mr-48 -mt-48" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -ml-32 -mb-32" />
                    </div>
                </div>
            </section>

            {/* Footer Credits */}
            <div className="pt-24 flex flex-col items-center gap-8 opacity-50">
                <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
                    <div className="flex items-center gap-1 text-xs font-black">
                        <span className="text-slate-400">P</span>
                        <span className="text-slate-800">PRODUCT HUNT</span>
                    </div>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => <span key={s} className={cn("text-xs", s < 5 ? "text-orange-400" : "text-slate-200")}>★</span>)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{t.common.reviews}</span>
                </div>
                <div className="h-0.5 w-1/4 bg-slate-100" />
            </div>

        </div>
    );
};
