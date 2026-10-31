import React from 'react';
import { Sparkles, Award, Coffee, ShieldCheck, Heart, Instagram } from 'lucide-react';

interface AboutSectionProps {
  isAzerbaijani: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ isAzerbaijani }) => {
  return (
    <section id="haqqimizda" className="py-16 bg-[#07160f] border-t border-[#183d29]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Brand Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Emblem & Visual Badge */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-gradient-to-tr from-[#0a2417] via-[#103825] to-[#184d33] border-4 border-[#c59b27] shadow-2xl flex items-center justify-center p-6 group">
              <div className="w-56 sm:w-64 h-56 sm:h-64 rounded-full overflow-hidden border-2 border-[#d4af37]/60 shadow-inner">
                <img
                  src="/assets/aistudio/IMG_5127_acff560b.jpeg"
                  alt="Belgian Chocolate & Coffee"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating aesthetic labels */}
              <div className="absolute -top-3 right-4 bg-[#26150b] border border-[#d4af37] px-3 py-1 rounded-full text-xs font-bold text-[#eeddb2] shadow-xl">
                ★ 100% Callebaut
              </div>
              <div className="absolute -bottom-3 left-4 bg-[#0a2619] border border-[#276648] px-3.5 py-1 rounded-full text-xs font-bold text-[#a7dfc0] shadow-xl">
                ☕ Specialty Arabica
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#123624] border border-[#2b6144] text-xs font-semibold text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Home in Europe!</span>
            </div>

            <h2 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              {isAzerbaijani
                ? 'Avropanın Zəngin Şokolad İrsi İndi Bakıda'
                : 'Europe’s Rich Chocolate Heritage in Baku'}
            </h2>

            <p className="text-sm sm:text-base text-[#b7d5c7] leading-relaxed">
              {isAzerbaijani
                ? 'Belgian Chocolate & Coffee – hər qurtumda səmimiyyət və əsl keyfiyyət vəd edir. Biz Belçikanın yüzillik şokolad ənənələrini ən yaxşı Arabica qəhvə dənələri ilə birləşdirərək Bakı və Sumqayıtda unudulmaz qastronomik təcrübə yaradırıq.'
                : 'Belgian Chocolate & Coffee brings true craftsmanship to Baku and Sumgait. We blend centuries-old Belgian chocolate recipes with specialty grade Arabica beans for an unforgettable gourmet coffee experience.'}
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#183e2a]">
              <div className="bg-[#091e14] border border-[#1d4732] p-4 rounded-2xl">
                <Award className="w-6 h-6 text-[#c59b27] mb-2" />
                <h4 className="font-serif-brand font-bold text-sm text-white">
                  {isAzerbaijani ? 'Orijinal Şokolad' : 'Original Chocolate'}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {isAzerbaijani ? 'Heç bir süni qatqı olmadan xalis kakao yağı.' : 'Pure cocoa butter without artificial additives.'}
                </p>
              </div>

              <div className="bg-[#091e14] border border-[#1d4732] p-4 rounded-2xl">
                <Coffee className="w-6 h-6 text-[#c59b27] mb-2" />
                <h4 className="font-serif-brand font-bold text-sm text-white">
                  {isAzerbaijani ? 'Həftəlik Qovrulma' : 'Fresh Weekly Roast'}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {isAzerbaijani ? 'Xüsusi profil ilə yerində təzə üyüdülən dənələr.' : 'Freshly ground specialty coffee beans.'}
                </p>
              </div>

              <div className="bg-[#091e14] border border-[#1d4732] p-4 rounded-2xl">
                <Heart className="w-6 h-6 text-[#c59b27] mb-2" />
                <h4 className="font-serif-brand font-bold text-sm text-white">
                  {isAzerbaijani ? '9 Rahat Məkan' : '9 Cozy Spaces'}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {isAzerbaijani ? 'Ağ Şəhər terrası, Rooftop və Nərimanov zalları.' : 'White City terrace, Rooftop and more.'}
                </p>
              </div>
            </div>

            {/* Instagram connection */}
            <div className="pt-2 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f2c1e] hover:bg-[#18452f] text-xs font-semibold text-[#eeddb2] border border-[#275a40] transition"
              >
                <Instagram className="w-4 h-4 text-[#c59b27]" />
                <span>Instagram: @belgian_coffee_baku</span>
              </a>
              <span className="text-xs text-gray-400">
                #YourHomeInEurope #BelgianBaku
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
