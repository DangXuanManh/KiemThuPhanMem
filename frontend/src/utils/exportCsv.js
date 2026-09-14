// Utility to export array of objects to CSV file with UTF-8 BOM for Excel
export const exportToCsv = (filename, rows) => {
  if (!rows || !rows.length) return;

  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  const csvContent =
    '\uFEFF' + // UTF-8 BOM
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Utility to print a booking invoice
export const printInvoice = (booking) => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  const invoiceHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hóa Đơn Dịch Vụ #${booking.id} - PetCare Store</title>
        <style>
          body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .header { text-align: center; border-b: 2px solid #ea580c; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; color: #ea580c; font-size: 28px; }
          .header p { margin: 5px 0 0; color: #666; font-size: 14px; }
          .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
          .details div { width: 48%; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .table th { background-color: #fff7ed; color: #c2410c; }
          .total { text-align: right; font-size: 20px; font-weight: bold; color: #ea580c; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #888; border-t: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🐾 PETCARE STORE</h1>
          <p>123 Nguyễn Trãi, Thanh Xuân, Hà Nội | Hotline: 1900 888 999</p>
          <h2 style="margin-top: 15px;">HÓA ĐƠN XÁC NHẬN DỊCH VỤ</h2>
          <p>Mã hóa đơn: <strong>#PET-INV-${booking.id}</strong> | Ngày in: ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        <div class="details">
          <div>
            <h3>Thông Tin Khách Hàng</h3>
            <p><strong>Họ tên:</strong> ${booking.customer_name || 'Khách hàng'}</p>
            <p><strong>Số điện thoại:</strong> ${booking.customer_phone || 'Chưa cập nhật'}</p>
            <p><strong>Email:</strong> ${booking.customer_email || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <h3>Thông Tin Thú Cưng</h3>
            <p><strong>Tên bé:</strong> 🐾 ${booking.pet_name}</p>
            <p><strong>Giống loài:</strong> ${booking.pet_breed || booking.pet_type}</p>
            <p><strong>Thời gian hẹn:</strong> ${booking.booking_date} lúc ${booking.booking_time}</p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Dịch Vụ Sử Dụng</th>
              <th>Thời Lượng</th>
              <th>Trạng Thái</th>
              <th>Đơn Giá</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${booking.service_name}</strong></td>
              <td>${booking.duration_mins || 60} phút</td>
              <td style="text-transform: uppercase; font-weight: bold;">${booking.status}</td>
              <td>${booking.total_price ? booking.total_price.toLocaleString('vi-VN') : 0} đ</td>
            </tr>
          </tbody>
        </table>

        <div class="total">
          Tổng Tiền Thanh Toán: ${booking.total_price ? booking.total_price.toLocaleString('vi-VN') : 0} VNĐ
        </div>

        <div class="footer">
          <p>Cảm ơn quý khách đã tin tưởng dịch vụ chăm sóc thú cưng tại PetCare Store!</p>
          <p>Mọi thắc mắc xin vui lòng liên hệ tổng đài 1900 888 999.</p>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;
  printWindow.document.write(invoiceHtml);
  printWindow.document.close();
};
