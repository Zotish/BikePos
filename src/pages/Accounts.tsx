import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Plus, Download, X, Check, FileText } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "../components/Toast";

interface Expense {
  id: number;
  date: string;
  category: string;
  vendor: string;
  amount: number;
  account: string;
  receipt: boolean;
}

const cashFlow = [
  { month: "Apr", inflow: 2840000, outflow: 2180000 },
  { month: "May", inflow: 3120000, outflow: 2420000 },
  { month: "Jun", inflow: 2980000, outflow: 2280000 },
  { month: "Jul", inflow: 3480000, outflow: 2680000 },
  { month: "Aug", inflow: 4120000, outflow: 3120000 },
  { month: "Sep", inflow: 4450000, outflow: 3380000 },
];

const initialExpenses: Expense[] = [
  { id: 1, date: "Sep 11", category: "Salary", vendor: "Staff Payroll (8 employees)", amount: 285000, account: "Bank (BRAC)", receipt: true },
  { id: 2, date: "Sep 10", category: "Rent", vendor: "Shop Space Landlord", amount: 85000, account: "Cash", receipt: true },
  { id: 3, date: "Sep 9", category: "Utility", vendor: "DESA Electricity & Water", amount: 12400, account: "Bank (Dutch-Bangla)", receipt: false },
  { id: 4, date: "Sep 8", category: "Transportation", vendor: "RedX Courier & Delivery", amount: 8500, account: "Cash", receipt: true },
  { id: 5, date: "Sep 7", category: "Marketing", vendor: "Meta / Facebook Ads", amount: 15000, account: "Card", receipt: true },
  { id: 6, date: "Sep 5", category: "Repairs", vendor: "Workshop Compressor Service", amount: 4500, account: "Cash", receipt: false },
];

const categoryColors: Record<string, string> = {
  Salary: "bg-[#DBEAFE] text-[#2563EB]",
  Rent: "bg-[#FEF3C7] text-[#D97706]",
  Utility: "bg-[#DCFCE7] text-[#16A34A]",
  Transportation: "bg-[#EDE9FE] text-[#7C3AED]",
  Marketing: "bg-[#FEE2E2] text-[#DC2626]",
  Repairs: "bg-[#F3F4F6] text-[#6B7280]",
  Miscellaneous: "bg-[#FEF0EA] text-[#D85A30]",
};

const fmt = (n: number) => `৳${(n / 100000).toFixed(1)}L`;

export default function Accounts({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Form
  const [newExp, setNewExp] = useState({
    category: "Utility",
    vendor: "",
    amount: "",
    account: "Cash",
    receipt: true,
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExp.amount) || 0;
    if (!newExp.vendor || amt <= 0) {
      showToast("Please enter vendor description and valid expense amount", "error");
      return;
    }
    const item: Expense = {
      id: Date.now(),
      date: "Today, Sep 12",
      category: newExp.category,
      vendor: newExp.vendor,
      amount: amt,
      account: newExp.account,
      receipt: newExp.receipt,
    };
    setExpenses(prev => [item, ...prev]);
    showToast(`Recorded expense of ৳${amt.toLocaleString()} (${item.category})`, "success");
    setShowExpenseModal(false);
    setNewExp({ category: "Utility", vendor: "", amount: "", account: "Cash", receipt: true });
  };

  const handleExport = () => {
    const headers = ["Date", "Category", "Vendor / Description", "Amount (BDT)", "Paid From", "Receipt Attached"];
    const rows = expenses.map(e => [e.date, e.category, `"${e.vendor}"`, e.amount, e.account, e.receipt ? "Yes" : "No"]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `accounts_expense_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded Financial Ledger CSV", "success");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Accounts & Cash Flow</h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">Financial ledger, shop operational expenses, and liquidity balances</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#4B5563] border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white hover:border-[#D1D5DB] transition-colors cursor-pointer"
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg px-3 sm:px-4 py-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={15} /> Add Expense
          </button>
        </div>
      </div>

      {/* Account balance cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          { label: "Cash Balance", value: "৳ 2,84,500", icon: <DollarSign size={16} className="text-[#16A34A]" />, bg: "bg-[#DCFCE7]", color: "text-[#16A34A]" },
          { label: "Bank Balance (BRAC)", value: "৳ 18,42,000", icon: <CreditCard size={16} className="text-[#2563EB]" />, bg: "bg-[#DBEAFE]", color: "text-[#2563EB]" },
          { label: "Receivables (Customers)", value: "৳ 8,72,000", icon: <TrendingUp size={16} className="text-[#D85A30]" />, bg: "bg-[#FEF0EA]", color: "text-[#D85A30]" },
          { label: "Payables (Suppliers)", value: "৳ 7,86,800", icon: <TrendingDown size={16} className="text-[#DC2626]" />, bg: "bg-[#FEE2E2]", color: "text-[#DC2626]" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 sm:p-4 shadow-2xs">
            <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center mb-2`}>{k.icon}</div>
            <div className={`text-base sm:text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[11px] text-[#9CA3AF]">{k.label}</div>
          </div>
        ))}
      </div>

      {/* P&L summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {[
          { label: "Revenue (Sep)", value: "৳ 44,50,000", change: "+8.1%", up: true },
          { label: "Total Expenses (Sep)", value: "৳ 30,70,000", change: "+3.2%", up: false },
          { label: "Net Profit (Sep)", value: "৳ 13,80,000", change: "+11.2%", up: true },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 sm:p-4 shadow-2xs">
            <div className="text-xs text-[#9CA3AF] mb-0.5">{k.label}</div>
            <div className="text-lg sm:text-xl font-bold text-[#111827]">{k.value}</div>
            <div className={`text-xs font-medium mt-0.5 ${k.up ? "text-[#16A34A]" : "text-[#DC2626]"}`}>{k.change} vs last month</div>
          </div>
        ))}
      </div>

      {/* Cash Flow Area Chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-sm text-[#111827]">Cash Inflow vs Outflow</h2>
            <p className="text-xs text-[#9CA3AF]">Monthly financial trends</p>
          </div>
          <div className="flex gap-4 text-xs text-[#6B7280]">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" /> Inflow</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#D85A30]" /> Outflow</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={cashFlow} margin={{ left: -20, right: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={fmt} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #E5E7EB", borderRadius: 6 }} />
            <Area type="monotone" dataKey="inflow" stroke="#16A34A" fill="#16A34A" fillOpacity={0.1} strokeWidth={2} />
            <Area type="monotone" dataKey="outflow" stroke="#D85A30" fill="#D85A30" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Expenses Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[#E5E7EB]">
          <h2 className="font-bold text-sm text-[#111827]">Recent Shop Expenses</h2>
          <span className="text-xs text-[#6B7280]">{expenses.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
                {["Date", "Category", "Vendor / Description", "Amount", "Account", "Receipt"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{e.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[e.category] || "bg-gray-100 text-gray-700"}`}>
                      {e.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-[#111827]">{e.vendor}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#111827] whitespace-nowrap">৳ {e.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{e.account}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    {e.receipt ? (
                      <span className="text-[#16A34A] font-semibold flex items-center gap-1">✓ Attached</span>
                    ) : (
                      <span className="text-[#9CA3AF]">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] text-base">Record New Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Expense Category</label>
                <select
                  value={newExp.category}
                  onChange={e => setNewExp({ ...newExp, category: e.target.value })}
                  className="w-full text-xs border rounded-lg px-3 py-2 bg-white"
                >
                  <option>Salary</option>
                  <option>Rent</option>
                  <option>Utility</option>
                  <option>Transportation</option>
                  <option>Marketing</option>
                  <option>Repairs</option>
                  <option>Miscellaneous</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Vendor / Payee Details *</label>
                <input
                  required
                  placeholder="e.g. Dhaka Electric Supply"
                  value={newExp.vendor}
                  onChange={e => setNewExp({ ...newExp, vendor: e.target.value })}
                  className="w-full text-xs border rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Amount (৳) *</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={newExp.amount}
                    onChange={e => setNewExp({ ...newExp, amount: e.target.value })}
                    className="w-full text-xs font-bold border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Paid From</label>
                  <select
                    value={newExp.account}
                    onChange={e => setNewExp({ ...newExp, account: e.target.value })}
                    className="w-full text-xs border rounded-lg px-3 py-2 bg-white"
                  >
                    <option>Cash</option>
                    <option>Bank (BRAC)</option>
                    <option>Bank (Dutch-Bangla)</option>
                    <option>Card</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="flex-1 border rounded-xl py-2 text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-[#D85A30] text-white rounded-xl py-2 text-xs font-bold">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
