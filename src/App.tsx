import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ThreeCanvas, ModelType } from './components/ThreeCanvas';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { BranchesModal } from './components/BranchesModal';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { AiAssistant } from './components/AiAssistant';
import { CartItem, ProductItem, Size, Order } from './types';
import { PRODUCTS } from './data/menuData';
import { Sparkles, ShoppingBag, CheckCircle, Clock } from 'lucide-react';

export default function App() {
  const [activeModel, setActiveModel] = useState<ModelType>('cup');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('belgian_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pastOrders, setPastOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('belgian_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null);
  const [isAzerbaijani, setIsAzerbaijani] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('belgian_cart', JSON.stringify(cartItems));
    } catch (e) {
      // ignore
    }
  }, [cartItems]);

  // Sync orders to local storage
  useEffect(() => {
    try {
      localStorage.setItem('belgian_orders', JSON.stringify(pastOrders));
    } catch (e) {
      // ignore
    }
  }, [pastOrders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Add customized item from ProductModal
  const handleAddToCartFromModal = (
    product: ProductItem,
    size: Size,
    quantity: number,
    milk?: string,
    temperature?: 'İsti' | 'Soyuq' | 'Buzlu',
    extras?: { id: string; name: string; price: number }[],
    notes?: string,
    finalUnitPrice?: number
  ) => {
    const newItem: CartItem = {
      cartItemId: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      productId: product.id,
      name: product.name,
      nameEn: product.nameEn,
      size,
      price: finalUnitPrice || (size === 'S' ? product.priceS || 0 : product.priceM || product.singlePrice || 0),
      quantity,
      milk,
      temperature,
      extras: extras || [],
      notes
    };

    setCartItems((prev) => [...prev, newItem]);
    showToast(isAzerbaijani ? `✓ ${product.name} səbətə əlavə edildi!` : `✓ Added ${product.nameEn} to cart!`);
  };

  // Quick Add from Catalog
  const handleQuickAdd = (product: ProductItem) => {
    if (product.hasSizes || product.allowsMilkChoice || product.allowsExtras) {
      // Open customization modal for rich options
      setSelectedProductForModal(product);
    } else {
      const newItem: CartItem = {
        cartItemId: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        productId: product.id,
        name: product.name,
        nameEn: product.nameEn,
        size: 'Standard',
        price: product.singlePrice || 0,
        quantity: 1,
        extras: []
      };
      setCartItems((prev) => [...prev, newItem]);
      showToast(isAzerbaijani ? `✓ ${product.name} səbətə əlavə edildi!` : `✓ Added ${product.nameEn} to cart!`);
    }
  };

  // Direct add from 3D Vitrine customizer
  const handleAddToCartDirectFrom3D = (model: ModelType, cupColor?: string, cocoaGrade?: string) => {
    let productMatch: ProductItem | undefined;
    let customNote = '';

    if (model === 'cup') {
      productMatch = PRODUCTS.find((p) => p.id === 'belgian-coffee');
      customNote = `3D Fincan Rəngi: ${cupColor || 'Belgian Green'}`;
    } else if (model === 'chocolate') {
      productMatch = PRODUCTS.find((p) => p.id === 'artisanal-chocolate-bar');
      customNote = `3D Kakao Növü: ${cocoaGrade || '85% Dark'}`;
    } else if (model === 'waffle') {
      productMatch = PRODUCTS.find((p) => p.id === 'belgian-special-waffle');
      customNote = `3D İsti Belçika Şokolad Sousu ilə`;
    } else {
      productMatch = PRODUCTS.find((p) => p.id === 'iced-belgian');
      customNote = `3D Lüks Qat-qat Frappe`;
    }

    if (productMatch) {
      const newItem: CartItem = {
        cartItemId: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        productId: productMatch.id,
        name: productMatch.name,
        nameEn: productMatch.nameEn,
        size: productMatch.hasSizes ? 'M' : 'Standard',
        price: productMatch.hasSizes ? (productMatch.priceM || 0) : (productMatch.singlePrice || 0),
        quantity: 1,
        notes: customNote,
        extras: []
      };

      setCartItems((prev) => [...prev, newItem]);
      showToast(isAzerbaijani ? `✓ 3D ${productMatch.name} səbətə əlavə edildi!` : `✓ 3D ${productMatch.nameEn} added to cart!`);
    }
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove single item
  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  // Order completed
  const handleOrderSuccess = (order: Order) => {
    setPastOrders((prev) => [order, ...prev]);
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#081811] text-[#f7f3ea] selection:bg-[#c59b27] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 bg-[#143d29] border border-[#c59b27] text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-[#c59b27]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBranches={() => setIsBranchesOpen(true)}
        isAzerbaijani={isAzerbaijani}
        onToggleLang={() => setIsAzerbaijani(!isAzerbaijani)}
      />

      <main>
        {/* Hero Section */}
        <HeroSection
          onExplore3D={() => {
            const elem = document.getElementById('vitrin');
            elem?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenMenu={() => {
            const elem = document.getElementById('menyu');
            elem?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenBranches={() => setIsBranchesOpen(true)}
          isAzerbaijani={isAzerbaijani}
        />

        {/* 3D Interactive Product Vitrine Section */}
        <section id="vitrin" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#123624] border border-[#2b6144] text-xs font-semibold text-[#d4af37] mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAzerbaijani ? 'İnteraktiv 3D Məhsul Vitrini' : 'Interactive 3D Product Vitrine'}</span>
            </div>
            <h2 className="font-serif-brand text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {isAzerbaijani ? 'Hər Detalı 360° İdarə Edin & Fərdiləşdirin' : 'Inspect Every Angle in 360° & Customize'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#bed8cb]">
              {isAzerbaijani
                ? 'Modeli fırladın, qatları ayırın (Exploded View), inqrediyentləri kəşf edin və birbaşa səbətinizə əlavə edin.'
                : 'Rotate freely, separate layers with exploded view, explore fine ingredients, and add directly to your cart.'}
            </p>
          </div>

          {/* WebGL 3D Canvas Container */}
          <ThreeCanvas
            activeModel={activeModel}
            onSelectModel={(m) => setActiveModel(m)}
            onAddToCartDirect={handleAddToCartDirectFrom3D}
            isAzerbaijani={isAzerbaijani}
          />
        </section>

        {/* Live Active Order Status Bar if order placed */}
        {pastOrders.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-[#0b2418] border border-[#276648] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#123d28] border border-[#c59b27] flex items-center justify-center text-[#d4af37]">
                  <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#eeddb2]">
                      #{pastOrders[0].orderNumber}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-md font-semibold border border-emerald-500/40">
                      Hazırlanır ☕
                    </span>
                  </div>
                  <p className="text-xs text-[#bed8cb]">
                    {pastOrders[0].orderType === 'pickup'
                      ? `${isAzerbaijani ? 'Götürmə filialı:' : 'Pickup at:'} ${pastOrders[0].branch}`
                      : `${isAzerbaijani ? 'Çatdırılma:' : 'Delivery to:'} ${pastOrders[0].address}`}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 block">{isAzerbaijani ? 'Məbləğ' : 'Total'}</span>
                <span className="text-sm font-mono font-bold text-[#eeddb2]">
                  {pastOrders[0].total.toFixed(2)} ₼
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Product Catalog with Categories & Add-ons */}
        <ProductCatalog
          onSelectProductForCustomize={(product) => setSelectedProductForModal(product)}
          onQuickAdd={handleQuickAdd}
          onViewIn3D={(model) => setActiveModel(model)}
          isAzerbaijani={isAzerbaijani}
        />

        {/* About Belgian Heritage Section */}
        <AboutSection isAzerbaijani={isAzerbaijani} />
      </main>

      {/* Footer */}
      <Footer
        onOpenBranches={() => setIsBranchesOpen(true)}
        isAzerbaijani={isAzerbaijani}
      />

      {/* Customization Modal */}
      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCartFromModal}
        isAzerbaijani={isAzerbaijani}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        isAzerbaijani={isAzerbaijani}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={handleOrderSuccess}
        isAzerbaijani={isAzerbaijani}
      />

      {/* Branches Modal */}
      <BranchesModal
        isOpen={isBranchesOpen}
        onClose={() => setIsBranchesOpen(false)}
        onSelectBranchForOrder={(branchName) => {
          setIsCheckoutOpen(true);
        }}
        isAzerbaijani={isAzerbaijani}
      />

      {/* AI Barista Assistant Widget */}
      <AiAssistant isAzerbaijani={isAzerbaijani} />
    </div>
  );
}
