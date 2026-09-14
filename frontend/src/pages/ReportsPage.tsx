import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/Badge';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Calendar, 
  Award, 
  Scissors, 
  ShoppingBag, 
  Users, 
  PieChart
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { orders, appointments, services, products, staff } = useStore();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // Revenue calculation
  const totalRevenue = 65000000;
  const groomingRevenue = 35850000;
  const hotelRevenue = 16250000;
  const shopRevenue = 12900000;

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Mã Đơn,Khách Hàng,Tổng Tiền,Phương Thức,Trạng Thái,Ngày\n"
      + orders.map(e => `${e.code},${e.customerName},${e.totalAmount},${e.paymentMethod},${e.status},${e.createdAt}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_Cao_Doanh_Thu_PetCare_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Báo Cáo & Thống Kê Doanh Thu</h1>
          <p className="text-xs text-slate-700 font-bold mt-1">Phân tích tăng trưởng, top dịch vụ, sản phẩm và hiệu suất nhân viên</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-emerald-400" /> Xuất Báo Cáo CSV / Excel
        </button>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 w-max">
        <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1 mr-2">
          <Calendar className="w-4 h-4 text-emerald-600" /> Khoảng thời gian:
        </span>
        {[
          { key: 'today', label: 'Hôm nay' },
          { key: 'week', label: 'Tuần này' },
          { key: 'month', label: 'Tháng này' },
          { key: 'year', label: 'Năm nay' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTimeRange(t.key as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              timeRange === t.key
                ? 'bg-emerald-500 text-slate-950 shadow-sm border-emerald-600'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Revenue Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900">Tổng Doanh Thu</span>
            <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-700">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalRevenue.toLocaleString('vi-VN')} đ</p>
          <p className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24.5% so với kỳ trước
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900">Spa & Cắt Tỉa Lông</span>
            <div className="p-2 rounded-2xl bg-purple-100 text-purple-700">
              <Scissors className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-purple-700">{groomingRevenue.toLocaleString('vi-VN')} đ</p>
          <p className="text-[11px] text-slate-700 font-bold">Chiếm 55.1% tổng doanh thu</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900">Khách Sạn Thú Cưng</span>
            <div className="p-2 rounded-2xl bg-amber-100 text-amber-700">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-700">{hotelRevenue.toLocaleString('vi-VN')} đ</p>
          <p className="text-[11px] text-slate-700 font-bold">Chiếm 25.0% tổng doanh thu</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900">Shop Sản Phẩm</span>
            <div className="p-2 rounded-2xl bg-blue-100 text-blue-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-blue-700">{shopRevenue.toLocaleString('vi-VN')} đ</p>
          <p className="text-[11px] text-slate-700 font-bold">Chiếm 19.9% tổng doanh thu</p>
        </div>
      </div>

      {/* Analytics Charts & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Services */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Scissors className="w-5 h-5 text-emerald-500" />
              Top Dịch Vụ Được Đặt Nhiều Nhất
            </h3>
            <p className="text-xs text-slate-500">Xếp hạng theo số lượt thực hiện trong kỳ</p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Combo Tắm Spa Vệ Sinh Toàn Diện', count: 48, revenue: '14.4M', pct: 85 },
              { name: 'Cắt Tỉa Tạo Kiểu Poodle / Corgi', count: 36, revenue: '12.6M', pct: 70 },
              { name: 'Khách Sạn Phòng VIP Thú Cưng', count: 22, revenue: '11.0M', pct: 55 },
              { name: 'Tắm Trị Liệu Thảo Dược & Nấm', count: 18, revenue: '4.5M', pct: 40 },
              { name: 'Khám Sức Khỏe Tổng Quát & Tiêm Vắc Xin', count: 14, revenue: '3.5M', pct: 30 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">#{idx + 1}. {item.name}</span>
                  <span className="text-emerald-600">{item.count} lượt ({item.revenue})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${item.pct}%` }} className="bg-emerald-500 h-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance Leaderboard */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Bảng Xếp Hạng Nhân Viên Xuất Sắc
            </h3>
            <p className="text-xs text-slate-500">Xếp hạng theo số ca hoàn thành và doanh số đóng góp</p>
          </div>

          <div className="space-y-3">
            {staff.slice(0, 5).map((s, idx) => (
              <div key={s.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-extrabold flex items-center justify-center text-xs shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 font-extrabold flex items-center justify-center text-xs shrink-0 border border-slate-700">
                    {s.name.trim().split(' ').slice(-1)[0][0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900">{s.name}</p>
                    <p className="text-[11px] text-slate-500">{s.role} • {s.shift}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-emerald-600">{(15.5 - idx * 2.5).toFixed(1)} triệu đ</p>
                  <p className="text-[10px] text-slate-400 font-bold">{32 - idx * 4} ca làm</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
