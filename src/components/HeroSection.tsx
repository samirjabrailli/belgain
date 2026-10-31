import React from 'react';
import { Sparkles, ArrowRight, Eye, ShieldCheck, MapPin, Coffee } from 'lucide-react';
import { ModelType } from './ThreeCanvas';

interface HeroSectionProps {
  onExplore3D: () => void;
  onOpenMenu: () => void;
  onOpenBranches: () => void;
  isAzerbaijani: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore3D,
  onOpenMenu,
  onOpenBranches,
  isAzerbaijani
}) => {
  return (
    <section className="relative pt-8 pb-12 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#1a4b33]/25 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Top welcome tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0e2a1d] border border-[#276648] text-xs font-semibold text-[#e8d9ba] mb-5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#c59b27] animate-ping" />
          <span>Your Home in Europe! Welcome to Belgian!</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-serif-brand text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          {isAzerbaijani ? (
            <>
              Əsl Belçika Şokoladı & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f7e7b4] to-[#c59b27]">
                3D İnteraktiv Qəhvə Vitrini
              </span>
            </>
          ) : (
            <>
              Authentic Belgian Chocolate & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f7e7b4] to-[#c59b27]">
                3D Interactive Showcase
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-[#bed8cb] max-w-2xl mx-auto leading-relaxed">
          {isAzerbaijani
            ? 'Callebaut şokoladları ilə zənginləşdirilmiş imza içkilər, isti Liege vafliləri və Bakının 9 ən gözəl məkanında onlayn sifariş rahatlığı.'
            : 'Signature drinks infused with pure Belgian Callebaut chocolate, warm Liege waffles, and effortless online ordering across 9 Baku & Sumgait locations.'}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#vitrin"
            onClick={onExplore3D}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#c59b27] to-[#e4ba4c] text-black font-bold text-sm shadow-xl hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2.5"
          >
            <Eye className="w-4 h-4 stroke-[2.5]" />
            <span>{isAzerbaijani ? '3D Vitrində Kəşf Et' : 'Explore 3D Vitrine'}</span>
          </a>

          <a
            href="#menyu"
            onClick={onOpenMenu}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0e2a1d] hover:bg-[#163f2c] border border-[#276648] text-white font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            <Coffee className="w-4 h-4 text-[#c59b27]" />
            <span>{isAzerbaijani ? 'Menyuya Keç & Sifariş Ver' : 'View Full Menu & Order'}</span>
          </a>

          <button
            onClick={onOpenBranches}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#091b12] hover:bg-[#123624] border border-[#1d4632] text-[#d5e8dd] font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 text-[#c59b27]" />
            <span>{isAzerbaijani ? '9 Filialımız' : '9 Branches'}</span>
          </button>
        </div>

        {/* Trust & Spec Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-[#183d29]">
          <div className="p-3 rounded-2xl bg-[#081b12]/70 border border-[#1a422d]">
            <p className="font-serif-brand font-bold text-xl sm:text-2xl text-[#eeddb2]">9 Filial</p>
            <p className="text-xs text-gray-400 mt-0.5">{isAzerbaijani ? 'Bakı & Sumqayıt' : 'Baku & Sumgait'}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#081b12]/70 border border-[#1a422d]">
            <p className="font-serif-brand font-bold text-xl sm:text-2xl text-[#eeddb2]">100% Xalis</p>
            <p className="text-xs text-gray-400 mt-0.5">{isAzerbaijani ? 'Belçika Şokoladı' : 'Belgian Chocolate'}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#081b12]/70 border border-[#1a422d]">
            <p className="font-serif-brand font-bold text-xl sm:text-2xl text-[#eeddb2]">3D Vitrin</p>
            <p className="text-xs text-gray-400 mt-0.5">{isAzerbaijani ? '360° Real-Time' : '360° Inspection'}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#081b12]/70 border border-[#1a422d]">
            <p className="font-serif-brand font-bold text-xl sm:text-2xl text-[#eeddb2]">15-25 Dəq</p>
            <p className="text-xs text-gray-400 mt-0.5">{isAzerbaijani ? 'Sürətli Hazırlıq' : 'Fast Preparation'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
