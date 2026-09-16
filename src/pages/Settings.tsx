import { useState } from "react";
import { Building2, MapPin, CreditCard, Bell, Shield, Plug, Users, Package, Upload, Check } from "lucide-react";
import { useToast } from "../components/Toast";

const sections = [
  { id: "business", label: "Business", icon: <Building2 size={14} /> },
  { id: "branches", label: "Branches", icon: <MapPin size={14} /> },
  { id: "currency", label: "Currency & Tax", icon: <CreditCard size={14} /> },
  { id: "invoice", label: "Invoice Config", icon: <CreditCard size={14} /> },
  { id: "integrations", label: "Integrations", icon: <Plug size={14} /> },
  { id: "subscription", label: "Subscription", icon: <CreditCard size={14} /> },
];

const initialIntegrations = [
  { id: "wa", name: "WhatsApp Business", desc: "Send invoices and reminders via WhatsApp", connected: true, logo: "💬" },
  { id: "bkash", name: "bKash Merchant", desc: "Accept bKash mobile payments at POS checkout", connected: true, logo: "💳" },
  { id: "nagad", name: "Nagad Gateway", desc: "Accept Nagad merchant wallet payments", connected: false, logo: "💳" },
  { id: "ssl", name: "SSLCommerz", desc: "Online payment gateway integration", connected: false, logo: "🔒" },
  { id: "email", name: "Email (SMTP)", desc: "Send invoices and daily sales reports via email", connected: true, logo: "✉️" },
  { id: "sms", name: "SMS Gateway (Bulk)", desc: "SMS notifications to customers on job completion", connected: false, logo: "📱" },
];

const plans = [
  { name: "Starter", price: "৳ 999", period: "/month", users: "Up to 3 users", branches: "1 branch", features: ["POS & Sales", "Inventory (500 SKUs)", "Basic Reports", "Email Support"], current: false, color: "border-[#E5E7EB]" },
  { name: "Professional", price: "৳ 2,499", period: "/month", users: "Up to 10 users", branches: "3 branches", features: ["Everything in Starter", "Unlimited SKUs", "Workshop Module", "Multi-branch", "Advanced Reports", "WhatsApp Integration"], current: true, color: "border-[#D85A30]" },
  { name: "Business", price: "৳ 5,999", period: "/month", users: "Up to 30 users", branches: "Unlimited branches", features: ["Everything in Professional", "Warehouse Management", "API Access", "Custom Reports", "Priority Support", "Dedicated Manager"], current: false, color: "border-[#E5E7EB]" },
  { name: "Enterprise", price: "Custom", period: "", users: "Unlimited users", branches: "Unlimited", features: ["Everything in Business", "White-label Option", "Custom Integration", "SLA Guarantee", "On-site Training"], current: false, color: "border-[#E5E7EB]" },
];

export default function Settings({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState("business");
  const [integrations, setIntegrations] = useState(initialIntegrations);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.connected;
          showToast(`${item.name} is now ${nextState ? "Connected" : "Disconnected"}`, nextState ? "success" : "info");
          return { ...item, connected: nextState };
        }
        return item;
      })
    );
  };

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Business profile updated successfully", "success");
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1100px] mx-auto space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Business Settings</h1>
        <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">Manage branch setup, billing information, integrations, and operational parameters</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Navigation - horizontal on mobile, vertical on desktop */}
        <div className="w-full md:w-52 flex-shrink-0">
          <nav className="flex md:flex-col overflow-x-auto scrollbar-none gap-1 bg-white md:bg-transparent p-1 md:p-0 rounded-xl border md:border-0 border-[#E5E7EB]">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-medium transition-colors text-left whitespace-nowrap cursor-pointer ${
                  activeSection === s.id
                    ? "bg-[#FEF0EA] text-[#D85A30] font-bold shadow-xs"
                    : "text-[#6B7280] hover:text-[#111827] hover:bg-gray-100"
                }`}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Panel */}
        <div className="flex-1 min-w-0">
          {activeSection === "business" && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 space-y-5 shadow-xs">
              <h2 className="font-bold text-sm sm:text-base text-[#111827]">Business Profile</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#D85A30] rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-xs">
                  MP
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => showToast("Upload logo dialog triggered", "info")}
                    className="flex items-center gap-1.5 text-xs text-[#D85A30] font-bold border border-[#D85A30] rounded-xl px-3 py-1.5 hover:bg-[#FEF0EA] transition-colors cursor-pointer"
                  >
                    <Upload size={13} /> Upload Brand Logo
                  </button>
                  <p className="text-[11px] text-[#9CA3AF] mt-1">PNG, JPG or SVG (max 2MB)</p>
                </div>
              </div>

              <form onSubmit={handleSaveBusiness} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">Company Name</label>
                    <input defaultValue="MotoParts Trading Ltd." className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">Business Type</label>
                    <input defaultValue="Motorcycle Spare Parts & Service Workshop" className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">Support Phone</label>
                    <input defaultValue="+880 1712-345678" className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">Official Email</label>
                    <input defaultValue="contact@motoparts.com.bd" className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">VAT / Tax BIN Number</label>
                    <input defaultValue="19120234567-BIN" className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">Default Base Currency</label>
                    <input defaultValue="Bangladeshi Taka (BDT ৳)" disabled className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#6B7280] bg-gray-50" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Head Office Address</label>
                  <textarea
                    defaultValue="Shop #12-14, Ground Floor, Moto Parts Market, Mirpur-10 Roundabout, Dhaka 1216, Bangladesh"
                    rows={2}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#D85A30] hover:bg-[#B74421] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Save Business Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSection === "branches" && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm sm:text-base text-[#111827]">Branch Locations</h2>
                <button
                  onClick={() => showToast("Added new branch draft", "info")}
                  className="bg-[#D85A30] text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  + Add Branch
                </button>
              </div>
              <div className="space-y-2.5">
                {[
                  { name: "Dhaka Main Branch (HQ)", loc: "Mirpur-10, Dhaka", isHQ: true },
                  { name: "Mirpur Sub-Store", loc: "Mirpur-1, Dhaka", isHQ: false },
                  { name: "Uttara Branch", loc: "Sector-3, Uttara", isHQ: false },
                  { name: "Chattogram Depot", loc: "Agrabad Commercial Area", isHQ: false },
                ].map(b => (
                  <div key={b.name} className="p-3.5 border rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#111827] flex items-center gap-1.5">
                        {b.name}
                        {b.isHQ && <span className="bg-[#DCFCE7] text-[#16A34A] text-[10px] px-1.5 rounded font-bold">Primary HQ</span>}
                      </div>
                      <div className="text-[#6B7280]">{b.loc}</div>
                    </div>
                    <button
                      onClick={() => showToast(`Editing parameters for ${b.name}`, "info")}
                      className="text-xs text-[#D85A30] font-semibold hover:underline cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "currency" && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
              <h2 className="font-bold text-sm sm:text-base text-[#111827]">Tax & Currency Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-[#374151] mb-1">Standard POS VAT Rate (%)</label>
                  <input defaultValue="5.0" className="w-full border rounded-lg px-3 py-2 font-bold text-sm" />
                </div>
                <div>
                  <label className="block font-semibold text-[#374151] mb-1">Currency Symbol Position</label>
                  <select className="w-full border rounded-lg px-3 py-2 bg-white">
                    <option>Before Amount (৳ 1,000)</option>
                    <option>After Amount (1,000 ৳)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => showToast("Tax settings saved", "success")}
                className="bg-[#D85A30] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Save Tax Settings
              </button>
            </div>
          )}

          {activeSection === "invoice" && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs text-xs">
              <h2 className="font-bold text-sm sm:text-base text-[#111827]">Invoice Print & Layout</h2>
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-[#374151] mb-1">Invoice Footer Note / Warranty Terms</label>
                  <textarea
                    rows={3}
                    defaultValue="Warranty valid for genuine Honda, Yamaha & Bajaj parts up to 6 months. Electrical parts carry no return or exchange policy once installed."
                    className="w-full border rounded-lg p-3 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked id="qr" className="rounded text-[#D85A30]" />
                  <label htmlFor="qr" className="font-semibold text-[#374151]">Print bKash & Nagad dynamic QR code on POS thermal slips</label>
                </div>
              </div>
              <button
                onClick={() => showToast("Invoice configuration saved", "success")}
                className="bg-[#D85A30] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Save Invoice Template
              </button>
            </div>
          )}

          {activeSection === "integrations" && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
              <div>
                <h2 className="font-bold text-sm sm:text-base text-[#111827]">Connected Platforms & APIs</h2>
                <p className="text-xs text-[#6B7280]">Connect payment gateways, SMS providers, and messaging apps</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {integrations.map(intg => (
                  <div
                    key={intg.id}
                    className={`border rounded-xl p-3.5 transition-colors ${
                      intg.connected ? "border-[#D85A30]/30 bg-[#FEF9F7]" : "border-[#E5E7EB]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{intg.logo}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#111827]">{intg.name}</span>
                          {intg.connected && (
                            <span className="text-[10px] font-semibold bg-[#DCFCE7] text-[#16A34A] px-1.5 py-0.2 rounded-full">
                              Connected
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-0.5">{intg.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleIntegration(intg.id)}
                      className={`mt-3 w-full text-xs font-bold py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        intg.connected
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-[#D85A30] text-[#D85A30] hover:bg-[#FEF0EA]"
                      }`}
                    >
                      {intg.connected ? "Disconnect" : "Connect Integration"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "subscription" && (
            <div className="space-y-4">
              <div className="bg-[#FEF0EA] border border-[#F4C4A8] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="text-sm font-bold text-[#111827]">Active Plan: Professional Tier (৳2,499/mo)</div>
                  <div className="text-xs text-[#6B7280] mt-0.5">Renews automatically on Oct 1, 2026. 10 user seats included.</div>
                </div>
                <button
                  onClick={() => showToast("Invoices sent to accounts email", "info")}
                  className="text-xs font-bold text-[#D85A30] border border-[#D85A30] rounded-xl px-3 py-2 hover:bg-[#D85A30] hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Download Billing Invoices
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plans.map(plan => (
                  <div
                    key={plan.name}
                    className={`bg-white border-2 rounded-2xl p-4 sm:p-5 shadow-xs ${plan.color} ${
                      plan.current ? "shadow-md ring-2 ring-[#D85A30]/20" : ""
                    }`}
                  >
                    {plan.current && (
                      <div className="text-[10px] font-bold text-[#D85A30] uppercase tracking-wider mb-1">
                        Current Active Plan
                      </div>
                    )}
                    <div className="text-base font-bold text-[#111827]">{plan.name}</div>
                    <div className="my-2">
                      <span className="text-xl font-bold text-[#111827]">{plan.price}</span>
                      <span className="text-[#9CA3AF] text-xs">{plan.period}</span>
                    </div>
                    <div className="text-xs text-[#6B7280] space-y-1 mb-4">
                      <div>✓ {plan.users}</div>
                      <div>✓ {plan.branches}</div>
                      {plan.features.map(f => <div key={f}>✓ {f}</div>)}
                    </div>
                    <button
                      disabled={plan.current}
                      onClick={() => showToast(`Upgraded to ${plan.name} plan!`, "success")}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        plan.current
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-[#D85A30] hover:bg-[#B74421] text-white"
                      }`}
                    >
                      {plan.current ? "Current Plan" : "Upgrade Plan"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
