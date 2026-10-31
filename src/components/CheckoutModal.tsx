import React, { useState } from 'react';
import { CartItem, Order, OrderType, PaymentMethod } from '../types';
import { BRANCHES } from '../data/branchesData';
import confetti from 'canvas-confetti';
import {
  X,
  MapPin,
  Truck,
  CreditCard,
  DollarSign,
  Smartphone,
  CheckCircle,
  Clock,
  Sparkles,
  Phone,
  User,
  Coffee
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: Order) => void;
  isAzerbaijani: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  isAzerbaijani
}) => {
  if (!isOpen) return null;

  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0].name);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+994 ');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? (subtotal > 25 ? 0 : 3.0) : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || phone.trim().length < 8) {
      alert(isAzerbaijani ? 'Zəhmət olmasa adınızı və əlaqə nömrənizi qeyd edin.' : 'Please enter your name and contact phone.');
      return;
    }
    if (orderType === 'delivery' && !address.trim()) {
      alert(isAzerbaijani ? 'Zəhmət olmasa çatdırılma ünvanını daxil edin.' : 'Please enter delivery address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: 'ord_' + Math.random().toString(36).substring(2, 9),
        orderNumber: 'BCC-' + Math.floor(1000 + Math.random() * 9000),
        items: [...items],
        subtotal,
        discount: 0,
        deliveryFee,
        total,
        orderType,
        branch: orderType === 'pickup' ? selectedBranch : undefined,
        customerName,
        phone,
        address: orderType === 'delivery' ? address : undefined,
        notes,
        paymentMethod,
        status: 'received',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedMinutes: orderType === 'pickup' ? 15 : 35
      };

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c59b27', '#e8d9ba', '#27ae60', '#ffffff']
        });
      } catch (err) {
        // Safe fallback
      }

      setConfirmedOrder(newOrder);
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0a1e15] border border-[#2b5e43] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1c4530] bg-[#071710]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#123624] border border-[#c59b27] flex items-center justify-center text-[#d4af37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-brand text-lg font-bold text-white">
                {confirmedOrder
                  ? (isAzerbaijani ? 'Sifariş Təsdiqləndi!' : 'Order Confirmed!')
                  : (isAzerbaijani ? 'Sifarişin Rəsmiləşdirilməsi' : 'Order Checkout')}
              </h3>
              <p className="text-[11px] text-[#c59b27] font-medium">
                Belgian Chocolate & Coffee • Baku
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

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {confirmedOrder ? (
            /* Order Success View */
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                  {isAzerbaijani ? 'Sifariş Nömrəniz' : 'Your Order Code'}
                </span>
                <h4 className="text-2xl font-mono font-bold text-white mt-0.5">
                  #{confirmedOrder.orderNumber}
                </h4>
                <p className="text-xs text-[#a4caba] mt-2 max-w-sm mx-auto">
                  {isAzerbaijani
                    ? `Təşəkkür edirik, ${confirmedOrder.customerName}! Baristamız sifarişinizi hazırlamağa başladı.`
                    : `Thank you, ${confirmedOrder.customerName}! Our baristas are preparing your items.`}
                </p>
              </div>

              {/* Live Order Timeline */}
              <div className="bg-[#071710] border border-[#1d4532] rounded-2xl p-4 text-left">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#c59b27]" />
                    {isAzerbaijani ? 'Təxmini vaxt:' : 'Estimated time:'} {confirmedOrder.estimatedMinutes} {isAzerbaijani ? 'dəqiqə' : 'mins'}
                  </span>
                  <span className="text-emerald-400 font-mono text-xs">● Qəbul edildi</span>
                </div>

                {/* Progress track */}
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-2">
                  <div className="p-2 rounded-xl bg-[#143d29] border border-[#266244] text-white font-medium">
                    1. Qəbul edildi
                  </div>
                  <div className="p-2 rounded-xl bg-[#0c2419] border border-[#1c4731] text-[#9fc7b4]">
                    2. Hazırlanır ☕
                  </div>
                  <div className="p-2 rounded-xl bg-[#0c2419] border border-[#1c4731] text-[#9fc7b4]">
                    3. Hazırdır ✨
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#173b29] text-xs text-gray-300 space-y-1">
                  <div>
                    <span className="text-gray-400">{isAzerbaijani ? 'Növ:' : 'Type:'} </span>
                    <span className="text-white font-medium">
                      {confirmedOrder.orderType === 'pickup'
                        ? `${isAzerbaijani ? 'Filialdan Götürmə' : 'Pickup'} (${confirmedOrder.branch})`
                        : `${isAzerbaijani ? 'Çatdırılma' : 'Delivery'} (${confirmedOrder.address})`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">{isAzerbaijani ? 'Yekun Məbləğ:' : 'Total:'} </span>
                    <span className="text-[#eeddb2] font-mono font-bold">
                      {confirmedOrder.total.toFixed(2)} ₼ ({confirmedOrder.paymentMethod === 'cash' ? (isAzerbaijani ? 'Nağd' : 'Cash') : (isAzerbaijani ? 'Kartla' : 'Card')})
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#c59b27] to-[#e4ba4c] text-black font-bold text-sm shadow-xl hover:brightness-110"
              >
                {isAzerbaijani ? 'Menyuya Qayıt' : 'Back to Menu'}
              </button>
            </div>
          ) : (
            /* Order Input Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Pickup vs Delivery Toggle */}
              <div>
                <label className="block text-xs font-bold text-[#eeddb2] mb-2 uppercase tracking-wide">
                  {isAzerbaijani ? 'Sifariş Tərzi:' : 'Order Fulfillment:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`p-3 rounded-2xl border text-center transition flex items-center justify-center gap-2 ${
                      orderType === 'pickup'
                        ? 'bg-[#18442e] border-[#c59b27] text-white shadow-md font-semibold'
                        : 'bg-[#091b12] border-[#1d4732] text-gray-300 hover:bg-[#102d1f]'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#c59b27]" />
                    <span>{isAzerbaijani ? 'Filialdan Götürmə' : 'Pickup (Takeaway)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`p-3 rounded-2xl border text-center transition flex items-center justify-center gap-2 ${
                      orderType === 'delivery'
                        ? 'bg-[#18442e] border-[#c59b27] text-white shadow-md font-semibold'
                        : 'bg-[#091b12] border-[#1d4732] text-gray-300 hover:bg-[#102d1f]'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-[#c59b27]" />
                    <span>{isAzerbaijani ? 'Kuryerlə Çatdırılma' : 'Door Delivery'}</span>
                  </button>
                </div>
              </div>

              {/* Branch Selector if Pickup */}
              {orderType === 'pickup' && (
                <div>
                  <label className="block text-xs font-bold text-[#eeddb2] mb-1.5 uppercase tracking-wide">
                    {isAzerbaijani ? 'Götürəcəyiniz Filialı Seçin (9 Filial):' : 'Select Branch (9 Locations):'}
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#071710] border border-[#24533b] rounded-xl text-xs text-white focus:outline-none focus:border-[#c59b27]"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.name} className="bg-[#0a1e15]">
                        {b.name} — {b.address}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Delivery Address if Delivery */}
              {orderType === 'delivery' && (
                <div>
                  <label className="block text-xs font-bold text-[#eeddb2] mb-1.5 uppercase tracking-wide">
                    {isAzerbaijani ? 'Çatdırılma Ünvanı (Bakı / Sumqayıt):' : 'Delivery Address (Baku / Sumgait):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={isAzerbaijani ? 'Küçə, bina, blok, mənzil, mərtəbə...' : 'Street, building, apartment, floor...'}
                    className="w-full px-3.5 py-2.5 bg-[#071710] border border-[#24533b] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c59b27]"
                  />
                  <p className="text-[10px] text-[#9dc4b1] mt-1">
                    {isAzerbaijani
                      ? '⚡ 25 ₼-dən yuxarı sifarişlərdə çatdırılma PULSUZDUR!'
                      : '⚡ Free delivery on orders over 25 ₼!'}
                  </p>
                </div>
              )}

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#eeddb2] mb-1.5 uppercase tracking-wide">
                    {isAzerbaijani ? 'Adınız:' : 'Full Name:'}
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Məs: Samir Cəbrayıllı"
                      className="w-full pl-9 pr-3 py-2 bg-[#071710] border border-[#24533b] rounded-xl text-xs text-white focus:outline-none focus:border-[#c59b27]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#eeddb2] mb-1.5 uppercase tracking-wide">
                    {isAzerbaijani ? 'Əlaqə Telefonu:' : 'Phone Number:'}
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+994 (50) 000-00-00"
                      className="w-full pl-9 pr-3 py-2 bg-[#071710] border border-[#24533b] rounded-xl text-xs text-white focus:outline-none focus:border-[#c59b27]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-[#eeddb2] mb-2 uppercase tracking-wide">
                  {isAzerbaijani ? 'Ödəniş Üsulu:' : 'Payment Method:'}
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                      paymentMethod === 'card'
                        ? 'bg-[#18442e] border-[#c59b27] text-white font-semibold'
                        : 'bg-[#091b12] border-[#1d4732] text-gray-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#c59b27]" />
                    <span>{isAzerbaijani ? 'Bank Kartı' : 'Card POS'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                      paymentMethod === 'cash'
                        ? 'bg-[#18442e] border-[#c59b27] text-white font-semibold'
                        : 'bg-[#091b12] border-[#1d4732] text-gray-300'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 text-[#c59b27]" />
                    <span>{isAzerbaijani ? 'Nağd Ödəniş' : 'Cash'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('applepay')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                      paymentMethod === 'applepay'
                        ? 'bg-[#18442e] border-[#c59b27] text-white font-semibold'
                        : 'bg-[#091b12] border-[#1d4732] text-gray-300'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#c59b27]" />
                    <span>Apple / Google</span>
                  </button>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-bold text-[#eeddb2] mb-1 uppercase tracking-wide">
                  {isAzerbaijani ? 'Əlavə İstək və Qeydlər:' : 'Additional Notes:'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAzerbaijani ? 'Məs: Qapı kodu 45, çatanda zəng edin' : 'e.g. Call when arrived'}
                  className="w-full px-3 py-2 bg-[#071710] border border-[#24533b] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c59b27]"
                />
              </div>

              {/* Summary Breakdown */}
              <div className="bg-[#06140e] border border-[#1b3f2c] rounded-2xl p-3.5 space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>{isAzerbaijani ? 'Məhsulların cəmi:' : 'Items total:'}</span>
                  <span className="font-mono text-white">{subtotal.toFixed(2)} ₼</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>{isAzerbaijani ? 'Çatdırılma xidməti:' : 'Delivery fee:'}</span>
                    <span className="font-mono text-white">
                      {deliveryFee === 0 ? (isAzerbaijani ? 'PULSUZ' : 'FREE') : `${deliveryFee.toFixed(2)} ₼`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-[#173827]">
                  <span>{isAzerbaijani ? 'Ödəniləcək Cəmi:' : 'Total Payable:'}</span>
                  <span className="font-mono text-base text-[#eeddb2]">{total.toFixed(2)} ₼</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#c59b27] to-[#e4ba4c] text-black font-bold text-sm shadow-xl hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{isAzerbaijani ? 'Sifariş göndərilir...' : 'Processing...'}</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isAzerbaijani ? 'Sifarişi Təsdiqlə və Göndər' : 'Confirm & Place Order'} • {total.toFixed(2)} ₼</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
