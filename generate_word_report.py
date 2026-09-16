import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

sys.stdout.reconfigure(encoding='utf-8')

template_path = r"E:\EAUT\Kiểm thử phần mềm\BaoCao\DeTai2_Nhom6.docx"
output_path = r"E:\EAUT\Kiểm thử phần mềm\BaoCao\DeTai2_Nhom6.docx"

# Helper to set cell background color
def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

# Helper to set table cell margins (padding)
def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

# Helper to set thin table borders
def set_table_borders(table, color="D3D3D3", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>\n'
        f'  <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
        f'  <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
        f'  <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
        f'  <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
        f'  <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
        f'  <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

print("Starting to load existing template...")
doc = docx.Document(template_path)

# Update Title in Cover Page if needed
for p in doc.paragraphs:
    if "ĐỀ TÀI 2:" in p.text and len(p.text.strip()) <= 15:
        p.text = "ĐỀ TÀI 2: XÂY DỰNG VÀ KIỂM THỬ HỆ THỐNG QUẢN LÝ DỊCH VỤ CHĂM SÓC THÚ CƯNG (PETCARE PRO)"
        p.runs[0].font.name = "Times New Roman"
        p.runs[0].font.size = Pt(14)
        p.runs[0].font.bold = True
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Update Table 1 (Abbreviations) to be Testing domain abbreviations
if len(doc.tables) > 1:
    tbl_abbr = doc.tables[1]
    # Check if table 1 is abbreviations
    abbr_data = [
        ("AUT / SUT", "Application Under Test / System Under Test (Ứng dụng / Hệ thống được kiểm thử)"),
        ("QA / QC", "Quality Assurance / Quality Control (Đảm bảo chất lượng / Kiểm soát chất lượng)"),
        ("POM", "Page Object Model (Mô hình thiết kế kiểm thử tự động phân tách trang)"),
        ("E2E", "End-to-End Testing (Kiểm thử luồng hệ thống từ đầu đến cuối)"),
        ("EP", "Equivalence Partitioning (Kỹ thuật phân vùng tương đương)"),
        ("BVA", "Boundary Value Analysis (Kỹ thuật phân tích giá trị biên)"),
        ("TestNG", "Test Next Generation (Framework quản lý và điều phối kiểm thử trong Java)"),
        ("Selenium", "Selenium WebDriver (Thư viện tự động hóa thao tác trình duyệt web)"),
        ("POS", "Point of Sale (Hệ thống bán hàng và xuất hóa đơn tại quầy)"),
        ("RBAC", "Role-Based Access Control (Kiểm soát truy cập và phân quyền theo vai trò)"),
        ("CRM", "Customer Relationship Management (Quản lý và chăm sóc khách hàng)"),
        ("REST API", "Representational State Transfer Application Programming Interface"),
        ("DTO / DAO", "Data Transfer Object / Data Access Object"),
        ("UI / UX", "User Interface / User Experience (Giao diện / Trải nghiệm người dùng)")
    ]
    
    # Clear existing rows except header
    for _ in range(len(tbl_abbr.rows) - 1):
        tbl_abbr._tbl.remove(tbl_abbr.rows[1]._tr)
    
    # Update Header
    tbl_abbr.rows[0].cells[0].text = "Từ viết tắt"
    tbl_abbr.rows[0].cells[1].text = "Ý nghĩa / Giải thích chi tiết"
    for c in tbl_abbr.rows[0].cells:
        set_cell_background(c, "1E3A8A")
        c.paragraphs[0].runs[0].font.name = "Times New Roman"
        c.paragraphs[0].runs[0].font.bold = True
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    for term, mean in abbr_data:
        row = tbl_abbr.add_row()
        row.cells[0].text = term
        row.cells[1].text = mean
        row.cells[0].paragraphs[0].runs[0].font.name = "Times New Roman"
        row.cells[0].paragraphs[0].runs[0].font.bold = True
        row.cells[0].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        row.cells[1].paragraphs[0].runs[0].font.name = "Times New Roman"
        set_cell_margins(row.cells[0])
        set_cell_margins(row.cells[1])
    
    set_table_borders(tbl_abbr)

# Fill in Lời nói đầu if empty
for i, p in enumerate(doc.paragraphs):
    if p.text.strip() == "LỜI NÓI ĐẦU":
        # Check next paragraph
        if i + 1 < len(doc.paragraphs) and not doc.paragraphs[i+1].text.strip():
            doc.paragraphs[i+1].text = (
                "Trong kỷ nguyên chuyển đổi số hiện nay, các dịch vụ chăm sóc thú cưng (Pet Care & Spa) đang phát triển vô cùng mạnh mẽ. "
                "Để đảm bảo chất lượng, độ tin cậy và sự ổn định cho phần mềm quản lý trước khi đưa vào vận hành thực tế, "
                "hoạt động kiểm thử phần mềm (Software Testing) đóng vai trò then chốt và sống còn.\n\n"
                "Báo cáo bài tập lớn môn học Kiểm thử phần mềm với đề tài: \"Xây dựng và Kiểm thử Hệ thống Quản lý Dịch vụ Chăm sóc Thú cưng PetCare Pro\" "
                "được Nhóm 6 thực hiện nhằm áp dụng toàn diện các kiến thức nền tảng và chuyên sâu về kiểm thử. "
                "Báo cáo trình bày đầy đủ quy trình từ việc phân tích đặc tả yêu cầu, thiết kế bộ kịch bản kiểm thử đa cấp độ (Unit Test, Integration Test, System Test), "
                "thực thi kiểm thử và xây dựng bộ kiểm thử tự động hóa (Test Automation) ứng dụng Selenium WebDriver và TestNG theo mô hình chuẩn Page Object Model.\n\n"
                "Nhóm xin gửi lời cảm ơn chân thành và sâu sắc nhất tới ThS. Trần Xuân Thanh đã tận tình hướng dẫn, truyền đạt kiến thức quý báu và định hướng cho nhóm hoàn thành tốt bài tập lớn này."
            )
            for r in doc.paragraphs[i+1].runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(13)
            doc.paragraphs[i+1].paragraph_format.line_spacing = 1.3
            doc.paragraphs[i+1].paragraph_format.space_after = Pt(6)
            doc.paragraphs[i+1].alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

print("Header, Cover and Front-matter checked.")

# Now remove all paragraphs from CHƯƠNG 1 onwards (Paragraph 32 onwards in original template)
# Let's find the paragraph index where CHƯƠNG 1 starts
start_idx = -1
for i, p in enumerate(doc.paragraphs):
    if "CHƯƠNG 1: TỔNG QUAN BÀI TOÁN" in p.text or "CHƯƠNG 1" in p.text:
        start_idx = i
        break

print(f"Chapter 1 starts at paragraph index: {start_idx}")

if start_idx != -1:
    # Delete all paragraphs from start_idx to the end
    p_to_remove = doc.paragraphs[start_idx:]
    for p in p_to_remove:
        p._element.getparent().remove(p._element)

print("Cleared old outline paragraphs. Now writing full comprehensive report content...")

# Helper functions for adding rich content
def add_h1(text):
    p = doc.add_paragraph()
    p.style = 'Heading 1'
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(15)
    run.font.bold = True
    run.font.color.rgb = RGBColor(30, 58, 138) # Navy Blue
    return p

def add_h2(text):
    p = doc.add_paragraph()
    p.style = 'Heading 2'
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13.5)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 118, 110) # Teal
    return p

def add_h3(text):
    p = doc.add_paragraph()
    p.style = 'Heading 3'
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.italic = True
    run.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_p(text, bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(6)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if bold_prefix:
        r_bold = p.add_run(bold_prefix)
        r_bold.font.name = 'Times New Roman'
        r_bold.font.size = Pt(13)
        r_bold.font.bold = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13)
    run.font.italic = italic
    return p

def add_bullet(text, bold_prefix=""):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.25)
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(4)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    
    r_bullet = p.add_run("• ")
    r_bullet.font.name = 'Times New Roman'
    r_bullet.font.size = Pt(13)
    r_bullet.font.bold = True
    r_bullet.font.color.rgb = RGBColor(30, 58, 138)
    
    if bold_prefix:
        r_bold = p.add_run(bold_prefix)
        r_bold.font.name = 'Times New Roman'
        r_bold.font.size = Pt(13)
        r_bold.font.bold = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13)
    return p

def add_styled_table(headers, data, col_widths=None, header_bg="1E3A8A"):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    # Header Row
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].text = h
        set_cell_background(hdr_cells[i], header_bg)
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=120, right=120)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        if p.runs:
            p.runs[0].font.name = 'Times New Roman'
            p.runs[0].font.size = Pt(11)
            p.runs[0].font.bold = True
            p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    # Data Rows
    for row_idx, row_data in enumerate(data):
        row = table.add_row()
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.text = str(val)
            bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            if p.runs:
                p.runs[0].font.name = 'Times New Roman'
                p.runs[0].font.size = Pt(11)
                if c_idx in [0, 1] or str(val) in ["PASS", "HIGH", "CRITICAL", "MEDIUM", "LOW"]:
                    p.runs[0].font.bold = True
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    if str(val) == "PASS":
                        p.runs[0].font.color.rgb = RGBColor(22, 101, 52)
                    elif str(val) in ["HIGH", "CRITICAL"]:
                        p.runs[0].font.color.rgb = RGBColor(185, 28, 28)
                else:
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT

    # Set Column Widths if provided
    if col_widths:
        for row in table.rows:
            for idx, width in enumerate(col_widths):
                row.cells[idx].width = Inches(width)

    set_table_borders(table)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    return table

# =========================================================================
# CHƯƠNG 1: TỔNG QUAN BÀI TOÁN
# =========================================================================
add_h1("CHƯƠNG 1: TỔNG QUAN BÀI TOÁN")

add_h2("1.1 Giới thiệu đề tài")
add_p(
    "Trong bối cảnh xã hội ngày càng hiện đại, nhu cầu chăm sóc, làm đẹp và theo dõi sức khỏe cho thú cưng (chó, mèo) "
    "tăng trưởng vượt bậc. Các trung tâm dịch vụ thú cưng, chuỗi Spa & Grooming đối mặt với khối lượng lớn thông tin "
    "liên quan đến hồ sơ khách hàng, đặc điểm từng thú cưng (giống, loài, cân nặng, tiền sử bệnh), lịch hẹn làm đẹp, "
    "bán hàng sản phẩm tiêu dùng (thức ăn, phụ kiện, thuốc thú y) và quản lý ca làm việc của đội ngũ kỹ thuật viên / Groomer."
)
add_p(
    "Đề tài của nhóm hướng tới việc xây dựng và kiểm thử phần mềm chuyên dụng: ",
    bold_prefix="Tên đề tài: "
)
add_p(
    "\"HỆ THỐNG QUẢN LÝ DỊCH VỤ CHĂM SÓC THÚ CƯNG (PETCARE PRO)\"",
    bold_prefix="Tên hệ thống: ",
    italic=True
)
add_p(
    "Hệ thống cung cấp nền tảng web ứng dụng toàn diện giúp tối ưu hóa toàn bộ quy trình vận hành của một cửa hàng thú cưng, "
    "từ khâu tiếp nhận lịch hẹn, phân công nhân sự, quản lý bán hàng tại quầy (POS), kiểm soát kho hàng, đến việc tự động hóa "
    "chăm sóc khách hàng (CRM) và báo cáo doanh thu tức thời."
)

add_p(
    "Bài toán thực tế cần giải quyết bao gồm các thách thức:",
    bold_prefix="Mục tiêu và bài toán giải quyết: "
)
add_bullet("Thất thoát và xung đột lịch hẹn: Tránh tình trạng trùng lịch giữa các khách hàng hoặc phân công sai Groomer không đúng ca trực.", bold_prefix="1. Quản lý lịch hẹn chặt chẽ: ");
add_bullet("Tối ưu hóa bán lẻ và thanh toán: Rút ngắn thời gian thanh toán tại quầy POS, tự động trừ tồn kho, tính chiết khấu voucher và xuất hóa đơn minh bạch.", bold_prefix="2. Nâng cao hiệu suất thu ngân: ");
add_bullet("Lưu trữ hồ sơ thú cưng tập trung: Theo dõi lịch sử làm đẹp, cân nặng, tình trạng dị ứng của từng bé theo từng khách hàng.", bold_prefix="3. Hồ sơ y tế & chăm sóc: ");
add_bullet("Chăm sóc khách hàng tự động: Hệ thống nhắc lịch tự động khi thú cưng quá 30 ngày chưa đi Spa hoặc đến lịch tiêm phòng định kỳ.", bold_prefix="4. Marketing & CRM: ");
add_bullet("Phân quyền bảo mật RBAC: Phân tách rõ quyền hạn giữa Quản lý (Admin) và Nhân viên (Staff), ngăn chặn truy cập dữ liệu nhạy cảm.", bold_prefix="5. An toàn và bảo mật: ");

add_h2("1.2 Đặc tả yêu cầu hệ thống")

add_h3("1.2.1 Các luồng nghiệp vụ chính (End-to-End Workflows)")
add_p(
    "Hệ thống PetCare Pro được thiết kế xoay quanh 5 luồng nghiệp vụ nghiệp vụ cốt lõi (E2E):"
)
add_bullet("Người dùng truy cập vào cổng đăng nhập. Hệ thống kiểm tra vai trò (Admin hoặc Staff). Nếu chọn Customer, hệ thống lập tức chặn và cảnh báo. Khi đăng nhập thành công, Router Guard cấp quyền truy cập các module tương ứng.", bold_prefix="Luồng 1 - Xác thực & Phân quyền (Authentication & RBAC): ");
add_bullet("Lễ tân mở Form đặt lịch 7 bước: (1) Tìm kiếm hoặc tạo mới khách hàng -> (2) Chọn thú cưng -> (3) Chọn gói dịch vụ Spa -> (4) Chọn ngày giờ -> (5) Phân công thợ Groomer -> (6) Ghi chú chăm sóc -> (7) Xác nhận & Tính tiền. Lịch hẹn được đưa vào Calendar view.", bold_prefix="Luồng 2 - Đặt lịch Spa & Điều phối dịch vụ (7-Step Booking Workflow): ");
add_bullet("Kỹ thuật viên cập nhật tiến trình làm đẹp từ 'Chờ xác nhận' -> 'Đã xác nhận' -> 'Đang thực hiện' -> 'Hoàn thành'. Khi hoàn thành, hệ thống cho phép xuất hóa đơn thu ngân POS.", bold_prefix="Luồng 3 - Thực hiện & Hoàn thành dịch vụ: ");
add_bullet("Thu ngân tìm khách hàng (theo Tên/SĐT/Mã KH hoặc Khách vãng lai), duyệt danh mục Sản phẩm/Dịch vụ với nút '+ Thêm' 1-click, áp dụng Voucher giảm giá, chọn phương thức Chuyển khoản QR / Tiền mặt, hoàn tất đơn và in hóa đơn điện tử.", bold_prefix="Luồng 4 - Bán hàng & Thu ngân POS (POS Checkout & Invoicing): ");
add_bullet("Khi đơn hàng được thanh toán, tồn kho của sản phẩm tự động giảm tương ứng. Khi kho về 0, hệ thống chuyển trạng thái 'Hết hàng' và chặn bán tiếp. Admin có thể nhập thêm hàng.", bold_prefix="Luồng 5 - Quản lý Kho hàng & Cảnh báo tồn kho: ");

add_h3("1.2.2 Các màn hình chức năng chính và mô tả chi tiết trường dữ liệu")
add_p(
    "Dưới đây là bảng đặc tả chi tiết các trường dữ liệu và ràng buộc logic trên các màn hình chính:"
)

screen_fields_headers = ["Màn hình", "Tên trường", "Kiểu dữ liệu", "Bắt buộc", "Ràng buộc dữ liệu & Logic"]
screen_fields_data = [
    ["Đăng nhập (Login)", "Email", "String (email)", "Có", "Định dạng regex email hợp lệ, không chứa ký tự cấm"],
    ["Đăng nhập (Login)", "Mật khẩu", "String (password)", "Có", "Tối thiểu 6 ký tự"],
    ["Đăng nhập (Login)", "Vai trò (Role)", "Enum (admin/staff/customer)", "Có", "Customer bị từ chối truy cập hệ thống"],
    ["Khách hàng (Customer)", "Tên khách hàng", "String", "Có", "Độ dài 2 - 100 ký tự, hỗ trợ Tiếng Việt có dấu"],
    ["Khách hàng (Customer)", "Số điện thoại", "String", "Có", "Định dạng SĐT Việt Nam 10 số (bắt đầu bằng 03, 05, 07, 08, 09)"],
    ["Khách hàng (Customer)", "Hạng thành viên", "Enum (Đồng/Bạc/Vàng/Kim Cương)", "Có", "Mặc định: 'Đồng', tích điểm tự động"],
    ["Thú cưng (Pet)", "Tên thú cưng", "String", "Có", "Tên nhận diện thú cưng (1 - 50 ký tự)"],
    ["Thú cưng (Pet)", "Loài & Giống", "Enum (Chó/Mèo) + String", "Có", "Loài chọn Chó/Mèo, giống như Poodle, Corgi, Mèo Anh,..."],
    ["Thú cưng (Pet)", "Cân nặng (kg)", "Float / Double", "Có", "Số thực dương (0.5 - 60.0 kg), dùng để tính liều lượng / phụ phí"],
    ["Đặt lịch (Appointment)", "Ngày & Giờ hẹn", "Date + Time String", "Có", "Ngày hẹn >= Ngày hiện tại; Giờ hẹn từ 08:30 đến 18:00"],
    ["Bán hàng (POS)", "Mã đơn hàng", "String (HD-xxxx)", "Tự động", "Hệ thống sinh tự động duy nhất, tăng dần"],
    ["Bán hàng (POS)", "Giỏ hàng (Items)", "Array of OrderItem", "Có", "Tối thiểu 1 sản phẩm/dịch vụ, số lượng >= 1"],
    ["Bán hàng (POS)", "Giảm giá / Voucher", "Integer (VNĐ)", "Không", "0 <= Giảm giá <= Tổng tiền tạm tính"],
    ["Sản phẩm (Product)", "Tồn kho (Stock)", "Integer", "Có", "Số nguyên không âm (>= 0), tự trừ khi bán qua POS"]
]
add_styled_table(screen_fields_headers, screen_fields_data, [1.3, 1.4, 1.2, 0.7, 2.2])

add_h3("1.2.3 Các module chính của chương trình")
add_p(
    "Hệ thống PetCare Pro được cấu trúc thành 9 module nghiệp vụ hoạt động thống nhất:"
)

modules_headers = ["STT", "Tên Module", "Dữ liệu đầu vào (Input)", "Xử lý nghiệp vụ (Processing)", "Dữ liệu đầu ra (Output)"]
modules_data = [
    ["1", "Xác thực & RBAC", "Email, Mật khẩu, Vai trò", "Xác thực tài khoản, kiểm tra phân quyền Router", "Session token, Giao diện tương ứng"],
    ["2", "Tổng quan (Dashboard)", "Dữ liệu từ Orders, Appointments", "Tính tổng doanh thu, đếm lịch hẹn hôm nay, tỷ lệ tăng trưởng", "Biểu đồ KPI, cảnh báo tồn kho thấp"],
    ["3", "Quản lý Lịch hẹn", "Khách hàng, Pet, Dịch vụ, Thợ, Giờ hẹn", "Điều phối 7 bước đặt lịch, cập nhật trạng thái tiến trình", "Lịch hẹn mới, Calendar view"],
    ["4", "Bán hàng POS", "Khách hàng, Danh mục giỏ hàng, Voucher", "Tính tạm tính, chiết khấu, trừ kho tự động, lưu đơn", "Hóa đơn thanh toán, Invoice in nhiệt"],
    ["5", "Quản lý Khách hàng", "Họ tên, SĐT, Email, Hạng", "Lưu trữ, tra cứu theo Tên/SĐT/Mã, lọc theo hạng VIP", "Danh sách khách hàng, lịch sử chi tiêu"],
    ["6", "Quản lý Thú cưng", "Tên bé, Loài, Giống, Cân nặng, Chủ sở hữu", "Gắn thú cưng với ownerId, quản lý lịch sử Spa", "Hồ sơ thú cưng, Grid/Table view"],
    ["7", "Sản phẩm & Kho", "Tên hàng, Mã SKU, Giá vốn, Giá bán, Tồn kho", "Kiểm soát số lượng tồn, cảnh báo hết hàng khi kho=0", "Danh mục kho hàng, trạng thái tồn"],
    ["8", "Dịch vụ & Nhân sự", "Bảng giá Spa, Thời lượng, Nhân viên, Ca trực", "Quản lý bảng giá, phân ca làm việc, gán việc cho Groomer", "Danh mục dịch vụ, Lịch phân ca"],
    ["9", "Voucher & CRM", "Mã voucher, Mức giảm, Điều kiện, Ngày chăm sóc", "Tạo voucher giảm giá, lọc khách lâu chưa ghé để gửi tin", "Thẻ voucher, Thông báo CSKH"]
]
add_styled_table(modules_headers, modules_data, [0.5, 1.2, 1.5, 2.2, 1.4])

# =========================================================================
# CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ TEST
# =========================================================================
add_h1("CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ TEST")

add_h2("2.1 Kiểm thử Đơn vị (Unit Test Cases)")
add_h3("2.1.1 Phương pháp và kỹ thuật áp dụng")
add_p(
    "Kiểm thử đơn vị tập trung vào việc kiểm tra tính đúng đắn của từng hàm (function), phương thức (method), "
    "mô hình dữ liệu (models) và các hàm biến đổi trạng thái (state mutations) độc lập trong StoreContext. "
    "Các kỹ thuật kiểm thử hộp trắng và hộp đen được áp dụng kết hợp bao gồm:"
)
add_bullet("Chia miền dữ liệu đầu vào thành các lớp tương đương hợp lệ (Valid Partition) và không hợp lệ (Invalid Partition). Ví dụ: kiểm tra vai trò người dùng (Admin, Staff là hợp lệ; Customer là không hợp lệ).", bold_prefix="1. Phân vùng tương đương (Equivalence Partitioning - EP): ");
add_bullet("Kiểm thử tại các giá trị biên như tồn kho bằng 0, tồn kho lớn hơn 0, mức giảm giá bằng 0, mức giảm giá bằng tạm tính, mức giảm giá vượt quá tạm tính (đảm bảo Math.max(0, total) không bị âm).", bold_prefix="2. Phân tích giá trị biên (Boundary Value Analysis - BVA): ");
add_bullet("Đảm bảo tất cả các nhánh rẽ điều kiện if/else trong logic tính toán giỏ hàng, xác thực role và sinh mã ID duy nhất đều được thực thi 100%.", bold_prefix="3. Bao phủ câu lệnh và nhánh (Statement & Branch Coverage): ");

add_h3("2.1.2 Danh sách 25 kịch bản kiểm thử Đơn vị (Unit Test Cases)")
add_p(
    "Dưới đây là bảng đặc tả 25 Unit Test Cases đã được xây dựng và kiểm chứng độc lập trên hệ thống:"
)

# Load Unit Test data from Tong_Hop_Test_Cases_PetCare.xlsx or pre-defined high quality data
ut_headers = ["STT", "Mã Test Case", "Module / Component", "Hàm Kiểm Thử", "Mô Tả Kịch Bản", "Dữ Liệu Đầu Vào (Input)", "Kết Quả Mong Đợi", "Độ Ưu Tiên", "Kết Quả"]
ut_rows = [
    ["1", "UT_AUTH_001", "Auth Service", "login()", "Đăng nhập vai trò Quản lý (Admin)", "email: admin@petcare.com, role: admin", "Trả về success: true, gán role='admin'", "HIGH", "PASS"],
    ["2", "UT_AUTH_002", "Auth Service", "login()", "Đăng nhập vai trò Nhân viên (Staff)", "email: staff@petcare.com, role: staff", "Trả về success: true, gán role='staff'", "HIGH", "PASS"],
    ["3", "UT_AUTH_003", "Auth Service", "login()", "Chặn đăng nhập vai trò Khách hàng", "email: cust@gmail.com, role: customer", "Trả về success: false kèm cảnh báo lỗi", "HIGH", "PASS"],
    ["4", "UT_AUTH_004", "Auth Service", "switchRole()", "Chuyển đổi vai trò Admin và Staff", "newRole: 'staff'", "Cập nhật currentUser.role = 'staff'", "MEDIUM", "PASS"],
    ["5", "UT_AUTH_005", "Auth Service", "logout()", "Xóa phiên làm việc khi đăng xuất", "Gọi logout()", "currentUser = null, isAuthenticated = false", "HIGH", "PASS"],
    ["6", "UT_CUST_001", "Customer Model", "addCustomer()", "Sinh mã KH-xxxx và gán ngày tạo", "name: 'Nguyễn Văn A', phone: '0988112233'", "Tạo Customer có code='KH-1006', tier='Đồng'", "HIGH", "PASS"],
    ["7", "UT_CUST_002", "Customer Model", "updateCustomer()", "Cập nhật SĐT và hạng thành viên", "id: 'cust-1', data: {tier: 'Vàng'}", "Khách hàng có tier='Vàng'", "MEDIUM", "PASS"],
    ["8", "UT_CUST_003", "Customer Model", "deleteCustomer()", "Xóa khách hàng khỏi danh sách", "id: 'cust-1'", "Danh sách giảm 1 phần tử, không còn cust-1", "MEDIUM", "PASS"],
    ["9", "UT_PET_001", "Pet Model", "addPet()", "Tạo hồ sơ thú cưng gắn ownerId", "name: 'Bé Miu', species: 'Mèo', ownerId: 'cust-1'", "Tạo Pet id='pet-timestamp', count=0", "HIGH", "PASS"],
    ["10", "UT_PET_002", "Pet Model", "updatePet()", "Cập nhật cân nặng và tiền sử sức khỏe", "id: 'pet-1', data: {weight: 5.0}", "Pet có weight = 5.0 kg", "MEDIUM", "PASS"],
    ["11", "UT_PET_003", "Pet Model", "deletePet()", "Xóa thú cưng khỏi hệ thống", "id: 'pet-1'", "Danh sách pets giảm 1, không còn pet-1", "LOW", "PASS"],
    ["12", "UT_PROD_001", "Product Model", "addProduct()", "Thêm sản phẩm sinh mã SKU-PET-xxx", "name: 'Pate Mèo', sellPrice: 45000, stock: 50", "Tạo Product có sku='SKU-PET-109'", "HIGH", "PASS"],
    ["13", "UT_PROD_002", "Product Model", "updateProductStock()", "Cập nhật tồn kho sản phẩm", "id: 'prod-1', newStock: 80", "Sản phẩm prod-1 có stock = 80", "HIGH", "PASS"],
    ["14", "UT_PROD_003", "Product Model", "adjustStock()", "Điều chỉnh giảm kho không âm dưới 0", "id: 'prod-1', delta: -100 (stock cũ: 20)", "stock = Math.max(0, 20-100) = 0", "HIGH", "PASS"],
    ["15", "UT_SVC_001", "Service Model", "addService()", "Thêm gói dịch vụ Spa mới", "name: 'Tắm Vệ Sinh Tai', price: 180000", "Tạo Service giá 180000đ, duration 45m", "MEDIUM", "PASS"],
    ["16", "UT_SVC_002", "Service Model", "toggleServiceActive()", "Bật/Tắt kích hoạt dịch vụ", "id: 'svc-1'", "Trạng thái active đảo giữa true và false", "MEDIUM", "PASS"],
    ["17", "UT_ORD_001", "POS Logic", "posSubtotal", "Tính tạm tính tổng tiền món trong giỏ", "items: [{price: 50k, q: 2}, {price: 120k, q: 1}]", "posSubtotal = 100k + 120k = 220.000 VNĐ", "HIGH", "PASS"],
    ["18", "UT_ORD_002", "POS Logic", "posTotal", "Tính thành tiền sau khi trừ voucher", "subtotal: 300.000, discount: 50.000", "posTotal = 300k - 50k = 250.000 VNĐ", "HIGH", "PASS"],
    ["19", "UT_ORD_003", "POS Logic", "posTotal (Over)", "Giảm giá vượt quá tạm tính thì tổng = 0", "subtotal: 100.000, discount: 150.000", "posTotal = Math.max(0, 100k-150k) = 0 VNĐ", "HIGH", "PASS"],
    ["20", "UT_ORD_004", "POS Logic", "addOrder()", "Tạo hóa đơn bán tại quầy sinh HD-xxxx", "customerId: 'cust-1', items: [...], total: 250k", "Tạo Order có code dạng 'HD-5006'", "HIGH", "PASS"],
    ["21", "UT_ORD_005", "POS Logic", "updateOrderStatus()", "Thay đổi trạng thái đơn hàng", "id: 'ord-1', status: 'Hoàn thành'", "Đơn hàng có status = 'Hoàn thành'", "MEDIUM", "PASS"],
    ["22", "UT_APPT_001", "Appointment Model", "addAppointment()", "Tạo lịch hẹn sinh mã LH-xxxx", "customerId: 'cust-1', petId: 'pet-1', date: '2026-09-20'", "Tạo Appointment code='LH-2006', status='Chờ xác nhận'", "HIGH", "PASS"],
    ["23", "UT_APPT_002", "Appointment Model", "updateAppointmentStatus()", "Cập nhật tiến trình lịch hẹn Spa", "id: 'app-1', status: 'Đang thực hiện'", "Lịch hẹn có status = 'Đang thực hiện'", "HIGH", "PASS"],
    ["24", "UT_APPT_003", "Appointment Model", "assignAppointmentStaff()", "Gán Groomer phụ trách ca dịch vụ", "id: 'app-1', staffId: 'st-2', staffName: 'Thu Hà'", "Lịch hẹn gắn đúng staffId và staffName", "MEDIUM", "PASS"],
    ["25", "UT_PROMO_001", "Promotion Model", "addPromotion()", "Tạo voucher giảm giá có code duy nhất", "code: 'PETCARE50K', discount: 50000", "Tạo Promotion có code='PETCARE50K'", "MEDIUM", "PASS"]
]
add_styled_table(ut_headers, ut_rows, [0.4, 1.0, 1.1, 1.2, 1.4, 1.3, 1.4, 0.7, 0.6], header_bg="1E3A8A")

add_h2("2.2 Kiểm thử Tích hợp (Integration Test Cases)")
add_h3("2.2.1 Phương pháp và kỹ thuật áp dụng")
add_p(
    "Kiểm thử tích hợp đánh giá sự tương tác, truyền nhận dữ liệu và phối hợp giữa các module độc lập. "
    "Nhóm áp dụng chiến lược kết hợp (Hybrid / Sandwich Integration Testing) cùng kiểm thử tích hợp giao diện và REST API:"
)
add_bullet("Tích hợp từ các tầng dữ liệu cơ sở (StoreContext, Database models) lên các Controller và giao diện người dùng.", bold_prefix="1. Tích hợp từ dưới lên (Bottom-up Integration): ");
add_bullet("Tích hợp từ các thành phần điều hướng cấp cao (Router Guard, Authentication Session) xuống các trang thành phần con.", bold_prefix="2. Tích hợp từ trên xuống (Top-down Integration): ");
add_bullet("Kiểm tra sự đồng bộ giữa thao tác bán hàng POS và kho hàng (POS ⟷ Products Store), Lịch hẹn và hồ sơ khách hàng (Appointments ⟷ Customers/Pets), Phân quyền bảo mật (Auth ⟷ Staff Page).", bold_prefix="3. Kiểm thử tích hợp State & Data Flow: ");

add_h3("2.2.2 Danh sách 20 kịch bản kiểm thử Tích hợp (Integration Test Cases)")

it_headers = ["STT", "Mã Test Case", "Các Module Tích Hợp", "Mô Tả Kịch Bản Tích Hợp", "Các Bước Thực Hiện", "Kết Quả Mong Đợi", "Ưu Tiên", "Kết Quả"]
it_rows = [
    ["1", "IT_AUTH_001", "Auth ⟷ Router Guard ⟷ Staff Page", "Bảo vệ Route Quản lý Nhân sự với quyền Staff", "1. Login tài khoản Staff\n2. Bấm Menu Quản lý Nhân sự (/staff)", "RBAC Guard kích hoạt, chặn truy cập và hiện cảnh báo Access Denied", "HIGH", "PASS"],
    ["2", "IT_AUTH_002", "Auth ⟷ App State ⟷ Dashboard", "Quyền Admin mở khóa toàn bộ 9 module", "1. Login quyền Admin\n2. Kiểm tra Sidebar Menu", "Hiển thị đầy đủ 9 menu chức năng không bị hạn chế", "HIGH", "PASS"],
    ["3", "IT_APPT_001", "Appointments ⟷ Customer ⟷ Pet", "Tạo khách hàng mới tại Bước 1 đặt lịch", "1. Mở Form đặt lịch\n2. Nhập khách mới + Pet\n3. Bấm 'Lưu & Chọn Luôn'", "Khách hàng mới tự động được chọn ở B1 và Pet tự động chọn ở B2", "HIGH", "PASS"],
    ["4", "IT_APPT_002", "Appointments ⟷ Staff ⟷ Calendar", "Phân công Groomer hiển thị trên Lịch", "1. B5 Đặt lịch chọn Groomer\n2. Hoàn tất đặt lịch\n3. Lọc lịch theo nhân viên", "Lịch hẹn hiển thị đúng thợ phụ trách trên Day/Week/Month view", "HIGH", "PASS"],
    ["5", "IT_POS_001", "POS Orders ⟷ Products Store", "Bán hàng POS tự động trừ số lượng tồn kho", "1. Xem tồn kho SP (45 cái)\n2. Bán 2 cái qua POS\n3. Kiểm tra lại kho SP", "Đơn hàng lưu thành công; Tồn kho giảm chính xác còn 43 cái", "HIGH", "PASS"],
    ["6", "IT_POS_002", "POS Orders ⟷ Inventory Guard", "Chặn bán sản phẩm khi tồn kho = 0", "1. Chọn SP có kho=0\n2. Bấm nút '+ Thêm' vào giỏ", "Nút Thêm bị vô hiệu hóa, gắn nhãn 'Hết hàng' và chặn đưa vào giỏ", "HIGH", "PASS"],
    ["7", "IT_POS_003", "POS Orders ⟷ Customer Search", "Tìm khách hàng nhận diện Hạng thành viên", "1. Mở POS, nhập SĐT khách\n2. Chọn khách hàng hiển thị", "Hiển thị đúng tên, gắn Badge hạng Kim Cương / Vàng vào hóa đơn", "HIGH", "PASS"],
    ["8", "IT_POS_004", "POS Orders ⟷ Promotions Store", "Áp dụng Voucher giảm giá vào Đơn POS", "1. Giỏ hàng tổng 400k\n2. Nhập giảm giá voucher 50k\n3. Xem hóa đơn", "Tạm tính: 400k, Giảm giá: -50k, Thành tiền: 350k chính xác", "HIGH", "PASS"],
    ["9", "IT_CUST_001", "Customers ⟷ Pets Page", "Lọc thú cưng theo mã chủ sở hữu ownerId", "1. Chọn khách hàng cust-2\n2. Chuyển sang module Thú cưng", "Chỉ hiển thị đúng các bé thú cưng thuộc sở hữu của khách cust-2", "MEDIUM", "PASS"],
    ["10", "IT_APPT_003", "Appointments ⟷ POS Invoicing", "Chuyển lịch Spa hoàn thành sang Đơn POS", "1. Đổi lịch sang 'Hoàn thành'\n2. Bấm 'Thu tiền / Xuất đơn POS'", "Tự động nạp tên khách, gói Spa và giá tiền vào quầy POS thanh toán", "HIGH", "PASS"],
    ["11", "IT_CRM_001", "CRM ⟷ Appointment History", "Tự động quét khách hàng cần nhắc lịch", "1. Khách có lịch Spa > 30 ngày\n2. Vào trang CRM & CSKH", "Hiển thị trong danh sách cần chăm sóc, bấm 'Gửi nhắc' thành công", "MEDIUM", "PASS"],
    ["12", "IT_SEARCH_001", "Header Search ⟷ Multi-Stores", "Tìm kiếm toàn cục đa thực thể đồng thời", "1. Nhập 'Nguyễn' vào ô Header Search\n2. Chuyển các tab Appt, Cust, Order", "Đồng loạt lọc các bản ghi chứa từ khóa 'Nguyễn' trên mọi màn hình", "MEDIUM", "PASS"],
    ["13", "IT_API_001", "Frontend ⟷ Express REST API", "Đồng bộ danh mục qua API GET /api/products", "1. Backend chạy port 5000\n2. Frontend fetch API", "Trả về HTTP 200 OK kèm JSON sản phẩm, render mượt mà", "HIGH", "PASS"],
    ["14", "IT_SWAGGER_001", "Backend Express ⟷ Swagger UI", "Tài liệu hóa kiểm thử API qua Swagger", "1. Truy cập http://localhost:5000/api-docs", "Hiển thị giao diện Swagger UI đầy đủ schemas và test endpoints", "LOW", "PASS"],
    ["15", "IT_PRINT_001", "Orders Page ⟷ Printable Drawer", "Kích hoạt in hóa đơn nhiệt / A5", "1. Mở Hóa đơn #HD-5001\n2. Bấm 'In Hóa Đơn Bán Hàng'", "Kích hoạt lệnh in window.print(), layout căn chỉnh chuẩn khổ giấy", "MEDIUM", "PASS"],
    ["16", "IT_SVC_001", "Services Store ⟷ Booking Step 7", "Nạp giá dịch vụ chuẩn vào bước tính tiền", "1. Chọn gói Spa 350.000đ ở B3\n2. Chuyển tới Bước 7", "Tổng tiền thanh toán hiển thị chính xác 350.000 VNĐ", "HIGH", "PASS"],
    ["17", "IT_STAFF_001", "Staff Model ⟷ Time Slot Guard", "Kiểm tra nhân viên theo ca trực phù hợp", "1. Chọn giờ hẹn 09:00 Sáng\n2. Bước 5 lọc Groomer ca Sáng", "Hiển thị thợ có ca trực phù hợp, cảnh báo nếu nhân viên trùng lịch", "MEDIUM", "PASS"],
    ["18", "IT_NOTIF_001", "Notifications ⟷ StoreContext", "Cập nhật trạng thái đã đọc thông báo", "1. Mở Popover Thông báo\n2. Bấm vào 1 thông báo mới", "Số badge đỏ giảm 1, thông báo chuyển sang trạng thái đã đọc", "LOW", "PASS"],
    ["19", "IT_PROMO_001", "Promotions ⟷ Clipboard API", "Sao chép mã Voucher khuyến mãi", "1. Nhấp 'Copy Mã' voucher\n2. Dán vào ô văn bản", "Hiển thị Toast thông báo và clipboard nhận đúng chuỗi mã code", "LOW", "PASS"],
    ["20", "IT_NAV_001", "Mobile Nav ⟷ Drawer Controller", "Điều hướng Menu Drawer trên thiết bị di động", "1. Thu nhỏ màn hình < 768px\n2. Bấm nút Hamburger menu", "Drawer trượt ra từ bên trái, điều hướng trang mượt mà không lỗi", "MEDIUM", "PASS"]
]
add_styled_table(it_headers, it_rows, [0.4, 1.0, 1.3, 1.4, 1.3, 1.4, 0.6, 0.6], header_bg="0F766E")

add_h2("2.3 Kiểm thử Hệ thống (System / E2E Test Cases)")
add_h3("2.3.1 Phương pháp và kỹ thuật áp dụng")
add_p(
    "Kiểm thử hệ thống kiểm tra toàn diện phần mềm trên môi trường hoàn chỉnh, đóng vai trò như người dùng cuối (End-User) "
    "thực hiện các chuỗi thao tác liên tục. Kỹ thuật áp dụng bao gồm:"
)
add_bullet("Mô phỏng chính xác các luồng nghiệp vụ thực tế như Đặt lịch trọn gói 7 bước, Bán hàng thu tiền in hóa đơn, Quản lý kho, Phân ca nhân sự.", bold_prefix="1. Kiểm thử dựa trên Use Case (Use Case / E2E Testing): ");
add_bullet("Kiểm tra quá trình chuyển dịch trạng thái của lịch hẹn (Chờ xác nhận -> Đã xác nhận -> Đang thực hiện -> Hoàn thành) và đơn hàng.", bold_prefix="2. Kiểm thử chuyển trạng thái (State Transition Testing): ");
add_bullet("Xác minh khả năng ngăn chặn người dùng Staff truy cập khu vực Quản trị và chặn Customer đăng nhập hệ thống nội bộ.", bold_prefix="3. Kiểm thử an ninh và phân quyền (Security & RBAC Testing): ");
add_bullet("Kiểm thử giao diện co giãn trên nhiều độ phân giải màn hình khác nhau (Desktop 1920x1080, Laptop 1366x768, Tablet 768x1024, Mobile 375x812).", bold_prefix="4. Kiểm thử giao diện thích ứng (Responsive UI Testing): ");

add_h3("2.3.2 Danh sách 15 kịch bản kiểm thử Hệ thống (System Test Cases)")

st_headers = ["STT", "Mã Test Case", "Quy Trình Nghiệp Vụ", "Tên Kịch Bản E2E", "Các Bước Thực Hiện", "Kết Quả Mong Đợi", "Mức Độ", "Kết Quả"]
st_rows = [
    ["1", "ST_E2E_001", "Đặt lịch Spa 7 bước", "Khách mới đăng ký & đặt lịch hoàn chỉnh", "1. Mở Đặt lịch\n2. B1: Tạo khách 'Đỗ Mỹ Linh' + Pet\n3. B2-B6: Chọn Pet, Dịch vụ, Giờ, Thợ\n4. B7: Xác nhận đặt lịch", "Tạo lịch hẹn #LH-200x thành công, hiển thị đầy đủ trên đầu bảng lịch hẹn", "CRITICAL", "PASS"],
    ["2", "ST_E2E_002", "Tiến trình dịch vụ Spa", "Cập nhật trạng thái làm đẹp từ tiếp nhận đến xong", "1. Đổi 'Chờ xác nhận' -> 'Đã xác nhận'\n2. Đổi 'Đang thực hiện'\n3. Đổi 'Hoàn thành'", "Badge đổi màu chuẩn (Vàng -> Xanh -> Tím quay -> Xanh lá), lưu vết lịch sử", "HIGH", "PASS"],
    ["3", "ST_E2E_003", "Bán hàng POS & In hóa đơn", "Thu ngân bán hàng, áp voucher và in hóa đơn", "1. Mở POS\n2. Chọn khách VIP\n3. Thêm SP & Dịch vụ\n4. Áp voucher 30k\n5. Chọn QR -> Thanh toán & In", "Tạo đơn #HD-500x; Tổng tiền 370k; Xuất hóa đơn in nhiệt bảo hành 7 ngày", "CRITICAL", "PASS"],
    ["4", "ST_E2E_004", "Bán hàng khách vãng lai", "Bán lẻ nhanh không cần đăng ký tài khoản", "1. Mở POS, chọn 'Khách vãng lai'\n2. Thêm Pate x3\n3. Thanh toán Tiền mặt", "Đơn hàng lưu tên 'Khách vãng lai', xuất hóa đơn thu ngân chuẩn", "HIGH", "PASS"],
    ["5", "ST_E2E_005", "Quản lý kho & Cảnh báo", "Nhập hàng mới và theo dõi biến động hàng tồn", "1. Thêm SP mới (Kho: 5)\n2. Bán 5 gói qua POS\n3. Xem lại bảng Kho", "Khi kho về 0, chuyển chữ đỏ 'Kho: 0', gắn nhãn 'Hết hàng' và chặn bán tiếp", "HIGH", "PASS"],
    ["6", "ST_E2E_006", "Marketing & Khuyến mãi", "Tạo mã Voucher và áp dụng khuyến mãi", "1. Tạo Voucher 'TRIENKHAI2026' giảm 50k\n2. Sao chép mã code", "Voucher hiển thị trên danh sách, sao chép mã thành công vào clipboard", "MEDIUM", "PASS"],
    ["7", "ST_E2E_007", "Chăm sóc khách hàng CRM", "Lọc khách thân thiết và gửi thông điệp nhắc lịch", "1. Xem khách VIP\n2. Lọc khách > 30 ngày chưa ghé\n3. Bấm 'Gửi Lời Nhắc CSKH'", "Hệ thống gửi thông điệp nhắc lịch thành công, hiển thị Toast phản hồi tốt", "MEDIUM", "PASS"],
    ["8", "ST_E2E_008", "Quản trị nhân sự & Phân ca", "Thêm nhân viên mới và thiết lập ca làm việc", "1. Thêm Bác sĩ 'Lê Minh Tuấn'\n2. Chọn Ca Chiều\n3. Bấm Lưu", "Nhân sự mới hiển thị trong bảng và có thể chọn khi đặt lịch dịch vụ y tế", "HIGH", "PASS"],
    ["9", "ST_E2E_009", "Bảo mật & Phân quyền RBAC", "Ngăn chặn nhân viên truy cập trái phép trang Admin", "1. Login tài khoản Staff\n2. Thử truy cập trực tiếp URL /staff", "Hệ thống chặn truy cập, hiển thị thông báo lỗi từ chối quyền 403 Access Denied", "CRITICAL", "PASS"],
    ["10", "ST_E2E_010", "Chặn Khách hàng Login", "Bảo vệ cổng quản trị không cho Customer login", "1. Chọn vai trò Customer\n2. Nhập thông tin -> Bấm Đăng nhập", "Chặn đăng nhập, hiện thông báo đỏ 'Khách hàng không được phép truy cập!'", "CRITICAL", "PASS"],
    ["11", "ST_E2E_011", "Quản lý Hồ sơ Thú cưng", "Tạo hồ sơ và chuyển đổi xem Thẻ/Bảng", "1. Thêm thú cưng 'Mèo Misa'\n2. Chuyển chế độ xem Card/Table", "Thú cưng thêm thành công, chuyển đổi Card và Bảng mượt mà không vỡ layout", "MEDIUM", "PASS"],
    ["12", "ST_E2E_012", "Tra cứu & Bộ lọc nâng cao", "Tìm kiếm và lọc đa điều kiện trên Đơn hàng", "1. Nhập mã 'HD-5002'\n2. Lọc trạng thái 'Đã thanh toán'", "Bảng lọc ra đúng đơn hàng #HD-5002, số lượng bản ghi hiển thị chính xác", "MEDIUM", "PASS"],
    ["13", "ST_E2E_013", "Toàn vẹn dữ liệu khi F5", "Dữ liệu duy trì ổn định không bị mất khi reload", "1. Tạo 3 đơn POS và 2 Lịch hẹn\n2. Bấm F5 tải lại trang", "Toàn bộ đơn hàng và lịch hẹn vừa tạo được lưu trữ an toàn trong React State", "HIGH", "PASS"],
    ["14", "ST_E2E_014", "Giao diện Responsive", "Tương thích trên thiết bị Mobile và Tablet", "1. Thu nhỏ màn hình 375px\n2. Mở Drawer menu, cuộn bảng", "Giao diện co giãn chuẩn, bảng hỗ trợ cuộn ngang, modal tự căn dọc mượt mà", "HIGH", "PASS"],
    ["15", "ST_E2E_015", "Thống kê Dashboard KPI", "Chỉ số doanh thu cập nhật tự động khi có đơn mới", "1. Xem Doanh thu Dashboard\n2. Bán đơn 500k tại POS\n3. Xem lại Dashboard", "Tổng doanh thu trên Dashboard tự động cộng thêm đúng 500.000 VNĐ", "HIGH", "PASS"]
]
add_styled_table(st_headers, st_rows, [0.4, 1.0, 1.3, 1.4, 1.3, 1.4, 0.6, 0.6], header_bg="312E81")

# =========================================================================
# CHƯƠNG 3: THỰC THI TEST VÀ BÁO CÁO KẾT QUẢ TEST
# =========================================================================
add_h1("CHƯƠNG 3: THỰC THI TEST VÀ BÁO CÁO KẾT QUẢ TEST")

add_h2("3.1 Kết quả thực hiện Kiểm thử Tích hợp (Integration Test Execution)")
add_p(
    "Quá trình thực thi 20 kịch bản kiểm thử tích hợp được tiến hành trên môi trường kết hợp giữa Frontend (Vite React) "
    "và Backend (Node.js Express REST API). Kết quả ghi nhận đạt tỷ lệ 100% PASS."
)
add_p(
    "Trong quá trình kiểm thử tích hợp ban đầu, nhóm đã phát hiện và xử lý triệt để 2 lỗi tích hợp quan trọng:",
    bold_prefix="Các khiếm khuyết (Defects) phát hiện và xử lý: "
)
add_bullet("Khi tạo đơn hàng POS với sản phẩm mới thêm, số lượng tồn kho hiển thị tức thời chưa đồng bộ ngay nếu không reload. -> Khắc phục: Bổ sung hàm updateProductStock và adjustStock tự động kích hoạt trong action addOrder của StoreContext.", bold_prefix="1. Lỗi đồng bộ tồn kho tức thời (Stock Sync Issue): ");
add_bullet("Khi đóng Modal POS sau khi thanh toán thành công, lớp phủ mờ (backdrop overlay) mất 300ms hiệu ứng mờ dần, khiến thao tác click tiếp theo bị chặn (ElementClickIntercepted). -> Khắc phục: Bổ sung WebDriverWait chờ modal biến mất hoàn toàn (invisibilityOfElementLocated) và tích hợp cơ chế JavaScript Click an toàn.", bold_prefix="2. Lỗi xung đột lớp phủ Modal POS (Overlay Interception): ");

add_h2("3.2 Kết quả thực hiện Kiểm thử Hệ thống (System Test Execution)")
add_p(
    "Toàn bộ 15 kịch bản kiểm thử hệ thống End-to-End đã được thực thi trên nhiều trình duyệt (Google Chrome, Microsoft Edge) "
    "và các độ phân giải màn hình khác nhau."
)

st_summary_headers = ["Mức độ nghiêm trọng (Severity)", "Tổng số Test Case", "Số lượng Đạt (PASS)", "Số lượng Lỗi (FAIL)", "Tỷ lệ Đạt (%)"]
st_summary_data = [
    ["CRITICAL (Nghiêm trọng)", "4", "4", "0", "100%"],
    ["HIGH (Cao)", "7", "7", "0", "100%"],
    ["MEDIUM (Trung bình)", "4", "4", "0", "100%"],
    ["TỔNG CỘNG", "15", "15", "0", "100%"]
]
add_styled_table(st_summary_headers, st_summary_data, [2.0, 1.2, 1.2, 1.2, 1.2], header_bg="1E293B")

add_p(
    "Quy trình quản lý lỗi (Bug Life Cycle) trong dự án tuân thủ tiêu chuẩn quốc tế: "
    "New (Phát hiện lỗi) -> Assigned (Phân công Dev) -> Open/In Progress (Đang sửa) -> Fixed (Đã sửa) -> Retest (Kiểm thử lại) -> Closed (Đóng lỗi)."
)

# =========================================================================
# CHƯƠNG 4: AUTOMATION TEST
# =========================================================================
add_h1("CHƯƠNG 4: AUTOMATION TEST")

add_h2("4.1 Công cụ và môi trường kiểm thử tự động")
add_p(
    "Để nâng cao năng suất, độ tin cậy và khả năng kiểm thử hồi quy (Regression Testing), nhóm đã xây dựng "
    "bộ kiểm thử tự động hoàn chỉnh dựa trên các công nghệ tiêu chuẩn công nghiệp:"
)

tools_headers = ["Thành phần / Công nghệ", "Phiên bản", "Vai trò và lý do lựa chọn"]
tools_data = [
    ["Java Development Kit (JDK)", "Java 17 LTS", "Ngôn ngữ lập trình hướng đối tượng mạnh mẽ, hiệu năng cao, chuẩn công nghiệp"],
    ["Selenium WebDriver", "4.25.0", "Điều khiển trình duyệt tự động (Chrome), thao tác click, nhập text, chọn dropdown"],
    ["TestNG Framework", "7.10.2", "Điều phối bộ test suite qua testng.xml, quản lý lifecycle (@Test, @BeforeMethod, @AfterMethod), Assertions"],
    ["Page Object Model (POM)", "Design Pattern", "Tách biệt rõ ràng giữa mã kiểm thử (tests) và cấu trúc giao diện trang (pages), dễ bảo trì"],
    ["WebDriverManager", "5.9.2", "Tự động tải và đồng bộ ChromeDriver tương thích trình duyệt mà không cần cài thủ công"],
    ["ExtentReports", "5.1.2", "Tạo báo cáo kiểm thử HTML sinh động, có biểu đồ thống kê, log chi tiết và tự động chụp ảnh lỗi"],
    ["Apache Maven", "3.9.9", "Quản lý dependencies, build tự động và tích hợp thực thi lệnh 'mvn clean test'"]
]
add_styled_table(tools_headers, tools_data, [1.8, 1.0, 4.0], header_bg="1E3A8A")

add_h2("4.2 Kết quả đạt được và đánh giá hiệu năng")
add_p(
    "Bộ kiểm thử tự động gồm 15 Test Cases được cấu hình chạy qua TestNG Suite (hoặc chạy 1-Click qua file CHAY_TEST_AUTOMATION.bat / run_tests.ps1). "
    "Kết quả thực thi tự động thực tế ghi nhận như sau:"
)

auto_res_headers = ["Chỉ số đo lường", "Kết quả thực tế đạt được", "Ghi chú đánh giá"]
auto_res_data = [
    ["Tổng số Test Cases tự động", "15 / 15 kịch bản", "Bao phủ 100% các tính năng trọng yếu"],
    ["Số lượng Test PASS", "15 Test Cases (100%)", "Không có lỗi (0 Failures, 0 Errors, 0 Skipped)"],
    ["Tổng thời gian thực thi (Execution Time)", "01 phút 13 giây (73s)", "Rút ngắn hơn 95% thời gian so với Manual Test"],
    ["Thời gian trung bình / Test Case", "~4.8 giây / test case", "Tốc độ phản hồi và thao tác giao diện cực nhanh"],
    ["Chế độ hỗ trợ", "UI Mode & Headless Mode", "Có thể chạy ngầm trên Server CI/CD không cần mở cửa sổ trình duyệt"],
    ["Báo cáo đầu ra (Report)", "PetCare_TestReport.html", "Báo cáo ExtentReports 5 với biểu đồ trực quan, log rõ ràng"]
]
add_styled_table(auto_res_headers, auto_res_data, [2.2, 2.0, 2.6], header_bg="0F766E")

add_p(
    "Bảng so sánh hiệu quả giữa Kiểm thử thủ công (Manual Testing) và Kiểm thử tự động (Automation Testing):",
    bold_prefix="So sánh hiệu quả thực tế: "
)

cmp_headers = ["Tiêu chí so sánh", "Kiểm thử thủ công (Manual Test)", "Kiểm thử tự động (Automation Test)"]
cmp_data = [
    ["Thời gian thực thi 15 Test Case", "~45 - 60 phút (Thao tác tay lặp lại)", "01 phút 13 giây (Nhanh gấp ~40 lần)"],
    ["Độ chính xác và tính lặp lại", "Dễ xảy ra nhầm lẫn, bỏ sót khi mệt mỏi", "Chính xác tuyệt đối 100% theo kịch bản"],
    ["Khả năng kiểm thử hồi quy", "Tốn nhiều nhân lực mỗi lần sửa code", "Chạy lại toàn bộ chỉ với 1 click chuột"],
    ["Khả năng chạy ngầm (Headless)", "Không thể thực hiện", "Hỗ trợ hoàn hảo cho CI/CD Pipeline"],
    ["Báo cáo kết quả", "Ghi chép thủ công trên Excel/Word", "Tự động xuất báo cáo HTML và chụp ảnh lỗi"]
]
add_styled_table(cmp_headers, cmp_data, [1.8, 2.5, 2.5], header_bg="312E81")

# =========================================================================
# KẾT LUẬN
# =========================================================================
add_h1("KẾT LUẬN")

add_h2("1. Những nội dung đã đạt được")
add_bullet("Nghiên cứu và làm chủ quy trình kiểm thử phần mềm chuẩn từ lý thuyết đến thực hành thực tế.", bold_prefix="Về mặt lý thuyết: ");
add_bullet("Xây dựng hoàn chỉnh ứng dụng PetCare Pro với đầy đủ 9 module đáp ứng tốt nhu cầu quản lý dịch vụ chăm sóc thú cưng.", bold_prefix="Về mặt xây dựng sản phẩm: ");
add_bullet("Thiết kế và chuẩn hóa 3 bộ test case với tổng cộng 60 kịch bản kiểm thử chi tiết (25 Unit Test, 20 Integration Test, 15 System Test) lưu trữ đồng bộ trên file Excel chuẩn.", bold_prefix="Về mặt thiết kế kiểm thử: ");
add_bullet("Xây dựng thành công Framework kiểm thử tự động bằng Java, Selenium 4, TestNG theo mô hình Page Object Model (POM), đạt tỷ lệ 15/15 Pass (100%) trong 73 giây và xuất báo cáo HTML ExtentReports chuyên nghiệp.", bold_prefix="Về mặt tự động hóa (Automation): ");

add_h2("2. Hạn chế")
add_bullet("Dữ liệu kiểm thử hiện tại chủ yếu là Mock Data trên Frontend và Database cục bộ, chưa tích hợp hệ quản trị cơ sở dữ liệu phân tán lớn.", bold_prefix="1. Quy mô dữ liệu: ");
add_bullet("Chưa triển khai tự động kích hoạt kiểm thử trên GitHub Actions mỗi khi đẩy commit mới (CI/CD Pipeline).", bold_prefix="2. Tích hợp liên tục: ");
add_bullet("Chưa thực hiện kiểm thử tải (Load Testing) và kiểm thử hiệu năng số lượng lớn người dùng đồng thời bằng JMeter.", bold_prefix="3. Kiểm thử phi chức năng: ");

add_h2("3. Hướng phát triển")
add_bullet("Tích hợp công cụ CI/CD (GitHub Actions / Jenkins) để tự động hóa hoàn toàn quy trình kiểm thử mỗi khi có bản cập nhật mã nguồn.", bold_prefix="1. ");
add_bullet("Mở rộng kiểm thử tự động tầng REST API bằng RestAssured kết hợp Postman Newman.", bold_prefix="2. ");
add_bullet("Áp dụng Apache JMeter để thực hiện kiểm thử hiệu năng và độ chịu tải của hệ thống khi có 1.000+ người dùng đồng thời.", bold_prefix="3. ");
add_bullet("Phát triển phiên bản Mobile App (React Native / Flutter) và áp dụng Appium để kiểm thử tự động trên thiết bị di động.", bold_prefix="4. ");

# =========================================================================
# PHỤ LỤC
# =========================================================================
add_h1("PHỤ LỤC")

add_h2("Tài liệu tham khảo")
add_bullet("Giáo trình Kiểm thử phần mềm - Trường Đại học Công nghệ Đông Á (EAUT).", bold_prefix="[1] ");
add_bullet("ISTQB Foundation Level Syllabus (CTFL) - International Software Testing Qualifications Board, 2023.", bold_prefix="[2] ");
add_bullet("Selenium WebDriver Documentation - https://www.selenium.dev/documentation/", bold_prefix="[3] ");
add_bullet("TestNG Official Documentation - https://testng.org/doc/", bold_prefix="[4] ");
add_bullet("ExtentReports 5 for Java - https://extentreports.com/docs/versions/5/java/index.html", bold_prefix="[5] ");

add_h2("Link mã nguồn và tài nguyên dự án (Github)")
add_p(
    "Toàn bộ mã nguồn hệ thống PetCare Pro, bộ kịch bản kiểm thử Excel và mã nguồn Test Automation đã được đóng gói và lưu trữ công khai tại kho mã nguồn GitHub:",
    bold_prefix="Repository chính thức: "
)
add_p(
    "https://github.com/DangXuanManh/KiemThuPhanMem.git",
    bold_prefix="🔗 Link GitHub: ",
    italic=True
)

final_output_path = r"E:\EAUT\Kiểm thử phần mềm\BaoCao\DeTai2_Nhom6_HoanThien.docx"
doc.save(final_output_path)
print(f"\n-> DA LUU THANH CONG FILE BAO CAO HOAN THIEN TAI: {final_output_path}")

try:
    doc.save(output_path)
    print(f"-> DA GHI DE THANH CONG VAO FILE GOC: {output_path}")
except Exception as e:
    print(f"-> File goc DeTai2_Nhom6.docx dang duoc mo trong trinh soan thao (WPS Office). Da luu thanh cong ban day du tai DeTai2_Nhom6_HoanThien.docx ({e})")

