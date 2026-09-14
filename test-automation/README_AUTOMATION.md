# Hướng Dẫn Sử Dụng Bộ Kiểm Thử Tự Động (Test Automation) - PetCare PRO

Bộ kiểm thử tự động được xây dựng bằng **Java + Selenium 4 + TestNG** áp dụng mô hình chuẩn **Page Object Model (POM)** kết hợp **ExtentReports 5**.

---

## 📁 Cấu Trúc Dự Án Test Automation

```
test-automation/
├── pom.xml                                   # Cấu hình Maven (Selenium 4, TestNG 7, WebDriverManager, ExtentReports 5)
├── testng.xml                                # Cấu hình TestNG Suite điều phối các lớp Test
├── run_tests.bat                             # File chạy 1-Click trên Windows
├── run_tests.ps1                             # Script PowerShell tự động tải Maven, bật Frontend và chạy test
├── reports/                                  # Thư mục chứa báo cáo HTML ExtentReport & ảnh chụp lỗi
│   └── PetCare_TestReport.html
└── src/
    ├── main/java/com/petcare/automation/
    │   ├── base/                             # Quản lý WebDriver (DriverFactory, BaseTest)
    │   ├── config/                           # Hằng số cấu hình (FrameworkConstants)
    │   ├── utils/                            # Tiện ích (WaitUtils, ScreenshotUtils, ExtentReportListener)
    │   └── pages/                            # Page Object Model (LoginPage, AppointmentsPage, PosOrdersPage...)
    └── test/java/com/petcare/automation/tests/
        ├── AuthAndRbacTest.java              # Test Đăng nhập & Phân quyền Admin vs Staff
        ├── AppointmentsTest.java             # Test Quy trình đặt lịch spa 7 bước
        ├── CustomersAndPetsTest.java         # Test Quản lý khách hàng & hồ sơ thú cưng
        ├── PosOrdersTest.java                # Test Bán hàng tại quầy POS & Hóa đơn
        ├── ProductsInventoryTest.java        # Test Tra cứu kho sản phẩm
        ├── ServicesAndStaffTest.java         # Test Bảng giá dịch vụ & Nhân sự
        └── PromotionsAndCrmTest.java         # Test Tạo voucher & CRM nhắc lịch
```

---

## 🚀 Cách Khởi Chạy Kiểm Thử (3 Cách)

### Cách 1: Chạy 1-Click Nhanh Nhất (Khuyên Dùng)
- Nhấp đúp chuột vào file **`CHAY_TEST_AUTOMATION.bat`** ở thư mục gốc dự án (hoặc `run_tests.bat` trong thư mục `test-automation`).
- Script sẽ **tự động**:
  1. Kiểm tra môi trường Java.
  2. Tự động tải bản Maven Portable nếu máy chưa cài sẵn Maven.
  3. Tự động khởi động web frontend nếu chưa chạy.
  4. Thực thi toàn bộ bộ kịch bản kiểm thử TestNG.
  5. Tự động mở file báo cáo HTML **ExtentReports** trên trình duyệt.

### Cách 2: Chạy Bằng Lệnh Maven (Nếu máy đã có Maven)
```bash
cd "E:\EAUT\Kiểm thử phần mềm\test-automation"
mvn clean test
```

### Cách 3: Chạy Chế Độ Headless (Chạy ngầm không mở cửa sổ trình duyệt)
```powershell
.\run_tests.ps1 -Headless
```

---

## 📊 Báo Cáo Kiểm Thử (ExtentReports)
- Sau khi chạy xong, kết quả kiểm thử được lưu tại:
  `test-automation/reports/PetCare_TestReport.html`
- Báo cáo gồm:
  - Biểu đồ tổng quan số ca kiểm thử **PASS**, **FAIL**, **SKIP**.
  - Thời gian thực thi từng Test Case.
  - Các bước thực hiện chi tiết (Step logs).
  - Tự động chụp và đính kèm ảnh màn hình khi có lỗi xảy ra.
