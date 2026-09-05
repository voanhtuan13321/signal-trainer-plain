# Nhật ký thay đổi

Mọi thay đổi đáng chú ý của dự án được ghi lại trong tài liệu này.

Định dạng dựa trên Keep a Changelog và đã được Việt hóa để dễ đọc hơn.

## [1.0.0] - 2026-09-05

### Thêm
- Chế độ luyện tập nâng cao với giới hạn thời gian giảm dần theo chuỗi trả lời đúng.
- Dialog chọn Morse hoặc Semaphore khi bắt đầu và bắt đầu lại lượt chơi.
- Tự động phát âm thanh Morse trong chế độ luyện tập nâng cao.
- Hiển thị Semaphore bằng SVG đầy đủ thay cho bộ ảnh cắt rời.
- Timeline trực quan cho lịch sử cập nhật theo từng phiên bản.

### Thay đổi
- Tái cấu trúc mã nguồn theo các nhóm `app`, `pages`, `components`, `data`, `services`, `features` và `lib`.
- Tách các component dùng chung như Button, Tabs, QuizOption và SemaphoreImage.
- Chuyển changelog thành nguồn dữ liệu duy nhất, đọc trực tiếp từ `CHANGELOG.md`.
- Cải thiện giao diện mobile, scroll, navbar cố định và hiển thị SVG Semaphore.
- Bổ sung accessibility cho tabs, focus keyboard, skip link và vùng an toàn trên thiết bị có tai thỏ.
- Tối ưu cache changelog, timer luyện tập và vòng đời phát âm thanh Morse.

### Sửa lỗi
- Sửa vị trí, hướng tay và vị trí mép cờ trong các tư thế Semaphore.
- Sửa lỗi SVG bị che mất đầu hoặc cờ trong màn hình luyện tập.
- Sửa lựa chọn Morse/Semaphore không cập nhật đúng trạng thái active trong dialog.
- Sửa lỗi audio tiếp tục phát khi rời màn hình hoặc chuyển câu hỏi.
- Escape nội dung changelog trước khi render để tránh chèn HTML ngoài ý muốn.

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
- Bộ khung phát hành gồm `CHANGELOG.md`, `README.md`, `src/data/app-meta.js` và `.github/release.yml`.

### Thay đổi
- Đơn giản hóa luồng Home và Practice cho điện thoại.
- Chuyển phần hiển thị Semaphore từ SVG sinh động sang hình ảnh.
- Khóa ứng dụng ở light mode.

### Sửa lỗi
- Footer Practice chỉ hiển thị khi cần.
- Cố định quy tắc line ending của Git bằng `.gitattributes`.
