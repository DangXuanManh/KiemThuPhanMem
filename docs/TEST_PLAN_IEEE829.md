# 📄 KẾ HOẠCH KIỂM THỬ PHẦN MỀM (SOFTWARE TEST PLAN)
### Dự án: Hệ Thống Quản Lý Cửa Hàng & Dịch Vụ Thú Cưng (PetCare Store)
**Tiêu chuẩn áp dụng**: IEEE Std 829-2008  
**Ngày lập**: 07/09/2026  
**Phiên bản**: v1.0.0 Enterprise  

---

## 1. MỤC ĐÍCH (PURPOSE)
Tài liệu này xác định chiến lược, phạm vi, nguồn lực, môi trường và lịch trình kiểm thử toàn diện cho hệ thống Web **PetCare Store**. Đảm bảo phần mềm đáp ứng đầy đủ các yêu cầu chức năng, hiệu năng, bảo mật và trải nghiệm người dùng trước khi đưa vào vận hành thực tế.

---

## 2. PHẠM VI KIỂM THỬ (SCOPE OF TESTING)

### 2.1 Các Hạng Mục Trong Phạm Vi (In-Scope)
- **Kiểm thử Chức năng (Functional Testing)**:
  - Quản lý tài khoản (Đăng ký, Đăng nhập JWT, Phân quyền Role-based Access Control).
  - Quản lý Dịch vụ Spa, Grooming, Khách sạn lưu trú thú cưng (CRUD Services).
  - Quản lý Sản phẩm & Kho hàng (CRUD Products & Inventory).
  - Quy trình Đặt lịch hẹn trực tuyến (Service Booking Flow).
  - Quản lý Thú cưng cá nhân (Pet Profile Management).
  - Bảng điều khiển Quản trị & Báo cáo doanh thu (Admin Dashboard & Reports).
- **Kiểm thử API (API Integration & Unit Testing)**: Kiểm thử tự động tất cả các Endpoints bằng Jest + Supertest.
- **Kiểm thử Bảo mật (Security Testing)**: Mã hóa mật khẩu bcrypt, xác thực Token JWT, Middleware giới hạn tần suất truy cập (Rate Limiting) và Header bảo mật (Helmet).
- **Kiểm thử Giao diện & Trải nghiệm Người dùng (UI/UX & Responsiveness)**: Kiểm thử hiển thị responsive trên PC và Mobile.

### 2.2 Các Hạng Mục Ngoài Phạm Vi (Out-of-Scope)
- Thanh toán trực tuyến với cổng ngân hàng thật (Hiện tại giả lập xác nhận đơn).
- Kiểm thử tải cực lớn (Stress Test > 100.000 concurrent users).

---

## 3. KỸ THUẬT THIẾT KẾ TEST CASE (TEST DESIGN TECHNIQUES)
Áp dụng các kỹ thuật kiểm thử hộp đen (Black-box testing) và hộp trắng (White-box testing) chính thống:
1. **Phân vùng tương đương (Equivalence Partitioning - EP)**: Phân nhóm dữ liệu hợp lệ và không hợp lệ cho các trường nhập liệu (Email, Mật khẩu, Giá tiền, Ngày giờ).
2. **Phân tích giá trị biên (Boundary Value Analysis - BVA)**: Kiểm thử các giá trị giới hạn của số lượng tồn kho (0, 1, MAX), tuổi thú cưng (0, 1, 30), giá dịch vụ.
3. **Bảng quyết định (Decision Table Testing)**: Kiểm thử logic chuyển đổi trạng thái đơn đặt lịch (*Pending ➔ Confirmed ➔ In Progress ➔ Completed / Cancelled*).
4. **Kiểm thử Luồng Công việc (Use Case / Workflow Testing)**: Luồng đặt dịch vụ từ phía Khách hàng đến khâu xử lý duyệt đơn phía Admin.

---

## 4. TIÊU CHUẨN BẮT ĐẦU VÀ KẾT THÚC (ENTRY & EXIT CRITERIA)

### 4.1 Tiêu chuẩn Bắt đầu (Entry Criteria)
- Mã nguồn Backend và Frontend đã được biên dịch thành công mà không có lỗi cú pháp.
- Cơ sở dữ liệu SQLite đã nạp đầy đủ dữ liệu mẫu (Seed Data).
- Môi trường kiểm thử (Node.js runtime, Jest framework) đã được thiết lập sẵn sàng.

### 4.2 Tiêu chuẩn Kết thúc (Exit Criteria)
- 100% các kịch bản kiểm thử API tự động (Automated API Tests) đạt trạng thái **PASSED**.
- 100% các kịch bản kiểm thử chức năng mức ưu tiên Cao (High Priority Test Cases) vượt qua thử nghiệm thành công.
- Không còn lỗi nghiêm trọng (Critical/High Severity Bugs) tồn tại trong hệ thống.
- Báo cáo độ bao phủ mã nguồn (Code Coverage) đạt trên **85%**.

---

## 5. MÔI TRƯỜNG KIỂM THỬ (TEST ENVIRONMENT)
- **Hệ điều hành**: Windows 11 / Linux / macOS.
- **Runtime**: Node.js v24.x, NPM v11.x.
- **Database**: SQLite3 (File DB `:memory:` cho Automated Tests và `petstore.db` cho Integration).
- **Công cụ Kiểm thử**: Jest, Supertest, Swagger UI (`/api-docs`), Browser Developer Tools.

---

## 6. QUẢN LÝ RỦI RO (RISK MANAGEMENT)

| Rủi ro (Risk) | Mức độ | Biện pháp giảm thiểu (Mitigation Strategy) |
| :--- | :---: | :--- |
| Trùng lịch hẹn khi nhiều khách đặt cùng thời điểm | Cao | Kiểm tra kiểm thử đồng thời (Concurrency Test) và khóa slot giờ theo ngày |
| Dữ liệu rác làm tràn DB | Trung bình | Tự động khôi phục DB sạch khi chạy `npm test` bằng SQLite Memory |
| Lộ token JWT trên Client | Cao | Đặt thời gian hết hạn Token (7 ngày) và lưu trữ an toàn |
