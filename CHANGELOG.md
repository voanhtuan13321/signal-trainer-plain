# Nhật ký thay đổi

Mọi thay đổi đáng chú ý của dự án được ghi lại trong tài liệu này.

Định dạng dựa trên Keep a Changelog và đã được Việt hóa để dễ đọc hơn.

## [Unreleased]

### Thêm
- Workflow tự tạo GitHub Release khi đẩy tag `signal-trainer-plain-v*`, lấy ghi chú từ `CHANGELOG.md` và kiểm tra tag khớp phiên bản trong `app-meta.js`.

## [1.2.0] - 2026-10-17

### Thêm
- Lưu kỷ lục luyện tập và thử thách tốc độ trên thiết bị (localStorage), giữ lại sau khi tải lại trang và hiển thị trên bảng điểm kiểu arcade.
- Font Press Start 2P và VT323 được tự host trong `styles/fonts/`, chạy được khi offline và không phụ thuộc Google Fonts.
- Tiêu đề tab đổi theo từng trang, focus chuyển về vùng nội dung sau khi đổi trang, hộp thoại có tên truy cập và tín hiệu Morse được đọc là "chấm/vạch".
- Màn hình báo lỗi khi một trang gặp lỗi lúc dựng, thay cho trang trống; thông báo cho người dùng tắt JavaScript.
- Thanh nhảy nhanh tới ký tự và nút nghe gọn trên từng thẻ ở trang Học.
- Phím 1–4 chọn đáp án trong thử thách tốc độ.
- Lệnh `npm start` chạy máy chủ phát triển; workflow chạy `npm test` cho mỗi lần push lên `main` và mỗi pull request.

### Thay đổi
- Đổi giao diện sang phong cách pixel art 8-bit: viền pixel bằng box-shadow, không bo góc, lớp CRT scanline, thanh cuộn dày, hiệu ứng nhấp nháy/nổi theo bước; favicon và `theme-color` khớp giao diện mới.
- Trang chủ gọn lại thành ba lối vào theo lộ trình học (Bảng tín hiệu → Luyện tập → Thử thách tốc độ) như thanh điều hướng; thẻ nổi bật là Bảng tín hiệu với người mới và Luyện tập với người đã có kỷ lục.
- Màn luyện tập: tín hiệu Morse vẽ bằng chấm và vạch, đáp án lớn có gợi ý phím 1–4, thêm chuỗi đúng và số câu đúng, đúng/sai tô xanh/đỏ rõ.
- Bảng Morse xếp chữ cái trước, chữ số sau (cả lưới lẫn thanh nhảy); chấm và vạch trên thẻ được vẽ thành khối pixel.
- Trang nâng cao đổi tên thành "Thử thách tốc độ", vừa một màn hình khi đang tính giờ và giữ kỷ lục khi đổi chế độ; câu chữ trang 404 và mô tả trang bằng tiếng Việt dễ hiểu hơn.
- Thanh điều hướng có biểu tượng một dòng, nút chính màu đặc, tương phản cao; trang Cập nhật hiển thị đoạn mã trong dấu backtick thay vì in nguyên dấu.
- Tách logic phiên luyện tập thường và nâng cao ra `features/practice/`, thêm danh sách chế độ tín hiệu dùng chung, component nhận `attrs` và trang tự dọn dẹp qua hàm cleanup.
- Báo lỗi phát âm thanh ngay trên trang thay cho `window.alert`.
- Workflow deploy chạy `npm test` trước và chỉ đăng các file cần thiết lên Pages.

### Sửa lỗi
- Thử thách tốc độ: phím Esc không còn đóng hộp thoại bắt buộc (mất nút Bắt đầu / Bắt đầu lại); tab không còn trùng ID và điều hướng mũi tên chỉ di chuyển trong đúng bộ tab.
- Router xóa toàn bộ class `route-*` cũ và dùng `route-not-found` cho đường dẫn không tồn tại.
- Trang Luyện tập không còn chừa cột trống trên màn hình rộng.
- Phím tắt không chặn phím Space/Enter khi đang focus nút, và bỏ qua tổ hợp Ctrl/Alt/Meta.
- Parser changelog không gộp mục của heading không hợp lệ vào phiên bản trước.

## [1.1.0] - 2026-10-12

### Thêm
- Skeleton loading cho timeline lịch sử cập nhật thay cho dòng chữ "Đang tải".

### Thay đổi
- Quản lý khoảng trống của thanh điều hướng dưới bằng biến `--bottom-nav-space`, đồng bộ padding nội dung và scroll padding.
- Cập nhật `aria-busy` cho danh sách cập nhật khi tải xong hoặc gặp lỗi.

### Sửa lỗi
- Tắt hiệu ứng shimmer của skeleton khi người dùng bật giảm chuyển động.
- Khôi phục padding vùng an toàn cho thanh điều hướng dưới trên thiết bị có thanh Home.
- Tránh lỗi khi rời trang Updates trước khi tải xong lịch sử cập nhật.

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
