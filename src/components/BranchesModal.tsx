import React, { useState } from 'react';
import { BRANCHES } from '../data/branchesData';
import { Branch } from '../types';
import { X, MapPin, Clock, Phone, Sparkles, Navigation, Check } from 'lucide-react';

interface BranchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBranchForOrder: (branchName: string) => void;
  isAzerbaijani: boolean;
}

export const BranchesModal: React.FC<BranchesModalProps> = ({
  isOpen,
  onClose,
  onSelectBranchForOrder,
  isAzerbaijani
}) => {
  const [filterRegion, setFilterRegion] = useState<string>('all');

  if (!isOpen) return null;

  const filteredBranches = BRANCHES.filter((b) => {
    if (filterRegion === 'all') return true;
    if (filterRegion === 'center') return b.id === 'sahil' || b.id === 'rooftop';
    if (filterRegion === 'whitecity') return b.id === 'white-city' || b.id === 'khatai' || b.id === 'karabakh-horses';
    if (filterRegion === 'sumgait') return b.id === 'sumgait';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0a1e15] border border-[#2b5e43] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1c4530] bg-[#071710]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#123624] border border-[#c59b27] flex items-center justify-center text-[#d4af37]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-brand text-xl font-bold text-white">
                {isAzerbaijani ? 'Belgian Filiallarımız (9 Ünvan)' : 'Our Belgian Branches (9 Locations)'}
              </h3>
              <p className="text-xs text-[#c59b27] font-medium">
                {isAzerbaijani ? 'Bakı & Sumqayıt üzrə xidmətinizdəyik' : 'At your service across Baku & Sumgait'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-[#133726] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Region Filter Tabs */}
        <div className="p-4 border-b border-[#183e2a] bg-[#081a11] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilterRegion('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
              filterRegion === 'all'
                ? 'bg-[#c59b27] text-black border-[#e0c169] font-bold'
                : 'bg-[#0f2c1e] text-gray-300 border-[#204d37]'
            }`}
          >
            {isAzerbaijani ? 'Bütün Filiallar (9)' : 'All Branches (9)'}
          </button>
          <button
            onClick={() => setFilterRegion('center')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
              filterRegion === 'center'
                ? 'bg-[#c59b27] text-black border-[#e0c169] font-bold'
                : 'bg-[#0f2c1e] text-gray-300 border-[#204d37]'
            }`}
          >
            {isAzerbaijani ? 'Bakı Mərkəz & Sahil' : 'Baku City Center'}
          </button>
          <button
            onClick={() => setFilterRegion('whitecity')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
              filterRegion === 'whitecity'
                ? 'bg-[#c59b27] text-black border-[#e0c169] font-bold'
                : 'bg-[#0f2c1e] text-gray-300 border-[#204d37]'
            }`}
          >
            {isAzerbaijani ? 'Ağ Şəhər & Xətai' : 'White City & Khatai'}
          </button>
          <button
            onClick={() => setFilterRegion('sumgait')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
              filterRegion === 'sumgait'
                ? 'bg-[#c59b27] text-black border-[#e0c169] font-bold'
                : 'bg-[#0f2c1e] text-gray-300 border-[#204d37]'
            }`}
          >
            {isAzerbaijani ? 'Sumqayıt Bulvar' : 'Sumgait Boulevard'}
          </button>
        </div>

        {/* Branch Cards List */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBranches.map((branch) => (
              <div
                key={branch.id}
                className="bg-[#081a12] border border-[#1e4834] hover:border-[#c59b27] rounded-2xl p-4 shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-serif-brand font-bold text-base text-[#f7f3ea]">
                      {branch.name}
                    </h4>
                    {branch.isRooftop && (
                      <span className="px-2 py-0.5 rounded-md bg-[#2b1706] border border-[#d4af37] text-[10px] font-bold text-[#f5d77f]">
                        Rooftop
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#a3c9b7] mb-2 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c59b27] shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </p>

                  <div className="space-y-1 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{branch.hours}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`tel:${branch.phone}`} className="hover:text-[#c59b27] transition font-mono">
                        {branch.phone}
                      </a>
                    </div>
                  </div>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {branch.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#0c2419] text-[#9fc7b4] px-2 py-0.5 rounded border border-[#1b4330]"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#173d2a] flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#eeddb2] italic truncate">
                    📍 {branch.landmark}
                  </span>
                  <button
                    onClick={() => {
                      onSelectBranchForOrder(branch.name);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#143a28] hover:bg-[#1d4d36] text-xs font-semibold text-[#eeddb2] border border-[#2b6144] transition shrink-0"
                  >
                    {isAzerbaijani ? 'Buradan Sifariş Et' : 'Order From Here'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
