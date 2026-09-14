import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { 
  Settings, 
  Store, 
  Clock, 
  Bell, 
  ShieldCheck, 
  Save, 
  Smartphone, 
  CheckCircle2,
  Database,
  Globe
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    name: 'PetCare Pro Center',
    phone: '1900 6789',
    email: 'contact@petcarepro.com',
    address: '123 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    website: 'https://petcarepro.com',
    openTime: '08:00',
    closeTime: '21:00',
    maxSlotsPerHour: 5,
    enableZaloSMS: true,
    enableAutoReminder: true,
    reminderDays: 30,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-8 max-w-5xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Cấu Hình & Cài Đặt Hệ Thống</h1>
          <p className="text-xs text-slate-500 mt-1">Thông tin cửa hàng, giờ mở cửa, tích hợp Zalo SMS và thông số hệ thống</p>
        </div>

        {savedSuccess && (
          <Badge variant="success">
            <CheckCircle2 className="w-4 h-4 mr-1" /> Đã lưu cài đặt thành công!
          </Badge>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Info Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-500" />
            <h2 className="font-extrabold text-slate-900 text-base">Thông Tin Cửa Hàng</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên Thương Hiệu Cửa Hàng *</label>
              <input
                type="text"
                required
                value={storeInfo.name}
                onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hotline Liên Hệ *</label>
              <input
                type="text"
                required
                value={storeInfo.phone}
                onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Hỗ Trợ Khách Hàng</label>
              <input
                type="email"
                value={storeInfo.email}
                onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Website Hệ Thống</label>
              <input
                type="text"
                value={storeInfo.website}
                onChange={(e) => setStoreInfo({ ...storeInfo, website: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Địa Chỉ Đăng Ký Cửa Hàng</label>
              <input
                type="text"
                value={storeInfo.address}
                onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours & Capacity */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-slate-900 text-base">Giờ Phục Vụ & Công Suất Đặt Lịch</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giờ Mở Cửa</label>
              <input
                type="time"
                value={storeInfo.openTime}
                onChange={(e) => setStoreInfo({ ...storeInfo, openTime: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giờ Đóng Cửa</label>
              <input
                type="time"
                value={storeInfo.closeTime}
                onChange={(e) => setStoreInfo({ ...storeInfo, closeTime: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số ca tối đa / 1 khung giờ</label>
              <input
                type="number"
                value={storeInfo.maxSlotsPerHour}
                onChange={(e) => setStoreInfo({ ...storeInfo, maxSlotsPerHour: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold text-center"
              />
            </div>
          </div>
        </div>

        {/* Zalo OA & SMS Integration */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-500" />
            <h2 className="font-extrabold text-slate-900 text-base">Tích Hợp Thông Báo Tự Động (Zalo OA / SMS)</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="font-extrabold text-slate-900 text-xs">Bật gửi tin nhắn Zalo OA khi đặt lịch thành công</p>
                <p className="text-[11px] text-slate-500">Tự động nhắn xác nhận ca cho khách hàng qua Zalo</p>
              </div>
              <input
                type="checkbox"
                checked={storeInfo.enableZaloSMS}
                onChange={(e) => setStoreInfo({ ...storeInfo, enableZaloSMS: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 cursor-pointer rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="font-extrabold text-slate-900 text-xs">Tự động nhắc lịch cắt tỉa lông khi quá {storeInfo.reminderDays} ngày</p>
                <p className="text-[11px] text-slate-500">Tăng tỷ lệ khách hàng quay lại chăm sóc bé định kỳ</p>
              </div>
              <input
                type="checkbox"
                checked={storeInfo.enableAutoReminder}
                onChange={(e) => setStoreInfo({ ...storeInfo, enableAutoReminder: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 cursor-pointer rounded"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Lưu Tất Cả Thay Đổi
          </button>
        </div>
      </form>
    </div>
  );
};
