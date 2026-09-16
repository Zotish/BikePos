import { useState } from "react";
import {
  Search, Plus, Filter, ChevronDown, Eye, Edit2, Car, X, Phone, Mail,
  MapPin, Check, DollarSign, FileText, Shield
} from "lucide-react";
import { useToast } from "../components/Toast";

interface Customer {
  id: string;
  name: string;
  type: string;
  phone: string;
  orders: number;
  spend: number;
  due: number;
  lastPurchase: string;
  status: string;
}

const initialCustomers: Customer[] = [
  { id: "CUST-001", name: "Rahman Auto Workshop", type: "Workshop", phone: "+880 1712-345678", orders: 48, spend: 284600, due: 24500, lastPurchase: "Sep 11, 2026", status: "Active" },
  { id: "CUST-002", name: "Karim Motors", type: "Dealer", phone: "+880 1823-456789", orders: 32, spend: 156200, due: 0, lastPurchase: "Sep 11, 2026", status: "Active" },
  { id: "CUST-003", name: "Hossain Trading Co.", type: "Wholesale", phone: "+880 1934-567890", orders: 24, spend: 892400, due: 27800, lastPurchase: "Sep 10, 2026", status: "Active" },
  { id: "CUST-004", name: "Dhaka Bike Shop", type: "Retail", phone: "+880 1645-678901", orders: 18, spend: 124800, due: 15400, lastPurchase: "Sep 10, 2026", status: "Active" },
  { id: "CUST-005", name: "Moto Parts Wholesale", type: "Wholesale", phone: "+880 1756-789012", orders: 12, spend: 1242600, due: 0, lastPurchase: "Sep 10, 2026", status: "Active" },
  { id: "CUST-006", name: "Uttara Bike Service", type: "Workshop", phone: "+880 1867-890123", orders: 28, spend: 234200, due: 18900, lastPurchase: "Sep 9, 2026", status: "Active" },
  { id: "CUST-007", name: "Ahmed Auto Parts", type: "Retail", phone: "+880 1978-901234", orders: 56, spend: 89400, due: 0, lastPurchase: "Sep 9, 2026", status: "Active" },
  { id: "CUST-008", name: "Badruddin Traders", type: "Corporate", phone: "+880 1589-012345", orders: 8, spend: 1890400, due: 0, lastPurchase: "Sep 8, 2026", status: "Active" },
];

const typeStyles: Record<string, string> = {
  Workshop: "bg-[#EDE9FE] text-[#7C3AED]",
  Dealer: "bg-[#DBEAFE] text-[#2563EB]",
  Wholesale: "bg-[#FEF3C7] text-[#D97706]",
  Retail: "bg-[#DCFCE7] text-[#16A34A]",
  Corporate: "bg-[#FEE2E2] text-[#DC2626]",
};

export default function Customers({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState("Purchases");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Forms
  const [newCust, setNewCust] = useState({
    name: "",
    type: "Workshop",
    phone: "",
    email: "",
    address: "",
  });

  const [vehicles, setVehicles] = useState([
    { brand: "Honda", model: "CB Hornet 160R", year: "2021", reg: "Dhaka Metro Ga 11-1234" },
    { brand: "Yamaha", model: "FZ-S FI V3", year: "2023", reg: "Dhaka Metro Cha 12-5678" },
  ]);

  const [newVehicle, setNewVehicle] = useState({ brand: "Yamaha", model: "", year: "2023", reg: "" });

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchType = typeFilter === "All" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name || !newCust.phone) {
      showToast("Please provide Customer Name and Phone Number", "error");
      return;
    }
    const c: Customer = {
      id: "CUST-00" + (customers.length + 1),
      name: newCust.name,
      type: newCust.type,
      phone: newCust.phone,
      orders: 0,
      spend: 0,
      due: 0,
      lastPurchase: "Just now",
      status: "Active",
    };
    setCustomers(prev => [c, ...prev]);
    showToast(`Added customer "${c.name}"`, "success");
    setShowAddModal(false);
    setNewCust({ name: "", type: "Workshop", phone: "", email: "", address: "" });
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.model || !newVehicle.reg) {
      showToast("Please enter bike model and reg number", "error");
      return;
    }
    setVehicles(prev => [...prev, newVehicle]);
    showToast(`Added ${newVehicle.brand} ${newVehicle.model} to vehicle registry`, "success");
    setShowAddVehicleModal(false);
    setNewVehicle({ brand: "Yamaha", model: "", year: "2023", reg: "" });
  };

  const handleRecordPayment = (amt: number) => {
    if (!selected) return;
    const newDue = Math.max(0, selected.due - amt);
    const updated = { ...selected, due: newDue };
    setSelected(updated);
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
    showToast(`Recorded payment of ৳${amt.toLocaleString()} from ${selected.name}`, "success");
    setShowPaymentModal(false);
  };

  if (selected) {
    return (
      <div className="p-4 sm:p-6 max-w-[1100px] mx-auto space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="text-xs sm:text-[13px] text-[#D85A30] font-medium hover:underline cursor-pointer"
        >
          ← Back to All Customers
        </button>

        {/* Customer Profile Header */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-14 h-14 bg-[#D85A30] rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xl shadow-xs">
              {selected.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-[#111827]">{selected.name}</h1>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeStyles[selected.type]}`}>{selected.type}</span>
                <span className="text-[11px] font-semibold bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full">Active Account</span>
              </div>
              <div className="text-xs text-[#6B7280] mt-1">{selected.id} · Member since March 2024</div>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-[#6B7280]">
                <span className="flex items-center gap-1"><Phone size={12} /> {selected.phone}</span>
                <span className="flex items-center gap-1"><Mail size={12} /> info@{selected.name.toLowerCase().replace(/[^a-z]/g, "")}.com</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> Dhaka, Bangladesh</span>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowEditModal(true)}
                className="border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-semibold text-[#374151] hover:bg-gray-50 cursor-pointer"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => {
                  if (onNavigate) onNavigate("pos");
                  showToast(`Opened POS for ${selected.name}`, "info");
                }}
                className="bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
              >
                New Sale
              </button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {[
            { label: "Lifetime Spend", value: `৳ ${selected.spend.toLocaleString()}`, color: "text-[#D85A30]" },
            { label: "Total Orders", value: selected.orders, color: "text-[#111827]" },
            { label: "Outstanding Due", value: selected.due > 0 ? `৳ ${selected.due.toLocaleString()}` : "৳ 0", color: selected.due > 0 ? "text-[#DC2626]" : "text-[#16A34A]" },
            { label: "Avg Order Value", value: "৳ 5,929", color: "text-[#111827]" },
            { label: "Last Purchase", value: selected.lastPurchase, color: "text-[#16A34A]" },
          ].map(k => (
            <div key={k.label} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs">
              <div className="text-[11px] text-[#9CA3AF] mb-1">{k.label}</div>
              <div className={`text-base sm:text-lg font-bold ${k.color}`}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Due settlement action if due exists */}
        {selected.due > 0 && (
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3.5 flex items-center justify-between">
            <span className="text-xs text-[#991B1B]">
              This customer has an outstanding ledger balance of <strong>৳ {selected.due.toLocaleString()}</strong>.
            </span>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="text-xs font-bold bg-[#DC2626] text-white px-3 py-1.5 rounded-lg hover:bg-red-700 cursor-pointer"
            >
              Record Payment
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB] overflow-x-auto scrollbar-none">
          {["Purchases", "Vehicles", "Ledger & Due", "Notes"].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 text-xs sm:text-[13px] font-medium border-b-2 transition-colors -mb-px whitespace-nowrap cursor-pointer ${
                activeTab === t ? "border-[#D85A30] text-[#D85A30] font-bold" : "border-transparent text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "Purchases" && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs">
              <thead className="bg-[#FAFAFA] border-b border-[#E5E7EB] text-[#9CA3AF]">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold">Invoice</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Date</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Items</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Total</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                <tr>
                  <td className="px-4 py-2.5 font-mono text-[#D85A30] font-bold">INV-20482</td>
                  <td className="px-4 py-2.5 text-[#6B7280]">Sep 11, 2026</td>
                  <td className="px-4 py-2.5 text-[#111827]">8 parts</td>
                  <td className="px-4 py-2.5 text-right font-bold text-[#111827]">৳ 24,500</td>
                  <td className="px-4 py-2.5 text-right"><span className="px-2 py-0.5 rounded-full font-semibold bg-[#DCFCE7] text-[#16A34A]">Paid</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-[#D85A30] font-bold">INV-20469</td>
                  <td className="px-4 py-2.5 text-[#6B7280]">Sep 5, 2026</td>
                  <td className="px-4 py-2.5 text-[#111827]">12 parts</td>
                  <td className="px-4 py-2.5 text-right font-bold text-[#111827]">৳ 38,200</td>
                  <td className="px-4 py-2.5 text-right"><span className="px-2 py-0.5 rounded-full font-semibold bg-[#DCFCE7] text-[#16A34A]">Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Vehicles" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-[#374151]">Registered Fleet Vehicles</span>
              <button
                onClick={() => setShowAddVehicleModal(true)}
                className="text-xs font-semibold text-[#D85A30] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} /> Add Bike
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehicles.map((v, i) => (
                <div key={i} className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FEF0EA] rounded-xl flex items-center justify-center text-[#D85A30] font-bold">
                    <Car size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#111827]">{v.brand} {v.model} ({v.year})</div>
                    <div className="text-[11px] text-[#6B7280] font-mono mt-0.5">{v.reg}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Ledger & Due" && (
          <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl text-center">
            <div className="text-xs text-[#6B7280]">Outstanding Receivables</div>
            <div className="text-2xl font-bold text-[#DC2626] my-1">৳ {selected.due.toLocaleString()}</div>
            <p className="text-xs text-[#9CA3AF] mb-4">Credit limit authorized: ৳ 50,000</p>
            {selected.due > 0 ? (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-[#D85A30] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Settle Balance
              </button>
            ) : (
              <span className="text-xs font-bold text-[#16A34A]">All invoices are fully paid!</span>
            )}
          </div>
        )}

        {activeTab === "Notes" && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3 text-xs">
            <div className="font-semibold text-[#111827]">Account Notes</div>
            <textarea
              rows={3}
              placeholder="Add internal customer preference notes..."
              defaultValue="VIP workshop client. Enjoys 5% tier wholesale discount on Yamaha brake pads and Motul oils."
              className="w-full border border-[#E5E7EB] rounded-lg p-2.5 text-xs text-[#374151]"
            />
            <button
              onClick={() => showToast("Customer notes saved", "success")}
              className="bg-[#D85A30] hover:bg-[#B74421] text-white px-3 py-1.5 rounded-lg font-semibold cursor-pointer"
            >
              Save Notes
            </button>
          </div>
        )}

        {/* Add Vehicle Modal */}
        {showAddVehicleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#111827] text-base">Register Customer Bike</h3>
                <button onClick={() => setShowAddVehicleModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddVehicle} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Brand</label>
                  <select
                    value={newVehicle.brand}
                    onChange={e => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    className="w-full text-xs border rounded-lg px-3 py-2 bg-white"
                  >
                    <option>Honda</option>
                    <option>Yamaha</option>
                    <option>Bajaj</option>
                    <option>Suzuki</option>
                    <option>TVS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Model Name</label>
                  <input
                    required
                    placeholder="e.g. Gixxer SF 150"
                    value={newVehicle.model}
                    onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full text-xs border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Registration #</label>
                  <input
                    required
                    placeholder="e.g. Dhaka Metro La 14-8921"
                    value={newVehicle.reg}
                    onChange={e => setNewVehicle({ ...newVehicle, reg: e.target.value })}
                    className="w-full text-xs border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddVehicleModal(false)} className="flex-1 border rounded-xl py-2 text-xs">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#D85A30] text-white rounded-xl py-2 text-xs font-bold">Add Bike</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Record Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#111827] text-base">Record Payment</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                  <X size={18} />
                </button>
              </div>
              <p className="text-xs text-[#6B7280] mb-3">Customer has ৳{selected.due.toLocaleString()} outstanding.</p>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Amount (৳)</label>
                  <input type="number" id="custPayAmt" defaultValue={selected.due} className="w-full text-sm font-bold border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 border rounded-xl py-2 text-xs">Cancel</button>
                <button
                  onClick={() => {
                    const input = document.getElementById("custPayAmt") as HTMLInputElement;
                    const val = parseFloat(input?.value) || selected.due;
                    handleRecordPayment(val);
                  }}
                  className="flex-1 bg-[#D85A30] text-white rounded-xl py-2 text-xs font-bold"
                >
                  Confirm Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Customers & Workshops</h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">Manage workshops, corporate fleets, and individual motorcycle owners</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg px-3 sm:px-4 py-2 transition-colors cursor-pointer shadow-xs"
        >
          <Plus size={15} /> Add Customer
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 sm:p-4 flex gap-2 sm:gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customer name, ID, phone…"
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-[13px] border border-[#E5E7EB] rounded-lg bg-[#F7F8FA] focus:outline-none focus:border-[#D85A30]"
          />
        </div>
        <div className="flex rounded-lg border border-[#E5E7EB] overflow-hidden bg-white">
          {["All", "Workshop", "Dealer", "Retail", "Wholesale"].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`text-[11px] sm:text-[12px] px-2.5 sm:px-3 py-2 font-medium transition-colors cursor-pointer ${
                typeFilter === t ? "bg-[#D85A30] text-white" : "text-[#6B7280] hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
                {["Customer", "Type", "Phone", "Orders", "Total Spend", "Outstanding Due", "Last Purchase", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#D85A30] flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">
                        {c.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
                      </div>
                      <div>
                        <div className="text-xs sm:text-[13px] font-semibold text-[#111827]">{c.name}</div>
                        <div className="text-[11px] text-[#9CA3AF] font-mono">{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeStyles[c.type]}`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{c.phone}</td>
                  <td className="px-4 py-3 text-xs text-[#111827] whitespace-nowrap">{c.orders}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#111827] whitespace-nowrap">৳ {c.spend.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-bold whitespace-nowrap">
                    {c.due > 0 ? <span className="text-[#DC2626]">৳ {c.due.toLocaleString()}</span> : <span className="text-[#9CA3AF]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{c.lastPurchase}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[10px] sm:text-[11px] font-semibold bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelected(c)}
                        className="p-1.5 rounded hover:bg-gray-100 text-[#9CA3AF] hover:text-[#D85A30] cursor-pointer"
                        title="View Customer"
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#E5E7EB] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#111827] text-base">Add New Customer</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Customer / Workshop Name *</label>
                <input
                  required
                  value={newCust.name}
                  onChange={e => setNewCust({ ...newCust, name: e.target.value })}
                  placeholder="e.g. Apex Auto Care"
                  className="w-full text-xs border rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Customer Type</label>
                  <select
                    value={newCust.type}
                    onChange={e => setNewCust({ ...newCust, type: e.target.value })}
                    className="w-full text-xs border rounded-lg px-3 py-2 bg-white"
                  >
                    <option>Workshop</option>
                    <option>Retail</option>
                    <option>Dealer</option>
                    <option>Wholesale</option>
                    <option>Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Phone Number *</label>
                  <input
                    required
                    value={newCust.phone}
                    onChange={e => setNewCust({ ...newCust, phone: e.target.value })}
                    placeholder="+880 17..."
                    className="w-full text-xs border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Shop Address</label>
                <input
                  value={newCust.address}
                  onChange={e => setNewCust({ ...newCust, address: e.target.value })}
                  placeholder="Mirpur, Dhaka"
                  className="w-full text-xs border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 border rounded-xl py-2 text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-[#D85A30] text-white rounded-xl py-2 text-xs font-bold">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
