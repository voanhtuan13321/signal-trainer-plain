# Nhật ký thay đổi

Mọi thay đổi đáng chú ý của dự án được ghi lại trong tài liệu này.

Định dạng dựa trên Keep a Changelog và đã được Việt hóa để dễ đọc hơn.

## [0.2.0] - 2026-09-01

### Thêm
- Tài liệu quy trình phát hành và hiển thị phiên bản trong ứng dụng.
- Kiến trúc native ES modules cho ứng dụng GitHub Pages.
- Máy chủ phát triển Node.js cục bộ để kiểm thử ES modules qua HTTP.
- Cơ chế dự phòng thân thiện khi trình duyệt chặn tự động phát âm thanh Morse.

### Thay đổi
- Tách mã nguồn ứng dụng thành các module app, data, services, pages, components và lib.
- Di chuyển tài nguyên Semaphore vào `public/assets/semaphore/`.
- Chuẩn hóa phần markup sinh bằng template literal.
- Xóa theme và settings không sử dụng, giữ ứng dụng ở light mode.
- Cải thiện bố cục Home và Practice trên thiết bị di động.

### Sửa lỗi
- Dọn dẹp keyboard handler khi rời màn Practice.
- Sửa đường dẫn asset và đường dẫn tài liệu release checklist.

## [0.1.0] - 2026-08-31

### Thêm
- Giao diện mobile-first để học và luyện Morse và Semaphore.
- Bộ ảnh Semaphore cho từng chữ cái từ A đến Z.
- Cấu trúc static app tương thích với GitHub Pages.
- Bộ khung phát hành gồm `CHANGELOG.md`, `README.md`, `version.json` và `.github/release.yml`.

### Thay đổi
- Đơn giản hóa luồng Home và Practice cho điện thoại.
- Chuyển phần hiển thị Semaphore từ SVG sinh động sang hình ảnh.
- Khóa ứng dụng ở light mode.

### Sửa lỗi
- Footer Practice chỉ hiển thị khi cần.
- Cố định quy tắc line ending của Git bằng `.gitattributes`.
