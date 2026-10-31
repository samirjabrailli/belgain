import React from 'react';
import { ShoppingBag, MapPin, Globe, Phone, Clock, Menu as MenuIcon, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenBranches: () => void;
  isAzerbaijani: boolean;
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenBranches,
  isAzerbaijani,
  onToggleLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#091b13]/90 backdrop-blur-md border-b border-[#1e4834]/60">
      {/* Top micro announcement bar */}
      <div className="bg-[#06140e] border-b border-[#143324] px-4 py-1.5 text-xs text-[#d3be93] flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#e4c272]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              {isAzerbaijani ? 'Your Home in Europe! • Bakı & Sumqayıt' : 'Your Home in Europe! • Baku & Sumgait'}
            </span>
            <span className="hidden md:inline text-gray-500">|</span>
            <span className="hidden md:inline text-[#eeddb2] text-[11px] font-medium flex items-center gap-1">
              <span>✨ AI Barista:</span>
              <span className="text-gray-300">
                {isAzerbaijani ? 'Məhsul və inqrediyentləri canlı soruşun' : 'Ask about drinks & ingredients live'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={onOpenBranches}
              className="hover:text-white transition flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>{isAzerbaijani ? 'Filiallarımız' : 'Our Branches'}</span>
            </button>
            <a
              href="tel:+994125671122"
              className="hover:text-white transition flex items-center gap-1 text-[#e8d9ba]"
            >
              <Phone className="w-3 h-3 text-[#c59b27]" />
              <span>*2020</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3.5 group">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#c59b27] shadow-lg group-hover:scale-105 transition-transform bg-[#0a2016]">
            <img
              src="/assets/aistudio/IMG_5127_acff560b.jpeg"
              alt="Belgian Chocolate & Coffee"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-serif-brand text-xl sm:text-2xl font-bold tracking-tight text-[#fdfbf7] group-hover:text-[#eeddb2] transition">
                BELGIAN
              </span>
            </div>
            <p className="text-[10px] sm:text-xs tracking-wider uppercase text-[#c59b27] font-semibold">
              CHOCOLATE & COFFEE
            </p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          <a
            href="#vitrin"
            className="text-sm font-medium text-[#e2f0e8] hover:text-[#d4af37] transition flex items-center gap-1.5"
          >
            <span>✨</span>
            <span>{isAzerbaijani ? '3D Vitrin' : '3D Showcase'}</span>
          </a>
          <a
            href="#menyu"
            className="text-sm font-medium text-[#e2f0e8] hover:text-[#d4af37] transition"
          >
            {isAzerbaijani ? 'Menyu & Sifariş' : 'Menu & Order'}
          </a>
          <button
            onClick={onOpenBranches}
            className="text-sm font-medium text-[#e2f0e8] hover:text-[#d4af37] transition"
          >
            {isAzerbaijani ? 'Filiallar (9)' : 'Branches (9)'}
          </button>
          <a
            href="#haqqimizda"
            className="text-sm font-medium text-[#e2f0e8] hover:text-[#d4af37] transition"
          >
            {isAzerbaijani ? 'Haqqımızda' : 'About Us'}
          </a>
        </nav>

        {/* Right Action Icons: Language, Cart, Order Button */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0f2b1d] border border-[#24523a] text-xs font-semibold text-[#e1eee6] hover:bg-[#18422e] transition"
            title="Dili dəyiş / Change language"
          >
            <Globe className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>{isAzerbaijani ? 'AZ' : 'EN'}</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center p-2.5 rounded-xl bg-[#0f2b1d] border border-[#24523a] text-[#f7f3ea] hover:bg-[#18422e] hover:border-[#c59b27] transition shadow-md"
            aria-label="Səbət"
          >
            <ShoppingBag className="w-5 h-5 text-[#eeddb2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#c59b27] text-black font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Quick Order CTA */}
          <a
            href="#menyu"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#c59b27] to-[#e4ba4c] text-black text-xs sm:text-sm font-bold shadow-lg hover:brightness-110 active:scale-95 transition"
          >
            {isAzerbaijani ? 'Sifariş Ver' : 'Order Now'}
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a1e15] border-b border-[#204a36] px-5 py-4 space-y-3">
          <a
            href="#vitrin"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-white py-1"
          >
            ✨ {isAzerbaijani ? '3D Vitrin' : '3D Showcase'}
          </a>
          <a
            href="#menyu"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-white py-1"
          >
            ☕ {isAzerbaijani ? 'Menyu & Sifariş' : 'Menu & Order'}
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBranches();
            }}
            className="block w-full text-left text-sm font-medium text-white py-1"
          >
            📍 {isAzerbaijani ? 'Filiallarımız (9)' : 'Our Branches (9)'}
          </button>
          <a
            href="#haqqimizda"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-white py-1"
          >
            📖 {isAzerbaijani ? 'Haqqımızda' : 'About Us'}
          </a>
        </div>
      )}
    </header>
  );
};
