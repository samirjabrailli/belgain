import React, { useState, useMemo } from 'react';
import { ProductItem } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/menuData';
import { Search, Sparkles, Plus, Eye, Flame, Coffee, Heart } from 'lucide-react';
import { ModelType } from './ThreeCanvas';

interface ProductCatalogProps {
  onSelectProductForCustomize: (product: ProductItem) => void;
  onQuickAdd: (product: ProductItem) => void;
  onViewIn3D: (model: ModelType) => void;
  isAzerbaijani: boolean;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProductForCustomize,
  onQuickAdd,
  onViewIn3D,
  isAzerbaijani
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTag, setActiveFilterTag] = useState<string | null>(null);

  const filterTags = isAzerbaijani
    ? ['Hamısı', 'İmza Məhsul', 'Belçika Şokoladı', 'Milli Dad', 'Buzlu', 'Qaynar']
    : ['All', 'Signature', 'Belgian Chocolate', 'National Taste', 'Iced', 'Hot'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.nameEn.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.descriptionEn.toLowerCase().includes(query);

      // Tag filter
      let matchesTag = true;
      if (activeFilterTag && activeFilterTag !== 'Hamısı' && activeFilterTag !== 'All') {
        const tagMap: Record<string, string> = {
          'İmza Məhsul': 'İmza Məhsul',
          'Signature': 'İmza Məhsul',
          'Belçika Şokoladı': 'Belçika Şokoladı',
          'Belgian Chocolate': 'Belçika Şokoladı',
          'Milli Dad': 'Milli Dad',
          'National Taste': 'Milli Dad',
          'Buzlu': 'Buzlu',
          'Iced': 'Buzlu',
          'Qaynar': 'Qaynar',
          'Hot': 'Qaynar',
        };
        const targetTag = tagMap[activeFilterTag] || activeFilterTag;
        matchesTag = Boolean(item.tags?.some((t) => t.includes(targetTag) || (item.isSignature && targetTag === 'İmza Məhsul')));
      }

      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [selectedCategory, searchQuery, activeFilterTag]);

  return (
    <section id="menyu" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#123624] border border-[#2b6144] text-xs font-semibold text-[#d4af37] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAzerbaijani ? 'Rəsmi Bakı & Sumqayıt Menyusu' : 'Official Baku & Sumgait Menu'}</span>
        </div>
        <h2 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          {isAzerbaijani ? 'Lüks Belçika Şokoladı & Qəhvə Seçimləri' : 'Luxury Belgian Chocolate & Coffee Selection'}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#c0dbce] leading-relaxed">
          {isAzerbaijani
            ? 'Hər fincanda əsl Belçika ənənəsi: təbii Callebaut şokoladları, xüsusi qovrulmuş Arabica dənləri və təzə inqrediyentlər.'
            : 'Authentic Belgian heritage in every cup: pure Callebaut chocolate, specialty roasted Arabica beans, and fresh artisan ingredients.'}
        </p>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="bg-[#0a2016] border border-[#214b35] p-4 rounded-2xl mb-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAzerbaijani ? 'Qəhvə, vafli və ya içki axtar...' : 'Search coffee, waffle or drink...'}
            className="w-full pl-10 pr-4 py-2.5 bg-[#071710] border border-[#26533c] rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#c59b27] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilterTag(activeFilterTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                activeFilterTag === tag
                  ? 'bg-[#c59b27] text-black border-[#e0c169] font-semibold'
                  : 'bg-[#0f2c1e] text-[#c6ded3] border-[#204d37] hover:bg-[#173e2b]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-[#c59b27] to-[#e4ba4c] text-black border-[#ffd359] shadow-lg font-bold'
                : 'bg-[#091e15] text-[#d1e5db] border-[#1d4632] hover:bg-[#113323]'
            }`}
          >
            {isAzerbaijani ? cat.label : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#0a1f16] border border-[#234d38] rounded-3xl p-8">
          <Coffee className="w-12 h-12 text-[#c59b27] mx-auto mb-3 opacity-60" />
          <p className="text-lg font-semibold text-white">
            {isAzerbaijani ? 'Axtarışa uyğun məhsul tapılmadı' : 'No items match your search'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {isAzerbaijani ? 'Zəhmət olmasa axtarış sözünü dəyişin və ya kateqoriyaları yoxlayın.' : 'Try adjusting your search keywords or categories.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setActiveFilterTag(null);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#c59b27] text-black text-xs font-bold"
          >
            {isAzerbaijani ? 'Filtirləri Sıfırla' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const displayPrice = product.hasSizes
              ? `${product.priceS?.toFixed(2)} - ${product.priceM?.toFixed(2)} ₼`
              : `${product.singlePrice?.toFixed(2)} ₼`;

            return (
              <div
                key={product.id}
                className="group relative bg-[#091d14] border border-[#1f4834] hover:border-[#c59b27]/80 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {product.isSignature && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#2d1806] border border-[#d4af37] text-[10px] font-bold text-[#f5d77f]">
                          <Sparkles className="w-2.5 h-2.5" />
                          {isAzerbaijani ? 'İmza' : 'Signature'}
                        </span>
                      )}
                      {product.hasSizes && (
                        <span className="px-2 py-0.5 rounded-md bg-[#133726] border border-[#296547] text-[10px] text-[#bde3cf] font-mono">
                          S / M
                        </span>
                      )}
                    </div>

                    {/* 3D Model Quick Link Icon */}
                    {product.threeModel && (
                      <button
                        onClick={() => {
                          onViewIn3D(product.threeModel!);
                          const vitrinElem = document.getElementById('vitrin');
                          vitrinElem?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1 text-[11px] text-[#d4af37] hover:text-white bg-[#0e2c1e] hover:bg-[#1a4b33] px-2 py-1 rounded-lg border border-[#2b5e43] transition"
                        title={isAzerbaijani ? '3D Vitrində Fırlat və Bax' : 'Inspect in 3D Vitrine'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="font-semibold text-[10px]">3D</span>
                      </button>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif-brand text-lg font-bold text-[#faf6ee] group-hover:text-[#eeddb2] transition mb-1.5">
                    {isAzerbaijani ? product.name : product.nameEn}
                  </h3>
                  <p className="text-xs text-[#a9c9b9] leading-relaxed mb-4 line-clamp-2">
                    {isAzerbaijani ? product.description : product.descriptionEn}
                  </p>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-[#0c2419] text-[#9fc7b4] px-2 py-0.5 rounded border border-[#1b4330]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Card Action & Price */}
                <div className="pt-3 border-t border-[#193d2b] flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider">
                      {isAzerbaijani ? 'Qiymət' : 'Price'}
                    </span>
                    <span className="text-base font-bold text-[#eeddb2] font-mono">
                      {displayPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {product.hasSizes || product.allowsMilkChoice || product.allowsExtras ? (
                      <button
                        onClick={() => onSelectProductForCustomize(product)}
                        className="px-3 py-1.5 bg-[#0f2d1e] hover:bg-[#18462f] text-[#f7f3ea] hover:text-[#c59b27] border border-[#2a5b42] rounded-xl text-xs font-semibold transition"
                      >
                        {isAzerbaijani ? 'Fərdiləşdir' : 'Customize'}
                      </button>
                    ) : null}

                    <button
                      onClick={() => onQuickAdd(product)}
                      className="p-2 rounded-xl bg-gradient-to-r from-[#c59b27] to-[#e4ba4c] text-black hover:brightness-110 active:scale-95 transition shadow-md"
                      title={isAzerbaijani ? 'Səbətə tez əlavə et' : 'Quick add to cart'}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
