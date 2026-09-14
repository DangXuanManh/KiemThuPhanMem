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
  Trash2,
  Receipt,
  Sparkles
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { 
    orders, 
    customers, 
    products, 
    services, 
    addOrder, 
    updateOrderStatus 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // New POS Order Modal State
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [posCustomerId, setPosCustomerId] = useState(customers[0]?.id || '');
  const [posItems, setPosItems] = useState<OrderItem[]>([]);
  const [posDiscount, setPosDiscount] = useState(0);
  const [posPaymentMethod, setPosPaymentMethod] = useState<'Tiền mặt' | 'Chuyển khoản' | 'Thẻ' | 'Ví QR'>('Chuyển khoản');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate POS summary
  const posSubtotal = posItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const posTotal = Math.max(0, posSubtotal - posDiscount);

  const handleAddItemToPOS = (type: 'product' | 'service', id: string) => {
    let name = '';
    let price = 0;

    if (type === 'product') {
      const prod = products.find(p => p.id === id);
      if (prod) {
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

  const handleRemovePOSItem = (index: number) => {
    setPosItems(posItems.filter((_, i) => i !== index));
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (posItems.length === 0) return alert('Vui lòng chọn ít nhất 1 sản phẩm hoặc dịch vụ!');

    const customer = customers.find(c => c.id === posCustomerId);
    const customerName = customer ? customer.name : 'Khách vãng lai';

    addOrder({
      customerId: posCustomerId,
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
  };

  const handleViewInvoice = (order: Order) => {
    setSelectedOrder(order);
    setIsInvoiceOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã thanh toán': 
      case 'Hoàn thành': 
        return <Badge variant="success"><CheckCircle2 className="w-3 h-3 mr-1" /> Đã thanh toán</Badge>;
      case 'Chờ thanh toán': 
        return <Badge variant="warning"><Clock3 className="w-3 h-3 mr-1" /> Chờ thanh toán</Badge>;
      case 'Đã hủy': 
        return <Badge variant="danger"><XCircle className="w-3 h-3 mr-1" /> Đã hủy</Badge>;
      default: 
        return <Badge>{status}</Badge>;
    }
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
          onClick={() => setIsPOSOpen(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <Receipt className="w-4 h-4" /> Bán Hàng Mới (POS)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn HD..., tên khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-slate-50/50"
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
                    Không có hóa đơn đơn hàng nào.
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

      {/* POS New Order Modal */}
      <Modal
        isOpen={isPOSOpen}
        onClose={() => setIsPOSOpen(false)}
        title="Tạo Đơn Hàng Mới Tại Quầy (POS)"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Khách Hàng</label>
            <select
              value={posCustomerId}
              onChange={(e) => setPosCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone}) - Hạng {c.tier}</option>
              ))}
            </select>
          </div>

          {/* Selector for adding item */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">+ Thêm Sản Phẩm</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddItemToPOS('product', e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="">-- Chọn sản phẩm shop --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - {p.sellPrice.toLocaleString('vi-VN')}đ (Kho: {p.stock})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">+ Thêm Dịch Vụ</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddItemToPOS('service', e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="">-- Chọn dịch vụ spa/grooming --</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name} - {s.price.toLocaleString('vi-VN')}đ</option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Items Cart List */}
          <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-2xl p-3">
            <p className="text-[11px] font-bold text-slate-500 uppercase">Giỏ hàng thanh toán ({posItems.length} món):</p>
            {posItems.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">Chưa chọn món nào vào giỏ hàng.</p>
            ) : (
              posItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-100 text-xs font-semibold">
                  <div className="flex-1">
                    <p className="font-extrabold text-slate-900">{item.name || item.productName}</p>
                    <p className="text-slate-400 text-[11px]">{item.price.toLocaleString('vi-VN')} đ / món</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        const updated = [...posItems];
                        updated[idx].quantity = val;
                        setPosItems(updated);
                      }}
                      className="w-12 px-2 py-1 border rounded-lg text-center font-bold"
                    />
                    <span className="font-extrabold text-emerald-600 min-w-[70px] text-right">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePOSItem(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phương Thức Thanh Toán</label>
              <select
                value={posPaymentMethod}
                onChange={(e) => setPosPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              >
                <option value="Chuyển khoản">Chuyển khoản QR</option>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Thẻ">Thẻ quẹt POS</option>
                <option value="Ví QR">Ví MoMo / ZaloPay</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giảm giá / Voucher (VNĐ)</label>
              <input
                type="number"
                value={posDiscount}
                onChange={(e) => setPosDiscount(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>
          </div>

          {/* Total Calculation */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Tạm tính: {posSubtotal.toLocaleString('vi-VN')} đ</p>
              <p className="text-sm font-extrabold text-emerald-400">TỔNG CỘNG THANH TOÁN:</p>
            </div>
            <p className="text-2xl font-extrabold text-emerald-400">{posTotal.toLocaleString('vi-VN')} đ</p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPOSOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-emerald-600 shadow-md"
            >
              Thanh Toán & Xuất Hóa Đơn
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
