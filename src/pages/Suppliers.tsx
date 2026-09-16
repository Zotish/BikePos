import { useState } from "react";
import { Plus, Search, Eye, MapPin, X, Building2, Phone, Mail } from "lucide-react";
import { useToast } from "../components/Toast";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  location: string;
  purchases: number;
  outstanding: number;
  lastPurchase: string;
  status: string;
}

const initialSuppliers: Supplier[] = [
  { id: "SUP-001", name: "Honda Bangladesh Ltd.", contact: "Mahbub Rahman", phone: "+880 2-9861234", location: "Tejgaon, Dhaka", purchases: 2840000, outstanding: 284600, lastPurchase: "Sep 10", status: "Active" },
  { id: "SUP-002", name: "Yamaha Motor BD", contact: "Farhan Islam", phone: "+880 2-9862345", location: "Uttara, Dhaka", purchases: 1562000, outstanding: 0, lastPurchase: "Sep 9", status: "Active" },
  { id: "SUP-003", name: "Auto Parts BD Ltd.", contact: "Karim Hossain", phone: "+880 1712-456789", location: "Motijheel, Dhaka", purchases: 894000, outstanding: 89400, lastPurchase: "Sep 8", status: "Active" },
  { id: "SUP-004", name: "MotoImport Ltd.", contact: "Sajed Alam", phone: "+880 1823-567890", location: "Agrabad, Chattogram", purchases: 4128000, outstanding: 412800, lastPurchase: "Sep 7", status: "Active" },
  { id: "SUP-005", name: "NGK Bangladesh", contact: "Akash Roy", phone: "+880 2-9863456", location: "Gulshan, Dhaka", purchases: 456000, outstanding: 0, lastPurchase: "Sep 6", status: "Active" },
  { id: "SUP-006", name: "Motul BD Official", contact: "Sohel Chowdhury", phone: "+880 1934-678901", location: "Banani, Dhaka", purchases: 1248000, outstanding: 0, lastPurchase: "Sep 5", status: "Active" },
];

export default function Suppliers({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);

  const [newSupp, setNewSupp] = useState({
    name: "",
    contact: "",
    phone: "",
    location: "Dhaka",
  });

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contact.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupp.name || !newSupp.phone) {
      showToast("Please provide Supplier Company Name and Phone", "error");
      return;
    }
    const item: Supplier = {
      id: "SUP-00" + (suppliers.length + 1),
      name: newSupp.name,
      contact: newSupp.contact || "Representative",
      phone: newSupp.phone,
      location: newSupp.location,
      purchases: 0,
      outstanding: 0,
      lastPurchase: "Today",
      status: "Active",
    };
    setSuppliers(prev => [item, ...prev]);
    showToast(`Added vendor "${item.name}"`, "success");
    setShowAddModal(false);
    setNewSupp({ name: "", contact: "", phone: "", location: "Dhaka" });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Parts Suppliers & Vendors</h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">Manage genuine OEM distributors, local importers, and payment ledgers</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg px-3 sm:px-4 py-2 transition-colors cursor-pointer shadow-xs"
        >
          <Plus size={15} /> Add Supplier
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {[
          { label: "Total Purchases (YTD)", value: "৳ 1.01Cr", color: "text-[#111827]" },
          { label: "Outstanding Payables", value: "৳ 7,86,800", color: "text-[#DC2626]" },
          { label: "Active Suppliers", value: suppliers.length, color: "text-[#16A34A]" },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 sm:p-4 shadow-2xs">
            <div className="text-xs text-[#9CA3AF] mb-1">{c.label}</div>
            <div className={`text-lg sm:text-xl font-bold ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 sm:p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search vendor name, contact person, city…"
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-[13px] border border-[#E5E7EB] rounded-lg bg-[#F7F8FA] focus:outline-none focus:border-[#D85A30]"
          />
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
                {["Supplier", "Contact Person", "Phone", "Location", "Total Purchases", "Outstanding", "Last Purchase", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr
                  key={s.id}
                  onClick={() => setViewSupplier(s)}
                  className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#243B53] flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">
                        {s.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
                      </div>
                      <div>
                        <div className="text-xs sm:text-[13px] font-semibold text-[#111827]">{s.name}</div>
                        <div className="text-[11px] text-[#9CA3AF] font-mono">{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{s.contact}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{s.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs text-[#6B7280]"><MapPin size={11} />{s.location}</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-[#111827] whitespace-nowrap">৳ {s.purchases.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-bold whitespace-nowrap">
                    {s.outstanding > 0 ? <span className="text-[#DC2626]">৳ {s.outstanding.toLocaleString()}</span> : <span className="text-[#9CA3AF]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{s.lastPurchase}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[10px] sm:text-[11px] font-semibold bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full">
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setViewSupplier(s)}
                      className="p-1.5 rounded hover:bg-gray-100 text-[#9CA3AF] hover:text-[#2563EB] cursor-pointer"
                      title="View Details"
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

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] text-base">Add New Supplier</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateSupplier} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Company / Brand Name *</label>
                <input
                  required
                  placeholder="e.g. Hero MotoCorp BD"
                  value={newSupp.name}
                  onChange={e => setNewSupp({ ...newSupp, name: e.target.value })}
                  className="w-full text-xs border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Contact Person</label>
                <input
                  placeholder="e.g. Tanvir Ahmed"
                  value={newSupp.contact}
                  onChange={e => setNewSupp({ ...newSupp, contact: e.target.value })}
                  className="w-full text-xs border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Phone Number *</label>
                <input
                  required
                  placeholder="+880 1..."
                  value={newSupp.phone}
                  onChange={e => setNewSupp({ ...newSupp, phone: e.target.value })}
                  className="w-full text-xs border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Location / Depot</label>
                <input
                  placeholder="Tejgaon, Dhaka"
                  value={newSupp.location}
                  onChange={e => setNewSupp({ ...newSupp, location: e.target.value })}
                  className="w-full text-xs border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 border rounded-xl py-2 text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-[#D85A30] text-white rounded-xl py-2 text-xs font-bold">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Details Modal */}
      {viewSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#111827] text-base">{viewSupplier.name}</h3>
              <button onClick={() => setViewSupplier(null)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 text-xs mb-4">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="flex justify-between"><span className="text-[#6B7280]">Supplier ID:</span><span className="font-mono font-bold">{viewSupplier.id}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Contact Person:</span><span className="font-semibold">{viewSupplier.contact}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Phone:</span><span>{viewSupplier.phone}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Depot:</span><span>{viewSupplier.location}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Outstanding Payables:</span><span className="font-bold text-[#DC2626]">৳ {viewSupplier.outstanding.toLocaleString()}</span></div>
              </div>
            </div>
            <button
              onClick={() => {
                if (onNavigate) onNavigate("purchases");
                setViewSupplier(null);
                showToast(`Opened purchase orders for ${viewSupplier.name}`, "info");
              }}
              className="w-full bg-[#D85A30] text-white py-2 rounded-xl text-xs font-bold"
            >
              Create Purchase Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
