import { useState } from "react";
import { Plus, Search, Eye, Shield, X, Check, UserCheck, Mail, Phone, Building2 } from "lucide-react";
import { useToast } from "../components/Toast";

interface Employee {
  id: string;
  name: string;
  role: string;
  branch: string;
  sales: number;
  status: "Active" | "Inactive";
}

const initialEmployees: Employee[] = [
  { id: "EMP-001", name: "Rahim Ahmed", role: "Owner", branch: "Dhaka Main", sales: 142600, status: "Active" },
  { id: "EMP-002", name: "Kamal Hossain", role: "Manager", branch: "Dhaka Main", sales: 98400, status: "Active" },
  { id: "EMP-003", name: "Reza Mia", role: "Salesperson", branch: "Mirpur", sales: 74200, status: "Active" },
  { id: "EMP-004", name: "Nabil Islam", role: "Salesperson", branch: "Uttara", sales: 56800, status: "Active" },
  { id: "EMP-005", name: "Sajid Khan", role: "Manager", branch: "Chattogram", sales: 88400, status: "Active" },
  { id: "EMP-006", name: "Arif Hossain", role: "Warehouse Manager", branch: "Dhaka Main", sales: 0, status: "Active" },
  { id: "EMP-007", name: "Rafiq Molla", role: "Mechanic", branch: "Dhaka Main", sales: 0, status: "Active" },
  { id: "EMP-008", name: "Jamal Uddin", role: "Mechanic", branch: "Dhaka Main", sales: 0, status: "Active" },
];

const roles = ["Owner", "Admin", "Manager", "Accountant", "Salesperson", "Warehouse Manager", "Mechanic", "Cashier"];

const roleColors: Record<string, string> = {
  Owner: "bg-[#FEF0EA] text-[#D85A30]",
  Admin: "bg-[#FEE2E2] text-[#DC2626]",
  Manager: "bg-[#DBEAFE] text-[#2563EB]",
  Accountant: "bg-[#EDE9FE] text-[#7C3AED]",
  Salesperson: "bg-[#DCFCE7] text-[#16A34A]",
  "Warehouse Manager": "bg-[#FEF3C7] text-[#D97706]",
  Mechanic: "bg-[#F3F4F6] text-[#6B7280]",
  Cashier: "bg-[#E0F2FE] text-[#0284C7]",
};

const initialPermissions = [
  { module: "Dashboard", view: true, create: false, edit: false, delete: false, approve: false, export: true },
  { module: "Sales", view: true, create: true, edit: true, delete: false, approve: false, export: true },
  { module: "Purchases", view: true, create: true, edit: true, delete: false, approve: true, export: false },
  { module: "Inventory", view: true, create: true, edit: true, delete: false, approve: false, export: true },
  { module: "Accounts", view: false, create: false, edit: false, delete: false, approve: false, export: false },
  { module: "Reports", view: true, create: false, edit: false, delete: false, approve: false, export: true },
  { module: "Settings", view: false, create: false, edit: false, delete: false, approve: false, export: false },
];

export default function Employees({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [permissions, setPermissions] = useState(initialPermissions);

  // Modals
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);

  // Form
  const [newEmp, setNewEmp] = useState({
    name: "",
    role: "Salesperson",
    branch: "Dhaka Main",
    phone: "",
    email: "",
  });

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All Roles" || e.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.phone) {
      showToast("Please provide Employee Name and Phone", "error");
      return;
    }
    const created: Employee = {
      id: "EMP-00" + (employees.length + 1),
      name: newEmp.name,
      role: newEmp.role,
      branch: newEmp.branch,
      sales: 0,
      status: "Active",
    };
    setEmployees(prev => [created, ...prev]);
    showToast(`Staff invitation sent to ${created.name} (${created.role})`, "success");
    setShowInviteModal(false);
    setNewEmp({ name: "", role: "Salesperson", branch: "Dhaka Main", phone: "", email: "" });
  };

  const togglePermission = (moduleIndex: number, field: "view" | "create" | "edit" | "delete" | "approve" | "export") => {
    setPermissions(prev =>
      prev.map((p, idx) => {
        if (idx === moduleIndex) {
          const updated = { ...p, [field]: !p[field] };
          showToast(`Updated permission for ${p.module} (${field})`, "info");
          return updated;
        }
        return p;
      })
    );
  };

  const toggleStatus = (id: string) => {
    setEmployees(prev =>
      prev.map(e => {
        if (e.id === id) {
          const nextStatus: Employee["status"] = e.status === "Active" ? "Inactive" : "Active";
          showToast(`${e.name} marked as ${nextStatus}`, "info");
          return { ...e, status: nextStatus };
        }
        return e;
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Staff & Permissions</h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">Manage branch mechanics, sales advisors, and granular module access control</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRolesModal(true)}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#4B5563] border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white hover:border-[#D1D5DB] transition-colors cursor-pointer"
          >
            <Shield size={14} /> Manage Roles
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg px-3 sm:px-4 py-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={15} /> Invite Employee
          </button>
        </div>
      </div>

      {/* Filter and search */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 sm:p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employee name or ID…"
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-[13px] border border-[#E5E7EB] rounded-lg bg-[#F7F8FA] focus:outline-none focus:border-[#D85A30]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="text-xs sm:text-[13px] border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#374151] focus:outline-none"
        >
          <option>All Roles</option>
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Employee table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
                {["Employee", "Role", "Branch", "Monthly Sales", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#243B53] flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]">
                        {emp.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <div className="text-xs sm:text-[13px] font-semibold text-[#111827]">{emp.name}</div>
                        <div className="text-[11px] text-[#9CA3AF] font-mono">{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleColors[emp.role] || "bg-gray-100"}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{emp.branch}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#111827] whitespace-nowrap">
                    {emp.sales > 0 ? `৳ ${emp.sales.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(emp.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                        emp.status === "Active" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {emp.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => setViewEmployee(emp)}
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

      {/* Permission Matrix */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-5 py-4 border-b border-[#E5E7EB] gap-2">
          <div>
            <h2 className="font-bold text-sm text-[#111827]">Role Permission Matrix</h2>
            <p className="text-xs text-[#9CA3AF]">Click checkboxes to adjust access control rights</p>
          </div>
          <span className="text-xs font-semibold text-[#D85A30] bg-[#FEF0EA] px-2.5 py-1 rounded-lg">
            Active Role: Salesperson
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
                <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">Module</th>
                {["View", "Create", "Edit", "Delete", "Approve", "Export"].map(h => (
                  <th key={h} className="text-center text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-3 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, mIdx) => (
                <tr key={p.module} className="border-b border-[#F9FAFB] hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs font-medium text-[#111827]">{p.module}</td>
                  {(["view", "create", "edit", "delete", "approve", "export"] as const).map(field => (
                    <td key={field} className="px-3 py-3 text-center">
                      <button
                        onClick={() => togglePermission(mIdx, field)}
                        className={`w-5 h-5 rounded mx-auto flex items-center justify-center cursor-pointer transition-colors ${
                          p[field] ? "bg-[#D85A30] text-white" : "bg-gray-100 border border-gray-300"
                        }`}
                      >
                        {p[field] && <Check size={12} strokeWidth={3} />}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] text-base">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Full Name *</label>
                <input
                  required
                  placeholder="e.g. Shakil Ahmed"
                  value={newEmp.name}
                  onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="w-full text-xs border rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Role</label>
                  <select
                    value={newEmp.role}
                    onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}
                    className="w-full text-xs border rounded-lg px-3 py-2 bg-white"
                  >
                    {roles.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Branch</label>
                  <select
                    value={newEmp.branch}
                    onChange={e => setNewEmp({ ...newEmp, branch: e.target.value })}
                    className="w-full text-xs border rounded-lg px-3 py-2 bg-white"
                  >
                    <option>Dhaka Main</option>
                    <option>Mirpur</option>
                    <option>Uttara</option>
                    <option>Chattogram</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Phone Number *</label>
                <input
                  required
                  placeholder="+880 17..."
                  value={newEmp.phone}
                  onChange={e => setNewEmp({ ...newEmp, phone: e.target.value })}
                  className="w-full text-xs border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 border rounded-xl py-2 text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-[#D85A30] text-white rounded-xl py-2 text-xs font-bold">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Details Modal */}
      {viewEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#111827] text-base">{viewEmployee.name}</h3>
              <button onClick={() => setViewEmployee(null)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2.5 text-xs mb-4">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="flex justify-between"><span className="text-[#6B7280]">Staff ID:</span><span className="font-mono">{viewEmployee.id}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Role:</span><span className="font-semibold">{viewEmployee.role}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Assigned Branch:</span><span>{viewEmployee.branch}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Status:</span><span className="font-bold text-[#16A34A]">{viewEmployee.status}</span></div>
              </div>
            </div>
            <button
              onClick={() => {
                toggleStatus(viewEmployee.id);
                setViewEmployee(null);
              }}
              className="w-full bg-[#D85A30] text-white py-2 rounded-xl text-xs font-bold"
            >
              Toggle Status (Active / Inactive)
            </button>
          </div>
        </div>
      )}

      {/* Manage Roles Dialog */}
      {showRolesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] text-base">Defined System Roles</h3>
              <button onClick={() => setShowRolesModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[#6B7280] mb-4">8 roles configured across all 4 operational branches.</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {roles.map(r => (
                <div key={r} className="p-2.5 border rounded-xl flex items-center justify-between text-xs">
                  <span className="font-medium text-[#111827]">{r}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${roleColors[r]}`}>Active</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                showToast("Roles updated successfully", "success");
                setShowRolesModal(false);
              }}
              className="w-full bg-[#D85A30] text-white py-2 rounded-xl text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
