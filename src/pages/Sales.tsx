import { useState } from "react";
import {
  Search, Filter, Download, Plus, Eye, Printer, MoreHorizontal,
  ArrowUpDown, X, Check, DollarSign, Send, RotateCcw, FileText
} from "lucide-react";
import { useToast } from "../components/Toast";

interface Invoice {
  id: string;
  date: string;
  customer: string;
  branch: string;
  items: number;
  salesperson: string;
  total: number;
  paid: number;
  due: number;
  status: "Paid" | "Partial" | "Due" | "Cancelled" | "Refunded";
}

const initialInvoices: Invoice[] = [
  { id: "INV-20483", date: "Sep 11, 2026", customer: "Walk-in Customer", branch: "Dhaka Main", items: 3, salesperson: "Kamal Hossain", total: 2160, paid: 2160, due: 0, status: "Paid" },
  { id: "INV-20482", date: "Sep 11, 2026", customer: "Rahman Auto Workshop", branch: "Dhaka Main", items: 8, salesperson: "Rahim Ahmed", total: 24500, paid: 24500, due: 0, status: "Paid" },
  { id: "INV-20481", date: "Sep 11, 2026", customer: "Karim Motors", branch: "Mirpur", items: 5, salesperson: "Reza Mia", total: 8750, paid: 8750, due: 0, status: "Paid" },
  { id: "INV-20480", date: "Sep 10, 2026", customer: "Hossain Trading Co.", branch: "Dhaka Main", items: 12, salesperson: "Rahim Ahmed", total: 67800, paid: 40000, due: 27800, status: "Partial" },
  { id: "INV-20479", date: "Sep 10, 2026", customer: "Dhaka Bike Shop", branch: "Uttara", items: 4, salesperson: "Nabil Islam", total: 15400, paid: 0, due: 15400, status: "Due" },
  { id: "INV-20478", date: "Sep 10, 2026", customer: "Moto Parts Wholesale", branch: "Chattogram", items: 24, salesperson: "Sajid Khan", total: 142600, paid: 142600, due: 0, status: "Paid" },
  { id: "INV-20477", date: "Sep 9, 2026", customer: "Ahmed Auto Parts", branch: "Dhaka Main", items: 7, salesperson: "Kamal Hossain", total: 34200, paid: 34200, due: 0, status: "Paid" },
  { id: "INV-20476", date: "Sep 9, 2026", customer: "Uttara Bike Service", branch: "Uttara", items: 6, salesperson: "Nabil Islam", total: 18900, paid: 0, due: 18900, status: "Due" },
  { id: "INV-20475", date: "Sep 9, 2026", customer: "Akhtar Motors", branch: "Mirpur", items: 3, salesperson: "Reza Mia", total: 7200, paid: 7200, due: 0, status: "Paid" },
  { id: "INV-20474", date: "Sep 8, 2026", customer: "Badruddin Traders", branch: "Dhaka Main", items: 15, salesperson: "Rahim Ahmed", total: 89400, paid: 89400, due: 0, status: "Paid" },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-[#DCFCE7] text-[#16A34A]",
  Partial: "bg-[#FEF3C7] text-[#D97706]",
  Due: "bg-[#FEE2E2] text-[#DC2626]",
  Cancelled: "bg-[#F3F4F6] text-[#6B7280]",
  Refunded: "bg-[#EDE9FE] text-[#7C3AED]",
};

const tabs = ["All Sales", "Invoices", "Quotations", "Drafts", "Credit Sales", "Payments"];

export default function Sales({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [activeTab, setActiveTab] = useState("All Sales");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  // Create sale form
  const [newSale, setNewSale] = useState({
    customer: "Rahman Auto Workshop",
    branch: "Dhaka Main",
    itemsCount: 3,
    total: "8500",
    paidAmount: "8500",
  });

  const filtered = invoices.filter(inv => {
    const matchSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || inv.status === statusFilter;
    const matchBranch = branchFilter === "All" || inv.branch.toLowerCase().includes(branchFilter.toLowerCase());

    if (activeTab === "Credit Sales") return matchSearch && inv.due > 0;
    if (activeTab === "Quotations") return matchSearch && inv.status === "Partial";
    return matchSearch && matchStatus && matchBranch;
  });

  const handleExportCSV = () => {
    const headers = ["Invoice ID", "Date", "Customer", "Branch", "Items", "Salesperson", "Total (BDT)", "Paid (BDT)", "Due (BDT)", "Status"];
    const rows = filtered.map(i => [
      i.id,
      i.date,
      `"${i.customer.replace(/"/g, '""')}"`,
      i.branch,
      i.items,
      i.salesperson,
      i.total,
      i.paid,
      i.due,
      i.status,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_invoices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filtered.length} invoices to CSV`, "success");
  };

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    const tot = parseFloat(newSale.total) || 0;
    const pd = parseFloat(newSale.paidAmount) || 0;
    const due = Math.max(0, tot - pd);
    const status: Invoice["status"] = due === 0 ? "Paid" : pd > 0 ? "Partial" : "Due";

    const inv: Invoice = {
      id: "INV-" + Math.floor(20500 + Math.random() * 500),
      date: "Today, Sep 12",
      customer: newSale.customer,
      branch: newSale.branch,
      items: parseInt(String(newSale.itemsCount)) || 1,
      salesperson: "Rahim Ahmed",
      total: tot,
      paid: pd,
      due,
      status,
    };

    setInvoices(prev => [inv, ...prev]);
    showToast(`Created invoice #${inv.id} for ${inv.customer}`, "success");
    setShowCreateModal(false);
  };

  const handleReceivePaymentConfirm = (amount: number) => {
    if (!selectedInvoice) return;
    const newPaid = selectedInvoice.paid + amount;
    const newDue = Math.max(0, selectedInvoice.total - newPaid);
    const newStatus: Invoice["status"] = newDue === 0 ? "Paid" : "Partial";

    const updated = {
      ...selectedInvoice,
      paid: newPaid,
      due: newDue,
      status: newStatus,
    };

    setSelectedInvoice(updated);
    setInvoices(prev => prev.map(i => i.id === updated.id ? updated : i));
    showToast(`Recorded payment of ৳${amount.toLocaleString()} on #${selectedInvoice.id}`, "success");
    setShowPaymentModal(false);
  };

  const handleReturnInvoiceConfirm = () => {
    if (!selectedInvoice) return;
    const updated: Invoice = {
      ...selectedInvoice,
      status: "Refunded",
    };
    setSelectedInvoice(updated);
    setInvoices(prev => prev.map(i => i.id === updated.id ? updated : i));
    showToast(`Processed full return/refund for #${selectedInvoice.id}`, "info");
    setShowReturnModal(false);
  };

  if (selectedInvoice) {
    return (
      <div className="p-4 sm:p-6 max-w-[900px] mx-auto space-y-4">
        <button
          onClick={() => setSelectedInvoice(null)}
          className="text-xs sm:text-[13px] text-[#D85A30] font-medium hover:underline flex items-center gap-1 cursor-pointer"
        >
          ← Back to Sales List
        </button>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-[#E5E7EB] gap-3">
            <div>
              <h1 className="text-xl font-bold text-[#111827]">Invoice {selectedInvoice.id}</h1>
              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="text-[#6B7280]">{selectedInvoice.date}</span>
                <span className={`font-semibold px-2 py-0.5 rounded-full ${statusStyles[selectedInvoice.status]}`}>
                  {selectedInvoice.status}
                </span>
                <span className="text-[#6B7280]">• Branch: {selectedInvoice.branch}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedInvoice.due > 0 && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl bg-[#D85A30] hover:bg-[#B74421] text-white transition-colors cursor-pointer"
                >
                  Receive Payment
                </button>
              )}
              <button
                onClick={() => {
                  window.print();
                  showToast(`Sent Invoice #${selectedInvoice.id} to printer`, "success");
                }}
                className="text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-gray-50 text-[#374151] flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={13} /> Print
              </button>
              <button
                onClick={() => showToast(`Downloaded PDF for Invoice #${selectedInvoice.id}`, "success")}
                className="text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-gray-50 text-[#374151] flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={13} /> PDF
              </button>
              <button
                onClick={() => setShowSendModal(true)}
                className="text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-gray-50 text-[#374151] flex items-center gap-1.5 cursor-pointer"
              >
                <Send size={13} /> Send
              </button>
              <button
                onClick={() => setShowReturnModal(true)}
                className="text-xs px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} /> Return
              </button>
            </div>
          </div>

          {/* Customer & Payment details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 sm:p-6 border-b border-[#E5E7EB] text-xs">
            <div>
              <div className="font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Billed To</div>
              <div className="font-bold text-[#111827] text-sm">{selectedInvoice.customer}</div>
              <div className="text-[#6B7280] mt-1">Customer Account #CUST-00124</div>
              <div className="text-[#6B7280]">+880 1712-345678</div>
              <div className="text-[#6B7280]">Dhaka, Bangladesh</div>
            </div>
            <div>
              <div className="font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Payment Summary</div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#6B7280]"><span>Total Invoice Value:</span><span className="font-bold text-[#111827]">৳ {selectedInvoice.total.toLocaleString()}</span></div>
                <div className="flex justify-between text-[#6B7280]"><span>Amount Paid:</span><span className="font-bold text-[#16A34A]">৳ {selectedInvoice.paid.toLocaleString()}</span></div>
                <div className="flex justify-between text-[#6B7280]"><span>Remaining Due:</span><span className="font-bold text-[#DC2626]">৳ {selectedInvoice.due.toLocaleString()}</span></div>
                <div className="flex justify-between text-[#6B7280]"><span>Salesperson:</span><span className="text-[#111827]">{selectedInvoice.salesperson}</span></div>
              </div>
            </div>
          </div>

          {/* Mock line items */}
          <div className="p-4 sm:p-6">
            <div className="text-xs font-semibold text-[#374151] mb-2">Invoice Line Items ({selectedInvoice.items} items)</div>
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold text-[#9CA3AF]">Description</th>
                    <th className="text-center px-4 py-2.5 font-semibold text-[#9CA3AF]">Qty</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-[#9CA3AF]">Unit Price</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-[#9CA3AF]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  <tr>
                    <td className="px-4 py-2.5 text-[#111827] font-medium">Honda CB Hornet Front Brake Pad (HBP-CBH-160F)</td>
                    <td className="px-4 py-2.5 text-center text-[#6B7280]">2</td>
                    <td className="px-4 py-2.5 text-right text-[#6B7280]">৳ 750</td>
                    <td className="px-4 py-2.5 text-right font-bold text-[#111827]">৳ 1,500</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-[#111827] font-medium">Motul Engine Oil 10W40 1L (MOT-10W40-1L)</td>
                    <td className="px-4 py-2.5 text-center text-[#6B7280]">1</td>
                    <td className="px-4 py-2.5 text-right text-[#6B7280]">৳ 580</td>
                    <td className="px-4 py-2.5 text-right font-bold text-[#111827]">৳ 580</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Receive Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#111827] text-base">Receive Payment</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                  <X size={18} />
                </button>
              </div>
              <p className="text-xs text-[#6B7280] mb-4">
                Total due on this invoice is <span className="font-bold text-[#DC2626]">৳ {selectedInvoice.due.toLocaleString()}</span>.
              </p>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Amount to Receive (৳)</label>
                  <input
                    type="number"
                    defaultValue={selectedInvoice.due}
                    id="receiveAmt"
                    className="w-full text-sm font-bold border border-[#E5E7EB] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Payment Method</label>
                  <select className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white">
                    <option>Cash</option>
                    <option>bKash</option>
                    <option>Nagad</option>
                    <option>Bank Card</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 border border-[#E5E7EB] rounded-xl py-2 text-xs font-semibold text-[#4B5563]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById("receiveAmt") as HTMLInputElement;
                    const val = parseFloat(input?.value) || selectedInvoice.due;
                    handleReceivePaymentConfirm(val);
                  }}
                  className="flex-1 bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2 text-xs font-bold"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Modal */}
        {showSendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#111827] text-base">Send Invoice</h3>
                <button onClick={() => setShowSendModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                  <X size={18} />
                </button>
              </div>
              <p className="text-xs text-[#6B7280] mb-4">Choose how you want to deliver invoice #{selectedInvoice.id}.</p>
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => {
                    showToast("Invoice link sent via WhatsApp Business", "success");
                    setShowSendModal(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-[#25D366] hover:bg-[#F0FFF4] text-left text-xs cursor-pointer font-medium"
                >
                  <Send size={16} className="text-[#25D366]" />
                  <span>Send via WhatsApp (+880 1712-345678)</span>
                </button>
                <button
                  onClick={() => {
                    showToast("PDF Invoice emailed to customer", "success");
                    setShowSendModal(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-blue-50 text-left text-xs cursor-pointer font-medium"
                >
                  <FileText size={16} className="text-[#2563EB]" />
                  <span>Email PDF Invoice (rahman.auto@gmail.com)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Return Modal */}
        {showReturnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB] text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
                <RotateCcw size={20} />
              </div>
              <h3 className="font-bold text-[#111827] text-base mb-1">Process Invoice Return</h3>
              <p className="text-xs text-[#6B7280] mb-4">
                This will mark invoice #{selectedInvoice.id} as Refunded and return parts back to available stock.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="flex-1 border border-[#E5E7EB] rounded-xl py-2 text-xs font-semibold text-[#4B5563]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReturnInvoiceConfirm}
                  className="flex-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-xl py-2 text-xs font-bold"
                >
                  Confirm Return
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
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleExportCSV}
          className="h-9 sm:h-9.5 flex items-center justify-center gap-1.5 text-xs sm:text-[13px] text-[#4B5563] border border-[#E5E7EB] rounded-lg px-3.5 bg-white hover:border-[#D1D5DB] transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
        >
          <Download size={14} className="shrink-0" />
          <span>Export CSV</span>
        </button>
        <button
          onClick={() => setShowCreateModal(true)}
          className="h-9 sm:h-9.5 flex items-center justify-center gap-1.5 text-xs sm:text-[13px] font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg px-3.5 sm:px-4 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
        >
          <Plus size={15} className="shrink-0" />
          <span>New Sale</span>
        </button>
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

      {/* Filter bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search invoice number or customer…"
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-[13px] border border-[#E5E7EB] rounded-lg bg-[#F7F8FA] focus:outline-none focus:border-[#D85A30]"
          />
        </div>
        <select
          value={branchFilter}
          onChange={e => setBranchFilter(e.target.value)}
          className="text-xs sm:text-[13px] border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#374151] focus:outline-none"
        >
          <option value="All">All Branches</option>
          <option value="Dhaka Main">Dhaka Main</option>
          <option value="Mirpur">Mirpur</option>
          <option value="Uttara">Uttara</option>
          <option value="Chattogram">Chattogram</option>
        </select>
        <div className="flex rounded-lg border border-[#E5E7EB] overflow-hidden bg-white">
          {["All", "Paid", "Partial", "Due"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-[11px] sm:text-[12px] px-2.5 sm:px-3 py-2 font-medium transition-colors cursor-pointer ${
                statusFilter === s ? "bg-[#D85A30] text-white" : "text-[#6B7280] hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table with Horizontal Scroll */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
                {["Invoice", "Date", "Customer", "Branch", "Items", "Salesperson", "Total", "Paid", "Due", "Status", ""].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-xs font-mono font-bold text-[#D85A30] whitespace-nowrap">{inv.id}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{inv.date}</td>
                  <td className="px-4 py-3 text-xs font-medium text-[#111827] max-w-[160px] truncate">{inv.customer}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{inv.branch}</td>
                  <td className="px-4 py-3 text-xs text-[#111827] whitespace-nowrap">{inv.items}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{inv.salesperson}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#111827] whitespace-nowrap">৳ {inv.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-[#16A34A] font-medium whitespace-nowrap">৳ {inv.paid.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-[#DC2626] font-medium whitespace-nowrap">
                    {inv.due > 0 ? `৳ ${inv.due.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 rounded hover:bg-gray-100 text-[#9CA3AF] hover:text-[#2563EB] cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => {
                          window.print();
                          showToast(`Printing invoice ${inv.id}`, "info");
                        }}
                        className="p-1.5 rounded hover:bg-gray-100 text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
                        title="Print"
                      >
                        <Printer size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-[#F3F4F6] gap-2">
          <span className="text-xs text-[#9CA3AF]">Showing {filtered.length} of {invoices.length} invoices</span>
          <div className="flex gap-1">
            {["‹", "1", "2", "3", "›"].map((p, i) => (
              <button
                key={i}
                onClick={() => showToast(`Page ${p} loaded`, "info")}
                className={`w-7 h-7 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  p === "1" ? "bg-[#D85A30] text-white" : "text-[#6B7280] hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New Sale Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#111827] text-base">Create New Sale Invoice</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateSale} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Customer</label>
                <input
                  type="text"
                  required
                  value={newSale.customer}
                  onChange={e => setNewSale({ ...newSale, customer: e.target.value })}
                  className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Branch</label>
                  <select
                    value={newSale.branch}
                    onChange={e => setNewSale({ ...newSale, branch: e.target.value })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white"
                  >
                    <option>Dhaka Main</option>
                    <option>Mirpur</option>
                    <option>Uttara</option>
                    <option>Chattogram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Items Count</label>
                  <input
                    type="number"
                    value={newSale.itemsCount}
                    onChange={e => setNewSale({ ...newSale, itemsCount: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Total Bill (৳)</label>
                  <input
                    type="number"
                    required
                    value={newSale.total}
                    onChange={e => setNewSale({ ...newSale, total: e.target.value })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Paid Amount (৳)</label>
                  <input
                    type="number"
                    value={newSale.paidAmount}
                    onChange={e => setNewSale({ ...newSale, paidAmount: e.target.value })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-[#E5E7EB] rounded-xl py-2 text-xs font-semibold text-[#4B5563]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2 text-xs font-bold transition-colors"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
