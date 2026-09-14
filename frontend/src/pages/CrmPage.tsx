import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/Badge';
import { 
  Users, 
  Award, 
  Gift, 
  Cake, 
  BellRing, 
  MessageSquare, 
  Send, 
  Calendar, 
  Sparkles, 
  Star,
  CheckCircle2
} from 'lucide-react';

export const CrmPage: React.FC = () => {
  const { customers, pets, setActiveTab } = useStore();
  const [remindedIds, setRemindedIds] = useState<string[]>([]);
  const [giftSentIds, setGiftSentIds] = useState<string[]>([]);

  // Retention Alert: customers created before August 2026 or high spend who haven't visited recently
  const inactiveCustomers = customers.slice(0, 8); // Demo simulation of inactive customer list >30 days
  const birthdayPets = pets.slice(0, 5); // Demo upcoming pet birthdays

  const handleSendReminder = (id: string, name: string) => {
    setRemindedIds([...remindedIds, id]);
    alert(`Đã gửi tin nhắn Zalo/SMS nhắc lịch chăm sóc tự động tới khách hàng ${name}!`);
  };

  const handleSendBirthdayGift = (id: string, petName: string) => {
    setGiftSentIds([...giftSentIds, id]);
    alert(`Đã gửi Voucher sinh nhật 20% giảm giá tắm rửa cho bé ${petName}!`);
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Chăm Sóc Khách Hàng (CRM & Retention)</h1>
          <p className="text-xs text-slate-500 mt-1">Chương trình tích điểm, nhắc lịch &gt; 30 ngày và mừng sinh nhật bé yêu</p>
        </div>
      </div>

      {/* Member Tier System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-900 to-slate-900 text-white p-5 rounded-3xl space-y-2 border border-amber-800/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">Hạng Đồng</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold">0 - 2 Tr đ</p>
          <p className="text-[11px] text-slate-300">Tích 1% điểm cho mọi đơn hàng</p>
        </div>

        <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white p-5 rounded-3xl space-y-2 border border-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Hạng Bạc</span>
            <Award className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-2xl font-extrabold">2 - 5 Tr đ</p>
          <p className="text-[11px] text-slate-300">Tích 3% điểm + Giảm 5% DV sinh nhật</p>
        </div>

        <div className="bg-gradient-to-br from-amber-600 to-slate-900 text-white p-5 rounded-3xl space-y-2 border border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">Hạng Vàng</span>
            <Award className="w-5 h-5 text-amber-300" />
          </div>
          <p className="text-2xl font-extrabold">5 - 15 Tr đ</p>
          <p className="text-[11px] text-slate-200">Tích 5% điểm + Ưu tiên đặt ca VIP</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-slate-900 text-white p-5 rounded-3xl space-y-2 border border-purple-800/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300">Hạng Kim Cương</span>
            <Award className="w-5 h-5 text-purple-300" />
          </div>
          <p className="text-2xl font-extrabold">&gt; 15 Tr đ</p>
          <p className="text-[11px] text-purple-200">Tích 10% điểm + Free Đưa đón bé tận nơi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Reminder Section (>30 days without visit) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <BellRing className="w-5 h-5 text-amber-500" />
                Cảnh Báo Khách Lâu Chưa Spa (&gt; 30 Ngày)
              </h3>
              <p className="text-xs text-slate-700 font-bold mt-0.5">Tự động gợi ý tin nhắn Zalo/SMS nhắc lịch cắt tỉa lông bé</p>
            </div>
            <Badge variant="warning">{inactiveCustomers.length} khách</Badge>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {inactiveCustomers.map((c) => {
              const isReminded = remindedIds.includes(c.id);
              return (
                <div key={c.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                      {getInitials(c.name)}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">{c.name}</p>
                      <p className="text-[11px] text-slate-700 font-bold">SĐT: {c.phone} • Hạng {c.tier}</p>
                      <p className="text-[10px] font-extrabold text-rose-700 mt-0.5">⚠️ Chưa ghé cửa hàng 35 ngày</p>
                    </div>
                  </div>

                  <button
                    disabled={isReminded}
                    onClick={() => handleSendReminder(c.id, c.name)}
                    className={`px-3 py-1.5 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 ${
                      isReminded
                        ? 'bg-slate-300 text-slate-800 cursor-not-allowed border border-slate-400'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-sm'
                    }`}
                  >
                    {isReminded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Đã Gửi SMS
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Gửi Remind Zalo
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pet Birthday Reminder Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Cake className="w-5 h-5 text-purple-500" />
                Sinh Nhật Thú Cưng Trong Tháng
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Gửi mã quà tặng giảm giá 20% dịch vụ dịp sinh nhật bé</p>
            </div>
            <Badge variant="purple">{birthdayPets.length} bé</Badge>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {birthdayPets.map((pet) => {
              const isGiftSent = giftSentIds.includes(pet.id);
              return (
                <div key={pet.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-base shrink-0">
                      {pet.species === 'Cat' ? '🐱' : '🐶'}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">🎂 Bé {pet.name} ({pet.breed})</p>
                      <p className="text-[11px] text-slate-500">Chủ nuôi: {pet.ownerName || pet.customerName}</p>
                      <p className="text-[10px] font-bold text-purple-600 mt-0.5">🎉 Tròn {pet.age} tuổi trong 3 ngày tới</p>
                    </div>
                  </div>

                  <button
                    disabled={isGiftSent}
                    onClick={() => handleSendBirthdayGift(pet.id, pet.name)}
                    className={`px-3 py-1.5 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 ${
                      isGiftSent
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                    }`}
                  >
                    {isGiftSent ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã Tặng Voucher
                      </>
                    ) : (
                      <>
                        <Gift className="w-3.5 h-3.5" /> Tặng Quà 20%
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
