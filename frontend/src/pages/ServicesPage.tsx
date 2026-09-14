import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Service } from '../types';
import { 
  Scissors, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  Sparkles,
  Hotel,
  ShowerHead,
  Stethoscope,
  Power
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { 
    services, 
    addService, 
    updateService, 
    deleteService, 
    toggleServiceActive,
    setActiveTab 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cắt tỉa lông' as Service['category'],
    durationMins: 60,
    price: 150000,
    description: '',
    active: true,
  });

  const categories = ['all', 'Tắm & vệ sinh', 'Cắt tỉa lông', 'Spa', 'Khách sạn thú cưng', 'Cắt móng', 'Vệ sinh tai', 'Trông giữ'];

  const filteredServices = services.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      category: 'Cắt tỉa lông',
      durationMins: 60,
      price: 180000,
      description: '',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s: Service) => {
    setEditingService(s);
    setFormData({
      name: s.name,
      category: s.category,
      durationMins: s.durationMins || 60,
      price: s.price || 150000,
      description: s.description || '',
      active: s.active !== undefined ? s.active : (s as any).isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, {
        ...formData,
        active: formData.active,
        isActive: formData.active,
      } as any);
    } else {
      addService({
        ...formData,
        active: formData.active,
        isActive: formData.active,
      } as any);
    }
    setIsModalOpen(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tắm & vệ sinh': return <ShowerHead className="w-5 h-5 text-emerald-600" />;
      case 'Cắt tỉa lông': return <Scissors className="w-5 h-5 text-purple-600" />;
      case 'Khách sạn thú cưng': 
      case 'Trông giữ': return <Hotel className="w-5 h-5 text-amber-600" />;
      case 'Spa': return <Sparkles className="w-5 h-5 text-blue-600" />;
      default: return <Stethoscope className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Danh Mục Dịch Vụ Cửa Hàng</h1>
          <p className="text-xs text-slate-500 mt-1">Quản lý bảng giá, thời lượng và trạng thái hoạt động dịch vụ nội bộ</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm Dịch Vụ Mới
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-500 text-slate-900 font-bold bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm border-slate-900'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300'
              }`}
            >
              {cat === 'all' ? '✨ Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length === 0 ? (
          <div className="col-span-full bg-white p-8 text-center text-slate-700 font-bold rounded-3xl border border-slate-200">
            Không có dịch vụ nào phù hợp.
          </div>
        ) : (
          filteredServices.map((s) => {
            const isServiceActive = s.active !== undefined ? s.active : (s as any).isActive ?? true;

            return (
              <div
                key={s.id}
                className={`bg-white rounded-3xl border shadow-sm p-5 space-y-4 flex flex-col justify-between transition-all ${
                  isServiceActive ? 'border-slate-200 hover:border-emerald-300 hover:shadow-md' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        {getCategoryIcon(s.category)}
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">{s.category}</span>
                        <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{s.name}</h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 font-semibold line-clamp-2 leading-relaxed">{s.description}</p>

                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                    <span className="text-slate-500 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" /> {s.durationMins || 60} phút
                    </span>
                    <span className="font-extrabold text-emerald-600 text-sm">
                      {s.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions: Toggle Active + Edit / Delete */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleServiceActive(s.id)}
                    className={`px-3 py-1.5 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 ${
                      isServiceActive
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    <Power className={`w-3.5 h-3.5 ${isServiceActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                    {isServiceActive ? 'Đang Hoạt Động' : 'Đang Tạm Ẩn'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(s)}
                      className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                      title="Chỉnh sửa dịch vụ"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteService(s.id)}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                      title="Xóa dịch vụ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên dịch vụ *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Tắm Spa Thảo Dược, Cắt Tỉa Tạo Kiểu..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phân loại dịch vụ</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              >
                {categories.filter(c => c !== 'all').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian dự kiến (phút)</label>
              <input
                type="number"
                value={formData.durationMins}
                onChange={(e) => setFormData({ ...formData, durationMins: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Đơn giá dịch vụ (VNĐ) *</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-extrabold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả quy trình dịch vụ</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Chi tiết các bước thực hiện dịch vụ..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActiveToggle"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="isActiveToggle" className="text-xs font-bold text-slate-700 cursor-pointer">
              Bật trạng thái hoạt động (Cho phép nhận lịch đặt dịch vụ)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-emerald-600"
            >
              {editingService ? 'Cập Nhật' : 'Tạo Dịch Vụ'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
