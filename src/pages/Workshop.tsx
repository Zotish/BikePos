import { useState } from "react";
import {
  Wrench, Clock, CheckCircle, AlertCircle, Plus, Search, User,
  ChevronRight, Timer, Printer, FileText, Check, X, ArrowRight
} from "lucide-react";
import { useToast } from "../components/Toast";

interface JobCard {
  id: string;
  customer: string;
  vehicle: string;
  mileage: string;
  advisor: string;
  mechanic: string;
  complaint: string;
  status: string;
  created: string;
}

const initialJobCards: JobCard[] = [
  { id: "JOB-0248", customer: "Rafi Islam", vehicle: "Honda CB Hornet 160R (2021)", mileage: "24,500 km", advisor: "Kamal Hossain", mechanic: "Rafiq Molla", complaint: "Engine noise at high RPM, brake squeal front", status: "In Progress", created: "Sep 11, 09:00" },
  { id: "JOB-0247", customer: "Nasrin Begum", vehicle: "Yamaha FZ-S FI V3 (2023)", mileage: "8,200 km", advisor: "Rahim Ahmed", mechanic: "Jamal Uddin", complaint: "Regular service due, chain adjustment needed", status: "Waiting for Parts", created: "Sep 11, 08:30" },
  { id: "JOB-0246", customer: "Mahbub Alam", vehicle: "Bajaj Pulsar 150 (2020)", mileage: "36,100 km", advisor: "Kamal Hossain", mechanic: "Salam Mia", complaint: "Oil change + full inspection", status: "Quality Check", created: "Sep 11, 08:00" },
  { id: "JOB-0245", customer: "Tanvir Hassan", vehicle: "TVS Apache RTR 160 (2022)", mileage: "15,800 km", advisor: "Rahim Ahmed", mechanic: "Rafiq Molla", complaint: "Electrical issue — headlight not working", status: "Ready", created: "Sep 10, 14:00" },
  { id: "JOB-0244", customer: "Sharmin Akter", vehicle: "Hero Splendor Plus (2019)", mileage: "48,200 km", advisor: "Kamal Hossain", mechanic: "Jamal Uddin", complaint: "Clutch slipping, brake shoes worn", status: "Delivered", created: "Sep 10, 10:00" },
];

const statusColors: Record<string, { dot: string; badge: string }> = {
  "Waiting": { dot: "bg-[#9CA3AF]", badge: "bg-[#F3F4F6] text-[#6B7280]" },
  "Inspection": { dot: "bg-[#2563EB]", badge: "bg-[#DBEAFE] text-[#2563EB]" },
  "In Progress": { dot: "bg-[#F59E0B]", badge: "bg-[#FEF3C7] text-[#D97706]" },
  "Waiting for Parts": { dot: "bg-[#DC2626]", badge: "bg-[#FEE2E2] text-[#DC2626]" },
  "Quality Check": { dot: "bg-[#7C3AED]", badge: "bg-[#EDE9FE] text-[#7C3AED]" },
  "Ready": { dot: "bg-[#16A34A]", badge: "bg-[#DCFCE7] text-[#16A34A]" },
  "Delivered": { dot: "bg-[#6B7280]", badge: "bg-[#F3F4F6] text-[#6B7280]" },
};

const jobStatusFlow = ["Waiting", "Inspection", "In Progress", "Waiting for Parts", "Quality Check", "Ready", "Delivered"];

export default function Workshop({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [jobCards, setJobCards] = useState<JobCard[]>(initialJobCards);
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);
  const [search, setSearch] = useState("");
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [showAddLaborModal, setShowAddLaborModal] = useState(false);

  // New job card form
  const [newJob, setNewJob] = useState({
    customer: "",
    vehicle: "Honda CB Hornet 160R",
    mileage: "12,000 km",
    advisor: "Kamal Hossain",
    mechanic: "Rafiq Molla",
    complaint: "",
  });

  const filtered = jobCards.filter(j =>
    j.customer.toLowerCase().includes(search.toLowerCase()) ||
    j.id.toLowerCase().includes(search.toLowerCase()) ||
    j.vehicle.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.customer || !newJob.complaint) {
      showToast("Please provide Customer Name and Issue Description", "error");
      return;
    }
    const card: JobCard = {
      id: "JOB-0" + Math.floor(250 + Math.random() * 50),
      customer: newJob.customer,
      vehicle: newJob.vehicle,
      mileage: newJob.mileage,
      advisor: newJob.advisor,
      mechanic: newJob.mechanic,
      complaint: newJob.complaint,
      status: "Waiting",
      created: "Today, Just now",
    };
    setJobCards(prev => [card, ...prev]);
    showToast(`Created Job Card #${card.id} for ${card.customer}`, "success");
    setShowNewJobModal(false);
    setNewJob({ customer: "", vehicle: "Honda CB Hornet 160R", mileage: "12,000 km", advisor: "Kamal Hossain", mechanic: "Rafiq Molla", complaint: "" });
  };

  const handleAdvanceStatus = () => {
    if (!selectedJob) return;
    const currentIdx = jobStatusFlow.indexOf(selectedJob.status);
    if (currentIdx < jobStatusFlow.length - 1) {
      const nextStatus = jobStatusFlow[currentIdx + 1];
      const updated = { ...selectedJob, status: nextStatus };
      setSelectedJob(updated);
      setJobCards(prev => prev.map(j => j.id === updated.id ? updated : j));
      showToast(`Job ${selectedJob.id} moved to "${nextStatus}"`, "success");
    }
  };

  if (selectedJob) {
    const statusIdx = jobStatusFlow.indexOf(selectedJob.status);
    return (
      <div className="p-4 sm:p-6 max-w-[1000px] mx-auto space-y-4">
        <button
          onClick={() => setSelectedJob(null)}
          className="text-xs sm:text-[13px] text-[#D85A30] font-medium hover:underline flex items-center gap-1 cursor-pointer"
        >
          ← Back to Workshop Jobs
        </button>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-xl font-bold text-[#111827]">Job Card {selectedJob.id}</h1>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColors[selectedJob.status]?.badge}`}>
                  {selectedJob.status}
                </span>
              </div>
              <div className="text-xs text-[#6B7280]">Created {selectedJob.created} · Advisor: {selectedJob.advisor}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAdvanceStatus}
                disabled={statusIdx === jobStatusFlow.length - 1}
                className="bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl px-3 py-2 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Advance to Next Step</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast(`Sent Job Card ${selectedJob.id} to printer`, "success");
                }}
                className="border border-[#E5E7EB] hover:bg-gray-50 rounded-xl px-3 py-2 text-xs font-medium text-[#374151] flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={13} /> Print
              </button>
              <button
                onClick={() => {
                  if (onNavigate) onNavigate("sales");
                  showToast(`Generated Invoice from Job Card ${selectedJob.id}`, "success");
                }}
                className="border border-[#E5E7EB] hover:bg-gray-50 rounded-xl px-3 py-2 text-xs font-medium text-[#374151] flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={13} /> Bill & Invoice
              </button>
            </div>
          </div>

          {/* Progress Timeline with Horizontal Scroll */}
          <div className="overflow-x-auto pb-2 scrollbar-thin">
            <div className="flex items-center min-w-[650px] px-2 py-3">
              {jobStatusFlow.map((s, i) => {
                const done = i < statusIdx;
                const active = i === statusIdx;
                return (
                  <div key={s} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
                        done ? "bg-[#16A34A] border-[#16A34A] text-white" :
                        active ? "bg-[#D85A30] border-[#D85A30] text-white ring-4 ring-[#FEF0EA]" :
                        "bg-white border-[#E5E7EB] text-[#9CA3AF]"
                      }`}>
                        {done ? "✓" : i + 1}
                      </div>
                      <span className={`text-[10px] mt-1 font-medium text-center leading-tight w-16 ${
                        active ? "text-[#D85A30] font-bold" : done ? "text-[#16A34A]" : "text-[#9CA3AF]"
                      }`}>
                        {s}
                      </span>
                    </div>
                    {i < jobStatusFlow.length - 1 && (
                      <div className={`flex-1 h-0.5 mt-[-14px] ${i < statusIdx ? "bg-[#16A34A]" : "bg-[#E5E7EB]"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl text-xs">
            <div>
              <div className="font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Customer & Vehicle Details</div>
              <div className="space-y-1 text-[#374151]">
                <div className="flex justify-between py-0.5"><span className="text-[#6B7280]">Customer:</span><span className="font-bold text-[#111827]">{selectedJob.customer}</span></div>
                <div className="flex justify-between py-0.5"><span className="text-[#6B7280]">Vehicle Model:</span><span>{selectedJob.vehicle}</span></div>
                <div className="flex justify-between py-0.5"><span className="text-[#6B7280]">Odometer Mileage:</span><span>{selectedJob.mileage}</span></div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Technician Assignment</div>
              <div className="space-y-1 text-[#374151]">
                <div className="flex justify-between py-0.5"><span className="text-[#6B7280]">Assigned Mechanic:</span><span className="font-bold text-[#111827]">{selectedJob.mechanic}</span></div>
                <div className="flex justify-between py-0.5"><span className="text-[#6B7280]">Service Advisor:</span><span>{selectedJob.advisor}</span></div>
                <div className="flex justify-between py-0.5"><span className="text-[#6B7280]">Customer Complaint:</span><span className="text-red-600 font-medium">{selectedJob.complaint}</span></div>
              </div>
            </div>
          </div>

          {/* Billable Parts & Labor */}
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#FAFAFA] border-b border-[#E5E7EB]">
              <span className="font-bold text-xs text-[#111827]">Estimated Parts & Labor</span>
              <button
                onClick={() => setShowAddLaborModal(true)}
                className="text-xs font-semibold text-[#D85A30] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} /> Add Service / Part
              </button>
            </div>
            <table className="w-full text-xs">
              <thead className="border-b border-[#F3F4F6] text-[#9CA3AF]">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Item Description</th>
                  <th className="text-center px-4 py-2 font-medium">Qty / Hrs</th>
                  <th className="text-right px-4 py-2 font-medium">Rate</th>
                  <th className="text-right px-4 py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                <tr>
                  <td className="px-4 py-2 text-[#111827]">Honda CB Hornet Front Brake Pad</td>
                  <td className="px-4 py-2 text-center text-[#6B7280]">1 pc</td>
                  <td className="px-4 py-2 text-right text-[#6B7280]">৳ 750</td>
                  <td className="px-4 py-2 text-right font-semibold text-[#111827]">৳ 750</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-[#111827]">Brake Service & Caliper Cleaning (Labor)</td>
                  <td className="px-4 py-2 text-center text-[#6B7280]">1.5 hrs</td>
                  <td className="px-4 py-2 text-right text-[#6B7280]">৳ 300</td>
                  <td className="px-4 py-2 text-right font-semibold text-[#111827]">৳ 450</td>
                </tr>
              </tbody>
            </table>
            <div className="px-4 py-3 bg-gray-50 flex justify-end text-xs font-bold text-[#111827]">
              <span>Estimated Total: ৳ 1,200</span>
            </div>
          </div>
        </div>

        {/* Add Labor/Part Modal */}
        {showAddLaborModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#111827] text-base">Add Service Item</h3>
                <button onClick={() => setShowAddLaborModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Service / Part Name</label>
                  <input placeholder="e.g. Engine Tuning" className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Estimated Cost (৳)</label>
                  <input type="number" defaultValue="400" className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 font-bold" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAddLaborModal(false)} className="flex-1 border rounded-xl py-2 text-xs">Cancel</button>
                <button
                  onClick={() => {
                    showToast("Added item to Job Card", "success");
                    setShowAddLaborModal(false);
                  }}
                  className="flex-1 bg-[#D85A30] text-white rounded-xl py-2 text-xs font-bold"
                >
                  Add Item
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Workshop Job Cards</h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">Motorcycle service tickets, technician assignments, and progress tracking</p>
        </div>
        <button
          onClick={() => setShowNewJobModal(true)}
          className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg px-3 sm:px-4 py-2 transition-colors cursor-pointer shadow-xs"
        >
          <Plus size={15} /> New Job Card
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Jobs", value: jobCards.length, icon: <Wrench size={16} className="text-[#D85A30]" />, bg: "bg-[#FEF0EA]" },
          { label: "Ready for Pickup", value: jobCards.filter(j => j.status === "Ready").length, icon: <CheckCircle size={16} className="text-[#16A34A]" />, bg: "bg-[#DCFCE7]" },
          { label: "Waiting for Parts", value: jobCards.filter(j => j.status === "Waiting for Parts").length, icon: <AlertCircle size={16} className="text-[#DC2626]" />, bg: "bg-[#FEE2E2]" },
          { label: "Avg Service Time", value: "3.2 hrs", icon: <Timer size={16} className="text-[#2563EB]" />, bg: "bg-[#DBEAFE]" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 sm:p-4 shadow-xs">
            <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center mb-2`}>{k.icon}</div>
            <div className="text-lg sm:text-xl font-bold text-[#111827]">{k.value}</div>
            <div className="text-[11px] text-[#9CA3AF]">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Job Cards List */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 border-b border-[#E5E7EB] gap-2">
          <h2 className="font-bold text-sm text-[#111827]">Active Workshop Tickets</h2>
          <div className="relative w-full sm:w-64">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customer, vehicle, ticket…"
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-[#F7F8FA] focus:outline-none focus:border-[#D85A30]"
            />
          </div>
        </div>

        <div className="divide-y divide-[#F9FAFB]">
          {filtered.map(job => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
            >
              <div className="flex-shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColors[job.status]?.dot}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono font-bold text-[#D85A30]">{job.id}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${statusColors[job.status]?.badge}`}>
                    {job.status}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#111827]">{job.customer}</div>
                <div className="text-xs text-[#6B7280] truncate">{job.vehicle} · {job.mileage}</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5 truncate">{job.complaint}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-0.5">
                  <User size={11} /> {job.mechanic}
                </div>
                <div className="text-[10px] text-[#9CA3AF]">{job.created}</div>
              </div>
              <ChevronRight size={14} className="text-[#D1D5DB] flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* New Job Card Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#E5E7EB] my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#111827] text-base">Create Workshop Job Card</h3>
              <button onClick={() => setShowNewJobModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Customer Name *</label>
                <input
                  required
                  value={newJob.customer}
                  onChange={e => setNewJob({ ...newJob, customer: e.target.value })}
                  placeholder="e.g. Asif Mahmud"
                  className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Bike Model</label>
                  <input
                    value={newJob.vehicle}
                    onChange={e => setNewJob({ ...newJob, vehicle: e.target.value })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Odometer (km)</label>
                  <input
                    value={newJob.mileage}
                    onChange={e => setNewJob({ ...newJob, mileage: e.target.value })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Assigned Mechanic</label>
                  <select
                    value={newJob.mechanic}
                    onChange={e => setNewJob({ ...newJob, mechanic: e.target.value })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white"
                  >
                    <option>Rafiq Molla</option>
                    <option>Jamal Uddin</option>
                    <option>Salam Mia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Service Advisor</label>
                  <input
                    value={newJob.advisor}
                    onChange={e => setNewJob({ ...newJob, advisor: e.target.value })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Customer Complaints / Symptoms *</label>
                <textarea
                  required
                  rows={2}
                  value={newJob.complaint}
                  onChange={e => setNewJob({ ...newJob, complaint: e.target.value })}
                  placeholder="Engine vibration, front brake noise, chain loose..."
                  className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="flex-1 border border-[#E5E7EB] rounded-xl py-2 text-xs font-semibold text-[#4B5563]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2 text-xs font-bold transition-colors"
                >
                  Register Job Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
