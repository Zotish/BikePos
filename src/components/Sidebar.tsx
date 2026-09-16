import { useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Monitor, Package, Box, ShoppingBag,
  Truck, Users, Wrench, ClipboardList, RotateCcw, Shield,
  ArrowLeftRight, CreditCard, Receipt, UserCheck, BarChart2,
  Bell, Plug, Settings, ChevronDown, ChevronRight,
  HelpCircle, Zap, LogOut, Building2, ChevronLeft, X, Check, ExternalLink, Phone, MessageSquare
} from "lucide-react";
import { useToast } from "./Toast";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  {
    id: "sales", label: "Sales", icon: <ShoppingCart size={16} />,
    children: [
      { id: "sales-list", label: "All Sales", icon: <ClipboardList size={14} /> },
      { id: "invoices", label: "Invoices", icon: <Receipt size={14} /> },
      { id: "quotations", label: "Quotations", icon: <ClipboardList size={14} /> },
    ]
  },
  { id: "pos", label: "POS", icon: <Monitor size={16} /> },
  {
    id: "inventory", label: "Inventory", icon: <Package size={16} />, badge: 12,
    children: [
      { id: "stock-overview", label: "Stock Overview", icon: <Package size={14} /> },
      { id: "stock-movement", label: "Stock Movement", icon: <ArrowLeftRight size={14} /> },
      { id: "adjustments", label: "Adjustments", icon: <ClipboardList size={14} /> },
      { id: "warehouses", label: "Warehouses", icon: <Building2 size={14} /> },
      { id: "reorder", label: "Reorder Suggestions", icon: <Zap size={14} />, badge: 8 },
    ]
  },
  { id: "products", label: "Products", icon: <Box size={16} /> },
  {
    id: "purchases", label: "Purchases", icon: <ShoppingBag size={16} />,
    children: [
      { id: "purchase-orders", label: "Purchase Orders", icon: <ClipboardList size={14} /> },
      { id: "goods-receiving", label: "Goods Receiving", icon: <Package size={14} /> },
      { id: "purchase-bills", label: "Bills", icon: <Receipt size={14} /> },
    ]
  },
  { id: "suppliers", label: "Suppliers", icon: <Truck size={16} /> },
  { id: "customers", label: "Customers", icon: <Users size={16} /> },
  { id: "workshop", label: "Workshop", icon: <Wrench size={16} />, badge: 3 },
  { id: "transfers", label: "Transfers", icon: <ArrowLeftRight size={16} /> },
  { id: "returns", label: "Returns", icon: <RotateCcw size={16} /> },
  { id: "warranty", label: "Warranty", icon: <Shield size={16} />, badge: 5 },
  {
    id: "accounts", label: "Accounts", icon: <CreditCard size={16} />,
    children: [
      { id: "accounts-overview", label: "Overview", icon: <LayoutDashboard size={14} /> },
      { id: "expenses", label: "Expenses", icon: <Receipt size={14} /> },
      { id: "receivables", label: "Receivables", icon: <CreditCard size={14} /> },
      { id: "payables", label: "Payables", icon: <CreditCard size={14} /> },
    ]
  },
  { id: "employees", label: "Employees", icon: <UserCheck size={16} /> },
  { id: "reports", label: "Reports", icon: <BarChart2 size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} />, badge: 7 },
  { id: "integrations", label: "Integrations", icon: <Plug size={16} /> },
  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
];

const branches = [
  { id: "dhaka-main", name: "Dhaka Main Branch", location: "Mirpur-10, Dhaka", isCurrent: true },
  { id: "mirpur-store", name: "Mirpur Sub-Store", location: "Mirpur-1, Dhaka", isCurrent: false },
  { id: "uttara", name: "Uttara Branch", location: "Sector-3, Uttara", isCurrent: false },
  { id: "chattogram", name: "Chattogram Depot", location: "Agrabad, Chattogram", isCurrent: false },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
  activeBranch?: string;
  onSelectBranch?: (branch: string) => void;
}

export default function Sidebar({
  currentPage,
  onNavigate,
  mobileOpen = false,
  onCloseMobile,
  onLogout,
  activeBranch = "Dhaka Main Branch",
  onSelectBranch
}: SidebarProps) {
  const { showToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["inventory", "sales", "purchases", "accounts"]));
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isActive = (item: NavItem): boolean => {
    if (item.id === currentPage) return true;
    if (item.children) return item.children.some(c => c.id === currentPage);
    return false;
  };

  const handleItemClick = (item: NavItem, hasChildren: boolean) => {
    if (hasChildren) {
      if (!collapsed) toggleExpand(item.id);
    } else {
      onNavigate(item.id);
      if (onCloseMobile) onCloseMobile();
    }
  };

  const renderItem = (item: NavItem, depth = 0) => {
    const active = isActive(item);
    const expanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isDirectlyActive = item.id === currentPage;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item, !!hasChildren)}
          className={`w-full flex items-center gap-2.5 rounded-lg text-left transition-all duration-150 group cursor-pointer
            ${depth === 0 ? "px-3 py-2 text-sm" : "px-3 py-1.5 text-[13px]"}
            ${isDirectlyActive
              ? "bg-[#FEF0EA] text-[#D85A30] font-semibold shadow-xs"
              : active && !isDirectlyActive
              ? "text-[#D85A30] font-medium"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-gray-100/80"
            }
          `}
          style={depth === 1 ? { paddingLeft: collapsed ? undefined : "2.25rem" } : undefined}
          title={collapsed ? item.label : undefined}
        >
          <span className={`flex-shrink-0 ${isDirectlyActive ? "text-[#D85A30]" : active ? "text-[#D85A30]" : "text-[#9CA3AF] group-hover:text-[#6B7280]"}`}>
            {item.icon}
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-semibold bg-[#D85A30] text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <span className="text-[#D1D5DB]">
                  {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </span>
              )}
            </>
          )}
        </button>
        {hasChildren && expanded && !collapsed && (
          <div className="mt-0.5 mb-1 space-y-0.5">
            {item.children!.map(child => renderItem(child, 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:relative flex flex-col h-screen bg-white border-r border-[#E5E7EB] transition-all duration-200 flex-shrink-0 shadow-xl md:shadow-none
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "w-[60px]" : "w-[240px]"}
        `}
      >
        {/* Logo & Mobile Close */}
        <div className={`flex items-center justify-between h-[58px] border-b border-[#E5E7EB] flex-shrink-0 ${collapsed ? "justify-center px-2" : "px-4"}`}>
          <div
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-7 h-7 bg-[#D85A30] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2"/>
                <circle cx="8" cy="8" r="2.5" fill="white"/>
                <path d="M8 2V4M8 12V14M2 8H4M12 8H14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            {!collapsed && (
              <div>
                <div className="font-bold text-[#111827] text-[15px] leading-tight flex items-center gap-1.5">
                  MotoParts
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-[#FEF0EA] text-[#D85A30] px-1 py-0.2 rounded">ERP</span>
                </div>
                <div className="text-[10px] text-[#6B7280] font-medium">Business Platform</div>
              </div>
            )}
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-[#9CA3AF] hover:text-[#111827] rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Branch selector */}
        {!collapsed && (
          <div className="px-3 py-2.5 border-b border-[#E5E7EB]">
            <button
              onClick={() => setShowBranchModal(true)}
              className="w-full flex items-center gap-2 text-left hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors border border-transparent hover:border-[#E5E7EB]"
            >
              <div className="w-5 h-5 bg-[#243B53] rounded-md flex items-center justify-center flex-shrink-0">
                <Building2 size={11} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-[#111827] truncate">{activeBranch}</div>
                <div className="text-[10px] text-[#9CA3AF]">Click to switch branch</div>
              </div>
              <ChevronDown size={12} className="text-[#9CA3AF] flex-shrink-0" />
            </button>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-thin">
          {navItems.map(item => renderItem(item))}
        </nav>

        {/* Bottom Menu */}
        <div className="border-t border-[#E5E7EB] p-2 space-y-0.5">
          {!collapsed && (
            <>
              <button
                onClick={() => setShowHelpModal(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <HelpCircle size={14} className="text-[#9CA3AF]" />
                <span>Help & Docs</span>
              </button>
              <button
                onClick={() => setShowProModal(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Zap size={14} className="text-[#D85A30]" />
                <span className="flex-1 text-left">Professional Plan</span>
                <span className="text-[10px] bg-[#FEF0EA] text-[#D85A30] font-semibold px-1.5 py-0.5 rounded-full">PRO</span>
              </button>
            </>
          )}
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-[#D85A30] flex items-center justify-center flex-shrink-0 font-bold text-white text-[11px]">
              RA
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-[#111827] truncate">Rahim Ahmed</div>
                <div className="text-[10px] text-[#9CA3AF]">Owner · Dhaka</div>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-[#9CA3AF] hover:text-[#DC2626] transition-colors p-1 rounded hover:bg-red-50"
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-full items-center justify-center p-2 rounded-lg text-[#9CA3AF] hover:text-[#6B7280] hover:bg-gray-50 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </aside>

      {/* Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-[#D85A30]" />
                <h3 className="font-bold text-[#111827] text-base">Select Branch</h3>
              </div>
              <button onClick={() => setShowBranchModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={16} />
              </button>
            </div>
            <p className="text-[#6B7280] text-xs mb-4">Switching branch changes POS inventory, orders, and sales data.</p>
            <div className="space-y-2 mb-4">
              {branches.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    if (onSelectBranch) onSelectBranch(b.name);
                    showToast(`Switched to ${b.name}`, "info");
                    setShowBranchModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    activeBranch === b.name ? "border-[#D85A30] bg-[#FEF0EA]/50" : "border-[#E5E7EB] hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-[13px] text-[#111827]">{b.name}</div>
                    <div className="text-[11px] text-[#6B7280]">{b.location}</div>
                  </div>
                  {activeBranch === b.name && <Check size={16} className="text-[#D85A30]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle size={20} className="text-[#D85A30]" />
                <h3 className="font-bold text-[#111827] text-lg">Help & Support</h3>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 mb-5 text-[13px]">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="font-semibold text-[#111827] mb-1">Keyboard Shortcuts</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#6B7280]">
                  <div><kbd className="bg-white border rounded px-1.5 py-0.5 font-mono">⌘K</kbd> Global Search</div>
                  <div><kbd className="bg-white border rounded px-1.5 py-0.5 font-mono">F2</kbd> Open POS Sale</div>
                  <div><kbd className="bg-white border rounded px-1.5 py-0.5 font-mono">F4</kbd> Add Product</div>
                  <div><kbd className="bg-white border rounded px-1.5 py-0.5 font-mono">Esc</kbd> Close Modals</div>
                </div>
              </div>
              <div className="p-3 border border-[#E5E7EB] rounded-xl flex items-center gap-3">
                <Phone size={16} className="text-[#16A34A]" />
                <div className="flex-1">
                  <div className="font-semibold text-[#111827]">Dedicated Support Line</div>
                  <div className="text-xs text-[#6B7280]">+880 9612-345678 (9 AM - 9 PM)</div>
                </div>
              </div>
              <div className="p-3 border border-[#E5E7EB] rounded-xl flex items-center gap-3">
                <MessageSquare size={16} className="text-[#2563EB]" />
                <div className="flex-1">
                  <div className="font-semibold text-[#111827]">Live Chat via WhatsApp</div>
                  <div className="text-xs text-[#6B7280]">Average response time: &lt; 5 mins</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                showToast("Opening MotoParts Knowledge Base...", "info");
                setShowHelpModal(false);
              }}
              className="w-full bg-[#D85A30] hover:bg-[#B74421] text-white font-semibold py-2.5 rounded-xl text-[13px] transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink size={14} /> Open Online Documentation
            </button>
          </div>
        </div>
      )}

      {/* Pro Plan Modal */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB] text-center">
            <div className="w-12 h-12 bg-[#FEF0EA] rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#D85A30]">
              <Zap size={24} />
            </div>
            <h3 className="font-bold text-[#111827] text-lg mb-1">Professional Plan</h3>
            <p className="text-xs text-[#6B7280] mb-4">Your subscription is active and renews on Oct 1, 2026.</p>
            <div className="bg-[#F7F8FA] rounded-xl p-3.5 space-y-2 text-left text-xs mb-5">
              <div className="flex justify-between"><span className="text-[#6B7280]">Plan:</span><span className="font-semibold text-[#111827]">Professional (৳2,499/mo)</span></div>
              <div className="flex justify-between"><span className="text-[#6B7280]">Branches:</span><span className="font-semibold text-[#111827]">3 of 3 active</span></div>
              <div className="flex justify-between"><span className="text-[#6B7280]">Users:</span><span className="font-semibold text-[#111827]">8 of 10 seats</span></div>
              <div className="flex justify-between"><span className="text-[#6B7280]">Inventory SKUs:</span><span className="font-semibold text-[#16A34A]">Unlimited</span></div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowProModal(false)}
                className="flex-1 border border-[#E5E7EB] rounded-xl py-2 text-xs font-semibold text-[#4B5563] hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onNavigate("settings");
                  setShowProModal(false);
                  showToast("Navigated to Subscription settings", "info");
                }}
                className="flex-1 bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2 text-xs font-semibold"
              >
                Manage Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB] text-center">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#DC2626]">
              <LogOut size={22} />
            </div>
            <h3 className="font-bold text-[#111827] text-lg mb-1">Confirm Log Out</h3>
            <p className="text-xs text-[#6B7280] mb-5">Are you sure you want to end your session? Any unsaved edits will be discarded.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-[#E5E7EB] rounded-xl py-2.5 text-xs font-semibold text-[#4B5563] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  if (onLogout) onLogout();
                  showToast("You have been logged out", "info");
                }}
                className="flex-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-xl py-2.5 text-xs font-semibold transition-colors"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
