import { useState } from "react";
import { Plus, Search, Download, Check, Package, Truck, X, Eye, Printer, CheckCircle } from "lucide-react";
import { useToast } from "../components/Toast";

interface PurchaseOrder {
  id: string;
  supplier: string;
  date: string;
  expected: string;
  total: number;
  receiving: "Received" | "Partially Received" | "Pending" | "Cancelled";
  payment: "Paid" | "Partial" | "Unpaid";
  items: number;
}

const initialOrders: PurchaseOrder[] = [
  { id: "PO-1048", supplier: "Honda Bangladesh Ltd.", date: "Sep 10, 2026", expected: "Sep 17, 2026", total: 284600, receiving: "Partially Received", payment: "Unpaid", items: 18 },
  { id: "PO-1047", supplier: "Yamaha Motor BD", date: "Sep 9, 2026", expected: "Sep 16, 2026", total: 156200, receiving: "Received", payment: "Paid", items: 12 },
  { id: "PO-1046", supplier: "Auto Parts BD Ltd.", date: "Sep 8, 2026", expected: "Sep 14, 2026", total: 89400, receiving: "Received", payment: "Paid", items: 24 },
  { id: "PO-1045", supplier: "MotoImport Ltd.", date: "Sep 7, 2026", expected: "Sep 21, 2026", total: 412800, receiving: "Pending", payment: "Unpaid", items: 36 },
  { id: "PO-1044", supplier: "NGK Bangladesh", date: "Sep 6, 2026", expected: "Sep 13, 2026", total: 45600, receiving: "Received", payment: "Partial", items: 8 },
  { id: "PO-1043", supplier: "Motul BD Official", date: "Sep 5, 2026", expected: "Sep 12, 2026", total: 124800, receiving: "Received", payment: "Paid", items: 15 },
  { id: "PO-1042", supplier: "Auto Parts BD Ltd.", date: "Sep 4, 2026", expected: "Sep 11, 2026", total: 67200, receiving: "Partially Received", payment: "Partial", items: 10 },
];

const receivingStyles: Record<string, string> = {
  "Received": "bg-[#DCFCE7] text-[#16A34A]",
  "Partially Received": "bg-[#FEF3C7] text-[#D97706]",
  "Pending": "bg-[#DBEAFE] text-[#2563EB]",
  "Cancelled": "bg-[#FEE2E2] text-[#DC2626]",
};

const paymentStyles: Record<string, string> = {
  "Paid": "bg-[#DCFCE7] text-[#16A34A]",
  "Partial": "bg-[#FEF3C7] text-[#D97706]",
  "Unpaid": "bg-[#FEE2E2] text-[#DC2626]",
};

const tabs = ["Purchase Orders", "Goods Receiving", "Purchase Bills", "Supplier Payments"];

export default function Purchases({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialOrders);
  const [activeTab, setActiveTab] = useState("Purchase Orders");
  const [showCreate, setShowCreate] = useState(false);
  const [viewPO, setViewPO] = useState<PurchaseOrder | null>(null);
  const [search, setSearch] = useState("");

  // Line items state in create PO modal
  const [poLines, setPoLines] = useState([
    { name: "Honda CB Brake Pad Front", qty: 50, cost: 580 },
    { name: "Yamaha FZ Air Filter", qty: 30, cost: 320 },
    { name: "Motul Engine Oil 10W40", qty: 100, cost: 420 },
  ]);
  const [selectedSupplier, setSelectedSupplier] = useState("Honda Bangladesh Ltd.");

  const filtered = purchaseOrders.filter(po => {
    const matchSearch = po.id.toLowerCase().includes(search.toLowerCase()) || po.supplier.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "Goods Receiving") return matchSearch && po.receiving !== "Received";
    if (activeTab === "Purchase Bills") return matchSearch && po.payment !== "Paid";
    return matchSearch;
  });

  const subtotal = poLines.reduce((acc, l) => acc + l.qty * l.cost, 0);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const handleCreatePO = (isDraft = false) => {
    const newPO: PurchaseOrder = {
      id: "PO-10" + (purchaseOrders.length + 50),
      supplier: selectedSupplier,
      date: "Today, Sep 12",
      expected: "Sep 19, 2026",
      total: grandTotal,
      receiving: "Pending",
      payment: "Unpaid",
      items: poLines.reduce((s, i) => s + i.qty, 0),
    };
    setPurchaseOrders(prev => [newPO, ...prev]);
    showToast(isDraft ? `Saved draft PO #${newPO.id}` : `Purchase Order #${newPO.id} dispatched to ${newPO.supplier}`, "success");
    setShowCreate(false);
  };

  const handleExportCSV = () => {
    const headers = ["PO Number", "Supplier", "Date", "Expected", "Items", "Total (BDT)", "Receiving Status", "Payment Status"];
    const rows = filtered.map(p => [
      p.id,
      `"${p.supplier.replace(/"/g, '""')}"`,
      p.date,
      p.expected,
      p.items,
      p.total,
      p.receiving,
      p.payment,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `purchase_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filtered.length} POs to CSV`, "success");
  };

  const handleReceiveGoods = (po: PurchaseOrder) => {
    const updated: PurchaseOrder = { ...po, receiving: "Received" };
    setPurchaseOrders(prev => prev.map(p => p.id === po.id ? updated : p));
    if (viewPO?.id === po.id) setViewPO(updated);
    showToast(`Goods received for #${po.id}! Central inventory stock updated.`, "success");
  };

  const handlePaySupplier = (po: PurchaseOrder) => {
    const updated: PurchaseOrder = { ...po, payment: "Paid" };
    setPurchaseOrders(prev => prev.map(p => p.id === po.id ? updated : p));
    if (viewPO?.id === po.id) setViewPO(updated);
    showToast(`Payment of ৳${po.total.toLocaleString()} settled for #${po.id}`, "success");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Procurement & Purchases</h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">Purchase orders, goods receiving notices (GRN) and supplier payments</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#4B5563] border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white hover:border-[#D1D5DB] transition-colors cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg px-3 sm:px-4 py-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={15} /> Create Purchase Order
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          { label: "Total POs This Month", value: "৳ 11.8L", sub: `${purchaseOrders.length} orders placed`, color: "text-[#111827]" },
          { label: "Pending Delivery", value: "৳ 4.1L", sub: "2 shipments in transit", color: "text-[#F59E0B]" },
          { label: "Amount Due", value: "৳ 5.7L", sub: "3 unpaid supplier bills", color: "text-[#DC2626]" },
          { label: "Avg Lead Time", value: "6.2 days", sub: "across all brands", color: "text-[#2563EB]" },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 sm:p-4 shadow-xs">
            <div className="text-[11px] text-[#9CA3AF] font-medium mb-1">{c.label}</div>
            <div className={`text-lg sm:text-xl font-bold ${c.color}`}>{c.value}</div>
            <div className="text-[10px] text-[#9CA3AF] mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] overflow-x-auto scrollbar-none">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-3 sm:px-4 py-2.5 text-xs sm:text-[13px] font-medium border-b-2 transition-colors -mb-px whitespace-nowrap cursor-pointer ${
              activeTab === t ? "border-[#D85A30] text-[#D85A30] font-bold" : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 sm:p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search PO number or vendor…"
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-[13px] border border-[#E5E7EB] rounded-lg bg-[#F7F8FA] focus:outline-none focus:border-[#D85A30]"
          />
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
                {["PO Number", "Supplier", "Order Date", "Expected Delivery", "Items", "Total", "Receiving", "Payment", "Actions"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(po => (
                <tr
                  key={po.id}
                  onClick={() => setViewPO(po)}
                  className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono font-bold text-[#D85A30] text-xs whitespace-nowrap">{po.id}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#111827] whitespace-nowrap">{po.supplier}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{po.date}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{po.expected}</td>
                  <td className="px-4 py-3 text-xs text-[#111827] whitespace-nowrap">{po.items}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#111827] whitespace-nowrap">৳ {po.total.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${receivingStyles[po.receiving]}`}>
                      {po.receiving}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${paymentStyles[po.payment]}`}>
                      {po.payment}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setViewPO(po)}
                      className="p-1.5 rounded hover:bg-gray-100 text-[#9CA3AF] hover:text-[#2563EB] cursor-pointer"
                      title="View PO Details"
                    >
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PO Details Modal */}
      {viewPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#111827] text-base">{viewPO.id} Details</h3>
                <div className="text-xs text-[#6B7280]">{viewPO.supplier}</div>
              </div>
              <button onClick={() => setViewPO(null)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 mb-5 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5">
                <div className="flex justify-between"><span className="text-[#6B7280]">Order Placed:</span><span>{viewPO.date}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Expected Delivery:</span><span>{viewPO.expected}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Total Quantity:</span><span className="font-bold text-[#111827]">{viewPO.items} units</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Total Amount:</span><span className="font-bold text-[#111827]">৳ {viewPO.total.toLocaleString()}</span></div>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-xl">
                <div>
                  <div className="font-semibold text-[#111827]">Receiving Status: <span className={`px-2 py-0.5 rounded-full text-[10px] ${receivingStyles[viewPO.receiving]}`}>{viewPO.receiving}</span></div>
                  <div className="font-semibold text-[#111827] mt-1">Payment Status: <span className={`px-2 py-0.5 rounded-full text-[10px] ${paymentStyles[viewPO.payment]}`}>{viewPO.payment}</span></div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {viewPO.receiving !== "Received" && (
                <button
                  onClick={() => handleReceiveGoods(viewPO)}
                  className="flex-1 bg-[#16A34A] hover:bg-emerald-700 text-white rounded-xl py-2 text-xs font-bold transition-colors cursor-pointer"
                >
                  Mark Goods Received
                </button>
              )}
              {viewPO.payment !== "Paid" && (
                <button
                  onClick={() => handlePaySupplier(viewPO)}
                  className="flex-1 bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2 text-xs font-bold transition-colors cursor-pointer"
                >
                  Pay Supplier
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Purchase Order Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl border border-[#E5E7EB] my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#111827] text-base">New Purchase Order</h3>
                <p className="text-xs text-[#6B7280]">Create PO and send to official motorcycle parts distributor</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Supplier</label>
                  <select
                    value={selectedSupplier}
                    onChange={e => setSelectedSupplier(e.target.value)}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white"
                  >
                    <option>Honda Bangladesh Ltd.</option>
                    <option>Yamaha Motor BD</option>
                    <option>Auto Parts BD Ltd.</option>
                    <option>MotoImport Ltd.</option>
                    <option>Motul BD Official</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Destination Warehouse</label>
                  <select className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white">
                    <option>WH-01 Dhaka Main Warehouse</option>
                    <option>WH-02 Mirpur Sub-Store</option>
                    <option>WH-03 Uttara Depot</option>
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#374151]">Purchase Order Lines</span>
                  <button
                    onClick={() => setPoLines([...poLines, { name: "New Spare Part", qty: 10, cost: 250 }])}
                    className="text-xs font-bold text-[#D85A30] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add Line
                  </button>
                </div>
                <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-[#E5E7EB] text-[#9CA3AF]">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium">Part Name</th>
                        <th className="text-center px-3 py-2 font-medium">Qty</th>
                        <th className="text-right px-3 py-2 font-medium">Unit Cost</th>
                        <th className="text-right px-3 py-2 font-medium">Total</th>
                        <th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {poLines.map((line, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 text-[#111827]">{line.name}</td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="number"
                              value={line.qty}
                              onChange={e => {
                                const q = parseInt(e.target.value) || 1;
                                setPoLines(poLines.map((l, i) => i === idx ? { ...l, qty: q } : l));
                              }}
                              className="w-14 text-center border rounded px-1.5 py-0.5 font-bold"
                            />
                          </td>
                          <td className="px-3 py-2 text-right text-[#6B7280]">৳ {line.cost}</td>
                          <td className="px-3 py-2 text-right font-bold text-[#111827]">
                            ৳ {(line.qty * line.cost).toLocaleString()}
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              onClick={() => setPoLines(poLines.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-3 text-xs space-y-1">
                  <div className="text-right space-y-1">
                    <div className="flex justify-between gap-10 text-[#6B7280]"><span>Subtotal:</span><span>৳ {subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between gap-10 text-[#6B7280]"><span>Tax (5%):</span><span>৳ {tax.toFixed(0)}</span></div>
                    <div className="flex justify-between gap-10 font-bold text-sm text-[#111827] pt-1 border-t"><span>Total Amount:</span><span>৳ {grandTotal.toFixed(0)}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => handleCreatePO(true)}
                  className="flex-1 border border-[#E5E7EB] rounded-xl py-2.5 text-xs font-semibold text-[#4B5563] hover:bg-gray-50"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleCreatePO(false)}
                  className="flex-1 bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2.5 text-xs font-bold transition-colors cursor-pointer"
                >
                  Send to Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
