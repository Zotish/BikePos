import { useState } from "react";
import {
  Bell, Package, ShoppingCart, CreditCard, AlertTriangle, Shield,
  ArrowLeftRight, Tag, CheckCircle, CheckCheck, X
} from "lucide-react";
import { useToast } from "../components/Toast";

interface NotificationItem {
  id: number;
  type: string;
  category: "Inventory" | "Sales" | "Payments" | "System";
  icon: React.ReactNode;
  bg: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const initialNotifications: NotificationItem[] = [
  { id: 1, type: "Low Stock", category: "Inventory", icon: <AlertTriangle size={15} className="text-[#D97706]" />, bg: "bg-[#FEF3C7]", title: "TVS Apache Spark Plug running low", body: "SKU: TVS-AP-SP01 has only 4 units left. Reorder level is 20.", time: "8 min ago", unread: true },
  { id: 2, type: "Inventory", category: "Inventory", icon: <Package size={15} className="text-[#DC2626]" />, bg: "bg-[#FEE2E2]", title: "KTM Duke 200 Shock Absorber — Out of Stock", body: "SKU: KTM-DK200-RSA is now out of stock. 2 pending orders affected.", time: "22 min ago", unread: true },
  { id: 3, type: "Sales", category: "Sales", icon: <ShoppingCart size={15} className="text-[#16A34A]" />, bg: "bg-[#DCFCE7]", title: "Large sale completed — INV-20482", body: "৳ 24,500 sale by Kamal Hossain for Rahman Auto Workshop.", time: "35 min ago", unread: true },
  { id: 4, type: "Payment", category: "Payments", icon: <CreditCard size={15} className="text-[#2563EB]" />, bg: "bg-[#DBEAFE]", title: "Payment overdue — Dhaka Bike Shop", body: "Invoice INV-20479 for ৳ 15,400 is 1 day overdue. Last reminder sent.", time: "1h ago", unread: true },
  { id: 5, type: "Warranty", category: "System", icon: <Shield size={15} className="text-[#7C3AED]" />, bg: "bg-[#EDE9FE]", title: "New warranty claim — WC-0089", body: "Customer Rafi Islam raised a claim for Honda CB Hornet Brake Pad.", time: "2h ago", unread: false },
  { id: 6, type: "Transfer", category: "Inventory", icon: <ArrowLeftRight size={15} className="text-[#D85A30]" />, bg: "bg-[#FEF0EA]", title: "Stock transfer request — TRF-0219", body: "Mirpur branch requested 10 units of Motul 10W40 from Dhaka Main.", time: "3h ago", unread: false },
  { id: 7, type: "Sales", category: "Sales", icon: <Tag size={15} className="text-[#F59E0B]" />, bg: "bg-[#FEF3C7]", title: "Large discount applied — 25%", body: "Salesperson Reza Mia applied a 25% discount on INV-20481. Requires approval.", time: "4h ago", unread: false },
  { id: 8, type: "System", category: "System", icon: <CheckCircle size={15} className="text-[#16A34A]" />, bg: "bg-[#DCFCE7]", title: "Purchase order PO-1048 confirmed", body: "Honda Bangladesh Ltd. confirmed PO-1048. Expected delivery Sep 17, 2026.", time: "5h ago", unread: false },
  { id: 9, type: "Inventory", category: "Inventory", icon: <AlertTriangle size={15} className="text-[#D97706]" />, bg: "bg-[#FEF3C7]", title: "Honda CB Piston Ring Set — Critical Low", body: "SKU: HON-CB-PRS01 has only 1 unit remaining. Immediate reorder needed.", time: "6h ago", unread: false },
  { id: 10, type: "Payment", category: "Payments", icon: <CreditCard size={15} className="text-[#DC2626]" />, bg: "bg-[#FEE2E2]", title: "Supplier payment due tomorrow", body: "Payment of ৳ 84,630 due to Auto Parts BD for PO-1042.", time: "8h ago", unread: false },
];

const tabs = ["All", "Inventory", "Sales", "Payments", "System"];

export default function Notifications({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState("All");
  const [detailNotif, setDetailNotif] = useState<NotificationItem | null>(null);

  const [prefs, setPrefs] = useState({
    stock: true,
    orders: true,
    overdue: true,
    transfers: false,
    dailyDigest: true,
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const filtered = notifications.filter(n => {
    if (activeTab === "All") return true;
    return n.category === activeTab;
  });

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast("All notifications marked as read", "success");
  };

  const handleTogglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(`Notification preference updated`, "info");
      return next;
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[800px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] flex items-center gap-2">
            Notifications & Alerts
            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-[#D85A30] text-white px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">Critical system updates, reorder thresholds, and customer billing reminders</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-[#D85A30] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] overflow-x-auto scrollbar-none">
        {tabs.map(t => (
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

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.map(n => (
          <div
            key={n.id}
            onClick={() => {
              setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
              setDetailNotif(n);
            }}
            className={`bg-white border rounded-xl p-3.5 sm:p-4 flex items-start gap-3 hover:border-[#D85A30]/40 transition-colors cursor-pointer shadow-2xs ${
              n.unread ? "border-[#FED7AA] bg-[#FFFDFB]" : "border-[#E5E7EB]"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg ${n.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {n.unread && <div className="w-2 h-2 rounded-full bg-[#D85A30] flex-shrink-0" />}
                  <div className="text-xs sm:text-[13px] font-bold text-[#111827]">{n.title}</div>
                </div>
                <span className="text-[10px] text-[#9CA3AF] flex-shrink-0">{n.time}</span>
              </div>
              <div className="text-xs text-[#6B7280] mt-0.5">{n.body}</div>
              <div className="mt-2.5 flex flex-wrap gap-3" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setDetailNotif(n)}
                  className="text-xs font-semibold text-[#D85A30] hover:underline"
                >
                  View Details
                </button>
                {n.category === "Inventory" && (
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate("reorder");
                      showToast(`Navigated to Reorder Suggestions for ${n.title}`, "info");
                    }}
                    className="text-xs font-semibold text-[#4B5563] hover:text-[#111827] hover:underline"
                  >
                    Reorder Now
                  </button>
                )}
                {n.category === "Payments" && (
                  <button
                    onClick={() => showToast("SMS & WhatsApp overdue reminder dispatched", "success")}
                    className="text-xs font-semibold text-[#4B5563] hover:text-[#111827] hover:underline"
                  >
                    Send Overdue Reminder
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs">
        <h2 className="font-bold text-sm text-[#111827] mb-3">Live Notification Channels</h2>
        <div className="space-y-3 text-xs">
          {[
            { key: "stock" as const, label: "Critical Low Stock Alerts", desc: "Instant alert when parts stock drops below safety reorder level" },
            { key: "overdue" as const, label: "Customer Ledger Overdue Warnings", desc: "Automatic notifications when unpaid invoices exceed credit terms" },
            { key: "transfers" as const, label: "Inter-Branch Transfer Requests", desc: "Require confirmation when Mirpur or Uttara requests central stock" },
            { key: "dailyDigest" as const, label: "Daily Business EOD Summary", desc: "Daily evening profit & loss recap via WhatsApp / Email" },
          ].map(p => (
            <div key={p.key} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-semibold text-[#111827]">{p.label}</div>
                <div className="text-[11px] text-[#6B7280]">{p.desc}</div>
              </div>
              <button
                onClick={() => handleTogglePref(p.key)}
                className={`w-10 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  prefs[p.key] ? "bg-[#D85A30] justify-end" : "bg-gray-200 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {detailNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#D85A30] uppercase tracking-wider">{detailNotif.type} Alert</span>
              <button onClick={() => setDetailNotif(null)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <h3 className="font-bold text-[#111827] text-base mb-2">{detailNotif.title}</h3>
            <p className="text-xs text-[#4B5563] mb-4 bg-gray-50 p-3 rounded-xl leading-relaxed">{detailNotif.body}</p>
            <div className="text-[11px] text-[#9CA3AF] mb-4">Received: {detailNotif.time}</div>
            <button
              onClick={() => {
                showToast("Acknowledged alert", "info");
                setDetailNotif(null);
              }}
              className="w-full bg-[#D85A30] text-white py-2 rounded-xl text-xs font-bold"
            >
              Dismiss Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
