import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Product } from '../types';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Package, 
  DollarSign, 
  Layers, 
  RefreshCw,
  LayoutGrid,
  List
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProductStock,
    adjustStock,
    deleteProduct 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Stock Adjust Modal
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedStockProduct, setSelectedStockProduct] = useState<Product | null>(null);
  const [stockDelta, setStockDelta] = useState(10);

  // Add / Edit Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Thức ăn' as Product['category'],
    sellPrice: 100000,
    importPrice: 60000,
    stock: 50,
    minStockAlert: 5,
  });

  const categories = ['all', 'Thức ăn', 'Pate', 'Phụ kiện', 'Đồ chơi', 'Vệ sinh'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      sku: `SKU-PET-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      category: 'Thức ăn',
      sellPrice: 150000,
      importPrice: 90000,
      stock: 30,
      minStockAlert: 5,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      sku: p.sku,
      name: p.name,
      category: p.category,
      sellPrice: p.sellPrice,
      importPrice: p.importPrice,
      stock: p.stock,
      minStockAlert: p.minStockAlert,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductStock(editingProduct.id, formData.stock);
    } else {
      addProduct(formData as any);
    }
    setIsAddModalOpen(false);
  };

  const handleAdjustStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStockProduct) {
      adjustStock(selectedStockProduct.id, stockDelta);
      setIsStockModalOpen(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Thức ăn': return '🍖';
      case 'Pate': return '🥫';
      case 'Phụ kiện': return '🎀';
      case 'Đồ chơi': return '🎾';
      default: return '🧼';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quản Lý Kho Hàng & Sản Phẩm ({products.length} Sản Phẩm)</h1>
          <p className="text-xs text-slate-500 mt-1">Danh mục sản phẩm, mã SKU, kiểm tồn kho và cảnh báo nhập hàng nội bộ</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tên sản phẩm, mã SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Danh mục:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs border-2 border-slate-300 rounded-xl bg-white font-extrabold text-slate-900 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'Tất cả danh mục' : c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-slate-200 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm font-extrabold' : 'text-slate-700 hover:text-slate-900'
              }`}
              title="Dạng Bảng"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm font-extrabold' : 'text-slate-700 hover:text-slate-900'
              }`}
              title="Dạng Thẻ"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase tracking-wider border-b-2 border-slate-300">
                <tr>
                  <th className="p-4">Sản Phẩm</th>
                  <th className="p-4">Mã SKU</th>
                  <th className="p-4">Danh Mục</th>
                  <th className="p-4">Giá Nhập / Bán</th>
                  <th className="p-4">Số Lượng Tồn Kho</th>
                  <th className="p-4 text-center">Mức Cảnh Báo</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-700 font-bold">
                      Không tìm thấy sản phẩm phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLowStock = p.stock <= p.minStockAlert;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 font-bold flex items-center justify-center text-lg shrink-0">
                              {getCategoryIcon(p.category)}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900 text-sm">{p.name}</p>
                              <p className="text-slate-700 font-bold text-[11px]">Dành cho cún/mèo</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-extrabold text-slate-500">#{p.sku}</td>
                        <td className="p-4">
                          <Badge variant="slate">{p.category}</Badge>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-extrabold text-emerald-600">{p.sellPrice.toLocaleString('vi-VN')} đ</p>
                            <p className="text-[10px] text-slate-400">Gốc: {p.importPrice.toLocaleString('vi-VN')} đ</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-extrabold text-sm ${isLowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                              {p.stock} món
                            </span>
                            {isLowStock && (
                              <Badge variant="danger">
                                <AlertTriangle className="w-3 h-3 mr-1" /> Sắp hết
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center font-bold text-slate-500">{p.minStockAlert} món</td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => {
                              setSelectedStockProduct(p);
                              setStockDelta(10);
                              setIsStockModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors"
                            title="Điều chỉnh kho"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                            title="Sửa"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
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
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => {
            const isLowStock = p.stock <= p.minStockAlert;
            return (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl">
                      {getCategoryIcon(p.category)}
                    </div>
                    {isLowStock && (
                      <Badge variant="danger"><AlertTriangle className="w-3 h-3 mr-1" /> Sắp hết</Badge>
                    )}
                  </div>
                  <Badge variant="slate">{p.category}</Badge>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-1">{p.name}</h3>
                  <p className="text-[11px] font-mono font-bold text-slate-400">SKU: #{p.sku}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-emerald-600">{p.sellPrice.toLocaleString('vi-VN')} đ</p>
                    <p className="text-[11px] font-bold text-slate-500">Tồn: {p.stock} món</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        title={`Điều Chỉnh Kho Hàng: ${selectedStockProduct?.name}`}
      >
        <form onSubmit={handleAdjustStockSubmit} className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 text-xs">
            <p className="text-slate-500 font-semibold">Tồn kho hiện tại: <strong className="text-slate-900 text-sm">{selectedStockProduct?.stock} món</strong></p>
            <p className="text-slate-500 font-semibold">Mức cảnh báo tồn tối thiểu: <strong className="text-slate-900">{selectedStockProduct?.minStockAlert} món</strong></p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Số lượng nhập/xuất (+ nhập thêm, - xuất bớt)</label>
            <input
              type="number"
              required
              value={stockDelta}
              onChange={(e) => setStockDelta(parseInt(e.target.value) || 0)}
              placeholder="VD: 10 hoặc -5"
              className="w-full px-3 py-2 text-sm font-extrabold border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">Số âm sẽ giảm tồn kho, số dương sẽ tăng tồn kho sản phẩm.</p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsStockModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-emerald-600"
            >
              Cập Nhật Kho Hàng
            </button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingProduct ? 'Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới Về Kho'}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mã SKU *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Danh mục *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              >
                <option value="Thức ăn">Thức ăn</option>
                <option value="Pate">Pate</option>
                <option value="Phụ kiện">Phụ kiện</option>
                <option value="Đồ chơi">Đồ chơi</option>
                <option value="Vệ sinh">Vệ sinh</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên sản phẩm *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Hạt Royal Canin Poodle 1.5kg..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giá bán (VNĐ) *</label>
              <input
                type="number"
                required
                value={formData.sellPrice}
                onChange={(e) => setFormData({ ...formData, sellPrice: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giá nhập (Gốc)</label>
              <input
                type="number"
                value={formData.importPrice}
                onChange={(e) => setFormData({ ...formData, importPrice: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tồn kho ban đầu</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cảnh báo khi tồn &lt;=</label>
              <input
                type="number"
                value={formData.minStockAlert}
                onChange={(e) => setFormData({ ...formData, minStockAlert: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-emerald-600"
            >
              {editingProduct ? 'Cập Nhật' : 'Tạo Sản Phẩm'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
