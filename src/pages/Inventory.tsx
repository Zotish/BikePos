import { useState } from "react";
import {
  ArrowLeftRight,
  Search, Filter, Plus, Download, X, Building2, Check
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "../components/Toast";

const movementData = [
  { name: "Engine", in: 420, out: 380 },
  { name: "Brake", in: 280, out: 310 },
  { name: "Electrical", in: 190, out: 175 },
  { name: "Suspension", in: 145, out: 130 },
  { name: "Lubricants", in: 380, out: 420 },
  { name: "Tyres", in: 95, out: 88 },
];

const initialMovements = [
  { date: "Sep 11, 09:42", product: "Honda CB Hornet Brake Pad", sku: "HBP-CBH-160F", type: "Sale", ref: "INV-20482", from: "Shelf A-04", to: "Customer", in: 0, out: 4, balance: 42 },
  { date: "Sep 11, 09:15", product: "Motul Engine Oil 10W40 1L", sku: "MOT-10W40-1L", type: "Purchase", ref: "PO-1042", from: "Supplier", to: "Shelf C-02", in: 50, out: 0, balance: 86 },
  { date: "Sep 11, 08:55", product: "NGK Spark Plug CR8E", sku: "NGK-CR8E", type: "Sale", ref: "INV-20481", from: "Shelf B-07", to: "Customer", in: 0, out: 6, balance: 64 },
  { date: "Sep 10, 17:30", product: "Yamaha R15 V3 Brake Disc", sku: "YAM-R15V3-BDF", type: "Transfer", ref: "TRF-0218", from: "Dhaka Main", to: "Mirpur Branch", in: 0, out: 3, balance: 6 },
  { date: "Sep 10, 14:20", product: "KTM Duke 200 Rear Shock", sku: "KTM-DK200-RSA", type: "Return", ref: "RTN-0091", from: "Customer", to: "Shelf D-01", in: 1, out: 0, balance: 2 },
  { date: "Sep 10, 11:00", product: "Bajaj Pulsar Clutch Plate", sku: "BAJ-PUL150-CP", type: "Adjustment", ref: "ADJ-0044", from: "System", to: "Shelf A-09", in: 3, out: 0, balance: 22 },
  { date: "Sep 10, 09:30", product: "Royal Enfield Oil Filter", sku: "RE-MET350-OF", type: "Sale", ref: "INV-20478", from: "Shelf B-03", to: "Customer", in: 0, out: 5, balance: 15 },
];

const typeStyles: Record<string, string> = {
  Sale: "bg-[#FEE2E2] text-[#DC2626]",
  Purchase: "bg-[#DCFCE7] text-[#16A34A]",
  Transfer: "bg-[#DBEAFE] text-[#2563EB]",
  Return: "bg-[#EDE9FE] text-[#7C3AED]",
  Adjustment: "bg-[#FEF3C7] text-[#D97706]",
  Damage: "bg-[#F3F4F6] text-[#6B7280]",
};

const warehouses = [
  { name: "WH-01 Dhaka Main", location: "Mirpur, Dhaka", value: "৳ 18.4L", skus: 2841, lowStock: 8, manager: "Arif Hossain" },
  { name: "WH-02 Mirpur Store", location: "Mirpur-10, Dhaka", value: "৳ 9.2L", skus: 1248, lowStock: 3, manager: "Rana Mia" },
  { name: "WH-03 Uttara", location: "Uttara, Dhaka", value: "৳ 6.8L", skus: 892, lowStock: 1, manager: "Sohel Rana" },
  { name: "WH-04 Chattogram", location: "Agrabad, Chattogram", value: "৳ 4.0L", skus: 624, lowStock: 0, manager: "Jahir Uddin" },
];

const tabs = ["Stock Overview", "Stock Movement", "Adjustments", "Warehouses", "Reorder Suggestions"];

export default function Inventory({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("Stock Movement");
  const [movements, setMovements] = useState(initialMovements);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");

  // Modals
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Forms
  const [adjForm, setAdjForm] = useState({
    product: "Honda CB Hornet Brake Pad",
    sku: "HBP-CBH-160F",
    type: "Adjustment",
    qty: "5",
    reason: "Damaged packaging in storage",
  });

  const [transferForm, setTransferForm] = useState({
    product: "Motul Engine Oil 10W40 1L",
    sku: "MOT-10W40-1L",
    from: "WH-01 Dhaka Main",
    to: "WH-02 Mirpur Store",
    qty: "15",
  });

  const filteredMovements = movements.filter(m => {
    const matchSearch = m.product.toLowerCase().includes(search.toLowerCase()) || m.sku.toLowerCase().includes(search.toLowerCase()) || m.ref.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === "All Types" || m.type === selectedType;
    return matchSearch && matchType;
  });

  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseInt(adjForm.qty) || 1;
    const newMovement = {
      date: "Just now",
      product: adjForm.product,
      sku: adjForm.sku,
      type: "Adjustment",
      ref: "ADJ-00" + (movements.length + 10),
      from: "Audit",
      to: "Shelf A-04",
      in: qtyNum > 0 ? qtyNum : 0,
      out: qtyNum < 0 ? Math.abs(qtyNum) : 0,
      balance: 42 + qtyNum,
    };
    setMovements(prev => [newMovement, ...prev]);
    showToast(`Stock adjustment logged (${adjForm.product}: ${qtyNum > 0 ? "+" : ""}${qtyNum})`, "success");
    setShowAdjustmentModal(false);
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseInt(transferForm.qty) || 1;
    const newMovement = {
      date: "Just now",
      product: transferForm.product,
      sku: transferForm.sku,
      type: "Transfer",
      ref: "TRF-0" + (movements.length + 20),
      from: transferForm.from,
      to: transferForm.to,
      in: 0,
      out: qtyNum,
      balance: 71,
    };
    setMovements(prev => [newMovement, ...prev]);
    showToast(`Transferred ${qtyNum} units to ${transferForm.to}`, "success");
    setShowTransferModal(false);
  };

  const handleExport = () => {
    const headers = ["Date", "Product", "SKU", "Type", "Ref", "From", "To", "Qty In", "Qty Out", "Balance"];
    const rows = movements.map(m => [m.date, `"${m.product}"`, m.sku, m.type, m.ref, m.from, m.to, m.in, m.out, m.balance]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `inventory_movement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded Inventory Movement log", "success");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5">
        <button
          onClick={handleExport}
          className="flex-1 min-w-0 sm:flex-none sm:w-[130px] h-9 sm:h-9.5 px-2.5 sm:px-0 flex items-center justify-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#4B5563] border border-[#E5E7EB] rounded-lg bg-white hover:border-[#D1D5DB] transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
        >
          <Download size={14} className="shrink-0" />
          <span className="truncate">Export CSV</span>
        </button>
        <button
          onClick={() => setShowTransferModal(true)}
          className="flex-1 min-w-0 sm:flex-none sm:w-[130px] h-9 sm:h-9.5 px-2.5 sm:px-0 flex items-center justify-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#374151] border border-[#E5E7EB] rounded-lg bg-white hover:border-[#D85A30] transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
        >
          <ArrowLeftRight size={14} className="shrink-0" />
          <span className="truncate">Transfer</span>
        </button>
        <button
          onClick={() => setShowAdjustmentModal(true)}
          className="flex-1 min-w-0 sm:flex-none sm:w-[130px] h-9 sm:h-9.5 px-2.5 sm:px-0 flex items-center justify-center gap-1.5 text-xs sm:text-[13px] font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
        >
          <Plus size={14} className="shrink-0" />
          <span className="truncate">Adjust Stock</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {[
          { label: "Inventory Value", value: "৳ 38.4L" },
          { label: "Total SKUs", value: "4,218" },
          { label: "Low Stock", value: "12" },
          { label: "Out of Stock", value: "7" },
          { label: "Dead Stock", value: "43 SKUs" },
          { label: "Stock Turnover", value: "4.2x" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#E5E7EB] rounded-xl p-3 sm:p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="text-[13px] sm:text-sm font-bold text-[#111827] leading-snug truncate" title={k.label}>
              {k.label}
            </div>
            <div className="text-sm sm:text-base font-bold text-[#111827] mt-2 leading-tight">
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] overflow-x-auto scrollbar-none">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => {
              if (t === "Reorder Suggestions" && onNavigate) {
                onNavigate("reorder");
              } else {
                setActiveTab(t);
              }
            }}
            className={`px-3 sm:px-4 py-2.5 text-xs sm:text-[13px] font-medium border-b-2 transition-colors -mb-px whitespace-nowrap cursor-pointer ${
              activeTab === t ? "border-[#D85A30] text-[#D85A30] font-bold" : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview & Warehouses Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-xs">
          <h2 className="font-bold text-sm text-[#111827] mb-1">Stock Movement by Category</h2>
          <p className="text-xs text-[#9CA3AF] mb-4">Inbound (purchases) vs Outbound (counter sales + workshop)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={movementData} margin={{ left: -20, right: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #E5E7EB", borderRadius: 6 }} />
              <Bar dataKey="in" fill="#16A34A" radius={[3, 3, 0, 0]} name="Inbound" />
              <Bar dataKey="out" fill="#D85A30" radius={[3, 3, 0, 0]} name="Outbound" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Warehouses */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-[#111827]">Warehouses & Depots</h2>
            <button
              onClick={() => showToast("All warehouse locations are online", "info")}
              className="text-xs text-[#D85A30] font-semibold hover:underline"
            >
              Live Sync Active
            </button>
          </div>
          <div className="space-y-2.5">
            {warehouses.map(w => (
              <div
                key={w.name}
                onClick={() => showToast(`Selected ${w.name}`, "info")}
                className="flex items-center gap-3 p-3 border border-[#F3F4F6] rounded-xl hover:border-[#D85A30]/50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-[#F7F8FA] rounded-lg border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                  <Building2 size={14} className="text-[#D85A30]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#111827]">{w.name}</div>
                  <div className="text-[11px] text-[#9CA3AF]">{w.location} · {w.manager}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold text-[#111827]">{w.value}</div>
                  <div className="text-[10px] text-[#9CA3AF]">{w.skus} SKUs</div>
                </div>
                {w.lowStock > 0 && (
                  <span className="text-[10px] font-semibold bg-[#FEF3C7] text-[#D97706] px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {w.lowStock} low
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Movement Log Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 border-b border-[#E5E7EB] gap-2">
          <h2 className="font-bold text-sm text-[#111827]">Audit Stock Movements</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search part or SKU…"
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-[#F7F8FA] focus:outline-none focus:border-[#D85A30]"
              />
            </div>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="text-xs border border-[#E5E7EB] rounded-lg px-2 py-1.5 bg-white text-[#374151] focus:outline-none"
            >
              <option>All Types</option>
              {Object.keys(typeStyles).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
                {["Date", "Product", "SKU", "Type", "Reference", "From", "To", "Qty In", "Qty Out", "Balance"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMovements.map((m, i) => (
                <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-4 py-3 text-xs text-[#9CA3AF] whitespace-nowrap">{m.date}</td>
                  <td className="px-4 py-3 text-xs font-medium text-[#111827] max-w-[160px] truncate">{m.product}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[#6B7280] whitespace-nowrap">{m.sku}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeStyles[m.type]}`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono font-bold text-[#D85A30] whitespace-nowrap">{m.ref}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{m.from}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{m.to}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#16A34A] whitespace-nowrap">{m.in > 0 ? `+${m.in}` : "—"}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#DC2626] whitespace-nowrap">{m.out > 0 ? `-${m.out}` : "—"}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#111827] whitespace-nowrap">{m.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] text-base">Adjust Physical Stock</h3>
              <button onClick={() => setShowAdjustmentModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateAdjustment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Select Part</label>
                <input
                  required
                  value={adjForm.product}
                  onChange={e => setAdjForm({ ...adjForm, product: e.target.value })}
                  className="w-full text-xs border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Adjustment Quantity (+ / -)</label>
                <input
                  type="number"
                  required
                  value={adjForm.qty}
                  onChange={e => setAdjForm({ ...adjForm, qty: e.target.value })}
                  className="w-full text-sm font-bold border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Reason / Note</label>
                <textarea
                  required
                  rows={2}
                  value={adjForm.reason}
                  onChange={e => setAdjForm({ ...adjForm, reason: e.target.value })}
                  className="w-full text-xs border rounded-lg px-3 py-2 resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdjustmentModal(false)} className="flex-1 border rounded-xl py-2 text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-[#D85A30] text-white rounded-xl py-2 text-xs font-bold">Log Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] text-base">Transfer Stock Between Warehouses</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateTransfer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Part Name</label>
                <input
                  required
                  value={transferForm.product}
                  onChange={e => setTransferForm({ ...transferForm, product: e.target.value })}
                  className="w-full text-xs border rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">From</label>
                  <select
                    value={transferForm.from}
                    onChange={e => setTransferForm({ ...transferForm, from: e.target.value })}
                    className="w-full text-xs border rounded-lg px-2 py-2 bg-white"
                  >
                    <option>WH-01 Dhaka Main</option>
                    <option>WH-02 Mirpur Store</option>
                    <option>WH-03 Uttara</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">To</label>
                  <select
                    value={transferForm.to}
                    onChange={e => setTransferForm({ ...transferForm, to: e.target.value })}
                    className="w-full text-xs border rounded-lg px-2 py-2 bg-white"
                  >
                    <option>WH-02 Mirpur Store</option>
                    <option>WH-01 Dhaka Main</option>
                    <option>WH-03 Uttara</option>
                    <option>WH-04 Chattogram</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  value={transferForm.qty}
                  onChange={e => setTransferForm({ ...transferForm, qty: e.target.value })}
                  className="w-full text-sm font-bold border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowTransferModal(false)} className="flex-1 border rounded-xl py-2 text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-[#D85A30] text-white rounded-xl py-2 text-xs font-bold">Execute Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
