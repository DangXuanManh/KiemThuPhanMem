import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { Customer } from '../types';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Dog, 
  ShoppingBag, 
  FileText,
  User
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { 
    customers, 
    pets, 
    orders, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer, 
    setActiveTab 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Add/Edit Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    tier: 'Đồng' as Customer['tier'],
    notes: '',
  });

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'all' || c.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', email: '', address: '', tier: 'Đồng', notes: '' });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      phone: c.phone,
      email: c.email,
      address: (c as any).address || '',
      tier: c.tier,
      notes: c.notes || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        tier: formData.tier,
        notes: formData.notes,
      } as any);
    }
    setIsAddModalOpen(false);
  };

  const handleViewDetail = (c: Customer) => {
    setSelectedCustomer(c);
    setIsDetailOpen(true);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Kim Cương': return <Badge variant="purple"><Award className="w-3 h-3 mr-1" /> Kim Cương</Badge>;
      case 'Vàng': return <Badge variant="warning"><Award className="w-3 h-3 mr-1" /> Vàng</Badge>;
      case 'Bạc': return <Badge variant="info"><Award className="w-3 h-3 mr-1" /> Bạc</Badge>;
      default: return <Badge variant="slate"><Award className="w-3 h-3 mr-1" /> Đồng</Badge>;
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quản Lý Khách Hàng</h1>
          <p className="text-xs text-slate-700 font-bold mt-1">Danh sách thành viên, tích điểm và lịch sử hoạt động</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm Khách Hàng Mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-500 text-slate-900 font-bold bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-extrabold text-slate-900 whitespace-nowrap">Hạng thành viên:</span>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 text-xs border-2 border-slate-300 rounded-xl bg-white font-extrabold text-slate-900 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Tất cả hạng</option>
            <option value="Đồng">Đồng</option>
            <option value="Bạc">Bạc</option>
            <option value="Vàng">Vàng</option>
            <option value="Kim Cương">Kim Cương</option>
          </select>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase tracking-wider border-b-2 border-slate-300">
              <tr>
                <th className="p-4">Khách Hàng</th>
                <th className="p-4">Số Điện Thoại</th>
                <th className="p-4">Hạng & Điểm Tích Lũy</th>
                <th className="p-4">Thú Cưng</th>
                <th className="p-4">Tổng Chi Tiêu</th>
                <th className="p-4">Ngày Tham Gia</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Không tìm thấy khách hàng phù hợp.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const customerPets = pets.filter(p => p.customerId === c.id || p.ownerId === c.id);
                  const customerOrders = orders.filter(o => o.customerId === c.id);
                  const totalSpent = customerOrders.reduce((sum, o) => sum + o.totalAmount, c.totalSpent || 0);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                            {getInitials(c.name)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">{c.name}</p>
                            <p className="text-slate-400 text-[11px]">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-700">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {getTierBadge(c.tier)}
                          <p className="text-[11px] font-bold text-amber-600">⭐ {c.points} điểm</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 w-max">
                          <Dog className="w-3.5 h-3.5" /> {customerPets.length} bé
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-emerald-600">
                        {totalSpent.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="p-4 text-slate-500 font-semibold">{c.createdAt || c.lastVisit}</td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleViewDetail(c)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                          title="Xem Chi Tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                          title="Sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCustomer(c.id)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Hồ Sơ Khách Hàng Chi Tiết"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Top Profile Card */}
            <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center border-2 border-emerald-400 shrink-0">
                  {getInitials(selectedCustomer.name)}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold">{selectedCustomer.name}</h2>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3 text-emerald-400" /> {selectedCustomer.phone}
                  </p>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3 text-emerald-400" /> {selectedCustomer.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Hạng Thành Viên</p>
                  <div className="mt-1">{getTierBadge(selectedCustomer.tier)}</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Điểm Tích Lũy</p>
                  <p className="text-base font-extrabold text-amber-400 mt-0.5">⭐ {selectedCustomer.points} pt</p>
                </div>
              </div>
            </div>

            {/* Address & Notes */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" /> Địa chỉ: {(selectedCustomer as any).address || '123 Nguyễn Trãi, Q1, TP.HCM'}
              </p>
              {selectedCustomer.notes && (
                <p className="text-xs text-slate-600 flex items-start gap-1.5 pt-1 border-t border-slate-200">
                  <FileText className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> Ghi chú: {selectedCustomer.notes}
                </p>
              )}
            </div>

            {/* Pets Owned */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Dog className="w-4 h-4 text-emerald-500" /> Danh Sách Thú Cưng Sở Hữu
                </h3>
                <button 
                  onClick={() => { setIsDetailOpen(false); setActiveTab('pets'); }}
                  className="text-[11px] font-extrabold text-emerald-600 hover:underline"
                >
                  Quản lý thú cưng →
                </button>
              </div>

              <div className="space-y-2">
                {pets.filter(p => p.customerId === selectedCustomer.id || p.ownerId === selectedCustomer.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Khách hàng chưa đăng ký thú cưng nào.</p>
                ) : (
                  pets.filter(p => p.customerId === selectedCustomer.id || p.ownerId === selectedCustomer.id).map(pet => (
                    <div key={pet.id} className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                          {pet.species === 'Cat' ? '🐱' : '🐶'}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs">{pet.name} ({pet.breed})</p>
                          <p className="text-[10px] text-slate-500">{pet.gender} • {pet.weight} kg • {pet.age} tuổi</p>
                        </div>
                      </div>
                      <Badge variant={pet.species === 'Cat' ? 'purple' : 'info'}>{pet.species === 'Cat' ? 'Mèo' : 'Chó'}</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-blue-500" /> Lịch Sử Đơn Hàng & Dịch Vụ
              </h3>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {orders.filter(o => o.customerId === selectedCustomer.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Chưa có giao dịch phát sinh.</p>
                ) : (
                  orders.filter(o => o.customerId === selectedCustomer.id).map(o => (
                    <div key={o.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">#{o.code} ({o.date})</p>
                        <p className="text-[10px] text-slate-500">{o.items.map(i => i.productName || (i as any).name).join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-emerald-600">{o.totalAmount.toLocaleString('vi-VN')} đ</p>
                        <Badge variant="success">{o.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingCustomer ? 'Chỉnh Sửa Thông Tin Khách Hàng' : 'Thêm Khách Hàng Mới'}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên khách hàng *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Nguyễn Văn A"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0901234567"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="khachhang@gmail.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ liên hệ</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="VD: 123 Nguyễn Trãi, Q1, TP.HCM"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hạng thành viên</label>
            <select
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
            >
              <option value="Đồng">Đồng</option>
              <option value="Bạc">Bạc</option>
              <option value="Vàng">Vàng</option>
              <option value="Kim Cương">Kim Cương</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú quan trọng</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ghi chú về thói quen, yêu cầu đặc biệt của khách..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-emerald-600"
            >
              {editingCustomer ? 'Cập Nhật' : 'Tạo Khách Hàng'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
