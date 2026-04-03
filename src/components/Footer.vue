<template>
  <footer class="watchshop-footer mt-5" id="footer-contact">
    
    <div class="newsletter-section py-4">
      <div class="container">
      </div>
    </div>

    <div class="main-footer py-5">
      <div class="container">
        <div class="row g-4">
          
          <div class="col-lg-3 col-md-6 pe-lg-4">
            <router-link class="brand-text text-decoration-none d-inline-block mb-3" to="/">WATCH<span class="gold-text">STORE</span></router-link>
            <p class="text-muted small mb-4 text-justify" style="line-height: 1.8;">
              Biểu tượng của sự đẳng cấp và trường tồn. Chúng tôi mang đến những cỗ máy thời gian xa xỉ nhất, tôn vinh vị thế và phong cách doanh nhân của bạn.
            </p>
            <h6 class="gold-text text-uppercase fw-bold mb-3 small" style="letter-spacing: 2px;">Kết nối</h6>
            <div class="social-links d-flex gap-2">
              <a href="#" class="social-icon"><i class="bi bi-facebook"></i></a>
              <a href="#" class="social-icon"><i class="bi bi-instagram"></i></a>
              <a href="#" class="social-icon"><i class="bi bi-youtube"></i></a>
              <a href="#" class="social-icon"><i class="bi bi-tiktok"></i></a>
            </div>
          </div>

          <div class="col-lg-2 col-md-3 col-6">
            <h6 class="footer-title">VỀ CHÚNG TÔI</h6>
            <ul class="list-unstyled footer-links mt-3">
              <li><router-link to="/">Trang chủ</router-link></li>
              <li><router-link to="/products">Bộ sưu tập</router-link></li>
              <li><a href="#">Lịch sử thương hiệu</a></li>
              <li><a href="#">Tạp chí đồng hồ</a></li>
              <li><a href="#">Hệ thống Showroom</a></li>
            </ul>
          </div>

          <div class="col-lg-3 col-md-3 col-6">
            <h6 class="footer-title">ĐẶC QUYỀN KHÁCH HÀNG</h6>
            <ul class="list-unstyled footer-links mt-3">
              <li><a href="#">Bảo hành quốc tế 5 năm</a></li>
              <li><a href="#">Thẩm định thật giả</a></li>
              <li><a href="#">Bảo mật thông tin VIP</a></li>
              <li><a href="#">Bảo dưỡng định kỳ</a></li>
              <li><a href="#">Giao hàng hỏa tốc</a></li>
            </ul>
          </div>

          <div class="col-lg-4 col-md-12">
            <h6 class="footer-title mb-3">SHOWROOM CHÍNH TÂM</h6>
            <ul class="list-unstyled contact-info mb-3">
              <li class="d-flex mb-2">
                <i class="bi bi-geo-alt-fill gold-text me-3 mt-1 fs-5"></i> 
                <span class="text-muted small">170A Thanh Niên, Quang Trung,<br>TP. Quy Nhơn, Bình Định</span>
              </li>
              <li class="d-flex mb-2">
                <i class="bi bi-telephone-fill gold-text me-3 mt-1 fs-5"></i> 
                <span class="text-muted small">Hotline VIP: <strong class="gold-text">0999.888.777</strong></span>
              </li>
              <li class="d-flex mb-3">
                <i class="bi bi-envelope-fill gold-text me-3 mt-1 fs-5"></i> 
                <span class="text-muted small">concierge@watchstore.vn</span>
              </li>
            </ul>
            
            <div class="map-container rounded-1 overflow-hidden border-gold mt-3 shadow-sm">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.283153066901!2d109.2074278748561!3d13.761790586631111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316f6da2764baa65%3A0xc43c8fee02505f3d!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1sen!2s!4v1774546507419!5m2!1sen!2s"
                width="100%" 
                height="150" 
                style="border:0;" 
                allowfullscreen 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

        </div>
      </div>
    </div>
    
    <div class="bottom-footer py-3 border-top-gold">
      <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <span class="small text-muted mb-2 mb-md-0">
          © 2026 <strong class="gold-text">WatchStore</strong> Exclusive. Crafted by <strong class="text-dark">Group Java6</strong>
        </span>
        <div class="payment-methods">
          <i class="bi bi-cc-visa mx-2 fs-4 text-muted hover-gold" title="Visa"></i>
          <i class="bi bi-cc-mastercard mx-2 fs-4 text-muted hover-gold" title="MasterCard"></i>
          <i class="bi bi-cc-amex mx-2 fs-4 text-muted hover-gold" title="American Express"></i>
          <i class="bi bi-shield-lock-fill mx-2 fs-4 gold-text" title="100% Secure"></i>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Màu nền Trắng Sáng */
.watchshop-footer {
  background-color: #ffffff;
  color: #333333; /* Chữ xám đậm dễ đọc */
  font-family: 'Helvetica Neue', Arial, sans-serif;
  border-top: 1px solid #eaeaea;
}

/* Định nghĩa màu Vàng Gold kim loại (Dành cho nền trắng) */
.gold-text {
  color: #B38728 !important;
  background: linear-gradient(to right, #AA771C, #D4AF37, #B38728);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent !important;
  display: inline-block;
}

/* Khu vực Đăng ký VIP - Màu Kem nhạt (Light Cream) cho sang */
.newsletter-section {
  background: #fdfbf7; 
  border-top: 1px solid #f0e6d2;
  border-bottom: 1px solid #f0e6d2;
}

.gold-border-input {
  border: 1px solid #D4AF37;
}
.gold-border-input:focus {
  border-color: #B38728;
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
  outline: none;
}
.gold-border-input::placeholder {
  color: #999;
  font-style: italic;
}

.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111 !important;
  border: 1px solid #D4AF37;
  transition: all 0.4s ease;
}
.btn-gold:hover {
  background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%);
  transform: scale(1.02);
  box-shadow: 0 4px 10px rgba(212, 175, 55, 0.3);
}

/* Logo */
.brand-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800; 
  font-size: 2rem;
  color: #1a1a1a; 
  letter-spacing: 3px;
}

/* Tiêu đề cột */
.footer-title {
  color: #1a1a1a;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 2px;
  position: relative;
  padding-bottom: 12px;
  text-transform: uppercase;
}
.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 2px;
  background: linear-gradient(to right, #D4AF37, transparent);
}

/* Links */
.footer-links li { 
  margin-bottom: 15px; 
}
.footer-links a { 
  text-decoration: none; 
  color: #666666; 
  font-size: 0.9rem; 
  transition: all 0.3s ease; 
  font-weight: 500;
}
.footer-links a:hover { 
  color: #D4AF37; 
  padding-left: 8px;
}

/* Social Icons */
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid #ddd; 
  color: #666; 
  background-color: transparent;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.4s ease;
}
.social-icon:hover {
  background: #D4AF37;
  border-color: #D4AF37;
  color: #fff;
  transform: translateY(-5px);
  box-shadow: 0 5px 10px rgba(212, 175, 55, 0.2);
}

/* Map & Border */
.border-gold {
  border: 1px solid #e8dcc4;
}
.map-container iframe {
  filter: contrast(1.05); /* Bản đồ màu sắc tự nhiên, sáng sủa */
}
.border-top-gold {
  border-top: 1px solid #eaeaea;
}

.bottom-footer {
  background-color: #f8f9fa; /* Nền xám cực nhạt cho phần bản quyền */
}

.hover-gold {
  transition: color 0.3s ease;
}
.hover-gold:hover {
  color: #D4AF37 !important;
}

.text-justify {
  text-align: justify;
}
</style>