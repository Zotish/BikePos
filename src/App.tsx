import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { ToastProvider } from "./components/Toast";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import POS from "./pages/POS";
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";
import Purchases from "./pages/Purchases";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/Customers";
import Workshop from "./pages/Workshop";
import Reports from "./pages/Reports";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Accounts from "./pages/Accounts";
import Reorder from "./pages/Reorder";

const breadcrumbs: Record<string, string[]> = {
  dashboard: ["Home", "Dashboard"],
  "sales-list": ["Home", "Sales", "All Sales"],
  invoices: ["Home", "Sales", "Invoices"],
  quotations: ["Home", "Sales", "Quotations"],
  pos: ["Home", "POS"],
  "stock-overview": ["Home", "Inventory", "Stock Overview"],
  "stock-movement": ["Home", "Inventory", "Stock Movement"],
  adjustments: ["Home", "Inventory", "Adjustments"],
  warehouses: ["Home", "Inventory", "Warehouses"],
  reorder: ["Home", "Inventory", "Reorder Suggestions"],
  inventory: ["Home", "Inventory"],
  products: ["Home", "Products"],
  "purchase-orders": ["Home", "Purchases", "Purchase Orders"],
  "goods-receiving": ["Home", "Purchases", "Goods Receiving"],
  "purchase-bills": ["Home", "Purchases", "Bills"],
  purchases: ["Home", "Purchases"],
  suppliers: ["Home", "Suppliers"],
  customers: ["Home", "Customers"],
  workshop: ["Home", "Workshop"],
  transfers: ["Home", "Transfers"],
  returns: ["Home", "Returns"],
  warranty: ["Home", "Warranty"],
  "accounts-overview": ["Home", "Accounts", "Overview"],
  expenses: ["Home", "Accounts", "Expenses"],
  receivables: ["Home", "Accounts", "Receivables"],
  payables: ["Home", "Accounts", "Payables"],
  accounts: ["Home", "Accounts"],
  employees: ["Home", "Employees"],
  reports: ["Home", "Reports"],
  notifications: ["Home", "Notifications"],
  integrations: ["Home", "Settings", "Integrations"],
  settings: ["Home", "Settings"],
};

function PageContent({ page, onNavigate }: { page: string; onNavigate: (p: string) => void }) {
  switch (page) {
    case "dashboard": return <Dashboard onNavigate={onNavigate} />;
    case "products": return <Products onNavigate={onNavigate} />;
    case "pos": return <POS onNavigate={onNavigate} />;
    case "sales":
    case "sales-list":
    case "invoices":
    case "quotations": return <Sales onNavigate={onNavigate} />;
    case "stock-overview":
    case "stock-movement":
    case "adjustments":
    case "warehouses":
    case "inventory": return <Inventory onNavigate={onNavigate} />;
    case "reorder": return <Reorder onNavigate={onNavigate} />;
    case "purchases":
    case "purchase-orders":
    case "goods-receiving":
    case "purchase-bills": return <Purchases onNavigate={onNavigate} />;
    case "suppliers": return <Suppliers onNavigate={onNavigate} />;
    case "customers": return <Customers onNavigate={onNavigate} />;
    case "workshop": return <Workshop onNavigate={onNavigate} />;
    case "accounts-overview":
    case "expenses":
    case "receivables":
    case "payables":
    case "accounts": return <Accounts onNavigate={onNavigate} />;
    case "employees": return <Employees onNavigate={onNavigate} />;
    case "reports": return <Reports onNavigate={onNavigate} />;
    case "notifications": return <Notifications onNavigate={onNavigate} />;
    case "integrations":
    case "settings": return <Settings onNavigate={onNavigate} />;
    case "transfers":
    case "returns":
    case "warranty":
    default: return <PlaceholderPage page={page} onNavigate={onNavigate} />;
  }
}

function PlaceholderPage({ page, onNavigate }: { page: string; onNavigate: (p: string) => void }) {
  const labels: Record<string, string> = {
    transfers: "Stock Transfers",
    returns: "Returns & Refunds",
    warranty: "Warranty Claims",
  };
  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-12 min-h-[60vh]">
      <div className="text-center max-w-sm bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div className="w-16 h-16 bg-[#FEF0EA] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#D85A30" strokeWidth="1.5"/><path d="M8 12h8M12 8v8" stroke="#D85A30" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
        <h2 className="text-[18px] font-bold text-[#111827] mb-2">{labels[page] || page.charAt(0).toUpperCase() + page.slice(1)}</h2>
        <p className="text-[#6B7280] text-sm mb-4">This module is linked directly to your central inventory and accounting records.</p>
        <button
          onClick={() => onNavigate("dashboard")}
          className="px-4 py-2 bg-[#D85A30] hover:bg-[#B74421] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState("Dhaka Main Branch");

  if (!isLoggedIn) {
    return (
      <ToastProvider>
        <Auth onLogin={() => setIsLoggedIn(true)} />
      </ToastProvider>
    );
  }

  const isPOS = currentPage === "pos";
  const crumbs = breadcrumbs[currentPage] ?? ["Home", currentPage];

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[#F7F8FA] relative">
        {/* Mobile Backdrop */}
        {mobileNavOpen && (
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          />
        )}

        {/* Responsive Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            setMobileNavOpen(false);
          }}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
          onLogout={() => setIsLoggedIn(false)}
          activeBranch={activeBranch}
          onSelectBranch={setActiveBranch}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header
            breadcrumb={crumbs}
            onNavigate={(page) => {
              setCurrentPage(page);
              setMobileNavOpen(false);
            }}
            onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
            activeBranch={activeBranch}
            onSelectBranch={setActiveBranch}
            onLogout={() => setIsLoggedIn(false)}
          />
          <main className={`flex-1 ${isPOS ? "overflow-hidden flex flex-col" : "overflow-y-auto"}`}>
            <PageContent page={currentPage} onNavigate={setCurrentPage} />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
