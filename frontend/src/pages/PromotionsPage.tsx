import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Promotion } from '../types';
import { 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Copy, 
  CheckCircle2, 
  Percent, 
  DollarSign, 
  Clock
} from 'lucide-react';

export const PromotionsPage: React.FC = () => {
  const { 
    promotions, 
    addPromotion, 
    updatePromotion, 
    deletePromotion 
  } = useStore();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discountType: 'percentage' as Promotion['discountType'],
    discountValue: 10,
    minOrderValue: 200000,
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    usageLimit: 100,
    isActive: true,
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenAddModal = () => {
    setEditingPromotion(null);
    setFormData({
      code: `PET${Math.floor(10 + Math.random() * 90)}OFF`,
      name: '',
      discountType: 'percentage',
      discountValue: 15,
      minOrderValue: 200000,
      startDate: '2026-09-01',
      endDate: '2026-09-30',
      usageLimit: 50,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Promotion) => {
    setEditingPromotion(p);
    setFormData({
      code: p.code,
      name: p.name,
      discountType: p.discountType,
      discountValue: p.discountValue,
      minOrderValue: p.minOrderValue,
      startDate: p.startDate,
      endDate: p.endDate,
      usageLimit: p.usageLimit,
      isActive: p.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromotion) {
      updatePromotion(editingPromotion.id, formData);
    } else {
      addPromotion({
        ...formData,
        usedCount: 0,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Khuyến Mãi & Mã Giảm Giá</h1>
          <p className="text-xs text-slate-500 mt-1">Tạo mã ưu đãi, voucher tri ân và chiến dịch marketing cửa hàng</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tạo Mã Ưu Đãi Mới
        </button>
      </div>

      {/* Promotions List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.length === 0 ? (
          <div className="col-span-full bg-white p-8 text-center text-slate-400 rounded-3xl border border-slate-200">
            Chưa có chương trình khuyến mãi nào.
          </div>
        ) : (
          promotions.map((p) => {
            const promoName = p.name || p.title || 'Chương trình KM';
            const promoValue = p.discountValue ?? p.value ?? 0;
            const isPercent = p.discountType === 'percentage' || p.discountType === 'percent';
            const promoActive = p.isActive ?? (p.status === 'Hoạt động');
            const promoMinOrder = p.minOrderValue ?? 0;
            const promoStart = p.startDate || '';
            const promoEnd = p.endDate || p.validUntil || '';
            const promoUsed = p.usedCount ?? p.usageCount ?? 0;
            const promoLimit = p.usageLimit ?? p.maxUsage ?? 0;

            return (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                      <Tag className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{promoName}</h3>
                      <span className="text-[11px] font-mono font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {p.code}
                      </span>
                    </div>
                  </div>
                  <Badge variant={promoActive ? 'success' : 'slate'}>
                    {promoActive ? 'Đang chạy' : 'Đã kết thúc'}
                  </Badge>
                </div>

                {/* Discount Display */}
                <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Mức giảm giá:</p>
                    <p className="text-xl font-extrabold text-emerald-400">
                      {isPercent 
                        ? `${promoValue}% OFF` 
                        : `${promoValue.toLocaleString('vi-VN')} đ`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(p.code)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                  >
                    {copiedCode === p.code ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode === p.code ? 'Đã copy!' : 'Copy Code'}
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-800 font-bold">
                  {promoMinOrder > 0 && <p>🛒 Đơn tối thiểu: <strong className="text-slate-900">{promoMinOrder.toLocaleString('vi-VN')} đ</strong></p>}
                  <p>📅 Thời gian: <strong className="text-slate-900">{promoStart || 'N/A'}</strong> đến <strong className="text-slate-900">{promoEnd}</strong></p>
                  <p>📊 Lượt đã dùng: <strong className="text-emerald-700">{promoUsed} / {promoLimit} lượt</strong></p>
                  {p.targetSegment && <p>🎯 Đối tượng: <strong className="text-slate-900">{p.targetSegment}</strong></p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
                <button
                  onClick={() => handleOpenEditModal(p)}
                  className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                  title="Sửa"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletePromotion(p.id)}
                  className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )})
        )}
      </div>

      {/* Add / Edit Promotion Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPromotion ? 'Chỉnh Sửa Mã Khuyến Mãi' : 'Tạo Mã Giảm Giá Mới'}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mã Voucher (Code) *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="VD: KHAMPHA20"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-mono font-bold uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên chương trình *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Tri ân khách hàng tháng 9..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Loại giảm giá</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              >
                <option value="percentage">Phần trăm (%)</option>
                <option value="fixed">Số tiền cố định (VNĐ)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giá trị giảm *</label>
              <input
                type="number"
                required
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) || 0 })}
                placeholder={formData.discountType === 'percentage' ? '15' : '50000'}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-extrabold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Đơn hàng tối thiểu (VNĐ)</label>
              <input
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giới hạn số lượt dùng</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || 100 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ngày hết hạn</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPromoActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="isPromoActive" className="text-xs font-bold text-slate-700 cursor-pointer">
              Kích hoạt chạy chiến dịch ngay
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-emerald-600"
            >
              {editingPromotion ? 'Cập Nhật' : 'Tạo Voucher'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
