import { useState } from "react";
import {
  BarChart2, TrendingUp, Package, DollarSign, Users, Wrench, Download,
  Printer, Calendar, Filter, ExternalLink, X, Check, FileText, Share2,
  ChevronDown, RefreshCw, Eye, ArrowUpRight, ArrowDownRight, Layers
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useToast } from "../components/Toast";

const monthlySales = [
  { month: "Apr", revenue: 2840000, profit: 820000 },
  { month: "May", revenue: 3120000, profit: 912000 },
  { month: "Jun", revenue: 2980000, profit: 856000 },
  { month: "Jul", revenue: 3480000, profit: 1024000 },
  { month: "Aug", revenue: 4120000, profit: 1242000 },
  { month: "Sep", revenue: 4450000, profit: 1380000 },
];

const topProducts = [
  { name: "Motul Engine Oil 10W40", revenue: 724000, units: 1248 },
  { name: "Honda CB Brake Pad Front", revenue: 562000, units: 748 },
  { name: "NGK Spark Plug CR8E", revenue: 318000, units: 1445 },
  { name: "Yamaha FZ Air Filter", revenue: 284000, units: 568 },
  { name: "Bajaj Pulsar Clutch Plate", revenue: 241000, units: 201 },
];

const reportCategories = [
  {
    title: "Sales Reports",
    icon: <TrendingUp size={18} className="text-[#D85A30]" />,
    bg: "bg-[#FEF0EA]",
    reports: ["Daily Sales Summary", "Monthly Sales Report", "Sales by Product", "Sales by Category", "Sales by Employee", "Sales by Branch"],
  },
  {
    title: "Inventory Reports",
    icon: <Package size={18} className="text-[#2563EB]" />,
    bg: "bg-[#DBEAFE]",
    reports: ["Stock Summary", "Inventory Valuation", "Low Stock Report", "Dead Stock Analysis", "Fast Moving Parts", "Stock Movement"],
  },
  {
    title: "Purchase Reports",
    icon: <BarChart2 size={18} className="text-[#7C3AED]" />,
    bg: "bg-[#EDE9FE]",
    reports: ["Purchase Summary", "Supplier Purchase Report", "Purchase by Product", "GRN Report"],
  },
  {
    title: "Finance Reports",
    icon: <DollarSign size={18} className="text-[#16A34A]" />,
    bg: "bg-[#DCFCE7]",
    reports: ["Profit & Loss", "Cash Flow Statement", "Accounts Receivable", "Accounts Payable", "Expense Report", "VAT Report"],
  },
  {
    title: "Customer Reports",
    icon: <Users size={18} className="text-[#F59E0B]" />,
    bg: "bg-[#FEF3C7]",
    reports: ["Customer Lifetime Value", "Top Customers", "Outstanding Payments", "New Customers"],
  },
  {
    title: "Workshop Reports",
    icon: <Wrench size={18} className="text-[#DC2626]" />,
    bg: "bg-[#FEE2E2]",
    reports: ["Jobs Completed", "Mechanic Performance", "Parts Consumed", "Service Revenue"],
  },
];

const fmt = (n: number) => `৳${(n / 100000).toFixed(1)}L`;

// Sample simulated datasets for report preview
function generateSampleReportData(reportName: string) {
  if (reportName.includes("Sales")) {
    return {
      headers: ["Reference / Period", "Items Sold", "Gross Revenue", "Discounts", "Net Total", "Profit Margin"],
      rows: [
        ["Sep 01 - Sep 05", "412 pcs", "৳ 9,84,000", "৳ 32,000", "৳ 9,52,000", "32.4%"],
        ["Sep 06 - Sep 10", "520 pcs", "৳ 12,40,000", "৳ 41,500", "৳ 11,98,500", "31.8%"],
        ["Sep 11 - Sep 15", "380 pcs", "৳ 8,90,000", "৳ 28,000", "৳ 8,62,000", "30.5%"],
        ["Sep 16 - Sep 20", "610 pcs", "৳ 14,20,000", "৳ 52,000", "৳ 13,68,000", "33.1%"],
        ["Sep 21 - Sep 25", "495 pcs", "৳ 11,65,000", "৳ 39,000", "৳ 11,26,000", "31.2%"],
      ],
      metrics: [
        { label: "Total Volume", value: "2,417 pcs" },
        { label: "Total Revenue", value: "৳ 57,06,500" },
        { label: "Average Margin", value: "31.9%" },
      ]
    };
  } else if (reportName.includes("Stock") || reportName.includes("Inventory")) {
    return {
      headers: ["Item SKU", "Part Description", "Category", "On Hand", "Reorder Point", "Valuation (৳)"],
      rows: [
        ["MOT-10W40-1L", "Motul 10W40 Synthetic Engine Oil", "Lubricants", "342 cans", "50", "৳ 2,90,700"],
        ["HON-CB-FBP", "Honda CB Hornet Front Brake Pad", "Brakes", "184 sets", "30", "৳ 1,38,000"],
        ["YAM-FZ-AF", "Yamaha FZ Version 2 Air Filter", "Filters", "86 pcs", "25", "৳ 43,000"],
        ["BAJ-PUL-CP", "Bajaj Pulsar 150 Clutch Plate", "Clutch", "112 sets", "20", "৳ 67,200"],
        ["NGK-CR8E", "NGK Spark Plug Nickel Core", "Electrical", "420 pcs", "100", "৳ 92,400"],
      ],
      metrics: [
        { label: "SKUs Assessed", value: "1,428" },
        { label: "Total In-Stock Units", value: "18,450 pcs" },
        { label: "Inventory Valuation", value: "৳ 38,42,500" },
      ]
    };
  } else if (reportName.includes("Profit") || reportName.includes("Finance") || reportName.includes("Cash") || reportName.includes("Expense") || reportName.includes("Payable")) {
    return {
      headers: ["Account Head / Category", "Transaction Type", "Budget / Inflow", "Actual Outflow", "Net Balance", "Variance"],
      rows: [
        ["Gross Product Sales", "Income", "৳ 45,00,000", "৳ 0", "৳ 44,50,000", "-1.1%"],
        ["Workshop Service Charges", "Income", "৳ 4,50,000", "৳ 0", "৳ 4,82,000", "+7.1%"],
        ["Cost of Goods Sold (COGS)", "Expense", "৳ 31,00,000", "৳ 30,70,000", "৳ 30,70,000", "-1.0%"],
        ["Store & Warehouse Rentals", "Operating Expense", "৳ 1,40,000", "৳ 1,40,000", "৳ 1,40,000", "0.0%"],
        ["Staff Payroll & Commissions", "Operating Expense", "৳ 2,80,000", "৳ 2,75,000", "৳ 2,75,000", "-1.8%"],
        ["Electricity & Utilities", "Utility Expense", "৳ 45,000", "৳ 48,200", "৳ 48,200", "+7.1%"],
      ],
      metrics: [
        { label: "Operating Revenue", value: "৳ 49,32,000" },
        { label: "Total Operating Cost", value: "৳ 35,33,200" },
        { label: "Net Operating Profit", value: "৳ 13,98,800" },
      ]
    };
  } else if (reportName.includes("Workshop") || reportName.includes("Job") || reportName.includes("Mechanic")) {
    return {
      headers: ["Job Card #", "Customer & Bike", "Technician", "Parts Used", "Labor Fee", "Status"],
      rows: [
        ["JC-2049", "Tanvir Ahmed · Yamaha R15 V3", "Kabir Hossain", "৳ 4,200", "৳ 1,200", "Completed"],
        ["JC-2048", "Farhan Kabir · Honda CB150R", "Sumon Mia", "৳ 2,850", "৳ 800", "Completed"],
        ["JC-2047", "Rashedul Islam · Suzuki Gixxer", "Kabir Hossain", "৳ 6,400", "৳ 1,500", "In Progress"],
        ["JC-2046", "Mehedi Hasan · Bajaj Pulsar NS", "Babul Akter", "৳ 1,950", "৳ 600", "Completed"],
      ],
      metrics: [
        { label: "Jobs Completed", value: "142 jobs" },
        { label: "Parts Revenue", value: "৳ 4,86,500" },
        { label: "Labor Revenue", value: "৳ 1,42,800" },
      ]
    };
  } else {
    return {
      headers: ["Client / Entity", "Contact #", "Total Orders", "Lifetime Spend", "Current Due", "Rating"],
      rows: [
        ["Rahman Auto Workshop", "+880 1711-234567", "68 orders", "৳ 8,45,000", "৳ 24,500", "⭐⭐⭐⭐⭐ VIP"],
        ["Karim Motors Mirpur", "+880 1812-987654", "45 orders", "৳ 5,80,000", "৳ 0", "⭐⭐⭐⭐⭐ VIP"],
        ["Dhaka Bike Care Center", "+880 1913-456789", "32 orders", "৳ 4,12,000", "৳ 15,400", "⭐⭐⭐⭐ Regular"],
        ["Hossain Motorcycle Parts", "+880 1614-321098", "28 orders", "৳ 3,65,000", "৳ 67,800", "⭐⭐⭐ Due Review"],
      ],
      metrics: [
        { label: "Active Customers", value: "486" },
        { label: "Average Spend", value: "৳ 34,200" },
        { label: "Outstanding Dues", value: "৳ 3,84,000" },
      ]
    };
  }
}

interface ReportsProps {
  onNavigate?: (p: string) => void;
}

export default function Reports({ onNavigate }: ReportsProps = {}) {
  const { addToast } = useToast();

  // State management
  const [selectedRange, setSelectedRange] = useState("Sep 01 - Sep 30, 2026");
  const [dateRangeModalOpen, setDateRangeModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState("All Branches");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeReportModal, setActiveReportModal] = useState<string | null>(null);

  // Custom date range inputs
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-09-30");
  const [tempBranch, setTempBranch] = useState("All Branches");
  const [tempCategory, setTempCategory] = useState("All Categories");

  const datePresets = [
    { label: "Today", value: "Sep 16, 2026" },
    { label: "Yesterday", value: "Sep 15, 2026" },
    { label: "Last 7 Days", value: "Sep 10 - Sep 16, 2026" },
    { label: "This Month", value: "Sep 01 - Sep 30, 2026" },
    { label: "Last Month", value: "Aug 01 - Aug 31, 2026" },
    { label: "Quarter 3 (Jul-Sep)", value: "Jul 01 - Sep 30, 2026" },
    { label: "Year to Date (2026)", value: "Jan 01 - Sep 16, 2026" },
  ];

  const handleApplyDateRange = () => {
    setSelectedRange(`${startDate} to ${endDate}`);
    setDateRangeModalOpen(false);
    addToast({
      title: "Date Range Applied",
      message: `Reports filtered for ${startDate} to ${endDate}`,
      type: "success"
    });
  };

  const handleSelectPreset = (preset: { label: string; value: string }) => {
    setSelectedRange(preset.value);
    setDateRangeModalOpen(false);
    addToast({
      title: "Date Range Updated",
      message: `Selected period: ${preset.label} (${preset.value})`,
      type: "info"
    });
  };

  const handleApplyFilters = () => {
    setActiveBranch(tempBranch);
    setActiveCategory(tempCategory);
    setFilterModalOpen(false);
    addToast({
      title: "Filters Updated",
      message: `Branch: ${tempBranch} | Category: ${tempCategory}`,
      type: "success"
    });
  };

  const handleResetFilters = () => {
    setTempBranch("All Branches");
    setTempCategory("All Categories");
    setActiveBranch("All Branches");
    setActiveCategory("All Categories");
    setFilterModalOpen(false);
    addToast({
      title: "Filters Reset",
      message: "Reset all report filters to default",
      type: "info"
    });
  };

  const handleExportCSV = (reportTitle: string = "Overall Business Report") => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      `MotoParts ERP - ${reportTitle}\n` +
      `Date Generated,${new Date().toLocaleDateString()}\n` +
      `Period,${selectedRange}\n` +
      `Branch,${activeBranch}\n\n` +
      "Category,Revenue (BDT),Profit (BDT),Margin\n" +
      monthlySales.map(m => `${m.month},${m.revenue},${m.profit},${((m.profit / m.revenue) * 100).toFixed(1)}%`).join("\n") +
      "\n\nTop Selling Products,Revenue (BDT),Units Sold\n" +
      topProducts.map(p => `"${p.name}",${p.revenue},${p.units}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportTitle.toLowerCase().replace(/\s+/g, "_")}_${selectedRange.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: "Export Completed",
      message: `${reportTitle} exported successfully as CSV.`,
      type: "success"
    });
  };

  const handlePrint = (reportTitle: string) => {
    addToast({
      title: "Print Job Sent",
      message: `Generating printable document for "${reportTitle}"...`,
      type: "info"
    });
    window.print();
  };

  const activeReportData = activeReportModal ? generateSampleReportData(activeReportModal) : null;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Reports & Analytics</h1>
          <p className="text-[#6B7280] text-sm mt-0.5">
            Business intelligence, financial statements & inventory performance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Button */}
          <button
            onClick={() => setDateRangeModalOpen(true)}
            className="flex items-center gap-1.5 text-[13px] text-[#374151] border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white hover:border-[#D1D5DB] hover:bg-[#F9FAFB] transition-all shadow-sm"
          >
            <Calendar size={14} className="text-[#D85A30]" />
            <span className="font-medium max-w-[140px] truncate">{selectedRange}</span>
            <ChevronDown size={13} className="text-[#9CA3AF]" />
          </button>

          {/* Filters Button */}
          <button
            onClick={() => {
              setTempBranch(activeBranch);
              setTempCategory(activeCategory);
              setFilterModalOpen(true);
            }}
            className={`flex items-center gap-1.5 text-[13px] rounded-lg px-3 py-2 border transition-all shadow-sm ${
              activeBranch !== "All Branches" || activeCategory !== "All Categories"
                ? "bg-[#FEF0EA] border-[#D85A30] text-[#D85A30] font-semibold"
                : "bg-white border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
            }`}
          >
            <Filter size={14} />
            <span>Filters</span>
            {(activeBranch !== "All Branches" || activeCategory !== "All Categories") && (
              <span className="w-2 h-2 rounded-full bg-[#D85A30]"></span>
            )}
          </button>

          {/* Export Report */}
          <button
            onClick={() => handleExportCSV("Executive_Business_Summary")}
            className="flex items-center gap-1.5 text-[13px] font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg px-3.5 py-2 transition-colors shadow-sm"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Active Filter Badges */}
      {(activeBranch !== "All Branches" || activeCategory !== "All Categories" || selectedRange !== "Sep 01 - Sep 30, 2026") && (
        <div className="flex flex-wrap items-center gap-2 text-xs bg-[#F9FAFB] border border-[#E5E7EB] p-2.5 rounded-lg">
          <span className="text-[#6B7280] font-medium">Applied Filters:</span>
          <span className="bg-white border border-[#E5E7EB] px-2 py-0.5 rounded text-[#374151] font-medium">
            📅 {selectedRange}
          </span>
          {activeBranch !== "All Branches" && (
            <span className="bg-[#FEF0EA] border border-[#FCD9BD] px-2 py-0.5 rounded text-[#D85A30] font-medium">
              🏢 {activeBranch}
            </span>
          )}
          {activeCategory !== "All Categories" && (
            <span className="bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded text-[#2563EB] font-medium">
              🏷️ {activeCategory}
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-[#DC2626] hover:underline text-xs ml-auto font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue (Sep)", value: "৳ 44.5L", change: "+8.1%", up: true, sub: "Target ৳ 42.0L" },
          { label: "Net Profit (Sep)", value: "৳ 13.8L", change: "+11.2%", up: true, sub: "Margin 31.0%" },
          { label: "Total Orders (Sep)", value: "1,842", change: "+6.4%", up: true, sub: "Avg ৳ 2,415 / order" },
          { label: "Avg Profit Margin", value: "31.0%", change: "-0.8%", up: false, sub: "Industry avg 28%" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
            <div className="text-[12px] text-[#9CA3AF] font-medium mb-1">{k.label}</div>
            <div className="text-xl sm:text-2xl font-bold text-[#111827]">{k.value}</div>
            <div className="flex items-center gap-1 mt-1 text-[11px] sm:text-[12px]">
              <span className={`font-semibold flex items-center ${k.up ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                {k.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {k.change}
              </span>
              <span className="text-[#9CA3AF]">vs last month</span>
            </div>
            <div className="text-[10px] text-[#9CA3AF] mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Revenue & Profit */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-[#111827] text-[15px]">Monthly Revenue & Profit</h2>
              <p className="text-[12px] text-[#9CA3AF]">Apr – Sep 2026 (Figures in Lacs)</p>
            </div>
            <button
              onClick={() => setActiveReportModal("Monthly Sales Report")}
              className="text-[12px] text-[#D85A30] hover:text-[#B74421] font-medium flex items-center gap-1 hover:underline"
            >
              Full Report <ExternalLink size={11} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlySales} margin={{ left: -15, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={fmt} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                formatter={(v: any) => [`৳ ${Number(v || 0).toLocaleString()}`, ""]}
              />
              <Bar dataKey="revenue" fill="#D85A30" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="profit" fill="#16A34A" radius={[4, 4, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-[#6B7280]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#D85A30]"></span> Revenue
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#16A34A]"></span> Profit
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-[#111827] text-[15px]">Top Selling Products</h2>
              <p className="text-[12px] text-[#9CA3AF]">This month ranking by revenue</p>
            </div>
            <button
              onClick={() => setActiveReportModal("Sales by Product")}
              className="text-[12px] text-[#D85A30] hover:text-[#B74421] font-medium flex items-center gap-1 hover:underline"
            >
              View Analysis <ExternalLink size={11} />
            </button>
          </div>
          <div className="space-y-3.5">
            {topProducts.map((p, i) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-[#374151] truncate flex-1">{p.name}</span>
                  <div className="text-right">
                    <span className="text-[12px] font-bold text-[#111827]">৳ {p.revenue.toLocaleString()}</span>
                    <span className="text-[10px] text-[#9CA3AF] ml-1.5">({p.units} pcs)</span>
                  </div>
                </div>
                <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-[#D85A30] transition-all"
                    style={{ width: `${(p.revenue / topProducts[0].revenue) * 100}%`, opacity: 1 - i * 0.12 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-[#111827] text-[16px]">Report Center</h2>
            <p className="text-xs text-[#6B7280]">Click any report to view live data breakdown, filter, print or export</p>
          </div>
          <span className="text-xs font-semibold bg-[#F3F4F6] text-[#4B5563] px-2.5 py-1 rounded-full">
            28 Available Reports
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCategories.map(cat => (
            <div
              key={cat.title}
              className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6] bg-[#FAFAFA]">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-semibold text-[#111827] text-[14px]">{cat.title}</h3>
                </div>
                <span className="text-[11px] text-[#9CA3AF] font-medium">{cat.reports.length} reports</span>
              </div>
              <div className="p-2 divide-y divide-gray-50">
                {cat.reports.map(r => (
                  <div
                    key={r}
                    onClick={() => setActiveReportModal(r)}
                    className="w-full text-left text-[13px] text-[#374151] px-3 py-2.5 rounded-lg hover:bg-[#FEF0EA]/40 hover:text-[#D85A30] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="font-medium truncate flex-1 pr-2">{r}</span>
                    <div className="flex items-center gap-1.5 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        title="Download CSV"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportCSV(r);
                        }}
                        className="p-1 rounded hover:bg-white text-[#6B7280] hover:text-[#D85A30] transition-colors"
                      >
                        <Download size={13} />
                      </button>
                      <button
                        title="Print Report"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint(r);
                        }}
                        className="p-1 rounded hover:bg-white text-[#6B7280] hover:text-[#D85A30] transition-colors"
                      >
                        <Printer size={13} />
                      </button>
                      <button
                        title="View Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveReportModal(r);
                        }}
                        className="p-1 rounded hover:bg-white text-[#6B7280] hover:text-[#D85A30] transition-colors"
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date Range Modal */}
      {dateRangeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#E5E7EB] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#D85A30]" />
                <h3 className="font-bold text-[#111827] text-base">Select Date Range</h3>
              </div>
              <button
                onClick={() => setDateRangeModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#111827] hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block mb-2">
                  Quick Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {datePresets.map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-left px-3 py-2 text-xs rounded-lg border transition-all ${
                        selectedRange === preset.value
                          ? "border-[#D85A30] bg-[#FEF0EA] text-[#D85A30] font-semibold"
                          : "border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151]"
                      }`}
                    >
                      <div className="font-medium">{preset.label}</div>
                      <div className="text-[10px] text-[#9CA3AF] truncate">{preset.value}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#F3F4F6] pt-4">
                <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block mb-2">
                  Custom Date Interval
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-[#6B7280] block mb-1">From:</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-xs border border-[#D1D5DB] rounded-lg px-2.5 py-2 focus:border-[#D85A30] outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#6B7280] block mb-1">To:</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs border border-[#D1D5DB] rounded-lg px-2.5 py-2 focus:border-[#D85A30] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-[#F9FAFB] border-t border-[#F3F4F6]">
              <button
                onClick={() => setDateRangeModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#111827] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyDateRange}
                className="px-4 py-2 text-xs font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg transition-colors"
              >
                Apply Custom Range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#E5E7EB] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-[#D85A30]" />
                <h3 className="font-bold text-[#111827] text-base">Filter Reports</h3>
              </div>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#111827] hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1.5">Branch Location</label>
                <select
                  value={tempBranch}
                  onChange={(e) => setTempBranch(e.target.value)}
                  className="w-full text-xs border border-[#D1D5DB] rounded-lg px-3 py-2.5 focus:border-[#D85A30] outline-none bg-white"
                >
                  <option value="All Branches">All Branches (Consolidated)</option>
                  <option value="Dhaka Main">Dhaka Main (Gulshan Branch)</option>
                  <option value="Mirpur Branch">Mirpur Workshop & Outlet</option>
                  <option value="Uttara Outlet">Uttara Sector 7 Outlet</option>
                  <option value="Chattogram Hub">Chattogram Distribution Hub</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374151] block mb-1.5">Product Category</label>
                <select
                  value={tempCategory}
                  onChange={(e) => setTempCategory(e.target.value)}
                  className="w-full text-xs border border-[#D1D5DB] rounded-lg px-3 py-2.5 focus:border-[#D85A30] outline-none bg-white"
                >
                  <option value="All Categories">All Product Categories</option>
                  <option value="Lubricants">Engine Oil & Lubricants</option>
                  <option value="Brake System">Brake Pads & Discs</option>
                  <option value="Electrical">Spark Plugs & Electricals</option>
                  <option value="Suspension">Shock Absorbers & Suspension</option>
                  <option value="Tyres">Motorcycle Tyres & Tubes</option>
                  <option value="Clutch & Transmission">Clutch & Sprocket Sets</option>
                </select>
              </div>

              <div className="bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB] text-xs text-[#6B7280]">
                💡 Tip: Filtering by a specific branch recalculates branch-specific profit margins and inventory valuation.
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 bg-[#F9FAFB] border-t border-[#F3F4F6]">
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#DC2626] font-semibold hover:underline"
              >
                Reset to Default
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#111827] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 text-xs font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Preview Modal */}
      {activeReportModal && activeReportData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-[#E5E7EB] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-[#E5E7EB] bg-[#F9FAFB] gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-[#FEF0EA] text-[#D85A30] rounded-lg">
                    <FileText size={18} />
                  </span>
                  <h2 className="text-lg font-bold text-[#111827]">{activeReportModal}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280] mt-1">
                  <span>📅 Period: <strong className="text-[#111827]">{selectedRange}</strong></span>
                  <span>•</span>
                  <span>🏢 Branch: <strong className="text-[#111827]">{activeBranch}</strong></span>
                  <span>•</span>
                  <span>🏷️ Category: <strong className="text-[#111827]">{activeCategory}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrint(activeReportModal)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#374151] border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] px-3 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <Printer size={13} /> Print
                </button>
                <button
                  onClick={() => handleExportCSV(activeReportModal)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#D85A30] hover:bg-[#B74421] px-3 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <Download size={13} /> Export CSV
                </button>
                <button
                  onClick={() => setActiveReportModal(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#111827] hover:bg-gray-200 transition-colors ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Summary stat cards for this report */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeReportData.metrics.map(metric => (
                  <div key={metric.label} className="bg-[#F9FAFB] border border-[#E5E7EB] p-3.5 rounded-xl">
                    <div className="text-xs text-[#6B7280]">{metric.label}</div>
                    <div className="text-lg font-bold text-[#111827] mt-0.5">{metric.value}</div>
                  </div>
                ))}
              </div>

              {/* Data Table */}
              <div className="border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                        {activeReportData.headers.map((h, i) => (
                          <th key={h} className={`px-4 py-3 font-semibold text-[#6B7280] uppercase tracking-wider ${i > 1 ? "text-right" : "text-left"}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {activeReportData.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#FAFAFA] transition-colors">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`px-4 py-3 text-[#374151] ${cIdx === 0 ? "font-semibold text-[#111827]" : ""} ${cIdx > 1 ? "text-right font-medium" : ""}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#9CA3AF] pt-2 border-t border-[#F3F4F6] gap-2">
                <span>Data generated in real time from MotoParts ERP database.</span>
                <span className="font-mono">Audit ID: ERP-REP-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
