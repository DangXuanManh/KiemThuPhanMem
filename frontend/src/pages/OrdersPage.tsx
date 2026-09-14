import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { Order, OrderItem } from '../types';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Eye, 
  Printer, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  CreditCard, 
  Banknote, 
  QrCode, 
  User, 
  UserPlus,
  Trash2,
  Receipt,
  Sparkles,
  Package,
  Scissors,
  X,
  Check,
  Percent,
  Minus,
  AlertCircle
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { 
    orders, 
    customers, 
    products, 
    services, 
    addOrder, 
    updateOrderStatus,
    addCustomer,
    globalSearch
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // New POS Order Modal State
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [posCustomerId, setPosCustomerId] = useState<string>('');
  const [posCustomerSearch, setPosCustomerSearch] = useState('');
  const [isQuickAddCustOpen, setIsQuickAddCustOpen] = useState(false);
  
  // Quick Add Customer fields
  const [quickCustName, setQuickCustName] = useState('');
  const [quickCustPhone, setQuickCustPhone] = useState('');
  const [quickCustEmail, setQuickCustEmail] = useState('');
  const [quickCustTier, setQuickCustTier] = useState<'Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương'>('Đồng');

  // Item selector state in POS
  const [activeCatalogTab, setActiveCatalogTab] = useState<'product' | 'service'>('product');
  const [productSearch, setProductSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [posItems, setPosItems] = useState<OrderItem[]>([]);
  const [posDiscount, setPosDiscount] = useState(0);
  const [posPaymentMethod, setPosPaymentMethod] = useState<'Tiền mặt' | 'Chuyển khoản' | 'Thẻ' | 'Ví QR'>('Chuyển khoản');

  // Orders list filter
  const filteredOrders = orders.filter(o => {
    const q = (searchTerm || globalSearch || '').toLowerCase();
    const matchesSearch = !q ||
      o.code.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.paymentMethod.toLowerCase().includes(q);
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate POS summary
  const posSubtotal = posItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const posTotal = Math.max(0, posSubtotal - posDiscount);

  // Filtered customers in POS
  const filteredPOSCustomers = customers.filter(c => {
    if (!posCustomerSearch.trim()) return true;
    const term = posCustomerSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      (c.code && c.code.toLowerCase().includes(term))
    );
  });

  const selectedCustomerObj = customers.find(c => c.id === posCustomerId);

  // Filtered products
  const productCategories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = products.filter(p => {
    const matchesSearch = !productSearch.trim() || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Filtered services
  const serviceCategories = ['all', ...Array.from(new Set(services.map(s => s.category)))];
  const filteredServices = services.filter(s => {
    const matchesSearch = !serviceSearch.trim() || 
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(serviceSearch.toLowerCase());
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddItemToPOS = (type: 'product' | 'service', id: string) => {
    let name = '';
    let price = 0;

    if (type === 'product') {
      const prod = products.find(p => p.id === id);
      if (prod) {
        if (prod.stock <= 0) {
          alert(`Sản phẩm "${prod.name}" đã hết hàng trong kho!`);
          return;
        }
        name = prod.name;
        price = prod.sellPrice;
      }
    } else {
      const srv = services.find(s => s.id === id);
      if (srv) {
        name = srv.name;
        price = srv.price;
      }
    }

    if (!name) return;

    const existingIdx = posItems.findIndex(i => i.name === name);
    if (existingIdx >= 0) {
      const updated = [...posItems];
      updated[existingIdx].quantity += 1;
      setPosItems(updated);
    } else {
      setPosItems([...posItems, { id: `item-${Date.now()}`, name, quantity: 1, price }]);
    }
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemovePOSItem(index);
      return;
    }
    const updated = [...posItems];
    updated[index].quantity = newQty;
    setPosItems(updated);
  };

  const handleRemovePOSItem = (index: number) => {
    setPosItems(posItems.filter((_, i) => i !== index));
  };

  const handleQuickAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCustName.trim() || !quickCustPhone.trim()) {
      alert('Vui lòng nhập Tên và Số điện thoại khách hàng!');
      return;
    }

    const created = addCustomer({
      name: quickCustName.trim(),
      phone: quickCustPhone.trim(),
      email: quickCustEmail.trim() || `${quickCustPhone.trim()}@petcare.vn`,
      tier: quickCustTier,
      points: 0,
      notes: 'Tạo nhanh tại quầy POS'
    });

    setPosCustomerId(created.id);
    setIsQuickAddCustOpen(false);
    setPosCustomerSearch('');
    setQuickCustName('');
    setQuickCustPhone('');
    setQuickCustEmail('');
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (posItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm hoặc dịch vụ vào giỏ hàng!');
      return;
    }

    const customerName = selectedCustomerObj ? selectedCustomerObj.name : (posCustomerId === 'guest' ? 'Khách vãng lai' : (customers[0]?.name || 'Khách vãng lai'));

    addOrder({
      customerId: posCustomerId || 'guest',
      customerName,
      items: posItems,
      totalAmount: posTotal,
      discountAmount: posDiscount,
      paymentMethod: posPaymentMethod,
      status: 'Đã thanh toán',
      notes: 'Đơn hàng tạo từ Quầy POS',
    });

    setIsPOSOpen(false);
    setPosItems([]);
    setPosDiscount(0);
    setPosCustomerId('');
    setPosCustomerSearch('');
  };

  const handleViewInvoice = (order: Order) => {
    setSelectedOrder(order);
    setIsInvoiceOpen(true);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quản Lý Đơn Hàng & POS</h1>
          <p className="text-xs text-slate-500 mt-1">Bán hàng tại quầy, xuất hóa đơn và theo dõi lịch sử doanh thu</p>
        </div>
        <button
          onClick={() => {
            setIsPOSOpen(true);
            if (customers.length > 0 && !posCustomerId) {
              setPosCustomerId(customers[0].id);
            }
          }}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 hover:scale-105"
        >
          <Receipt className="w-4 h-4" /> Bán Hàng Mới (POS)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã HD..., tên khách, hình thức TT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-slate-50/50 font-bold text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Trạng thái:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-bold outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Tất cả đơn</option>
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Chờ thanh toán">Chờ thanh toán</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase tracking-wider border-b-2 border-slate-300">
              <tr>
                <th className="p-4">Mã Đơn Hàng</th>
                <th className="p-4">Khách Hàng</th>
                <th className="p-4">Sản Phẩm & Dịch Vụ</th>
                <th className="p-4">Phương Thức TT</th>
                <th className="p-4">Tổng Tiền</th>
                <th className="p-4">Ngày Tạo</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Hóa Đơn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-700 font-bold">
                    Không có hóa đơn đơn hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-black text-slate-900">#{o.code}</td>
                    <td className="p-4 font-extrabold text-slate-900">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-600" /> {o.customerName}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs truncate text-slate-800 font-bold" title={o.items.map(i => `${i.name || i.productName} x${i.quantity}`).join(', ')}>
                        {o.items.map(i => `${i.name || i.productName} (${i.quantity})`).join(', ')}
                      </div>
                    </td>
                    <td className="p-4 font-extrabold text-slate-900">
                      <span className="bg-slate-200 text-slate-900 font-black border border-slate-300 px-2.5 py-1 rounded-xl text-[11px]">
                        💳 {o.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 font-black text-emerald-700">
                      {o.totalAmount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-4 text-slate-800 font-bold">{o.createdAt || o.date}</td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                        className="px-2.5 py-1 text-xs border rounded-xl bg-white font-bold cursor-pointer outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Đã thanh toán">Đã thanh toán</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Chờ thanh toán">Chờ thanh toán</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleViewInvoice(o)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem Hóa Đơn
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADVANCED POS NEW ORDER MODAL */}
      <Modal
        isOpen={isPOSOpen}
        onClose={() => setIsPOSOpen(false)}
        title="Quầy Bán Hàng & Thu Ngân (POS)"
        subtitle="Tìm kiếm khách hàng, chọn nhanh sản phẩm / dịch vụ và tính tiền"
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleCreateOrder} className="space-y-5">
          {/* TOP SECTION: CUSTOMER SELECTION & QUICK CREATION */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3.5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black text-slate-900 uppercase">
                  1. Khách Hàng Thanh Toán
                </span>
                {selectedCustomerObj ? (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-lg">
                    Đã chọn: {selectedCustomerObj.name} ({selectedCustomerObj.phone})
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-lg">
                    Khách vãng lai
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsQuickAddCustOpen(!isQuickAddCustOpen)}
                className={`px-3 py-1 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 shadow-sm ${
                  isQuickAddCustOpen
                    ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                }`}
              >
                {isQuickAddCustOpen ? (
                  <><X className="w-3.5 h-3.5" /> Đóng Form Tạo Khách</>
                ) : (
                  <><UserPlus className="w-3.5 h-3.5" /> + Tạo Khách Mới</>
                )}
              </button>
            </div>

            {/* Quick Add Customer Sub-form */}
            {isQuickAddCustOpen ? (
              <div className="bg-emerald-50/80 border-2 border-emerald-300 p-3.5 rounded-2xl space-y-3 animate-in fade-in">
                <p className="text-xs font-black text-emerald-900 uppercase flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-emerald-600" /> Thêm nhanh khách hàng mới vào hệ thống
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Tên Khách Hàng *</label>
                    <input
                      type="text"
                      required
                      value={quickCustName}
                      onChange={(e) => setQuickCustName(e.target.value)}
                      placeholder="VD: Trần Văn Nam"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Số Điện Thoại *</label>
                    <input
                      type="text"
                      required
                      value={quickCustPhone}
                      onChange={(e) => setQuickCustPhone(e.target.value)}
                      placeholder="VD: 0912345678"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Email</label>
                    <input
                      type="email"
                      value={quickCustEmail}
                      onChange={(e) => setQuickCustEmail(e.target.value)}
                      placeholder="nam@gmail.com"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Hạng Thành Viên</label>
                    <select
                      value={quickCustTier}
                      onChange={(e) => setQuickCustTier(e.target.value as any)}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl outline-none font-bold"
                    >
                      <option value="Đồng">Hạng Đồng</option>
                      <option value="Bạc">Hạng Bạc</option>
                      <option value="Vàng">Hạng Vàng</option>
                      <option value="Kim Cương">Hạng Kim Cương</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-emerald-200">
                  <button
                    type="button"
                    onClick={() => setIsQuickAddCustOpen(false)}
                    className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickAddCustomerSubmit}
                    className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Lưu & Chọn Khách Này
                  </button>
                </div>
              </div>
            ) : (
              /* Searchable Customer Picker */
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={posCustomerSearch}
                    onChange={(e) => setPosCustomerSearch(e.target.value)}
                    placeholder="Tìm theo Tên, Số điện thoại, Mã khách hàng (KH-1001)..."
                    className="w-full pl-9 pr-8 py-1.5 text-xs border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold bg-white text-slate-900"
                  />
                  {posCustomerSearch && (
                    <button
                      type="button"
                      onClick={() => setPosCustomerSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Customer Horizontal / Grid Chips */}
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
                  {/* Option: Khách vãng lai */}
                  <button
                    type="button"
                    onClick={() => setPosCustomerId('guest')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all ${
                      posCustomerId === 'guest' || !posCustomerId
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    🚶 Khách vãng lai
                  </button>

                  {/* Filtered Existing Customers */}
                  {filteredPOSCustomers.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPosCustomerId(c.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                        posCustomerId === c.id
                          ? 'border-emerald-500 bg-emerald-50 text-slate-950 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      <span>👤 {c.name}</span>
                      <span className="text-[10px] text-slate-600 font-black">({c.phone})</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                        c.tier === 'Kim Cương' ? 'bg-purple-100 text-purple-900' :
                        c.tier === 'Vàng' ? 'bg-amber-100 text-amber-900' :
                        'bg-slate-200 text-slate-800'
                      }`}>
                        {c.code || c.tier}
                      </span>
                    </button>
                  ))}

                  {filteredPOSCustomers.length === 0 && (
                    <div className="text-xs text-slate-500 italic py-1 flex items-center gap-2">
                      <span>Không tìm thấy khách hàng khớp với từ khóa.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setQuickCustName(posCustomerSearch);
                          setIsQuickAddCustOpen(true);
                        }}
                        className="text-emerald-600 hover:text-emerald-700 font-bold underline"
                      >
                        + Tạo khách mới "{posCustomerSearch}"
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* MIDDLE SECTION: SEARCHABLE CATALOG (PRODUCTS & SERVICES) & CART */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* LEFT: SEARCHABLE CATALOG (7 COLS) */}
            <div className="md:col-span-7 bg-white border-2 border-slate-200 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-black text-slate-900 uppercase">
                  2. Chọn Sản Phẩm / Dịch Vụ
                </span>

                {/* Tab Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCatalogTab('product');
                      setSelectedCategory('all');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
                      activeCatalogTab === 'product'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" /> Sản Phẩm ({products.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCatalogTab('service');
                      setSelectedCategory('all');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
                      activeCatalogTab === 'service'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5" /> Dịch Vụ ({services.length})
                  </button>
                </div>
              </div>

              {/* Search & Category Filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={activeCatalogTab === 'product' ? productSearch : serviceSearch}
                    onChange={(e) => {
                      if (activeCatalogTab === 'product') setProductSearch(e.target.value);
                      else setServiceSearch(e.target.value);
                    }}
                    placeholder={
                      activeCatalogTab === 'product'
                        ? 'Tìm sản phẩm theo tên, mã SKU...'
                        : 'Tìm dịch vụ Spa, Tắm, Cắt tỉa...'
                    }
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold bg-slate-50 focus:bg-white"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white font-bold outline-none cursor-pointer"
                >
                  <option value="all">Tất cả danh mục</option>
                  {(activeCatalogTab === 'product' ? productCategories : serviceCategories)
                    .filter(c => c !== 'all')
                    .map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
              </div>

              {/* Items List/Grid */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {activeCatalogTab === 'product' ? (
                  filteredProducts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-50 rounded-xl">
                      Không tìm thấy sản phẩm nào khớp với tìm kiếm.
                    </div>
                  ) : (
                    filteredProducts.map(p => {
                      const isOutOfStock = p.stock <= 0;
                      return (
                        <div
                          key={p.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                            isOutOfStock
                              ? 'bg-slate-50 border-slate-200 opacity-60'
                              : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="font-extrabold text-slate-900 text-xs truncate">{p.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                              <span className="text-slate-500 font-bold">SKU: {p.sku}</span>
                              <span className="text-slate-400">•</span>
                              <span className={`font-black ${p.stock <= 5 ? 'text-rose-600' : 'text-slate-600'}`}>
                                Kho: {p.stock}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-black text-emerald-700 text-xs whitespace-nowrap">
                              {p.sellPrice.toLocaleString('vi-VN')} đ
                            </span>
                            <button
                              type="button"
                              disabled={isOutOfStock}
                              onClick={() => handleAddItemToPOS('product', p.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                                isOutOfStock
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-sm active:scale-95'
                              }`}
                            >
                              <Plus className="w-3.5 h-3.5" /> Thêm
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )
                ) : (
                  filteredServices.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-50 rounded-xl">
                      Không tìm thấy dịch vụ nào khớp với tìm kiếm.
                    </div>
                  ) : (
                    filteredServices.map(s => (
                      <div
                        key={s.id}
                        className="p-2.5 rounded-xl border bg-white border-slate-200 hover:border-emerald-400 hover:shadow-sm flex items-center justify-between transition-all"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="font-extrabold text-slate-900 text-xs truncate">{s.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                            <span className="text-slate-500 font-bold">⏱ {s.durationMins} phút</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-emerald-700 font-bold">{s.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-black text-emerald-700 text-xs whitespace-nowrap">
                            {s.price.toLocaleString('vi-VN')} đ
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddItemToPOS('service', s.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-sm active:scale-95 flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Thêm
                          </button>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>

            {/* RIGHT: GIỎ HÀNG THANH TOÁN (5 COLS) */}
            <div className="md:col-span-5 bg-slate-50 border-2 border-slate-200 rounded-2xl p-3.5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-black text-slate-900 uppercase flex items-center gap-1">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" /> Giỏ Hàng ({posItems.length})
                  </span>
                  {posItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setPosItems([])}
                      className="text-[10px] text-rose-600 hover:underline font-bold"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>

                {/* Cart Items List */}
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1 mt-2">
                  {posItems.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 italic text-xs space-y-1">
                      <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 opacity-60" />
                      <p>Chưa có món nào trong giỏ</p>
                      <p className="text-[10px]">Click "+ Thêm" từ danh sách bên trái</p>
                    </div>
                  ) : (
                    posItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="font-extrabold text-slate-900 truncate text-[11px]">
                            {item.name || item.productName}
                          </p>
                          <p className="text-slate-500 text-[10px] font-bold">
                            {item.price.toLocaleString('vi-VN')} đ
                          </p>
                        </div>

                        {/* Quantity Changer */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(idx, item.quantity - 1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded-md font-bold flex items-center justify-center text-slate-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-black text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(idx, item.quantity + 1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded-md font-bold flex items-center justify-center text-slate-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                          <span className="font-black text-emerald-700 min-w-[64px] text-right text-[11px] ml-1">
                            {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemovePOSItem(idx)}
                            className="text-rose-400 hover:text-rose-600 p-1 ml-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom Settings (Payment, Discount, Total) */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Hình Thức TT</label>
                    <select
                      value={posPaymentMethod}
                      onChange={(e) => setPosPaymentMethod(e.target.value as any)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-xl bg-white outline-none font-bold"
                    >
                      <option value="Chuyển khoản">Chuyển khoản QR</option>
                      <option value="Tiền mặt">Tiền mặt</option>
                      <option value="Thẻ">Thẻ quẹt POS</option>
                      <option value="Ví QR">Ví MoMo / ZaloPay</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Giảm Giá / Voucher (đ)</label>
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      value={posDiscount}
                      onChange={(e) => setPosDiscount(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-xl bg-white outline-none font-bold text-rose-600"
                    />
                  </div>
                </div>

                {/* Total Summary Box */}
                <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Tạm tính:</span>
                    <span className="font-bold text-slate-200">{posSubtotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                  {posDiscount > 0 && (
                    <div className="flex justify-between text-[11px] text-rose-400">
                      <span>Giảm giá:</span>
                      <span className="font-bold">-{posDiscount.toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-emerald-400">
                    <span className="text-xs font-black uppercase">Thành Tiền:</span>
                    <span className="text-lg font-black">{posTotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsPOSOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={posItems.length === 0}
              className={`px-5 py-2.5 text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 transition-all ${
                posItems.length === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20 hover:scale-105'
              }`}
            >
              <Receipt className="w-4 h-4" /> Thanh Toán & Hoàn Tất Đơn Hàng
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Invoice Drawer */}
      <Drawer
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        title="Hóa Đơn Thanh Toán (Invoice)"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Invoice Print Box */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm font-sans" id="printableInvoice">
              {/* Receipt Header */}
              <div className="border-b border-slate-200 pb-4 text-center space-y-1">
                <h2 className="text-xl font-black text-slate-900 tracking-wide uppercase">PETCARE PRO STORE</h2>
                <p className="text-xs text-slate-500 font-medium">Trung Tâm Dịch Vụ & Spa Thú Cưng Hàng Đầu</p>
                <p className="text-[11px] text-slate-400">ĐC: 123 Nguyễn Trãi, Q1, TP.HCM • Hotline: 1900 6789</p>
              </div>

              {/* Order Meta Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Mã Hóa Đơn:</p>
                  <p className="font-extrabold text-slate-900 text-sm">#{selectedOrder.code}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Ngày Giờ:</p>
                  <p className="font-bold text-slate-800">{selectedOrder.createdAt || selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Khách Hàng:</p>
                  <p className="font-extrabold text-slate-900">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Phương Thức TT:</p>
                  <p className="font-bold text-emerald-700">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                    <tr>
                      <th className="p-2">Tên Món</th>
                      <th className="p-2 text-center">SL</th>
                      <th className="p-2 text-right">Đơn Giá</th>
                      <th className="p-2 text-right">Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-bold text-slate-900">{item.name || item.productName}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-right text-slate-600">{item.price.toLocaleString('vi-VN')} đ</td>
                        <td className="p-2 text-right font-extrabold text-slate-900">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Summary */}
              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính dịch vụ & hàng hóa:</span>
                  <span className="font-bold">{(selectedOrder.totalAmount + (selectedOrder.discountAmount || 0)).toLocaleString('vi-VN')} đ</span>
                </div>
                {selectedOrder.discountAmount ? (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Chiết khấu / Giảm giá:</span>
                    <span>-{selectedOrder.discountAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-slate-900 text-base font-extrabold pt-2 border-t border-slate-200">
                  <span>TỔNG CỘNG (VAT inc.):</span>
                  <span className="text-emerald-600">{selectedOrder.totalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-dashed border-slate-200 text-[11px] text-slate-400 space-y-1">
                <p className="font-extrabold text-slate-700">Cảm ơn Quý khách và bé yêu đã đến PetCare Pro!</p>
                <p>Hóa đơn điện tử có giá trị bảo hành sản phẩm trong 7 ngày.</p>
              </div>
            </div>

            {/* Print Action */}
            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> In Hóa Đơn Bán Hàng
            </button>
          </div>
        )}
      </Drawer>
    </div>
  );
};
