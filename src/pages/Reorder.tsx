import { useState } from "react";
import { Zap, AlertTriangle, ShoppingBag, Plus, X, Check, CheckCircle2 } from "lucide-react";
import { useToast } from "../components/Toast";

interface Suggestion {
  product: string;
  sku: string;
  stock: number;
  avgDaily: number;
  daysLeft: number;
  reorderLevel: number;
  suggested: number;
  supplier: string;
  leadTime: string;
  priority: "Critical" | "High" | "Medium" | "Low";
}

const initialSuggestions: Suggestion[] = [
  { product: "TVS Apache Spark Plug NGK", sku: "TVS-AP-SP01", stock: 4, avgDaily: 3.2, daysLeft: 1.3, reorderLevel: 20, suggested: 80, supplier: "Auto Parts BD", leadTime: "5 days", priority: "Critical" },
  { product: "KTM Duke 200 Rear Shock Absorber", sku: "KTM-DK200-RSA", stock: 2, avgDaily: 0.8, daysLeft: 2.5, reorderLevel: 10, suggested: 15, supplier: "MotoImport Ltd.", leadTime: "7 days", priority: "Critical" },
  { product: "Honda CB Piston Ring Set", sku: "HON-CB-PRS01", stock: 1, avgDaily: 1.4, daysLeft: 0.7, reorderLevel: 10, suggested: 30, supplier: "Honda BD", leadTime: "3 days", priority: "Critical" },
  { product: "Yamaha R15 Chain Set", sku: "YAM-R15-CS01", stock: 3, avgDaily: 0.9, daysLeft: 3.3, reorderLevel: 12, suggested: 25, supplier: "Yamaha BD", leadTime: "4 days", priority: "High" },
  { product: "Yamaha FZ Air Filter", sku: "YAM-FZ-AF01", stock: 4, avgDaily: 1.1, daysLeft: 3.6, reorderLevel: 15, suggested: 40, supplier: "Yamaha BD", leadTime: "4 days", priority: "High" },
  { product: "Bajaj Pulsar Brake Shoe Rear", sku: "BAJ-PUL-BSR01", stock: 6, avgDaily: 1.8, daysLeft: 3.3, reorderLevel: 20, suggested: 50, supplier: "Auto Parts BD", leadTime: "5 days", priority: "High" },
  { product: "Hero Splendor Engine Oil 0.9L", sku: "HRO-SPL-EO09", stock: 12, avgDaily: 2.4, daysLeft: 5.0, reorderLevel: 25, suggested: 60, supplier: "Motul BD", leadTime: "3 days", priority: "Medium" },
  { product: "Suzuki Gixxer Clutch Cable", sku: "SUZ-GIX-CC01", stock: 8, avgDaily: 1.2, daysLeft: 6.7, reorderLevel: 15, suggested: 30, supplier: "Auto Parts BD", leadTime: "5 days", priority: "Medium" },
];

const priorityStyles: Record<string, { badge: string; dot: string }> = {
  Critical: { badge: "bg-[#FEE2E2] text-[#DC2626]", dot: "bg-[#DC2626]" },
  High: { badge: "bg-[#FEF3C7] text-[#D97706]", dot: "bg-[#F59E0B]" },
  Medium: { badge: "bg-[#DBEAFE] text-[#2563EB]", dot: "bg-[#2563EB]" },
  Low: { badge: "bg-[#F3F4F6] text-[#6B7280]", dot: "bg-[#9CA3AF]" },
};

export default function Reorder({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const [reorderItem, setReorderItem] = useState<Suggestion | null>(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [orderQty, setOrderQty] = useState(0);

  const critical = suggestions.filter(s => s.priority === "Critical").length;

  const handleReorderCritical = () => {
    showToast(`Created 3 Purchase Orders for all critical stockout items!`, "success");
    setSuggestions(prev => prev.filter(s => s.priority !== "Critical"));
  };

  const handleCreateSinglePO = () => {
    if (!reorderItem) return;
    showToast(`Created PO for ${orderQty || reorderItem.suggested} units of ${reorderItem.product}`, "success");
    setSuggestions(prev => prev.filter(s => s.sku !== reorderItem.sku));
    setReorderItem(null);
  };

  const handleCreateBatchOrders = () => {
    showToast(`Generated batch Purchase Orders for ${suggestions.length} products`, "success");
    setSuggestions([]);
    setShowBatchModal(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] flex items-center gap-2">
            <Zap size={22} className="text-[#D85A30]" />
            Reorder Suggestions
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">AI-powered reorder recommendations based on sales velocity and supplier lead times</p>
        </div>
        <button
          onClick={() => setShowBatchModal(true)}
          disabled={suggestions.length === 0}
          className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg px-3 sm:px-4 py-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
        >
          <ShoppingBag size={14} /> Create All Purchase Orders
        </button>
      </div>

      {/* Critical Alert Banner */}
      {critical > 0 && (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-[#DC2626] flex-shrink-0" />
            <div className="text-xs sm:text-[13px] text-[#991B1B]">
              <strong>{critical} spare parts are critically low</strong> — at current daily sales velocity, they will run out within 3 days.
            </div>
          </div>
          <button
            onClick={handleReorderCritical}
            className="text-xs font-bold text-[#DC2626] border border-[#FCA5A5] bg-white rounded-lg px-3 py-1.5 hover:bg-[#FEE2E2] transition-colors flex-shrink-0 cursor-pointer self-start sm:self-auto"
          >
            Reorder Critical Items
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          { label: "Critical Items", count: suggestions.filter(s => s.priority === "Critical").length, color: "text-[#DC2626]", bg: "bg-[#FEE2E2]" },
          { label: "High Priority", count: suggestions.filter(s => s.priority === "High").length, color: "text-[#D97706]", bg: "bg-[#FEF3C7]" },
          { label: "Medium Priority", count: suggestions.filter(s => s.priority === "Medium").length, color: "text-[#2563EB]", bg: "bg-[#DBEAFE]" },
          { label: "Total Suggested PO Value", count: "৳ 3.8L", color: "text-[#111827]", bg: "bg-[#F3F4F6]" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs">
            <div className={`text-lg sm:text-xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-[11px] text-[#9CA3AF] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Suggestions Table with Horizontal Scroll */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
                {["Priority", "Product", "Current Stock", "Avg Daily Sales", "Days Left", "Reorder Level", "Suggested Qty", "Supplier", "Lead Time", "Actions"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suggestions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center p-8 text-xs text-[#6B7280]">
                    <CheckCircle2 size={32} className="text-[#16A34A] mx-auto mb-2" />
                    All reorder suggestions have been addressed! Current stock is optimal.
                  </td>
                </tr>
              ) : (
                suggestions.map(s => (
                  <tr key={s.sku} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${priorityStyles[s.priority].dot}`} />
                        <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full ${priorityStyles[s.priority].badge}`}>
                          {s.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-[#111827] max-w-[180px] truncate">{s.product}</div>
                      <div className="text-[10px] font-mono text-[#9CA3AF]">{s.sku}</div>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <span className={`font-bold ${s.stock <= 3 ? "text-[#DC2626]" : s.stock <= 6 ? "text-[#D97706]" : "text-[#111827]"}`}>
                        {s.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#111827] whitespace-nowrap">{s.avgDaily}/day</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <span className={`font-bold ${s.daysLeft < 3 ? "text-[#DC2626]" : "text-[#D97706]"}`}>{s.daysLeft}d</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{s.reorderLevel}</td>
                    <td className="px-4 py-3 text-xs font-bold text-[#111827] whitespace-nowrap">{s.suggested} units</td>
                    <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{s.supplier}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{s.leadTime}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setReorderItem(s);
                          setOrderQty(s.suggested);
                        }}
                        className="flex items-center gap-1 text-[11px] font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus size={12} /> Create PO
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Single Reorder Modal */}
      {reorderItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] text-base">Quick Purchase Order</h3>
              <button onClick={() => setReorderItem(null)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl mb-4 text-xs space-y-1">
              <div className="font-bold text-[#111827]">{reorderItem.product}</div>
              <div className="text-[#6B7280]">Supplier: {reorderItem.supplier} · Lead time: {reorderItem.leadTime}</div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#374151] mb-1">Order Quantity</label>
              <input
                type="number"
                value={orderQty}
                onChange={e => setOrderQty(parseInt(e.target.value) || 1)}
                className="w-full text-sm font-bold border rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setReorderItem(null)} className="flex-1 border rounded-xl py-2 text-xs">Cancel</button>
              <button onClick={handleCreateSinglePO} className="flex-1 bg-[#D85A30] text-white rounded-xl py-2 text-xs font-bold">
                Confirm PO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch PO Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] text-base">Generate All Suggested POs</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[#6B7280] mb-4">
              This will automatically draft 4 purchase orders grouped by vendor (Honda BD, Yamaha BD, Auto Parts BD, MotoImport) totaling ৳3.8L.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowBatchModal(false)} className="flex-1 border rounded-xl py-2 text-xs font-semibold">Cancel</button>
              <button onClick={handleCreateBatchOrders} className="flex-1 bg-[#D85A30] text-white rounded-xl py-2 text-xs font-bold">
                Confirm & Create POs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
