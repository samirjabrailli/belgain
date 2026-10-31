import React, { useState, useMemo } from 'react';
import { ProductItem, Size, ExtraOption } from '../types';
import { EXTRA_MILK_OPTIONS, EXTRA_ADDONS } from '../data/menuData';
import { X, Plus, Minus, ShoppingBag, Sparkles, Coffee } from 'lucide-react';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (
    product: ProductItem,
    size: Size,
    quantity: number,
    milk?: string,
    temperature?: 'İsti' | 'Soyuq' | 'Buzlu',
    extras?: { id: string; name: string; price: number }[],
    notes?: string,
    finalUnitPrice?: number
  ) => void;
  isAzerbaijani: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isAzerbaijani,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<Size>(product.hasSizes ? 'M' : 'Standard');
  const [selectedMilk, setSelectedMilk] = useState<string>('Standart Süd');
  const [selectedTemp, setSelectedTemp] = useState<'İsti' | 'Soyuq' | 'Buzlu'>(
    product.tags?.includes('Buzlu') ? 'Buzlu' : 'İsti'
  );
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState('');

  // Calculate unit price dynamically based on size & selected extras
  const unitPrice = useMemo(() => {
    let base = 0;
    if (product.hasSizes) {
      base = selectedSize === 'S' ? (product.priceS || 0) : (product.priceM || 0);
    } else {
      base = product.singlePrice || 0;
    }

    // Milk surcharge
    const milkObj = EXTRA_MILK_OPTIONS.find((m) => m.name === selectedMilk || m.nameEn === selectedMilk);
    if (milkObj && milkObj.id !== 'regular') {
      base += milkObj.price;
    }

    // Extras sum
    const extrasTotal = selectedExtras.reduce((acc, curr) => acc + curr.price, 0);
    return base + extrasTotal;
  }, [product, selectedSize, selectedMilk, selectedExtras]);

  const toggleExtra = (extra: ExtraOption) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleConfirm = () => {
    onAddToCart(
      product,
      selectedSize,
      quantity,
      product.allowsMilkChoice ? selectedMilk : undefined,
      selectedTemp,
      selectedExtras.map((e) => ({
        id: e.id,
        name: isAzerbaijani ? e.name : e.nameEn,
        price: e.price,
      })),
      specialNote.trim() ? specialNote : undefined,
      unitPrice
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0a1e15] border border-[#2b5e43] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1c4530] bg-[#071710]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#123624] border border-[#c59b27] flex items-center justify-center text-[#d4af37]">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-brand text-lg font-bold text-white">
                {isAzerbaijani ? product.name : product.nameEn}
              </h3>
              <p className="text-[11px] text-[#c59b27] font-medium uppercase tracking-wider">
                {isAzerbaijani ? 'Sifarişi Fərdiləşdir' : 'Customize Your Drink'}
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

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Description */}
          <p className="text-xs text-[#b8d6c7] leading-relaxed bg-[#06150e] p-3 rounded-xl border border-[#1b3d2c]">
            {isAzerbaijani ? product.description : product.descriptionEn}
          </p>

          {/* Size Choice */}
          {product.hasSizes && (
            <div>
              <label className="block text-xs font-bold text-[#eeddb2] mb-2 uppercase tracking-wide">
                {isAzerbaijani ? 'Ölçü Seçimi:' : 'Select Size:'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSize('S')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                    selectedSize === 'S'
                      ? 'bg-[#18442e] border-[#c59b27] text-white shadow-md'
                      : 'bg-[#091b12] border-[#1d4732] text-gray-300 hover:bg-[#102d1f]'
                  }`}
                >
                  <span className="font-bold text-sm">S (Standart)</span>
                  <span className="font-mono text-xs text-[#eeddb2] mt-0.5">
                    {product.priceS?.toFixed(2)} ₼
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSize('M')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                    selectedSize === 'M'
                      ? 'bg-[#18442e] border-[#c59b27] text-white shadow-md'
                      : 'bg-[#091b12] border-[#1d4732] text-gray-300 hover:bg-[#102d1f]'
                  }`}
                >
                  <span className="font-bold text-sm">M (Böyük / Medium)</span>
                  <span className="font-mono text-xs text-[#eeddb2] mt-0.5">
                    {product.priceM?.toFixed(2)} ₼
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Milk Choice */}
          {product.allowsMilkChoice && (
            <div>
              <label className="block text-xs font-bold text-[#eeddb2] mb-2 uppercase tracking-wide">
                {isAzerbaijani ? 'Süd Seçimi (Extra Bar):' : 'Milk Preference:'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {EXTRA_MILK_OPTIONS.map((milk) => {
                  const isSelected = selectedMilk === milk.name;
                  return (
                    <button
                      key={milk.id}
                      type="button"
                      onClick={() => setSelectedMilk(milk.name)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#18442e] border-[#c59b27] text-white font-semibold'
                          : 'bg-[#091b12] border-[#1d4732] text-gray-300 hover:bg-[#102d1f]'
                      }`}
                    >
                      <span className="truncate">{isAzerbaijani ? milk.name : milk.nameEn}</span>
                      {milk.price > 0 && (
                        <span className="text-[10px] text-[#eeddb2] font-mono ml-1 shrink-0">
                          +{milk.price.toFixed(2)} ₼
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Temperature Choice */}
          <div>
            <label className="block text-xs font-bold text-[#eeddb2] mb-2 uppercase tracking-wide">
              {isAzerbaijani ? 'Temperatur:' : 'Temperature:'}
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['İsti', 'Soyuq', 'Buzlu'] as const).map((temp) => (
                <button
                  key={temp}
                  type="button"
                  onClick={() => setSelectedTemp(temp)}
                  className={`py-2 rounded-xl border text-center transition ${
                    selectedTemp === temp
                      ? 'bg-[#18442e] border-[#c59b27] text-white font-semibold'
                      : 'bg-[#091b12] border-[#1d4732] text-gray-300 hover:bg-[#102d1f]'
                  }`}
                >
                  {temp === 'İsti' && '🔥 '}
                  {temp === 'Soyuq' && '❄️ '}
                  {temp === 'Buzlu' && '🧊 '}
                  {temp}
                </button>
              ))}
            </div>
          </div>

          {/* Extra Bar Add-ons */}
          {product.allowsExtras && (
            <div>
              <label className="block text-xs font-bold text-[#eeddb2] mb-2 uppercase tracking-wide">
                {isAzerbaijani ? 'Extra Bar Əlavələri:' : 'Extra Bar Additions:'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {EXTRA_ADDONS.map((addon) => {
                  const isChecked = selectedExtras.some((e) => e.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleExtra(addon)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#1b4a32] border-[#c59b27] text-white font-semibold'
                          : 'bg-[#091b12] border-[#1d4732] text-gray-300 hover:bg-[#102d1f]'
                      }`}
                    >
                      <span className="truncate">{isAzerbaijani ? addon.name : addon.nameEn}</span>
                      <span className="text-[10px] text-[#eeddb2] font-mono ml-1 shrink-0">
                        +{addon.price.toFixed(2)} ₼
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Barista Note */}
          <div>
            <label className="block text-xs font-bold text-[#eeddb2] mb-1.5 uppercase tracking-wide">
              {isAzerbaijani ? 'Baristaya Qeyd:' : 'Note for Barista:'}
            </label>
            <input
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder={isAzerbaijani ? 'məs: "çox qaynar olsun", "şəkərsiz"...' : 'e.g. "extra hot", "no sugar"...'}
              className="w-full px-3 py-2 bg-[#06150e] border border-[#234d38] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c59b27]"
            />
          </div>
        </div>

        {/* Footer with Quantity Stepper & Add to Cart button */}
        <div className="p-4 border-t border-[#1c4530] bg-[#071710] flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2 bg-[#0a2016] border border-[#234d38] p-1 rounded-2xl">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-[#123624] transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-sm w-7 text-center text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-[#123624] transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button with calculated price */}
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#c59b27] to-[#e4ba4c] text-black font-bold text-sm shadow-xl hover:brightness-110 active:scale-95 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {isAzerbaijani ? 'Səbətə Əlavə Et' : 'Add to Cart'} • {(unitPrice * quantity).toFixed(2)} ₼
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
