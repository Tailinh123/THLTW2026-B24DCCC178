# 🎓 Quick Start Guide - Quản lý Sản phẩm & Đơn hàng

## ⚡ 3 bước chạy ứng dụng

```bash
cd "d:\FRONT END\TH LT WEB\baseltw"
npm install
npm start
```

## 🖥️ Truy cập ứng dụng
- URL: `http://localhost:8000/pages/ProductManagement`
- Hoặc click menu → ProductManagement

---

## 📌 Các chức năng chính (Tóm tắt)

### TAB 1: Tổng quan 📊
- Xem tổng số sản phẩm, giá trị tồn kho, đơn hàng, doanh thu
- Biểu đồ trạng thái đơn hàng

### TAB 2: Quản lý Sản phẩm 📦

#### Tìm kiếm & Lọc:
| Input | Chức năng |
|-------|----------|
| "Tìm kiếm theo tên" | Tìm nhanh sản phẩm |
| "Danh mục" | Lọc theo category |
| "Min giá" | Lọc giá tối thiểu |
| "Max giá" | Lọc giá tối đa |
| "Trạng thái" | Lọc Còn hàng / Sắp hết / Hết hàng |

#### Thao tác:
- **Thêm**: Nút "Thêm sản phẩm" → Điền form → OK
- **Sửa**: Click "Sửa" → Sửa thông tin → OK
- **Xóa**: Click "Xóa" → Xác nhận → Xóa
- **Sắp xếp**: Click header cột (Tên, Giá, Số lượng)

### TAB 3: Quản lý Đơn hàng 📋

#### Tìm kiếm & Lọc:
| Input | Chức năng |
|-------|----------|
| "Tìm kiếm theo tên/mã" | Tìm khách hàng hoặc mã đơn |
| "Trạng thái" | Lọc Chờ xử lý / Đang giao / Hoàn thành / Đã hủy |
| "DatePicker Range" | Lọc theo khoảng ngày |

#### Tạo đơn hàng:
1. Nút "Tạo đơn hàng"
2. Điền:
   - Tên khách hàng
   - Số điện thoại (10-11 số)
   - Địa chỉ
3. Chọn sản phẩm → Nhập số lượng
4. Xem tổng tiền → OK

#### Cập nhật trạng thái:
- Bảng đơn hàng → Cột "Trạng thái" → Select → Trạng thái mới
- **Tự động trừ kho**: Chuyển "Hoàn thành"
- **Tự động hoàn trả**: Chuyển "Đã hủy"

#### Xem chi tiết:
- Click "Xem chi tiết" → Modal
- Xem: Khách hàng, sản phẩm, tổng tiền

---

## 🔍 Validation (Lỗi sẽ báo cáo tự động)

### Form Sản phẩm:
```
❌ Tên: Bắt buộc, 3-100 ký tự
❌ Danh mục: Bắt buộc
❌ Giá: Bắt buộc, > 0
❌ Số lượng: Bắt buộc, ≥ 0
```

### Form Đơn hàng:
```
❌ Tên khách: Bắt buộc
❌ Điện thoại: Bắt buộc, 10-11 chữ số
❌ Địa chỉ: Bắt buộc
❌ Sản phẩm: Chọn ≥ 1
❌ Số lượng: 1 ≤ qty ≤ tồn kho
```

---

## 💾 Dữ liệu

### Nơi lưu:
- **localStorage** → Key: `pm_products_v1`, `pm_orders_v1`
- Tự động lưu khi thay đổi

### Xóa dữ liệu (nếu cần reset):
```javascript
// Mở DevTools → Console
localStorage.removeItem('pm_products_v1');
localStorage.removeItem('pm_orders_v1');
location.reload();
```

---

## 🐛 Troubleshoot

| Vấn đề | Giải pháp |
|--------|----------|
| Dữ liệu bị mất | Kiểm tra localStorage (F12 → Application) |
| Form không validate | Kiểm tra console có error không |
| Số lượng không trừ | Kiểm tra trạng thái có phải "Hoàn thành" không |
| Page không load | Kiểm tra npm start chạy bình thường |

---

## 📚 Code Structure

```
index.tsx
├── State (products, orders, modals, filters)
├── Effects (localStorage persist)
├── Handlers
│  ├── handleSaveProduct
│  ├── handleDeleteProduct
│  ├── handleCreateOrder
│  └── changeOrderStatus
├── Filters (useMemo)
│  ├── filteredProducts
│  └── filteredOrders
└── UI (Tabs + Components)
   ├── Dashboard
   ├── Products (Table + Form + Modal)
   └── Orders (Table + Form + Detail Modal)
```

---

## ✨ Highlights

- ✅ 100% chức năng yêu cầu
- ✅ Code clean, dễ hiểu
- ✅ Comment Tiếng Việt
- ✅ Validation đầy đủ
- ✅ Lưu dữ liệu tự động
- ✅ UI thân thiện Ant Design

---

**Sẵn sàng sử dụng! Happy coding! 🚀**
