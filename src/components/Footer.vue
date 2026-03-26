<template>
  <footer class="watchshop-footer mt-5" id="footer-contact">
    <div class="container py-5">
      <div class="row g-4">
        <div class="col-lg-3 col-md-6">
          <router-link class="brand-text text-decoration-none" to="/">WATCH<span>STORE</span></router-link>
          <p class="text-muted small mt-3">WATCHSTORE cung cấp những mẫu đồng hồ chính hãng, chất lượng và thời trang nhất. Chúng tôi cam kết mang đến sự hài lòng tuyệt đối cho quý khách hàng.</p>
        </div>
        
        <div class="col-lg-3 col-md-6 col-6 px-4">
          <h6 class="text-uppercase fw-bold mb-3 small">Liên kết nhanh</h6>
          <ul class="list-unstyled footer-links">
            <li><router-link to="/">Trang chủ</router-link></li>
            <li><router-link to="/products">Sản phẩm</router-link></li>
            <li><router-link to="/cart">Giỏ hàng</router-link></li>
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        
        <div class="col-lg-3 col-md-6 col-6 px-4">
          <h6 class="text-uppercase fw-bold mb-3 small">Danh mục hot</h6>
          <ul class="list-unstyled footer-links">
            <li><router-link to="/products?category=1">Đồng hồ Nam</router-link></li>
            <li><router-link to="/products?category=2">Đồng hồ Nữ</router-link></li>
            <li><router-link to="/products?category=3">Phụ kiện</router-link></li>
            <li><router-link to="/products?brand=rolex">Rolex</router-link></li>
          </ul>
        </div>
        
        <div class="col-lg-3 col-md-6">
          <h6 class="text-uppercase fw-bold mb-3 small">Liên hệ</h6>
          <div class="contact-item">
            <i class="bi bi-geo-alt me-2 text-danger"></i>
            <span class="small text-muted">123 Đường ABC, Quận XYZ, TP. Quy Nhơn, Bình Định</span>
          </div>
          <div class="contact-item">
            <i class="bi bi-telephone me-2 text-danger"></i>
            <span class="small text-muted">0123.456.789</span>
          </div>
          <div class="contact-item">
            <i class="bi bi-envelope me-2 text-danger"></i>
            <span class="small text-muted">support@watchstore.com</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="copyright py-3">
      <div class="container text-center">
        <span class="small text-white-50">© 2024 WatchStore. All Rights Reserved. Group Java6</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Paste toàn bộ CSS liên quan đến footer-luxury từ footer.html vào đây */
.watchshop-footer { background-color: #f8f9fa; border-top: 1px solid #eee; }
.brand-text {
  font-family: 'Playfair Display', serif;
  font-weight: 700; font-size: 1.5rem;
  color: #1a1a1a; letter-spacing: -0.5px;
}
.brand-text span { color: #d0021b; }
.footer-links li { margin-bottom: 8px; }
.footer-links a { text-decoration: none; color: #666; font-size: 0.85rem; transition: 0.2s; }
.footer-links a:hover { color: #d0021b; padding-left: 5px; }
.contact-item { display: flex; margin-bottom: 10px; align-items: start; }
.copyright { background-color: #212529; }
</style>