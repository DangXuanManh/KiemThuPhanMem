# 📑 MA TRẬN KỊCH BẢN KIỂM THỬ CHI TIẾT (TEST CASES SPECIFICATION)
### Dự án: PetCare Store Management System
**Ngày cập nhật**: 07/09/2026  

---

## 📌 BẢNG TỔNG HỢP TEST CASES

| Mã Test Case | Phân Hệ / Module | Tên Kịch Bản Kiểm Thử | Kỹ Thuật Kiểm Thử | Mức Ưu Tiên | Trạng Thái |
| :---: | :--- | :--- | :---: | :---: | :---: |
| **TC_AUTH_01** | Authentication | Đăng ký tài khoản khách hàng mới với dữ liệu hợp lệ | Phân vùng tương đương | High | PASSED |
| **TC_AUTH_02** | Authentication | Đăng ký với Email đã tồn tại trong hệ thống | Phân tích giá trị biên | High | PASSED |
| **TC_AUTH_03** | Authentication | Đăng nhập thành công với tài khoản Admin | Phân vùng tương đương | High | PASSED |
| **TC_AUTH_04** | Authentication | Đăng nhập thất bại với Mật khẩu không chính xác | Bảng quyết định | High | PASSED |
| **TC_SVC_01** | Services | Truy vấn danh sách toàn bộ Dịch vụ Spa & Grooming | API Functional | Medium | PASSED |
| **TC_SVC_02** | Services | Admin tạo mới Dịch vụ Tắm & Massage Thảo Dược | Authorization | High | PASSED |
| **TC_SVC_03** | Services | Khách hàng tạo Dịch vụ mới (Mong muốn bị từ chối 403) | Security / RBAC | High | PASSED |
| **TC_PROD_01** | Products | Truy vấn danh mục Sản phẩm thú cưng & Tồn kho | API Functional | Medium | PASSED |
| **TC_PET_01** | Pets | Khách hàng thêm hồ sơ Thú cưng mới (Chó Poodle) | Equivalence | High | PASSED |
| **TC_BOOK_01** | Bookings | Khách hàng đặt lịch hẹn thành công (Trạng thái Pending) | Workflow Testing | Critical | PASSED |
| **TC_BOOK_02** | Bookings | Admin đổi trạng thái đơn đặt lịch từ Pending sang Confirmed | State Transition | Critical | PASSED |
| **TC_BOOK_03** | Bookings | Khách hàng gửi yêu cầu Hủy lịch hẹn cá nhân | State Transition | High | PASSED |
| **TC_DASH_01** | Dashboard | Admin xem báo cáo Thống kê Doanh thu & Lịch hẹn | Business Logic | High | PASSED |
| **TC_SEC_01** | Security | Giới hạn tần suất gửi Request (Rate Limiting Check) | Security / DoS | High | PASSED |

---

## 🔍 CHI TIẾT CÁC TEST CASES TIÊU BIỂU

### 1. TC_AUTH_04: Đăng nhập thất bại với mật khẩu sai
- **Mục đích**: Kiểm tra cơ chế xử lý xác thực không hợp lệ và phản hồi lỗi an toàn.
- **Tiền điều kiện**: Tài khoản `admin@petcare.com` đã tồn tại trong CSDL.
- **Các bước thực hiện**:
  1. Gửi HTTP POST request đến `/api/auth/login`.
  2. Body JSON: `{"email": "admin@petcare.com", "password": "WrongPassword123"}`.
- **Kết quả kỳ vọng**: HTTP Status Code `400 Bad Request`, body phản hồi chứa thông báo: `"Email hoặc mật khẩu không chính xác!"`.
- **Kết quả thực tế**: PASSED (Đúng theo thiết kế).

---

### 2. TC_SVC_03: Kiểm tra Phân quyền Role-Based Access Control (RBAC)
- **Mục đích**: Đảm bảo khách hàng thường không thể tự thêm hoặc sửa dịch vụ của cửa hàng.
- **Tiền điều kiện**: Có JWT Token đại diện cho tài khoản Khách hàng (`role = customer`).
- **Các bước thực hiện**:
  1. Gửi HTTP POST request đến `/api/services`.
  2. Header: `Authorization: Bearer <CUSTOMER_JWT_TOKEN>`.
  3. Body JSON: `{"name": "Dịch vụ Hacker", "price": 1000}`.
- **Kết quả kỳ vọng**: HTTP Status Code `403 Forbidden`, body phản hồi thông báo lỗi từ chối truy cập.
- **Kết quả thực tế**: PASSED.

---

### 3. TC_BOOK_02: Chuyển đổi trạng thái Đơn đặt lịch (State Transition)
- **Mục đích**: Kiểm tra quy trình xử lý đơn đặt dịch vụ của Admin.
- **Tiền điều kiện**: Có đơn đặt lịch `#1` đang ở trạng thái `pending`.
- **Các bước thực hiện**:
  1. Admin đăng nhập và gửi HTTP PATCH request đến `/api/bookings/1/status`.
  2. Header: `Authorization: Bearer <ADMIN_JWT_TOKEN>`.
  3. Body JSON: `{"status": "confirmed"}`.
- **Kết quả kỳ vọng**: HTTP Status Code `200 OK`, trạng thái đơn trong CSDL cập nhật thành `confirmed`, tổng doanh thu dự kiến được ghi nhận.
- **Kết quả thực tế**: PASSED.
