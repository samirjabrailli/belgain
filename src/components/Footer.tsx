import React from 'react';
import { BRANCHES } from '../data/branchesData';
import { Phone, MapPin, Instagram, Heart, Coffee } from 'lucide-react';

interface FooterProps {
  onOpenBranches: () => void;
  isAzerbaijani: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBranches, isAzerbaijani }) => {
  return (
    <footer className="bg-[#05110b] border-t border-[#143324] text-gray-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#c59b27] bg-[#0a2016]">
                <img
                  src="/assets/aistudio/IMG_5127_acff560b.jpeg"
                  alt="Belgian Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-serif-brand text-2xl font-bold tracking-tight text-white">
                  BELGIAN
                </span>
                <p className="text-[10px] tracking-widest uppercase text-[#c59b27] font-semibold">
                  CHOCOLATE & COFFEE
                </p>
              </div>
            </div>

            <p className="text-xs text-[#a3cbb8] leading-relaxed max-w-sm">
              {isAzerbaijani
                ? 'Your Home in Europe! Welcome to Belgian! Əsl Belçika şokoladının təravətli qəhvə ilə ən zərif vəhdəti.'
                : 'Your Home in Europe! Welcome to Belgian! The finest union of authentic Belgian chocolate and specialty coffee.'}
            </p>

            <div className="pt-2 text-xs text-[#e8d9ba] space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c59b27]" />
                <a href="tel:+994125671122" className="hover:text-white transition font-mono">
                  +994 (12) 567 11 22 / *2020
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>@belgian_coffee_baku</span>
              </div>
            </div>
          </div>

          {/* Col 3: Filiallar Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-brand font-bold text-white text-base">
              {isAzerbaijani ? 'Filiallarımız' : 'Branches'}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {BRANCHES.slice(0, 5).map((b) => (
                <li key={b.id}>
                  <button
                    onClick={onOpenBranches}
                    className="hover:text-[#c59b27] transition text-left"
                  >
                    • {b.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenBranches}
                  className="text-[#c59b27] hover:underline font-semibold"
                >
                  {isAzerbaijani ? 'Bütün 9 filialı gör →' : 'View all 9 branches →'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Menyu Kateqoriyaları */}
          <div className="space-y-3">
            <h4 className="font-serif-brand font-bold text-white text-base">
              {isAzerbaijani ? 'Seçilmiş Menyu' : 'Menu Highlights'}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a href="#menyu" className="hover:text-[#c59b27] transition">
                  • Belgian Coffee & Cocktail
                </a>
              </li>
              <li>
                <a href="#menyu" className="hover:text-[#c59b27] transition">
                  • Şəkərbura Raf & Paxlava Frappe
                </a>
              </li>
              <li>
                <a href="#menyu" className="hover:text-[#c59b27] transition">
                  • Belgian Liege Waffle
                </a>
              </li>
              <li>
                <a href="#menyu" className="hover:text-[#c59b27] transition">
                  • Iced Belgian & Feijoa Chiller
                </a>
              </li>
              <li>
                <a href="#menyu" className="hover:text-[#c59b27] transition">
                  • Hot Chocolate & Black Mocha
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: İş Saatları & Xidmət */}
          <div className="space-y-3">
            <h4 className="font-serif-brand font-bold text-white text-base">
              {isAzerbaijani ? 'İş Qrafiki' : 'Opening Hours'}
            </h4>
            <div className="space-y-1.5 text-xs text-gray-400">
              <p className="text-white font-medium">Bazar ertəsi - Bazar:</p>
              <p>08:00 - 00:00 (Filiallara görə)</p>
              <p className="text-[#c59b27] pt-1">Rooftop Lounge:</p>
              <p>11:00 - 01:30</p>
              <p className="pt-2 text-[11px] text-[#9fc7b4]">
                ✓ Çatdırılma: Bakı & Sumqayıt
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#143324] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Belgian Chocolate & Coffee. Bütün hüquqlar qorunur.</p>
          <div className="flex items-center gap-4">
            <a
              href="/belgian-chocolate-coffee.zip"
              download="belgian-chocolate-coffee.zip"
              className="text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
            >
              ⬇ {isAzerbaijani ? 'Layihənin Bütün Kodunu ZIP Kimi Yüklə (.zip)' : 'Download Full Codebase (.zip)'}
            </a>
            <span className="hidden sm:inline text-gray-600">|</span>
            <p className="flex items-center gap-1.5 text-gray-400">
              <span>Your Home in Europe</span>
              <span>•</span>
              <span className="text-[#eeddb2]">Bakı, Azərbaycan</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
