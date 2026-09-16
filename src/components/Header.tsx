import { useState, useRef, useEffect } from "react";
import {
  Search, Plus, Bell, HelpCircle, ChevronDown, Calendar, GitBranch,
  Menu, X, Check, ShoppingCart, Box, ShoppingBag, Users, Wrench, DollarSign,
  User, Shield, LogOut, CheckCheck, ExternalLink
} from "lucide-react";
import { useToast } from "./Toast";

interface HeaderProps {
  breadcrumb: string[];
  onNavigate?: (page: string) => void;
  onToggleMobileNav?: () => void;
  activeBranch?: string;
  onSelectBranch?: (branch: string) => void;
  onLogout?: () => void;
}

const mockNotifications = [
  { id: 1, title: "TVS Apache Spark Plug running low", time: "8m ago", unread: true, type: "stock" },
  { id: 2, title: "KTM Duke 200 Shock Absorber Out of Stock", time: "22m ago", unread: true, type: "stock" },
  { id: 3, title: "Large sale completed — INV-20482 (৳24,500)", time: "35m ago", unread: true, type: "sale" },
  { id: 4, title: "Payment overdue — Dhaka Bike Shop (৳15,400)", time: "1h ago", unread: true, type: "pay" },
  { id: 5, title: "New warranty claim — WC-0089", time: "2h ago", unread: false, type: "warranty" },
];

const branches = ["Dhaka Main Branch", "Mirpur Sub-Store", "Uttara Branch", "Chattogram Depot"];
const periods = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month (Sep 2026)", "Last Month", "Q3 2026"];

export default function Header({
  breadcrumb,
  onNavigate,
  onToggleMobileNav,
  activeBranch = "Dhaka Main Branch",
  onSelectBranch,
  onLogout
}: HeaderProps) {
  const { showToast } = useToast();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Sep 2026");
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const branchRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) setShowBranchMenu(false);
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) setShowPeriodMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast("All notifications marked as read", "success");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    showToast(`Searching for "${searchQuery}" in Products...`, "info");
    onNavigate?.("products");
    setShowSearchModal(false);
  };

  const quickCreateItems = [
    { label: "New POS Sale", icon: <ShoppingCart size={16} className="text-[#D85A30]" />, page: "pos", desc: "Launch checkout counter" },
    { label: "Add Spare Part", icon: <Box size={16} className="text-[#2563EB]" />, page: "products", desc: "Create new catalog SKU" },
    { label: "Purchase Order", icon: <ShoppingBag size={16} className="text-[#16A34A]" />, page: "purchases", desc: "Order inventory from supplier" },
    { label: "New Job Card", icon: <Wrench size={16} className="text-[#7C3AED]" />, page: "workshop", desc: "Register bike service ticket" },
    { label: "Add Customer", icon: <Users size={16} className="text-[#D97706]" />, page: "customers", desc: "Create workshop or retail client" },
    { label: "Add Expense", icon: <DollarSign size={16} className="text-[#DC2626]" />, page: "accounts", desc: "Record shop operational cost" },
  ];

  return (
    <header className="h-[58px] bg-white border-b border-[#E5E7EB] flex items-center px-4 sm:px-6 gap-3 sm:gap-4 flex-shrink-0 sticky top-0 z-20">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={onToggleMobileNav}
        className="md:hidden p-1.5 -ml-1 text-[#4B5563] hover:text-[#111827] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        aria-label="Open sidebar menu"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {breadcrumb.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <span className="text-[#D1D5DB] text-xs">/</span>}
            <span
              className={`text-xs sm:text-sm truncate ${
                i === breadcrumb.length - 1 ? "font-semibold text-[#111827]" : "text-[#6B7280] hidden sm:inline"
              }`}
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Desktop Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative hidden lg:flex items-center">
        <Search size={13} className="absolute left-3 text-[#9CA3AF]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search parts, SKU, invoice, customer…"
          className="pl-9 pr-8 py-1.5 text-[13px] border border-[#E5E7EB] rounded-lg bg-[#F7F8FA] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30] w-56 xl:w-72 transition-all focus:w-80"
        />
        <kbd className="absolute right-2.5 text-[10px] text-[#9CA3AF] bg-white border rounded px-1 font-mono">⌘K</kbd>
      </form>

      {/* Mobile Search Icon */}
      <button
        onClick={() => setShowSearchModal(true)}
        className="lg:hidden p-2 text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 rounded-lg cursor-pointer"
        aria-label="Search"
      >
        <Search size={18} />
      </button>

      {/* Branch Selector Dropdown */}
      <div className="relative hidden md:block" ref={branchRef}>
        <button
          onClick={() => setShowBranchMenu(!showBranchMenu)}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#374151] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 hover:border-[#D85A30] transition-colors bg-white cursor-pointer"
        >
          <GitBranch size={13} className="text-[#D85A30]" />
          <span className="max-w-[110px] truncate">{activeBranch.replace(" Branch", "")}</span>
          <ChevronDown size={11} className="text-[#9CA3AF]" />
        </button>
        {showBranchMenu && (
          <div className="absolute right-0 mt-1 w-52 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1.5 z-50">
            <div className="px-3 py-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Select Branch</div>
            {branches.map(b => (
              <button
                key={b}
                onClick={() => {
                  if (onSelectBranch) onSelectBranch(b);
                  showToast(`Active branch set to ${b}`, "info");
                  setShowBranchMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-gray-50 cursor-pointer ${
                  activeBranch === b ? "text-[#D85A30] font-semibold bg-[#FEF0EA]/40" : "text-[#374151]"
                }`}
              >
                <span>{b}</span>
                {activeBranch === b && <Check size={14} className="text-[#D85A30]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Period Selector Dropdown */}
      <div className="relative hidden md:block" ref={periodRef}>
        <button
          onClick={() => setShowPeriodMenu(!showPeriodMenu)}
          className="flex items-center gap-1.5 text-[13px] text-[#6B7280] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 hover:border-[#D1D5DB] transition-colors bg-white cursor-pointer"
        >
          <Calendar size={13} />
          <span>{selectedPeriod}</span>
          <ChevronDown size={11} className="text-[#9CA3AF]" />
        </button>
        {showPeriodMenu && (
          <div className="absolute right-0 mt-1 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1.5 z-50">
            <div className="px-3 py-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Date Period</div>
            {periods.map(p => (
              <button
                key={p}
                onClick={() => {
                  setSelectedPeriod(p);
                  showToast(`Reporting period set to ${p}`, "info");
                  setShowPeriodMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-gray-50 cursor-pointer ${
                  selectedPeriod === p ? "text-[#D85A30] font-semibold bg-[#FEF0EA]/40" : "text-[#374151]"
                }`}
              >
                <span>{p}</span>
                {selectedPeriod === p && <Check size={14} className="text-[#D85A30]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Create Action Button */}
      <button
        onClick={() => setShowQuickCreate(true)}
        className="flex items-center gap-1.5 bg-[#D85A30] hover:bg-[#B74421] text-white text-[13px] font-semibold rounded-lg px-2.5 sm:px-3 py-1.5 transition-colors shadow-xs cursor-pointer"
      >
        <Plus size={14} />
        <span className="hidden sm:inline">Quick Create</span>
      </button>

      {/* Notifications Popover */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative text-[#6B7280] hover:text-[#111827] p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute 0.5 top-0.5 right-0.5 bg-[#D85A30] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <>
            {/* Backdrop on mobile */}
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] sm:hidden"
              onClick={() => setShowNotifications(false)}
            />
            <div className="fixed sm:absolute top-14 sm:top-full left-2.5 right-2.5 sm:left-auto sm:right-0 sm:mt-2 w-auto sm:w-96 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6] mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#111827] text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-[#FEF0EA] text-[#D85A30] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] text-[#D85A30] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              </div>
              <div className="space-y-2 max-h-[60vh] sm:max-h-72 overflow-y-auto scrollbar-thin">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                      onNavigate?.("notifications");
                      setShowNotifications(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                      n.unread ? "bg-[#FFFBF9] border-[#FED7AA]" : "bg-white border-[#F3F4F6] hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-xs text-[#111827] leading-snug">{n.title}</div>
                      <span className="text-[10px] text-[#9CA3AF] flex-shrink-0">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  onNavigate?.("notifications");
                  setShowNotifications(false);
                }}
                className="w-full mt-3 text-center text-xs font-semibold text-[#D85A30] hover:underline py-2 bg-gray-50 hover:bg-[#FEF0EA]/40 transition-colors rounded-xl cursor-pointer"
              >
                View All Notifications →
              </button>
            </div>
          </>
        )}
      </div>

      {/* User Profile Menu */}
      <div className="relative" ref={profileRef}>
        <div
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-1.5 cursor-pointer p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[#D85A30] flex items-center justify-center text-white font-bold text-[11px] shadow-xs">
            RA
          </div>
          <ChevronDown size={11} className="text-[#9CA3AF] hidden sm:block" />
        </div>

        {showProfileMenu && (
          <>
            <div
              className="fixed inset-0 z-40 sm:hidden"
              onClick={() => setShowProfileMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-[#F3F4F6] mb-1">
              <div className="font-bold text-xs text-[#111827]">Rahim Ahmed</div>
              <div className="text-[10px] text-[#6B7280]">rahim@motopartsbd.com</div>
              <div className="text-[9px] font-semibold text-[#D85A30] uppercase tracking-wider mt-0.5">Admin & Owner</div>
            </div>
            <div className="space-y-0.5 text-xs text-[#374151]">
              <button
                onClick={() => {
                  onNavigate?.("employees");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-left cursor-pointer"
              >
                <User size={14} className="text-[#9CA3AF]" />
                <span>My Profile & Staff</span>
              </button>
              <button
                onClick={() => {
                  onNavigate?.("settings");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-left cursor-pointer"
              >
                <Shield size={14} className="text-[#9CA3AF]" />
                <span>Business Settings</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onLogout) onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 text-left cursor-pointer font-medium"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </>
      )}
      </div>

      {/* Quick Create Modal */}
      {showQuickCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#E5E7EB] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#111827] text-lg">Quick Create</h3>
                <p className="text-xs text-[#6B7280]">Select what you would like to create</p>
              </div>
              <button onClick={() => setShowQuickCreate(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2">
              {quickCreateItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    onNavigate?.(item.page);
                    setShowQuickCreate(false);
                    showToast(`Navigated to ${item.label}`, "info");
                  }}
                  className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-[#D85A30] hover:bg-[#FEF0EA]/20 transition-all text-left group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#111827] group-hover:text-[#D85A30] transition-colors">{item.label}</div>
                    <div className="text-[11px] text-[#6B7280]">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-xs p-4 pt-16">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 shadow-2xl border border-[#E5E7EB]">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <Search size={16} className="text-[#9CA3AF]" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search parts, SKU, invoice, customer…"
                className="flex-1 text-sm outline-none text-[#111827] py-1"
              />
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827]"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
