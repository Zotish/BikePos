import { useState } from "react";
import {
  Search, Plus, Minus, Trash2, ChevronDown, Check, Printer, Send,
  RefreshCw, X, User, ShoppingBag, ArrowLeft, CheckCircle, Smartphone, CreditCard
} from "lucide-react";
import { useToast } from "../components/Toast";

const catalogProducts = [
  { id: 1, name: "Honda CB Hornet Brake Pad (Front)", sku: "HBP-CBH-160F", price: 750, stock: 42, compat: "CB Hornet 160R", cat: "Brake" },
  { id: 2, name: "Motul Engine Oil 10W40 1L", sku: "MOT-10W40-1L", price: 580, stock: 86, compat: "Universal", cat: "Lubricants" },
  { id: 3, name: "Yamaha FZ Air Filter", sku: "YAM-FZ-AF01", price: 500, stock: 2, compat: "FZ, FZ-S", cat: "Engine" },
  { id: 4, name: "NGK Spark Plug CR8E", sku: "NGK-CR8E", price: 220, stock: 64, compat: "TVS Apache, Bajaj", cat: "Electrical" },
  { id: 5, name: "Bajaj Pulsar Clutch Plate Set", sku: "BAJ-PUL150-CP", price: 1200, stock: 22, compat: "Pulsar 150/180", cat: "Engine" },
  { id: 6, name: "Suzuki Gixxer Chain Sprocket", sku: "SUZ-GIX-CSK01", price: 2100, stock: 0, compat: "Gixxer 150/SF", cat: "Transmission" },
  { id: 7, name: "Michelin Pilot Street 110/70-17", sku: "MCH-PS-11070", price: 4800, stock: 14, compat: "Universal 17 inch", cat: "Tyres" },
  { id: 8, name: "Yamaha R15 V3 Brake Disc Front", sku: "YAM-R15V3-BDF", price: 4200, stock: 6, compat: "R15 V3/V4", cat: "Brake" },
  { id: 9, name: "Hero Splendor Headlight Bulb 35W", sku: "HRO-SPL-HLB35", price: 140, stock: 200, compat: "Splendor Plus/Pro", cat: "Electrical" },
  { id: 10, name: "KTM Duke 200 Rear Shock Absorber", sku: "KTM-DK200-RSA", price: 6800, stock: 1, compat: "Duke 200/250", cat: "Suspension" },
  { id: 11, name: "Royal Enfield Oil Filter", sku: "RE-MET350-OF", price: 420, stock: 15, compat: "Meteor 350", cat: "Engine" },
  { id: 12, name: "Honda CBR Chain Set 428H", sku: "HON-CBR-CS428", price: 1650, stock: 18, compat: "CBR 150/250", cat: "Transmission" },
];

const categories = ["All", "Engine", "Brake", "Electrical", "Suspension", "Lubricants", "Tyres", "Transmission", "Accessories"];

const customers = [
  { id: "WALK-IN", name: "Walk-in Customer", phone: "N/A", discountTier: 0 },
  { id: "CUST-001", name: "Rahman Auto Workshop", phone: "+880 1712-345678", discountTier: 5 },
  { id: "CUST-002", name: "Karim Motors", phone: "+880 1823-456789", discountTier: 8 },
  { id: "CUST-003", name: "Hossain Trading Co.", phone: "+880 1934-567890", discountTier: 10 },
  { id: "CUST-004", name: "Dhaka Bike Shop", phone: "+880 1645-678901", discountTier: 5 },
];

interface CartItem {
  id: number;
  name: string;
  sku: string;
  price: number;
  qty: number;
  discount: number;
}

interface HeldSale {
  id: string;
  time: string;
  customer: string;
  cart: CartItem[];
  total: number;
}

const paymentMethods = ["Cash", "Card", "Bank Transfer", "bKash", "Nagad", "Credit", "Split"];

export default function POS({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [searchQ, setSearchQ] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([
    { id: 2, name: "Motul Engine Oil 10W40 1L", sku: "MOT-10W40-1L", price: 580, qty: 2, discount: 0 },
    { id: 1, name: "Honda CB Hornet Brake Pad (Front)", sku: "HBP-CBH-160F", price: 750, qty: 1, discount: 5 },
  ]);
  const [payment, setPayment] = useState("Cash");
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedInvoiceId, setCompletedInvoiceId] = useState("INV-20484");
  const [heldSales, setHeldSales] = useState<HeldSale[]>([]);
  const [showHeldModal, setShowHeldModal] = useState(false);
  const [mobileTab, setMobileTab] = useState<"catalog" | "cart">("catalog");

  const filtered = catalogProducts.filter(p => {
    const matchCat = activeCategory === "All" || p.cat === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQ.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (p: typeof catalogProducts[0]) => {
    if (p.stock === 0) {
      showToast(`Item "${p.name}" is currently Out of Stock!`, "warning");
      return;
    }
    setCart(prev => {
      const existing = prev.find(c => c.id === p.id);
      if (existing) {
        showToast(`Increased quantity of ${p.name}`, "info");
        return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      }
      showToast(`Added ${p.name} to cart`, "success");
      return [...prev, { id: p.id, name: p.name, sku: p.sku, price: p.price, qty: 1, discount: selectedCustomer.discountTier }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c).filter(c => c.qty > 0));
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(c => c.id !== id));
    showToast("Item removed from cart", "info");
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    showToast("Cart cleared", "info");
  };

  const handleHoldSale = () => {
    if (cart.length === 0) {
      showToast("Cart is empty. Add items before holding.", "error");
      return;
    }
    const held: HeldSale = {
      id: "HOLD-" + Math.floor(100 + Math.random() * 900),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: selectedCustomer.name,
      cart: [...cart],
      total,
    };
    setHeldSales(prev => [held, ...prev]);
    setCart([]);
    showToast(`Order held as ticket #${held.id}`, "info");
  };

  const handleResumeSale = (sale: HeldSale) => {
    setCart(sale.cart);
    setHeldSales(prev => prev.filter(s => s.id !== sale.id));
    setShowHeldModal(false);
    showToast(`Resumed ticket #${sale.id}`, "success");
    setMobileTab("cart");
  };

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty * (1 - c.discount / 100), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const totalItemsCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      showToast("Cannot complete sale: Cart is empty", "error");
      return;
    }
    const invId = "INV-" + Math.floor(20500 + Math.random() * 500);
    setCompletedInvoiceId(invId);
    setShowSuccess(true);
    showToast(`Sale completed successfully! Receipt #${invId}`, "success");
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-58px)] overflow-hidden relative">
      {/* Mobile Top View Switcher */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-[#E5E7EB] px-4 py-2.5 z-10 flex-shrink-0">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setMobileTab("catalog")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              mobileTab === "catalog" ? "bg-white text-[#D85A30] shadow-xs" : "text-[#6B7280]"
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => setMobileTab("cart")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              mobileTab === "cart" ? "bg-white text-[#D85A30] shadow-xs" : "text-[#6B7280]"
            }`}
          >
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="bg-[#D85A30] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>

        {heldSales.length > 0 && (
          <button
            onClick={() => setShowHeldModal(true)}
            className="text-xs font-semibold text-[#D85A30] border border-[#F4C4A8] bg-[#FEF0EA] px-2.5 py-1.5 rounded-lg"
          >
            Held ({heldSales.length})
          </button>
        )}
      </div>

      {/* Left: Product Catalog */}
      <div
        className={`flex-1 flex-col bg-[#F7F8FA] border-r border-[#E5E7EB] overflow-hidden ${
          mobileTab === "catalog" ? "flex" : "hidden lg:flex"
        }`}
      >
        {/* Search & Customer bar */}
        <div className="p-3 sm:p-4 bg-white border-b border-[#E5E7EB] flex flex-col sm:flex-row gap-2.5 sm:items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Scan barcode or search spare parts (e.g. Hornet, Spark Plug)…"
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-[13px] border border-[#E5E7EB] rounded-xl bg-[#F7F8FA] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30]"
            />
          </div>
          <button
            onClick={() => setShowCustomerModal(true)}
            className="flex items-center justify-between sm:justify-start gap-2 border border-[#E5E7EB] hover:border-[#D85A30] rounded-xl px-3 py-2 bg-white text-xs cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 text-[#374151] font-medium">
              <User size={13} className="text-[#D85A30]" />
              <span className="max-w-[140px] truncate">{selectedCustomer.name}</span>
            </div>
            <ChevronDown size={12} className="text-[#9CA3AF]" />
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 px-3 sm:px-4 py-2.5 bg-white border-b border-[#E5E7EB] overflow-x-auto scrollbar-none flex-shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeCategory === cat ? "bg-[#D85A30] text-white shadow-xs" : "text-[#6B7280] hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3 content-start">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              disabled={p.stock === 0}
              className={`flex flex-col justify-between p-3 rounded-xl border text-left transition-all duration-150 relative bg-white shadow-xs group cursor-pointer ${
                p.stock === 0
                  ? "opacity-50 cursor-not-allowed border-gray-200"
                  : "border-[#E5E7EB] hover:border-[#D85A30] hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] mb-1 font-mono">
                  <span>{p.sku}</span>
                  <span className={p.stock < 5 ? "text-[#DC2626] font-bold" : "text-[#16A34A] font-semibold"}>
                    {p.stock === 0 ? "Out" : `${p.stock} left`}
                  </span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-[#111827] line-clamp-2 leading-snug group-hover:text-[#D85A30] transition-colors">
                  {p.name}
                </div>
                <div className="text-[11px] text-[#6B7280] mt-0.5 truncate">{p.compat}</div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F3F4F6]">
                <span className="text-xs sm:text-sm font-bold text-[#D85A30]">৳ {p.price.toLocaleString()}</span>
                <span className="w-6 h-6 rounded-lg bg-[#FEF0EA] text-[#D85A30] flex items-center justify-center text-xs font-bold group-hover:bg-[#D85A30] group-hover:text-white transition-colors">
                  +
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Floating Mobile Cart Bar */}
        {cart.length > 0 && mobileTab === "catalog" && (
          <div className="lg:hidden p-3 bg-white border-t border-[#E5E7EB] flex items-center justify-between shadow-lg">
            <div>
              <div className="text-xs text-[#6B7280]">{totalItemsCount} items in cart</div>
              <div className="text-base font-bold text-[#111827]">৳ {total.toFixed(0)}</div>
            </div>
            <button
              onClick={() => setMobileTab("cart")}
              className="bg-[#D85A30] hover:bg-[#B74421] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <ShoppingBag size={14} /> View Cart & Pay
            </button>
          </div>
        )}
      </div>

      {/* Right: Cart & Checkout */}
      <div
        className={`w-full lg:w-96 flex flex-col bg-white flex-shrink-0 h-full ${
          mobileTab === "cart" ? "flex" : "hidden lg:flex"
        }`}
      >
        {/* Cart header */}
        <div className="p-3.5 sm:p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileTab("catalog")}
              className="lg:hidden p-1 text-[#6B7280] hover:text-[#111827] rounded-lg"
            >
              <ArrowLeft size={16} />
            </button>
            <h2 className="font-bold text-[#111827] text-sm sm:text-base">Current Cart ({totalItemsCount})</h2>
          </div>
          <div className="flex items-center gap-2">
            {heldSales.length > 0 && (
              <button
                onClick={() => setShowHeldModal(true)}
                className="hidden lg:block text-xs font-semibold text-[#D85A30] bg-[#FEF0EA] px-2 py-1 rounded-lg hover:bg-[#FDDCCC]"
              >
                Held ({heldSales.length})
              </button>
            )}
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:underline flex items-center gap-1"
                title="Clear Cart"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-[#9CA3AF]">
              <ShoppingBag size={40} className="stroke-1 mb-2 text-gray-300" />
              <div className="text-xs font-semibold text-gray-600">Your cart is empty</div>
              <p className="text-[11px] text-gray-400 mt-1 max-w-[200px]">
                Click on spare parts from the catalog or scan barcodes to add items.
              </p>
              <button
                onClick={() => setMobileTab("catalog")}
                className="lg:hidden mt-4 text-xs font-semibold bg-[#D85A30] text-white px-3 py-1.5 rounded-lg"
              >
                Browse Parts
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="p-3 border border-[#E5E7EB] rounded-xl hover:border-[#D85A30]/50 transition-colors bg-white shadow-2xs">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#111827] leading-snug truncate">{item.name}</div>
                    <div className="text-[10px] text-[#9CA3AF] font-mono">{item.sku} · ৳{item.price} each</div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#9CA3AF] hover:text-[#DC2626] transition-colors p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="px-2 py-1 text-[#6B7280] hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="px-2 py-1 text-xs font-bold text-[#111827] min-w-[28px] text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="px-2 py-1 text-[#6B7280] hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  <div className="flex items-center border border-[#E5E7EB] rounded-lg px-2 py-0.5 text-[11px] text-[#6B7280]">
                    <span>Disc %:</span>
                    <input
                      type="number"
                      value={item.discount}
                      onChange={e =>
                        setCart(prev =>
                          prev.map(c => c.id === item.id ? { ...c, discount: Math.min(100, Math.max(0, Number(e.target.value))) } : c)
                        )
                      }
                      className="w-8 text-center font-bold text-[#111827] outline-none ml-1"
                      min={0}
                      max={100}
                    />
                  </div>

                  <div className="text-xs font-bold text-[#111827]">
                    ৳ {(item.price * item.qty * (1 - item.discount / 100)).toFixed(0)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bill summary & payment */}
        <div className="border-t border-[#E5E7EB] p-3.5 sm:p-4 space-y-3 bg-[#FBFBFC]">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[#6B7280]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#111827]">৳ {subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>VAT / Tax (5%)</span>
              <span className="font-semibold text-[#111827]">৳ {tax.toFixed(0)}</span>
            </div>
            <div className="flex justify-between font-bold text-[#111827] text-base pt-1.5 border-t border-[#E5E7EB]">
              <span>Total Payable</span>
              <span className="text-[#D85A30]">৳ {total.toFixed(0)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <div className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Payment Method</div>
            <div className="flex flex-wrap gap-1.5">
              {paymentMethods.map(pm => (
                <button
                  key={pm}
                  onClick={() => setPayment(pm)}
                  className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    payment === pm
                      ? "bg-[#D85A30] text-white border-[#D85A30] shadow-2xs font-semibold"
                      : "border-[#E5E7EB] text-[#4B5563] bg-white hover:border-[#D85A30]"
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleHoldSale}
              disabled={cart.length === 0}
              className="border border-[#E5E7EB] bg-white hover:bg-gray-50 rounded-xl py-2.5 text-xs font-semibold text-[#4B5563] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} /> Hold Sale
            </button>
            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className="bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2.5 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Check size={15} /> Complete Sale
            </button>
          </div>
        </div>
      </div>

      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] text-base">Select Customer</h3>
              <button onClick={() => setShowCustomerModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 mb-4">
              {customers.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomer(c);
                    setShowCustomerModal(false);
                    showToast(`Customer set to ${c.name} (${c.discountTier}% tier discount)`, "info");
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    selectedCustomer.id === c.id ? "border-[#D85A30] bg-[#FEF0EA]/40 font-semibold" : "border-[#E5E7EB] hover:bg-gray-50"
                  }`}
                >
                  <div className="text-xs text-[#111827]">{c.name}</div>
                  <div className="text-[10px] text-[#6B7280]">{c.phone} · {c.discountTier}% discount</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Held Sales Modal */}
      {showHeldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] text-base">Held Orders ({heldSales.length})</h3>
              <button onClick={() => setShowHeldModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto mb-4">
              {heldSales.map(sale => (
                <div key={sale.id} className="p-3 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#111827]">{sale.id} · {sale.customer}</div>
                    <div className="text-[10px] text-[#6B7280]">Held at {sale.time} · {sale.cart.length} items · ৳{sale.total.toFixed(0)}</div>
                  </div>
                  <button
                    onClick={() => handleResumeSale(sale)}
                    className="bg-[#D85A30] hover:bg-[#B74421] text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                  >
                    Resume
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sale Success Receipt Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB] animate-in fade-in zoom-in-95">
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={32} className="text-[#16A34A]" />
              </div>
              <h2 className="text-lg font-bold text-[#111827]">Payment Received!</h2>
              <p className="text-[#6B7280] text-xs mt-0.5">Invoice #{completedInvoiceId}</p>
            </div>

            <div className="bg-[#F7F8FA] rounded-xl p-3.5 space-y-2 mb-4 text-xs">
              <div className="flex justify-between text-[#6B7280]"><span>Total Amount</span><span className="font-bold text-[#111827]">৳ {total.toFixed(0)}</span></div>
              <div className="flex justify-between text-[#6B7280]"><span>Payment Method</span><span className="text-[#111827] font-semibold">{payment}</span></div>
              <div className="flex justify-between text-[#6B7280]"><span>Customer</span><span className="text-[#111827]">{selectedCustomer.name}</span></div>
              <div className="flex justify-between text-[#6B7280]"><span>Items Purchased</span><span className="text-[#111827]">{totalItemsCount} units</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => {
                  window.print();
                  showToast("Invoice sent to printer", "success");
                }}
                className="border border-[#E5E7EB] rounded-xl py-2.5 text-xs font-semibold text-[#374151] hover:bg-gray-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer size={13} /> Print Receipt
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`MotoParts Invoice #${completedInvoiceId} for ${selectedCustomer.name}: ৳${total.toFixed(0)} paid via ${payment}. Thank you!`);
                  showToast("Invoice link copied for WhatsApp!", "success");
                }}
                className="border border-[#25D366] text-[#25D366] rounded-xl py-2.5 text-xs font-semibold hover:bg-[#F0FFF4] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send size={13} /> Share Link
              </button>
            </div>

            <button
              onClick={() => {
                setShowSuccess(false);
                setCart([]);
                setMobileTab("catalog");
              }}
              className="w-full bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2.5 text-xs font-bold transition-colors cursor-pointer"
            >
              Start Next Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
