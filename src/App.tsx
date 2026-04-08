/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronRight, 
  ArrowRight, 
  ShoppingBag, 
  Info, 
  Layers,
  Search,
  Loader2
} from 'lucide-react';
import { getFashionRecommendations, FashionRecommendation } from './services/geminiService';

const STYLES = [
  { id: 'minimalist', name: 'Minimalist', description: 'Clean lines, neutral palette, essential silhouettes.', image: 'https://picsum.photos/seed/minimalist/800/1200' },
  { id: 'grunge', name: 'Grunge', description: 'Edgy, distressed, dark aesthetic with a rebellious spirit.', image: 'https://picsum.photos/seed/grunge/800/1200' },
  { id: 'old-money', name: 'Old Money', description: 'Timeless elegance, quiet luxury, sophisticated tailoring.', image: 'https://picsum.photos/seed/luxury/800/1200' },
  { id: 'avant-garde', name: 'Avant-Garde', description: 'Experimental, sculptural, pushing fashion boundaries.', image: 'https://picsum.photos/seed/avantgarde/800/1200' },
  { id: 'streetwear', name: 'Streetwear', description: 'Urban, comfortable, hype-driven contemporary culture.', image: 'https://picsum.photos/seed/streetwear/800/1200' },
  { id: 'bohemian', name: 'Bohemian', description: 'Free-spirited, eclectic, rich textures and patterns.', image: 'https://picsum.photos/seed/boho/800/1200' },
];

export default function App() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<FashionRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStyleSelect = async (styleName: string) => {
    setSelectedStyle(styleName);
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFashionRecommendations(styleName);
      setRecommendations(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSelectedStyle(null);
    setRecommendations(null);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white flex items-center justify-center">
            <span className="text-black font-serif font-bold text-xl">C</span>
          </div>
          <span className="chic-label text-sm">CHIC CURATOR</span>
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#" className="chic-label hover:text-white transition-colors">Collections</a>
          <a href="#" className="chic-label hover:text-white transition-colors">About</a>
          <a href="#" className="chic-label hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedStyle ? (
            <motion.section
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-20"
            >
              <span className="chic-label mb-4 block">Curated Excellence</span>
              <h1 className="text-6xl md:text-8xl font-serif mb-8 tracking-tight">
                Define Your <span className="italic">Aesthetic</span>
              </h1>
              <p className="text-brand-silver max-w-xl mx-auto text-lg font-light leading-relaxed mb-12">
                Select a style that resonates with your vision. Our AI-driven curator will provide a bespoke selection of brands and items to elevate your wardrobe.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STYLES.map((style, idx) => (
                  <motion.div
                    key={style.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
                    onClick={() => handleStyleSelect(style.name)}
                  >
                    <img 
                      src={style.image} 
                      alt={style.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute bottom-0 left-0 p-8 text-left w-full">
                      <h3 className="text-3xl font-serif mb-2">{style.name}</h3>
                      <p className="text-sm text-brand-silver font-light opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        {style.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-white/50 group-hover:text-white transition-colors">
                        <span className="chic-label text-[8px]">Explore</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[60vh]"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
                <div>
                  <button 
                    onClick={reset}
                    className="chic-label mb-4 flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <ChevronRight size={12} className="rotate-180" />
                    Back to Styles
                  </button>
                  <h2 className="text-5xl md:text-7xl font-serif">
                    The <span className="italic">{selectedStyle}</span> Edit
                  </h2>
                </div>
                {!isLoading && recommendations && (
                  <div className="chic-label text-right">
                    Curated by Gemini AI
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 className="animate-spin mb-6 text-brand-silver" size={48} />
                  <p className="chic-label animate-pulse">Analyzing aesthetic patterns...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-400 mb-6">{error}</p>
                  <button onClick={() => handleStyleSelect(selectedStyle)} className="chic-button">Retry</button>
                </div>
              ) : recommendations && (
                <div className="space-y-20">
                  {/* Summary */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles size={20} className="text-brand-silver" />
                      <span className="chic-label">Curator's Note</span>
                    </div>
                    <p className="text-2xl font-light leading-relaxed text-brand-silver italic">
                      "{recommendations.summary}"
                    </p>
                  </motion.div>

                  {/* Brands */}
                  <section>
                    <div className="flex items-center gap-3 mb-10">
                      <ShoppingBag size={20} className="text-brand-silver" />
                      <h3 className="chic-label">Recommended Brands</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {recommendations.brands.map((brand, idx) => (
                        <motion.div 
                          key={brand.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="chic-card group"
                        >
                          <h4 className="text-2xl font-serif mb-2 group-hover:text-brand-silver transition-colors">{brand.name}</h4>
                          <p className="chic-label text-[8px] mb-4 text-white/40">{brand.vibe}</p>
                          <p className="text-sm font-light text-brand-silver leading-relaxed">
                            {brand.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* Items */}
                  <section>
                    <div className="flex items-center gap-3 mb-10">
                      <Layers size={20} className="text-brand-silver" />
                      <h3 className="chic-label">Essential Coordination Items</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {recommendations.items.map((item, idx) => (
                        <motion.div 
                          key={item.name}
                          initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + (idx * 0.1) }}
                          className="flex flex-col md:flex-row gap-6 p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                        >
                          <div className="w-full md:w-1/3 aspect-square bg-brand-gray flex items-center justify-center border border-white/10">
                            <Search size={32} className="text-white/10" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-xl font-serif">{item.name}</h4>
                              <span className="text-[10px] uppercase border border-white/20 px-2 py-0.5 rounded-full text-white/40">{item.category}</span>
                            </div>
                            <p className="text-sm font-light text-brand-silver mb-6">
                              {item.description}
                            </p>
                            <div className="bg-white/5 p-4 border-l-2 border-white">
                              <div className="flex items-center gap-2 mb-2">
                                <Info size={12} className="text-brand-silver" />
                                <span className="chic-label text-[8px]">Styling Tip</span>
                              </div>
                              <p className="text-xs italic font-light text-brand-silver">
                                {item.stylingTip}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  <div className="pt-20 text-center">
                    <button onClick={reset} className="chic-button">
                      Curate Another Style
                    </button>
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-12 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white flex items-center justify-center">
              <span className="text-black font-serif font-bold text-sm">C</span>
            </div>
            <span className="chic-label text-[10px]">CHIC CURATOR © 2026</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-brand-silver hover:text-white transition-colors"><span className="chic-label text-[8px]">Instagram</span></a>
            <a href="#" className="text-brand-silver hover:text-white transition-colors"><span className="chic-label text-[8px]">Vogue</span></a>
            <a href="#" className="text-brand-silver hover:text-white transition-colors"><span className="chic-label text-[8px]">Hypebeast</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
