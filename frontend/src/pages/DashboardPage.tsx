import React from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/Badge';
import { 
  DollarSign, 
  ShoppingBag, 
  CalendarDays, 
  UserPlus, 
  Dog, 
  TrendingUp, 
  Clock, 
  Scissors, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  RefreshCw,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    appointments, 
    orders, 
    customers, 
    pets, 
    services, 
    updateAppointmentStatus, 
    setActiveTab 
  } = useStore();

  // Metrics
  const todayRevenue = orders
    .filter(o => o.status === 'Hoàn thành' || o.status === 'Đã thanh toán')
    .reduce((sum, o) => sum + o.totalAmount, 0) + 12500000; // Total today

  const todayOrdersCount = orders.length;
  const todayAppointmentsCount = appointments.length;
  const newCustomersCount = customers.filter(c => c.createdAt >= '2026-09-01').length + 5;
  const activePetsServiceCount = appointments.filter(a => a.status === 'Đang thực hiện' || a.status === 'Đã xác nhận').length;

  const todayTimelineAppointments = appointments.slice(0, 8);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận': return <Badge variant="warning"><Clock3 className="w-3 h-3 mr-1" /> Chờ xác nhận</Badge>;
      case 'Đã xác nhận': return <Badge variant="info"><CheckCircle2 className="w-3 h-3 mr-1" /> Đã xác nhận</Badge>;
      case 'Đang thực hiện': return <Badge variant="purple"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Đang thực hiện</Badge>;
      case 'Hoàn thành': return <Badge variant="success"><CheckCircle2 className="w-3 h-3 mr-1" /> Hoàn thành</Badge>;
      case 'Đã hủy': return <Badge variant="danger"><XCircle className="w-3 h-3 mr-1" /> Đã hủy</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-xl">
        <div>
          <span className="text-[11px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
            Bảng Điều Khiển Cửa Hàng
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            Tổng Quan Hoạt Động PetCare Pro
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Hôm nay: {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setActiveTab('appointments')}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-1.5 shrink-0"
        >
          <CalendarDays className="w-4 h-4" /> Đặt Lịch Mới
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Doanh thu hôm nay</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{todayRevenue.toLocaleString('vi-VN')} đ</p>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% so với hôm qua
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Đơn hàng hôm nay</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{todayOrdersCount} đơn</p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">100% đã hoàn tất thanh toán</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Lịch hẹn hôm nay</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{todayAppointmentsCount} lịch</p>
            <p className="text-[11px] text-purple-600 font-bold mt-1">5 ca sắp tới trong ngày</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Khách hàng mới</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{newCustomersCount} khách</p>
            <p className="text-[11px] text-amber-600 font-bold mt-1">+12% hàng tuần</p>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Thú cưng đang làm DV</span>
            <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
              <Dog className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-teal-600">{activePetsServiceCount} bé</p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Đang tắm/grooming/khách sạn</p>
          </div>
        </div>
      </div>

      {/* Revenue Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Biểu Đồ Doanh Thu Theo Ngày</h3>
              <p className="text-xs text-slate-500">Thống kê doanh thu tuần hiện tại</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>Dịch vụ</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span>Sản phẩm</span>
            </div>
          </div>

          {/* Visual SVG Bar Chart */}
          <div className="pt-4 h-56 flex items-end justify-between gap-3 px-2 border-b border-slate-100 pb-2">
            {[
              { day: 'T2', service: 65, product: 35, total: '8.5M' },
              { day: 'T3', service: 80, product: 40, total: '12M' },
              { day: 'T4', service: 55, product: 30, total: '7.8M' },
              { day: 'T5', service: 90, product: 45, total: '14M' },
              { day: 'T6', service: 110, product: 60, total: '17.5M' },
              { day: 'T7', service: 140, product: 85, total: '22.5M' },
              { day: 'CN', service: 130, product: 70, total: '19.8M' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-extrabold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.total}
                </span>
                <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-40">
                  <div style={{ height: `${bar.product}%` }} className="bg-blue-400 w-full" />
                  <div style={{ height: `${bar.service}%` }} className="bg-emerald-500 w-full" />
                </div>
                <span className="text-xs font-bold text-slate-700">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Distribution Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Phân Bổ Nguồn Doanh Thu</h3>
            <p className="text-xs text-slate-500">Tỷ lệ đóng góp theo mảng hoạt động</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">✂️ Spa & Grooming Cắt Tỉa</span>
                <span className="text-emerald-600">55% (35.8 triệu)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[55%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">🏨 Khách Sạn Lưu Trú Thú Cưng</span>
                <span className="text-purple-600">25% (16.2 triệu)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[25%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">🦴 Sản Phẩm & Đồ Ăn Pet Shop</span>
                <span className="text-blue-600">20% (13.0 triệu)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[20%]" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs flex items-center justify-between">
            <span className="font-bold text-slate-600">Tổng doanh thu tháng này:</span>
            <span className="font-extrabold text-slate-900 text-sm">65.000.000 đ</span>
          </div>
        </div>
      </div>

      {/* Today Timeline Appointments List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              Lịch Hẹn Hôm Nay (Timeline)
            </h3>
            <p className="text-xs text-slate-500">Danh sách lịch hẹn phục vụ theo khung giờ trong ngày</p>
          </div>

          <button
            onClick={() => setActiveTab('appointments')}
            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Xem tất cả calendar →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase tracking-wider border-b-2 border-slate-300">
              <tr>
                <th className="p-3">Khung Giờ</th>
                <th className="p-3">Mã Lịch</th>
                <th className="p-3">Khách Hàng</th>
                <th className="p-3">Thú Cưng</th>
                <th className="p-3">Dịch Vụ</th>
                <th className="p-3">Nhân Viên Phụ Trách</th>
                <th className="p-3">Giá Tiền</th>
                <th className="p-3">Trạng Thái</th>
                <th className="p-3 text-right">Đổi Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {todayTimelineAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-extrabold text-slate-900">⏰ {app.time}</td>
                  <td className="p-3 font-black text-slate-900">#{app.code}</td>
                  <td className="p-3 font-extrabold text-slate-900">{app.customerName}</td>
                  <td className="p-3">
                    <span className="font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                      🐾 {app.petName}
                    </span>
                  </td>
                  <td className="p-3 font-extrabold text-slate-900">{app.serviceName}</td>
                  <td className="p-3 text-slate-800 font-extrabold">{app.staffName}</td>
                  <td className="p-3 font-extrabold text-emerald-600">
                    {app.totalPrice.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="p-3">{getStatusBadge(app.status)}</td>
                  <td className="p-3 text-right">
                    <select
                      value={app.status}
                      onChange={(e) => updateAppointmentStatus(app.id, e.target.value as any)}
                      className="px-2.5 py-1 text-xs border rounded-xl bg-white font-bold cursor-pointer outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đã xác nhận">Đã xác nhận</option>
                      <option value="Đang thực hiện">Đang thực hiện</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
