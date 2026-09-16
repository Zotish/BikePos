import { useState } from "react";
import {
  Search, Plus, Download, Upload, Printer, Filter, MoreHorizontal,
  Edit2, Eye, Trash2, Tag, X, Check, AlertCircle, Barcode, Copy
} from "lucide-react";
import { useToast } from "../components/Toast";

interface Product {
  id: number;
  name: string;
  sku: string;
  oem: string;
  brand: string;
  compat: string;
  cost: number;
  price: number;
  stock: number;
  reserved: number;
  available: number;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Overstock";
}

const initialProducts: Product[] = [
  { id: 1, name: "Honda CB Hornet Front Brake Pad", sku: "HBP-CBH-160F", oem: "06455-KYJ-921", brand: "Honda", compat: "CB Hornet 160R", cost: 580, price: 750, stock: 48, reserved: 6, available: 42, status: "In Stock" },
  { id: 2, name: "Yamaha FZ Series Air Filter", sku: "YAM-FZ-AF01", oem: "5D7-E4451-00", brand: "Yamaha", compat: "FZ, FZ-S, FZS FI", cost: 320, price: 500, stock: 4, reserved: 2, available: 2, status: "Low Stock" },
  { id: 3, name: "Bajaj Pulsar 150 Clutch Plate Set", sku: "BAJ-PUL150-CP", oem: "CT100-3001", brand: "Bajaj", compat: "Pulsar 150, Pulsar 180", cost: 880, price: 1200, stock: 22, reserved: 0, available: 22, status: "In Stock" },
  { id: 4, name: "Suzuki Gixxer Chain Sprocket Kit", sku: "SUZ-GIX-CSK01", oem: "27600M", brand: "Suzuki", compat: "Gixxer 150, Gixxer SF", cost: 1450, price: 2100, stock: 0, reserved: 0, available: 0, status: "Out of Stock" },
  { id: 5, name: "TVS Apache RTR Spark Plug NGK", sku: "TVS-AP160-SP", oem: "NGK-CR8E", brand: "NGK", compat: "Apache RTR 160, 180, 200", cost: 140, price: 220, stock: 4, reserved: 0, available: 4, status: "Low Stock" },
  { id: 6, name: "Motul Engine Oil 10W40 1L", sku: "MOT-10W40-1L", oem: "MOT-104066", brand: "Motul", compat: "Universal", cost: 420, price: 580, stock: 98, reserved: 12, available: 86, status: "In Stock" },
  { id: 7, name: "Royal Enfield Meteor 350 Oil Filter", sku: "RE-MET350-OF", oem: "551406", brand: "Royal Enfield", compat: "Meteor 350, Thunderbird 350", cost: 260, price: 420, stock: 15, reserved: 0, available: 15, status: "In Stock" },
  { id: 8, name: "KTM Duke 200 Rear Shock Absorber", sku: "KTM-DK200-RSA", oem: "50180102S1", brand: "KTM", compat: "Duke 200, Duke 250", cost: 4200, price: 6800, stock: 2, reserved: 1, available: 1, status: "Low Stock" },
  { id: 9, name: "Hero Splendor Plus Headlight Bulb 35W", sku: "HRO-SPL-HLB35", oem: "33100-KFG-901", brand: "Hero", compat: "Splendor Plus, Splendor Pro", cost: 85, price: 140, stock: 200, reserved: 0, available: 200, status: "Overstock" },
  { id: 10, name: "Yamaha R15 V3 Brake Disc Front", sku: "YAM-R15V3-BDF", oem: "1WD-2581T-00", brand: "Yamaha", compat: "R15 V3, R15 V4", cost: 2800, price: 4200, stock: 8, reserved: 2, available: 6, status: "In Stock" },
];

const statusStyles: Record<string, string> = {
  "In Stock": "bg-[#DCFCE7] text-[#16A34A]",
  "Low Stock": "bg-[#FEF3C7] text-[#D97706]",
  "Out of Stock": "bg-[#FEE2E2] text-[#DC2626]",
  "Overstock": "bg-[#DBEAFE] text-[#2563EB]",
};

const categories = ["All Categories", "Engine Parts", "Brake System", "Electrical", "Suspension", "Lubricants", "Filters", "Tyres", "Body Parts", "Accessories"];
const brands = ["All Brands", "Honda", "Yamaha", "Bajaj", "Suzuki", "TVS", "Hero", "KTM", "Royal Enfield", "Motul", "NGK"];

export default function Products({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [bulkPricePercent, setBulkPricePercent] = useState(5);

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    oem: "",
    brand: "Honda",
    compat: "",
    cost: "",
    price: "",
    stock: "",
  });

  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.oem.toLowerCase().includes(search.toLowerCase());
    const matchStatus = selectedStatus === "All" || p.status === selectedStatus;
    const matchBrand = selectedBrand === "All Brands" || p.brand === selectedBrand;
    return matchSearch && matchStatus && matchBrand;
  });

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id));

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku || !newProduct.price) {
      showToast("Please fill in required fields (Name, SKU, Retail Price)", "error");
      return;
    }

    const costNum = parseFloat(newProduct.cost) || 0;
    const priceNum = parseFloat(newProduct.price) || 0;
    const stockNum = parseInt(newProduct.stock) || 0;
    const status: Product["status"] = stockNum === 0 ? "Out of Stock" : stockNum < 5 ? "Low Stock" : "In Stock";

    const item: Product = {
      id: Date.now(),
      name: newProduct.name,
      sku: newProduct.sku.toUpperCase(),
      oem: newProduct.oem || "OEM-" + Math.floor(10000 + Math.random() * 90000),
      brand: newProduct.brand,
      compat: newProduct.compat || "Universal",
      cost: costNum,
      price: priceNum,
      stock: stockNum,
      reserved: 0,
      available: stockNum,
      status,
    };

    setProducts(prev => [item, ...prev]);
    showToast(`Product "${item.name}" added successfully!`, "success");
    setShowAddModal(false);
    setNewProduct({ name: "", sku: "", oem: "", brand: "Honda", compat: "", cost: "", price: "", stock: "" });
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    setProducts(prev => prev.map(p => p.id === editProduct.id ? editProduct : p));
    showToast(`Product "${editProduct.name}" updated!`, "success");
    setEditProduct(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteProduct) return;
    setProducts(prev => prev.filter(p => p.id !== deleteProduct.id));
    setSelected(prev => {
      const next = new Set(prev);
      next.delete(deleteProduct.id);
      return next;
    });
    showToast(`Deleted product "${deleteProduct.name}"`, "info");
    setDeleteProduct(null);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "SKU", "OEM", "Brand", "Compatibility", "Cost (BDT)", "Price (BDT)", "Stock", "Reserved", "Available", "Status"];
    const rows = filtered.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      p.oem,
      p.brand,
      `"${p.compat.replace(/"/g, '""')}"`,
      p.cost,
      p.price,
      p.stock,
      p.reserved,
      p.available,
      p.status,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `products_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filtered.length} products to CSV`, "success");
  };

  const handleImportMock = () => {
    const mockImports: Product[] = [
      { id: Date.now() + 1, name: "TVS Raider 125 Front Sprocket", sku: "TVS-RAID-FS14", oem: "N9060040", brand: "TVS", compat: "Raider 125", cost: 350, price: 520, stock: 18, reserved: 0, available: 18, status: "In Stock" },
      { id: Date.now() + 2, name: "Castrol Power1 Ultimate 10W50", sku: "CAS-P1-10W50", oem: "CAS-3420", brand: "Universal", compat: "All 150-400cc Bikes", cost: 720, price: 950, stock: 36, reserved: 4, available: 32, status: "In Stock" },
    ];
    setProducts(prev => [...mockImports, ...prev]);
    setShowImportModal(false);
    showToast("Imported 2 products from CSV file successfully", "success");
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) return;
    setProducts(prev => prev.filter(p => !selected.has(p.id)));
    showToast(`Deleted ${selected.size} selected products`, "info");
    setSelected(new Set());
  };

  const handleBulkPriceApply = () => {
    setProducts(prev =>
      prev.map(p => {
        if (selected.has(p.id)) {
          const newPrice = Math.round(p.price * (1 + bulkPricePercent / 100));
          return { ...p, price: newPrice };
        }
        return p;
      })
    );
    showToast(`Updated retail prices of ${selected.size} products by ${bulkPricePercent}%`, "success");
    setShowBulkPriceModal(false);
    setSelected(new Set());
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Products Catalog</h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">Manage your motorcycle spare parts catalog and live inventory</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#4B5563] border border-[#E5E7EB] rounded-lg px-2.5 sm:px-3 py-2 hover:border-[#D1D5DB] bg-white transition-colors cursor-pointer"
          >
            <Upload size={14} /> <span className="hidden xs:inline">Import</span> CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#4B5563] border border-[#E5E7EB] rounded-lg px-2.5 sm:px-3 py-2 hover:border-[#D1D5DB] bg-white transition-colors cursor-pointer"
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => setShowBarcodeModal(true)}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#4B5563] border border-[#E5E7EB] rounded-lg px-2.5 sm:px-3 py-2 hover:border-[#D1D5DB] bg-white transition-colors cursor-pointer"
          >
            <Printer size={14} /> Barcodes
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg px-3 sm:px-4 py-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by part name, SKU, OEM number…"
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-[13px] border border-[#E5E7EB] rounded-lg bg-[#F7F8FA] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs sm:text-[13px] border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#374151] focus:outline-none focus:border-[#D85A30]"
          >
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="text-xs sm:text-[13px] border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#374151] focus:outline-none focus:border-[#D85A30]"
          >
            {brands.map(b => <option key={b}>{b}</option>)}
          </select>
          <div className="flex rounded-lg border border-[#E5E7EB] overflow-hidden bg-white">
            {["All", "In Stock", "Low Stock", "Out of Stock"].map(s => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`text-[11px] sm:text-[12px] px-2.5 sm:px-3 py-2 font-medium transition-colors cursor-pointer ${
                  selectedStatus === s ? "bg-[#D85A30] text-white" : "text-[#6B7280] hover:bg-gray-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk actions banner */}
      {selected.size > 0 && (
        <div className="bg-[#FEF0EA] border border-[#F4C4A8] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <span className="text-xs sm:text-[13px] font-semibold text-[#D85A30]">{selected.size} items selected</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowBarcodeModal(true)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#374151] hover:bg-gray-50"
            >
              Print Barcodes
            </button>
            <button
              onClick={() => setShowBulkPriceModal(true)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#374151] hover:bg-gray-50"
            >
              Update Price
            </button>
            <button
              onClick={handleBulkDelete}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-300 text-red-600 bg-white hover:bg-red-50"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Table container with horizontal scroll */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[#E5E7EB]">
          <span className="text-xs sm:text-[13px] text-[#6B7280]">{filtered.length} products found</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9CA3AF]">Sort:</span>
            <select className="text-xs border border-[#E5E7EB] rounded-lg px-2 py-1 bg-white text-[#374151] focus:outline-none">
              <option>Stock: Low first</option>
              <option>Name A–Z</option>
              <option>Price: High first</option>
              <option>Recently added</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
                <th className="px-4 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => {
                      if (allSelected) setSelected(new Set());
                      else setSelected(new Set(filtered.map(p => p.id)));
                    }}
                    className="rounded border-[#D1D5DB] text-[#D85A30] focus:ring-[#D85A30] cursor-pointer"
                  />
                </th>
                {["Product", "SKU / OEM", "Brand", "Compatibility", "Cost", "Retail Price", "Stock", "Reserved", "Available", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={`border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors ${selected.has(p.id) ? "bg-[#FEF9F7]" : ""}`}>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="rounded border-[#D1D5DB] text-[#D85A30] focus:ring-[#D85A30] cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#F7F8FA] rounded-lg border border-[#E5E7EB] flex items-center justify-center text-base flex-shrink-0">
                        🔧
                      </div>
                      <span className="text-xs sm:text-[13px] font-medium text-[#111827] max-w-[200px] truncate" title={p.name}>
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs font-mono text-[#4B5563] font-medium">{p.sku}</div>
                    <div className="text-[11px] text-[#9CA3AF] font-mono">{p.oem}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#4B5563] whitespace-nowrap">{p.brand}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] max-w-[130px] truncate" title={p.compat}>{p.compat}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">৳ {p.cost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#111827] whitespace-nowrap">৳ {p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#111827] whitespace-nowrap">{p.stock}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{p.reserved}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#111827] whitespace-nowrap">{p.available}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewProduct(p)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-[#9CA3AF] hover:text-[#2563EB] transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setEditProduct({ ...p })}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-[#9CA3AF] hover:text-[#D85A30] transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteProduct(p)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-[#9CA3AF] hover:text-[#DC2626] transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-5 py-3 border-t border-[#F3F4F6] gap-2">
          <span className="text-xs text-[#9CA3AF]">Showing 1–{filtered.length} of {products.length} products</span>
          <div className="flex items-center gap-1">
            {["‹", "1", "2", "3", "›"].map((page, i) => (
              <button
                key={i}
                onClick={() => showToast(`Page ${page} selected`, "info")}
                className={`w-7 h-7 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  page === "1" ? "bg-[#D85A30] text-white" : "text-[#6B7280] hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-[#E5E7EB] my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#111827] text-lg">Add New Product</h3>
                <p className="text-xs text-[#6B7280]">Enter spare part details and stock parameters</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Part Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Yamaha FZ Front Brake Caliper"
                  className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#D85A30]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.sku}
                    onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="e.g. YAM-FZ-BC01"
                    className="w-full text-xs font-mono border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#D85A30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">OEM Part #</label>
                  <input
                    type="text"
                    value={newProduct.oem}
                    onChange={e => setNewProduct({ ...newProduct, oem: e.target.value })}
                    placeholder="e.g. 5D7-F580U-00"
                    className="w-full text-xs font-mono border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#D85A30]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Brand</label>
                  <select
                    value={newProduct.brand}
                    onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#D85A30] bg-white"
                  >
                    {brands.filter(b => b !== "All Brands").map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Compatible Bike Models</label>
                  <input
                    type="text"
                    value={newProduct.compat}
                    onChange={e => setNewProduct({ ...newProduct, compat: e.target.value })}
                    placeholder="e.g. FZ V2, FZ V3"
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#D85A30]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Cost Price (৳)</label>
                  <input
                    type="number"
                    value={newProduct.cost}
                    onChange={e => setNewProduct({ ...newProduct, cost: e.target.value })}
                    placeholder="0"
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#D85A30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Retail Price (৳) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0"
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#D85A30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="0"
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#D85A30]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-[#E5E7EB] rounded-xl py-2.5 text-xs font-semibold text-[#4B5563] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2.5 text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FEF0EA] rounded-xl flex items-center justify-center text-2xl">🔧</div>
                <div>
                  <h3 className="font-bold text-[#111827] text-base">{viewProduct.name}</h3>
                  <div className="text-xs font-mono text-[#D85A30]">{viewProduct.sku}</div>
                </div>
              </div>
              <button onClick={() => setViewProduct(null)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs mb-5">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5">
                <div className="flex justify-between"><span className="text-[#6B7280]">OEM Part Number:</span><span className="font-mono font-semibold text-[#111827]">{viewProduct.oem}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Brand:</span><span className="font-semibold text-[#111827]">{viewProduct.brand}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Compatibility:</span><span className="font-semibold text-[#111827]">{viewProduct.compat}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Status:</span><span className={`px-2 py-0.5 rounded-full font-semibold ${statusStyles[viewProduct.status]}`}>{viewProduct.status}</span></div>
              </div>

              <div className="p-3 border border-[#E5E7EB] rounded-xl space-y-1.5">
                <div className="flex justify-between"><span className="text-[#6B7280]">Cost Price:</span><span className="font-bold text-[#111827]">৳ {viewProduct.cost.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Selling Price:</span><span className="font-bold text-[#16A34A]">৳ {viewProduct.price.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Gross Margin:</span><span className="font-bold text-[#2563EB]">৳ {(viewProduct.price - viewProduct.cost).toLocaleString()} ({Math.round(((viewProduct.price - viewProduct.cost) / (viewProduct.price || 1)) * 100)}%)</span></div>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl flex justify-around text-center">
                <div><div className="font-bold text-[#111827] text-sm">{viewProduct.stock}</div><div className="text-[10px] text-[#6B7280]">Total Stock</div></div>
                <div><div className="font-bold text-[#D97706] text-sm">{viewProduct.reserved}</div><div className="text-[10px] text-[#6B7280]">Reserved</div></div>
                <div><div className="font-bold text-[#16A34A] text-sm">{viewProduct.available}</div><div className="text-[10px] text-[#6B7280]">Available</div></div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditProduct({ ...viewProduct });
                  setViewProduct(null);
                }}
                className="flex-1 bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2 text-xs font-semibold transition-colors"
              >
                Edit Product
              </button>
              <button
                onClick={() => {
                  if (onNavigate) onNavigate("pos");
                  setViewProduct(null);
                }}
                className="flex-1 border border-[#E5E7EB] hover:bg-gray-50 rounded-xl py-2 text-xs font-semibold text-[#374151]"
              >
                Sell at POS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#111827] text-base">Edit Product #{editProduct.id}</h3>
              <button onClick={() => setEditProduct(null)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editProduct.name}
                  onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                  className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Cost Price (৳)</label>
                  <input
                    type="number"
                    value={editProduct.cost}
                    onChange={e => setEditProduct({ ...editProduct, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Retail Price (৳)</label>
                  <input
                    type="number"
                    value={editProduct.price}
                    onChange={e => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Stock On Hand</label>
                  <input
                    type="number"
                    value={editProduct.stock}
                    onChange={e => {
                      const stockVal = parseInt(e.target.value) || 0;
                      const statusVal: Product["status"] = stockVal === 0 ? "Out of Stock" : stockVal < 5 ? "Low Stock" : "In Stock";
                      setEditProduct({ ...editProduct, stock: stockVal, available: Math.max(0, stockVal - editProduct.reserved), status: statusVal });
                    }}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Compatibility</label>
                  <input
                    type="text"
                    value={editProduct.compat}
                    onChange={e => setEditProduct({ ...editProduct, compat: e.target.value })}
                    className="w-full text-xs border border-[#E5E7EB] rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="flex-1 border border-[#E5E7EB] rounded-xl py-2 text-xs font-semibold text-[#4B5563]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2 text-xs font-bold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB] text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
              <Trash2 size={22} />
            </div>
            <h3 className="font-bold text-[#111827] text-base mb-1">Delete Product?</h3>
            <p className="text-xs text-[#6B7280] mb-5">
              Are you sure you want to delete <span className="font-bold text-[#111827]">"{deleteProduct.name}"</span> ({deleteProduct.sku})? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteProduct(null)}
                className="flex-1 border border-[#E5E7EB] rounded-xl py-2.5 text-xs font-semibold text-[#4B5563] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-xl py-2.5 text-xs font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] text-base">Import Products from CSV</h3>
              <button onClick={() => setShowImportModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[#6B7280] mb-4">Upload a spreadsheet with product Name, SKU, OEM, Cost, and Selling Price.</p>
            <div className="border-2 border-dashed border-[#D1D5DB] rounded-xl p-6 text-center hover:border-[#D85A30] transition-colors mb-4 bg-gray-50/50">
              <Upload size={32} className="mx-auto text-[#9CA3AF] mb-2" />
              <div className="text-xs font-semibold text-[#111827]">Drag and drop your .csv file here</div>
              <div className="text-[11px] text-[#9CA3AF] mt-1">or click below to load sample supplier data</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 border border-[#E5E7EB] rounded-xl py-2 text-xs font-semibold text-[#4B5563]"
              >
                Cancel
              </button>
              <button
                onClick={handleImportMock}
                className="flex-1 bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2 text-xs font-bold transition-colors"
              >
                Load Sample Data (2 SKUs)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barcode Print Modal */}
      {showBarcodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Barcode size={22} className="text-[#D85A30]" />
                <h3 className="font-bold text-[#111827] text-base">Print Shelf Barcode Labels</h3>
              </div>
              <button onClick={() => setShowBarcodeModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[#6B7280] mb-4">Ready to print Code-128 sticker labels for thermal barcode printers.</p>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1 mb-4">
              {filtered.slice(0, 6).map(p => (
                <div key={p.id} className="border border-[#E5E7EB] rounded-xl p-2.5 text-center bg-white shadow-xs">
                  <div className="font-bold text-[11px] text-[#111827] truncate">{p.name}</div>
                  <div className="my-1.5 font-mono text-xs tracking-widest bg-gray-100 py-1 rounded">||| |||| | | ||| |</div>
                  <div className="text-[10px] font-mono text-[#6B7280]">{p.sku}</div>
                  <div className="text-xs font-bold text-[#D85A30] mt-0.5">৳ {p.price}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBarcodeModal(false)}
                className="flex-1 border border-[#E5E7EB] rounded-xl py-2.5 text-xs font-semibold text-[#4B5563]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast("Sending barcode labels to printer...", "success");
                  setShowBarcodeModal(false);
                }}
                className="flex-1 bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2.5 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer size={14} /> Print All Labels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Price Modal */}
      {showBulkPriceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#111827] text-base">Bulk Price Adjustment</h3>
              <button onClick={() => setShowBulkPriceModal(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[#6B7280] mb-4">
              Apply a percentage increase or decrease across {selected.size} selected products.
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#374151] mb-1">Percentage Change (%)</label>
              <input
                type="number"
                value={bulkPricePercent}
                onChange={e => setBulkPricePercent(parseFloat(e.target.value) || 0)}
                className="w-full text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 font-bold"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBulkPriceModal(false)}
                className="flex-1 border border-[#E5E7EB] rounded-xl py-2 text-xs font-semibold text-[#4B5563]"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkPriceApply}
                className="flex-1 bg-[#D85A30] hover:bg-[#B74421] text-white rounded-xl py-2 text-xs font-bold transition-colors"
              >
                Apply Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
