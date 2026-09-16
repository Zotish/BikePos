import { useState } from "react";
import {
  ArrowUpRight, ArrowDownRight, AlertTriangle, ShoppingCart, Package,
  TrendingUp, DollarSign, Users, RotateCcw, ArrowLeftRight,
  Receipt, ExternalLink, X, Check, Printer, FileText, ChevronRight
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { useToast } from "../components/Toast";

const initialSalesData = [
  { day: "Sep 1", revenue: 142000, cost: 98000, profit: 44000 },
  { day: "Sep 3", revenue: 189000, cost: 125000, profit: 64000 },
  { day: "Sep 5", revenue: 156000, cost: 104000, profit: 52000 },
  { day: "Sep 7", revenue: 224000, cost: 148000, profit: 76000 },
  { day: "Sep 9", revenue: 198000, cost: 132000, profit: 66000 },
  { day: "Sep 11", revenue: 267000, cost: 174000, profit: 93000 },
  { day: "Sep 13", revenue: 245000, cost: 162000, profit: 83000 },
  { day: "Sep 15", revenue: 312000, cost: 201000, profit: 111000 },
  { day: "Sep 17", revenue: 289000, cost: 188000, profit: 101000 },
  { day: "Sep 19", revenue: 334000, cost: 216000, profit: 118000 },
  { day: "Sep 21", revenue: 298000, cost: 194000, profit: 104000 },
  { day: "Sep 23", revenue: 378000, cost: 241000, profit: 137000 },
  { day: "Sep 25", revenue: 356000, cost: 228000, profit: 128000 },
  { day: "Sep 27", revenue: 412000, cost: 261000, profit: 151000 },
  { day: "Sep 29", revenue: 389000, cost: 248000, profit: 141000 },
  { day: "Sep 30", revenue: 445000, cost: 283000, profit: 162000 },
];

const categoryData = [
  { name: "Engine Parts", value: 32, color: "#D85A30" },
  { name: "Brake System", value: 18, color: "#243B53" },
  { name: "Electrical", value: 14, color: "#2563EB" },
  { name: "Suspension", value: 11, color: "#16A34A" },
  { name: "Lubricants", value: 9, color: "#F59E0B" },
  { name: "Tyres", value: 8, color: "#7C3AED" },
  { name: "Body Parts", value: 5, color: "#DB2777" },
  { name: "Accessories", value: 3, color: "#9CA3AF" },
];

const branchData = [
  { branch: "Dhaka Main", revenue: 1240000, profit: 342000 },
  { branch: "Mirpur", revenue: 856000, profit: 218000 },
  { branch: "Uttara", revenue: 698000, profit: 189000 },
  { branch: "Chattogram", revenue: 524000, profit: 143000 },
];

const topParts = [
  { name: "Honda CB Hornet Brake Pad (Front)", part: "HBP-CBH-160F", qty: 248, revenue: "186,000", profit: "52,080", img: "🔧", inStock: 48, cost: "৳ 540", price: "৳ 750" },
  { name: "Motul Engine Oil 10W40 1L", part: "MOT-10W40-1L", qty: 312, revenue: "156,000", profit: "46,800", img: "🛢️", inStock: 85, cost: "৳ 650", price: "৳ 850" },
  { name: "Yamaha FZ Air Filter", part: "YAM-FZ-AF01", qty: 189, revenue: "94,500", profit: "28,350", img: "🔩", inStock: 32, cost: "৳ 350", price: "৳ 500" },
  { name: "Bajaj Pulsar Clutch Plate", part: "BAJ-PUL-CP01", qty: 143, revenue: "85,800", profit: "25,740", img: "⚙️", inStock: 19, cost: "৳ 420", price: "৳ 600" },
  { name: "Suzuki Gixxer Chain Sprocket Kit", part: "SUZ-GIX-CSK", qty: 97, revenue: "77,600", profit: "23,280", img: "⛓️", inStock: 14, cost: "৳ 560", price: "৳ 800" },
];

const initialLowStockItems = [
  { name: "TVS Apache Spark Plug", sku: "TVS-AP-SP01", stock: 4, reorder: 20, supplier: "Auto Parts BD", img: "⚡", unitCost: 180 },
  { name: "KTM Duke Air Filter", sku: "KTM-DK-AF01", stock: 2, reorder: 15, supplier: "MotoImport Ltd", img: "🔩", unitCost: 450 },
  { name: "Honda CB Piston Ring Set", sku: "HON-CB-PRS01", stock: 1, reorder: 10, supplier: "Honda BD", img: "🔧", unitCost: 1200 },
  { name: "Yamaha R15 Chain Set", sku: "YAM-R15-CS01", stock: 3, reorder: 12, supplier: "Yamaha BD", img: "⛓️", unitCost: 950 },
];

const recentTransactions = [
  { id: "INV-20482", customer: "Rahman Auto Workshop", amount: "৳ 24,500", status: "Paid", time: "12 min ago", method: "bKash Merchant", items: "Motul Oil x12, Spark Plug x8" },
  { id: "INV-20481", customer: "Karim Motors", amount: "৳ 8,750", status: "Paid", time: "34 min ago", method: "Cash", items: "FZ Air Filter x5, Brake Pad x2" },
  { id: "INV-20480", customer: "Walk-in Customer", amount: "৳ 2,200", status: "Paid", time: "1h ago", method: "Cash", items: "Engine Oil 1L x2" },
  { id: "INV-20479", customer: "Hossain Trading", amount: "৳ 67,800", status: "Partial", time: "2h ago", method: "Bank Transfer", items: "Bulk Chains & Sprockets x20" },
  { id: "INV-20478", customer: "Dhaka Bike Shop", amount: "৳ 15,400", status: "Due", time: "3h ago", method: "Credit / Ledger", items: "Clutch Plates x10" },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-[#DCFCE7] text-[#16A34A]",
  Partial: "bg-[#FEF3C7] text-[#D97706]",
  Due: "bg-[#FEE2E2] text-[#DC2626]",
};

const fmt = (n: number) => `৳ ${(n / 1000).toFixed(0)}K`;

interface Props {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: Props) {
  const { addToast } = useToast();

  const [activeTimeframe, setActiveTimeframe] = useState("This Month");
  const [lowStockItems, setLowStockItems] = useState(initialLowStockItems);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<(typeof topParts)[0] | null>(null);
  const [selectedTx, setSelectedTx] = useState<(typeof recentTransactions)[0] | null>(null);
  const [reorderItem, setReorderItem] = useState<(typeof initialLowStockItems)[0] | null>(null);
  const [reorderQty, setReorderQty] = useState(20);

  // Timeframe multiplier for dynamic data changes
  const multiplier =
    activeTimeframe === "Today" ? 0.12 :
    activeTimeframe === "7 Days" ? 0.35 :
    activeTimeframe === "30 Days" ? 0.95 : 1.0;

  const kpis = [
    {
      label: "Sales",
      value: `৳ ${Math.round(445000 * multiplier).toLocaleString()}`,
      change: "+18.2%",
      up: true,
      sub: `vs previous ৳ ${Math.round(376000 * multiplier).toLocaleString()}`,
    },
    {
      label: "Profit",
      value: `৳ ${Math.round(162000 * multiplier).toLocaleString()}`,
      change: "+12.4%",
      up: true,
      sub: "36.4% gross margin",
    },
    {
      label: "Orders",
      value: `${Math.round(84 * multiplier) || 12}`,
      change: "+7",
      up: true,
      sub: "Avg ৳ 5,290 / order",
    },
    {
      label: "Stock Value",
      value: "৳ 38.4L",
      change: "-2.1%",
      up: false,
      sub: "4,218 SKUs tracked",
    },
    {
      label: "Receivables",
      value: "৳ 8,72,000",
      change: "+3 due",
      up: false,
      sub: "18 invoices pending",
    },
    {
      label: "Low Stock",
      value: `${lowStockItems.length}`,
      change: "Critical",
      up: false,
      sub: "Action required",
    },
  ];


  const handleTimeframeChange = (tf: string) => {
    setActiveTimeframe(tf);
    addToast({
      title: "Timeframe Updated",
      message: `Dashboard data recalculated for: ${tf}`,
      type: "info"
    });
  };

  const handleConfirmReorder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reorderItem) return;

    addToast({
      title: "Purchase Order Created",
      message: `Reordered ${reorderQty} units of ${reorderItem.name} from ${reorderItem.supplier}`,
      type: "success"
    });

    // Remove from local alert or update stock
    setLowStockItems(prev => prev.filter(item => item.sku !== reorderItem.sku));
    setReorderItem(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["Today", "7 Days", "30 Days", "This Month"].map(f => (
            <button
              key={f}
              onClick={() => handleTimeframeChange(f)}
              className={`text-[13px] px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTimeframe === f
                  ? "bg-[#D85A30] text-white shadow-sm font-semibold"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 bg-white border border-[#E5E7EB]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map(k => (
          <div
            key={k.label}
            className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 hover:shadow-md transition-all shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[13px] sm:text-sm font-bold text-[#111827] truncate">
                {k.label}
              </span>
              <span
                className={`text-[11px] font-bold flex-shrink-0 ${
                  k.up ? "text-[#16A34A]" : "text-[#D85A30]"
                }`}
              >
                {k.change}
              </span>
            </div>
            <div>
              <div className="text-base sm:text-[17px] font-bold text-[#111827] leading-tight">
                {k.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales area chart */}
        <div className="xl:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h2 className="font-semibold text-[#111827] text-[15px]">Sales Overview</h2>
              <p className="text-[12px] text-[#9CA3AF]">
                Revenue, cost and profit trend ({activeTimeframe})
              </p>
            </div>
            <div className="flex gap-4">
              {[
                { label: "Revenue", color: "#D85A30" },
                { label: "Cost", color: "#E5E7EB" },
                { label: "Profit", color: "#16A34A" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={initialSalesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D85A30" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#D85A30" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={fmt} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(v: any) => [`৳ ${Number(v || 0).toLocaleString()}`, ""]}
              />
              <Area type="monotone" dataKey="cost" stroke="#E5E7EB" strokeWidth={1.5} fill="none" />
              <Area type="monotone" dataKey="profit" stroke="#16A34A" strokeWidth={2} fill="url(#profit)" />
              <Area type="monotone" dataKey="revenue" stroke="#D85A30" strokeWidth={2} fill="url(#revenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-0.5">
            <h2 className="font-semibold text-[#111827] text-[15px]">Sales by Category</h2>
            <button
              onClick={() => onNavigate("reports")}
              className="text-xs text-[#D85A30] hover:underline font-medium"
            >
              Report
            </button>
          </div>
          <p className="text-[12px] text-[#9CA3AF] mb-3">Portfolio revenue distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 11, border: "1px solid #E5E7EB", borderRadius: 6 }}
                formatter={v => [`${v}%`, "Share"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryData.slice(0, 5).map(c => (
              <div key={c.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span className="text-[12px] text-[#6B7280] flex-1">{c.name}</span>
                <span className="text-[12px] font-semibold text-[#111827]">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top parts */}
        <div className="xl:col-span-2 bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="font-semibold text-[#111827] text-[15px]">Top Selling Parts</h2>
            <button
              onClick={() => onNavigate("products")}
              className="text-[12px] text-[#D85A30] font-semibold hover:underline flex items-center gap-1"
            >
              View all inventory <ExternalLink size={11} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
                  {["Product", "Part #", "Qty", "Revenue (৳)", "Profit (৳)", "Action"].map(h => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 sm:px-5 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9FAFB]">
                {topParts.map(p => (
                  <tr
                    key={p.part}
                    onClick={() => setSelectedProduct(p)}
                    className="hover:bg-[#FEF0EA]/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 sm:px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg w-7 flex-shrink-0">{p.img}</span>
                        <div>
                          <div className="text-[13px] font-medium text-[#111827] group-hover:text-[#D85A30] transition-colors truncate max-w-[200px]">
                            {p.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-[12px] text-[#6B7280] font-mono whitespace-nowrap">{p.part}</td>
                    <td className="px-4 sm:px-5 py-3 text-[13px] font-semibold text-[#111827] whitespace-nowrap">{p.qty}</td>
                    <td className="px-4 sm:px-5 py-3 text-[13px] text-[#111827] whitespace-nowrap">{p.revenue}</td>
                    <td className="px-4 sm:px-5 py-3 text-[13px] font-semibold text-[#16A34A] whitespace-nowrap">{p.profit}</td>
                    <td className="px-4 sm:px-5 py-3 text-[11px] whitespace-nowrap">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedProduct(p);
                        }}
                        className="text-[#D85A30] hover:underline font-medium cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="font-semibold text-[#111827] text-[15px]">Recent Transactions</h2>
            <button
              onClick={() => onNavigate("sales-list")}
              className="text-[12px] text-[#D85A30] font-semibold hover:underline"
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-[#F3F4F6]">
            {recentTransactions.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTx(t)}
                className="px-5 py-3 hover:bg-[#FAFAFA] transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[12px] font-mono text-[#D85A30] font-semibold group-hover:underline">
                    {t.id}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[t.status]}`}>
                    {t.status}
                  </span>
                </div>
                <div className="text-[13px] font-medium text-[#111827] truncate">{t.customer}</div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[13px] font-bold text-[#111827]">{t.amount}</span>
                  <span className="text-[11px] text-[#9CA3AF]">{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Low stock */}
        <div className="xl:col-span-2 bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-[#111827] text-[15px]">Low Stock</h2>
            </div>
            <button
              onClick={() => onNavigate("reorder")}
              className="text-[12px] text-[#D85A30] font-semibold hover:underline"
            >
              Reorder all ({lowStockItems.length})
            </button>
          </div>
          <div className="divide-y divide-[#F9FAFB]">
            {lowStockItems.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#16A34A]">
                🎉 All low stock items have been reordered!
              </div>
            ) : (
              lowStockItems.map(item => (
                <div
                  key={item.sku}
                  className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-[#FAFAFA] transition-colors"
                >
                  <span className="text-2xl w-8 flex-shrink-0">{item.img}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#111827] truncate">{item.name}</div>
                    <div className="text-[11px] text-[#9CA3AF] font-mono">
                      {item.sku} · {item.supplier}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[13px] font-bold text-[#DC2626]">{item.stock} left</div>
                    <div className="text-[11px] text-[#9CA3AF]">min {item.reorder}</div>
                  </div>
                  <button
                    onClick={() => {
                      setReorderItem(item);
                      setReorderQty(item.reorder * 2);
                    }}
                    className="bg-[#D85A30] hover:bg-[#B74421] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 shadow-sm"
                  >
                    Reorder
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Branch performance */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-[#111827] text-[15px] mb-3">Branch Performance</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={branchData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="branch" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 9, fill: "#9CA3AF" }}
                  tickFormatter={v => `${(v / 100000).toFixed(1)}L`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ fontSize: 11, border: "1px solid #E5E7EB", borderRadius: 6 }}
                  formatter={(v: any) => [`৳ ${Number(v || 0).toLocaleString()}`, ""]}
                />
                <Bar dataKey="revenue" fill="#D85A30" radius={[3, 3, 0, 0]} name="Revenue" />
                <Bar dataKey="profit" fill="#16A34A" radius={[3, 3, 0, 0]} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-[#6B7280]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#D85A30]"></span> Revenue
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#16A34A]"></span> Profit
            </div>
          </div>
        </div>
      </div>



      {/* Product Quick Inspect Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#E5E7EB] animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedProduct.img}</span>
                <div>
                  <h3 className="font-bold text-sm text-[#111827]">{selectedProduct.name}</h3>
                  <p className="text-xs text-[#6B7280] font-mono">{selectedProduct.part}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-[#9CA3AF] hover:text-[#111827] p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4 text-xs">
              <div className="bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                <div className="text-[#9CA3AF]">Current Stock</div>
                <div className="text-base font-bold text-[#111827]">{selectedProduct.inStock} units</div>
              </div>
              <div className="bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                <div className="text-[#9CA3AF]">Units Sold (Period)</div>
                <div className="text-base font-bold text-[#D85A30]">{selectedProduct.qty} sold</div>
              </div>
              <div className="bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                <div className="text-[#9CA3AF]">Unit Purchase Cost</div>
                <div className="text-base font-bold text-[#111827]">{selectedProduct.cost}</div>
              </div>
              <div className="bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                <div className="text-[#9CA3AF]">Selling Price</div>
                <div className="text-base font-bold text-[#16A34A]">{selectedProduct.price}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6] gap-2">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  onNavigate("products");
                }}
                className="text-xs font-semibold text-[#243B53] hover:underline"
              >
                Open in Products & Inventory →
              </button>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  onNavigate("pos");
                }}
                className="bg-[#D85A30] hover:bg-[#B74421] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Sell at POS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Quick Inspect Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#E5E7EB] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#D85A30]" />
                <h3 className="font-bold text-sm text-[#111827]">{selectedTx.id}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[selectedTx.status]}`}>
                  {selectedTx.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-[#9CA3AF] hover:text-[#111827] p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#6B7280]">Customer</span>
                <span className="font-semibold text-[#111827]">{selectedTx.customer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#6B7280]">Items Included</span>
                <span className="font-medium text-[#111827] text-right">{selectedTx.items}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#6B7280]">Payment Method</span>
                <span className="font-medium text-[#111827]">{selectedTx.method}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-[#6B7280]">Timestamp</span>
                <span className="text-[#9CA3AF]">{selectedTx.time}</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold">
                <span>Total Amount</span>
                <span className="text-[#D85A30]">{selectedTx.amount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F3F4F6]">
              <button
                onClick={() => {
                  window.print();
                  addToast({ title: "Printing Invoice", message: `Sent ${selectedTx.id} to printer`, type: "info" });
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]"
              >
                <Printer size={13} /> Print Slip
              </button>
              <button
                onClick={() => {
                  setSelectedTx(null);
                  onNavigate("sales-list");
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg transition-colors"
              >
                Open Full Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Reorder Modal */}
      {reorderItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmReorder}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#E5E7EB] animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#DC2626]" />
                <h3 className="font-bold text-sm text-[#111827]">Quick Reorder Part</h3>
              </div>
              <button
                type="button"
                onClick={() => setReorderItem(null)}
                className="text-[#9CA3AF] hover:text-[#111827] p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="bg-[#FEF0EA] p-3 rounded-lg text-[#D85A30]">
                <div className="font-semibold text-sm">{reorderItem.name}</div>
                <div className="text-[11px] font-mono text-[#D85A30]/80">{reorderItem.sku}</div>
                <div className="mt-1 text-[11px]">
                  Current Stock: <strong>{reorderItem.stock}</strong> | Minimum Threshold: <strong>{reorderItem.reorder}</strong>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#6B7280] block mb-1">Supplier</label>
                <input
                  type="text"
                  readOnly
                  value={reorderItem.supplier}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#374151]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7280] block mb-1">Reorder Quantity</label>
                  <input
                    type="number"
                    min={5}
                    value={reorderQty}
                    onChange={e => setReorderQty(parseInt(e.target.value) || 0)}
                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs focus:border-[#D85A30] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7280] block mb-1">Unit Cost (BDT)</label>
                  <input
                    type="text"
                    readOnly
                    value={`৳ ${reorderItem.unitCost}`}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#374151]"
                  />
                </div>
              </div>

              <div className="bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB] flex items-center justify-between text-xs">
                <span className="font-medium text-[#6B7280]">Total Purchase Estimated:</span>
                <span className="text-sm font-bold text-[#D85A30]">৳ {(reorderQty * reorderItem.unitCost).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F3F4F6]">
              <button
                type="button"
                onClick={() => setReorderItem(null)}
                className="px-4 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#111827] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg transition-colors shadow-sm"
              >
                Confirm Purchase Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
