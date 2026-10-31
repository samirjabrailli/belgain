import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, Tag, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  isAzerbaijani: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  isAzerbaijani
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const deliveryEstimated = subtotal > 25 ? 0 : 3.0;
  const total = Math.max(0, subtotal - discount);

  const applyPromo = () => {
    if (promoInput.trim().toUpperCase() === 'BELGIAN10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError(isAzerbaijani ? 'Yanlış promo kod (Sınayın: BELGIAN10)' : 'Invalid code (Try: BELGIAN10)');
    }
  };

  // Quick WhatsApp Order link generator
  const handleWhatsAppOrder = () => {
    let text = `Salam, Belgian Chocolate & Coffee! Mən onlayn sifariş vermək istəyirəm:%0A%0A`;
    items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name}* (${item.size}) x${item.quantity} - ${(item.price * item.quantity).toFixed(2)} ₼%0A`;
      if (item.milk) text += `   • Süd: ${item.milk}%0A`;
      if (item.temperature) text += `   • Temp: ${item.temperature}%0A`;
      if (item.extras && item.extras.length > 0) {
        text += `   • Əlavələr: ${item.extras.map(e => e.name).join(', ')}%0A`;
      }
      if (item.notes) text += `   • Qeyd: ${item.notes}%0A`;
    });
    text += `%0A*Cəmi Məbləğ:* ${total.toFixed(2)} ₼`;
    window.open(`https://wa.me/994508009900?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0a1e15] border-l border-[#26533c] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#1b432f] bg-[#071710] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#123624] border border-[#c59b27] flex items-center justify-center text-[#d4af37]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-brand text-lg font-bold text-white">
                {isAzerbaijani ? 'Sifariş Səbəti' : 'Shopping Cart'}
              </h3>
              <p className="text-[11px] text-[#c59b27] font-medium">
                {items.length} {isAzerbaijani ? 'məhsul növü' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-[#123624] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#0d261b] border border-[#234e38] flex items-center justify-center mx-auto mb-4 text-[#c59b27]">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <p className="text-base font-semibold text-white">
                {isAzerbaijani ? 'Səbətiniz boşdur' : 'Your cart is empty'}
              </p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                {isAzerbaijani
                  ? 'Menyudan zövqünüzə uyğun Belçika şokoladı və ya qəhvəsi seçin.'
                  : 'Select your favorite Belgian chocolate or artisanal coffee from our menu.'}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-[#081a12] border border-[#1e4834] rounded-2xl p-4 shadow-sm relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-serif-brand font-bold text-sm text-[#f5f1e8]">
                      {isAzerbaijani ? item.name : item.nameEn}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#133827] text-[#a7d8bf] border border-[#245b3f] font-mono">
                        {item.size}
                      </span>
                      {item.temperature && (
                        <span className="text-[10px] text-gray-400">
                          {item.temperature}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-mono font-bold text-sm text-[#eeddb2]">
                    {(item.price * item.quantity).toFixed(2)} ₼
                  </span>
                </div>

                {/* Customizations tags */}
                {(item.milk || (item.extras && item.extras.length > 0) || item.notes) && (
                  <div className="mt-2.5 pt-2 border-t border-[#153826] space-y-1 text-[11px] text-[#9fc7b4]">
                    {item.milk && item.milk !== 'Standart Süd' && (
                      <div>🥛 {item.milk}</div>
                    )}
                    {item.extras && item.extras.map((ex, i) => (
                      <div key={i}>✨ {ex.name} (+{ex.price.toFixed(2)} ₼)</div>
                    ))}
                    {item.notes && (
                      <div className="italic text-gray-400">📝 "{item.notes}"</div>
                    )}
                  </div>
                )}

                {/* Bottom quantity stepper & remove */}
                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => onRemoveItem(item.cartItemId)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{isAzerbaijani ? 'Sil' : 'Remove'}</span>
                  </button>

                  <div className="flex items-center gap-2 bg-[#0c2419] border border-[#234e38] p-1 rounded-xl">
                    <button
                      onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                      className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-[#163f2b]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold text-white w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                      className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-[#163f2b]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations & Checkout Buttons */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#1b432f] bg-[#071710] space-y-3.5">
            {/* Promo Code Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo kod: BELGIAN10"
                  disabled={promoApplied}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#0a2016] border border-[#24523a] rounded-xl text-xs text-white uppercase placeholder-gray-500 focus:outline-none focus:border-[#c59b27]"
                />
              </div>
              <button
                onClick={applyPromo}
                disabled={promoApplied}
                className="px-3 py-1.5 bg-[#143a28] hover:bg-[#1d4d36] text-xs font-bold text-[#eeddb2] border border-[#2b6144] rounded-xl transition disabled:opacity-50"
              >
                {promoApplied ? <Check className="w-4 h-4 text-emerald-400" /> : (isAzerbaijani ? 'Tətbiq et' : 'Apply')}
              </button>
            </div>
            {promoError && <p className="text-[11px] text-red-400">{promoError}</p>}
            {promoApplied && (
              <p className="text-[11px] text-emerald-400 font-medium">
                ✓ {isAzerbaijani ? '10% endirim təsdiqləndi!' : '10% discount applied!'}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-gray-300 pt-1 border-t border-[#163826]">
              <div className="flex justify-between">
                <span>{isAzerbaijani ? 'Məhsullar:' : 'Subtotal:'}</span>
                <span className="font-mono text-white">{subtotal.toFixed(2)} ₼</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-400">
                  <span>{isAzerbaijani ? 'Endirim (10%):' : 'Discount (10%):'}</span>
                  <span className="font-mono">-{discount.toFixed(2)} ₼</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-[#1d4632]">
                <span>{isAzerbaijani ? 'Yekun Məbləğ:' : 'Total Amount:'}</span>
                <span className="font-mono text-base text-[#eeddb2]">{total.toFixed(2)} ₼</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#c59b27] to-[#e4ba4c] text-black font-bold text-sm shadow-xl hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>{isAzerbaijani ? 'Sifarişi Rəsmiləşdir' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#0f3422] hover:bg-[#184931] border border-[#2b6647] text-[#aae4c7] font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{isAzerbaijani ? 'WhatsApp ilə Sürətli Sifariş' : 'Quick WhatsApp Order'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
