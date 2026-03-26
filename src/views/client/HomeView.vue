<template>
  <div>
    <section class="position-relative overflow-hidden p-0">
      <div id="heroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="https://images.unsplash.com/photo-1622434641406-a158123450f9?w=1600" class="d-block w-100 hero-img" alt="Luxury Watch">
            <div class="carousel-caption d-flex flex-column justify-content-center h-100 text-start ps-5 container">
              <div class="col-lg-6 hero-caption" data-aos="fade-right" data-aos-duration="1200">
                <h5 class="text-warning text-uppercase fw-bold letter-spacing-2 mb-3">Bộ sưu tập 2026</h5>
                <h1 class="display-3 fw-bold text-white mb-4">Đẳng Cấp Của<br>Sự Thành Công</h1>
                <p class="text-white-50 mb-4 fs-5">Sự kết hợp hoàn hảo giữa công nghệ chính xác và nghệ thuật chế tác thủ công.</p>
                <div data-aos="fade-up" data-aos-delay="300">
                  <router-link to="/products" class="btn btn-light btn-lg rounded-pill px-5 fw-bold shadow hover-scale">Khám Phá Ngay</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="marquee-section border-bottom">
      <div class="marquee-track">
        <div class="brand-item" v-for="i in 2" :key="i">
          <span class="brand-item-content"><i class="bi bi-watch me-2"></i> ROLEX</span>
          <span class="brand-item-content"><i class="bi bi-gem me-2"></i> OMEGA</span>
          <span class="brand-item-content"><i class="bi bi-stopwatch me-2"></i> TAG HEUER</span>
          <span class="brand-item-content"><i class="bi bi-heptagon me-2"></i> CASIO</span>
          <span class="brand-item-content"><i class="bi bi-stars me-2"></i> SEIKO</span>
          <span class="brand-item-content"><i class="bi bi-lightning-charge me-2"></i> HUBLOT</span>
          <span class="brand-item-content"><i class="bi bi-droplet me-2"></i> PATEK PHILIPPE</span>
        </div>
      </div>
    </section>

    <div class="container my-5 py-5">
      <div class="row g-4 text-center">
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="0">
          <div class="p-5 bg-white shadow-sm rounded-4 feature-box h-100">
            <div class="feature-icon-box shadow-sm"><i class="bi bi-truck fs-2 text-primary"></i></div>
            <h5 class="fw-bold mt-3">Miễn phí vận chuyển</h5>
            <p class="text-muted small mb-0">Áp dụng cho đơn hàng trên 5 triệu đồng trên toàn quốc.</p>
          </div>
        </div>
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
          <div class="p-5 bg-white shadow-sm rounded-4 feature-box h-100">
            <div class="feature-icon-box shadow-sm"><i class="bi bi-shield-check fs-2 text-primary"></i></div>
            <h5 class="fw-bold mt-3">Bảo hành 5 năm</h5>
            <p class="text-muted small mb-0">Cam kết chính hãng 100%, bảo hành máy móc trọn đời.</p>
          </div>
        </div>
        <div class="col-md-4" data-aos="fade-up" data-aos-delay="400">
          <div class="p-5 bg-white shadow-sm rounded-4 feature-box h-100">
            <div class="feature-icon-box shadow-sm"><i class="bi bi-arrow-counterclockwise fs-2 text-primary"></i></div>
            <h5 class="fw-bold mt-3">Đổi trả 30 ngày</h5>
            <p class="text-muted small mb-0">Thủ tục nhanh gọn nếu có lỗi từ nhà sản xuất.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container my-5 py-5">
      <div class="d-flex justify-content-between align-items-end mb-5" data-aos="fade-right">
        <div>
          <h6 class="text-primary fw-bold text-uppercase letter-spacing-2">Bộ sưu tập</h6>
          <h2 class="fw-bold display-5">Lựa Chọn Hàng Đầu</h2>
        </div>
        <router-link to="/products" class="btn btn-outline-dark rounded-pill px-4 fw-bold">
          Xem tất cả <i class="bi bi-arrow-right ms-2"></i>
        </router-link>
      </div>

      <div v-if="isLoadingData" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 fw-bold">Đang tải đồng hồ luxury...</p>
      </div>

      <div v-else class="row g-4">
        <div class="col-lg-3 col-md-6" 
             v-for="(p, index) in localBestSellers" 
             :key="p.id" 
             data-aos="fade-up" 
             :data-aos-delay="index * 100">
          <div class="card h-100 product-card-pro bg-white rounded-4 overflow-hidden position-relative border-0 shadow-sm">
            <div class="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 m-3 rounded-pill small fw-bold shadow-sm" style="z-index: 2;">HOT</div>
            
            <div class="card-img-wrapper position-relative">
              <img :src="`http://localhost:8080/images/${p.imageUrl}`" 
                   class="img-fluid card-img-top" 
                   style="max-height: 200px;" 
                   :alt="p.name">
            </div>

            <div class="card-body text-center p-4">
              <p class="text-muted small mb-1 text-uppercase fw-bold ls-1">{{ p.category?.name || 'Luxury' }}</p>
              <h5 class="card-title fw-bold text-dark mb-3 text-truncate">
                <router-link :to="`/product/${p.id}`" class="text-decoration-none text-dark stretched-link">
                  {{ p.name }}
                </router-link>
              </h5>
              
              <div class="d-flex justify-content-center align-items-center flex-wrap gap-2">
                <template v-if="isSaleActive(p)">
                  <h5 class="text-danger fw-bold mb-0">{{ formatPrice(calculateSalePrice(p.price, p.discount)) }}</h5>
                  <span class="text-muted text-decoration-line-through small">{{ formatPrice(p.price) }}</span>
                  <span class="badge bg-danger small">-{{ p.discount }}%</span>
                </template>
                <template v-else>
                  <h5 class="text-primary fw-bold mb-0">{{ formatPrice(p.price) }}</h5>
                </template>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="py-5 my-5 position-relative text-white" data-aos="zoom-in" style="background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600') center/cover fixed;">
      <div class="container text-center py-5">
        <h2 class="display-4 fw-bold mb-3" data-aos="fade-up">Khuyến Mãi Đặc Biệt</h2>
        <p class="lead mb-4" data-aos="fade-up" data-aos-delay="200">Giảm giá lên đến 20% cho thành viên VIP đăng ký trong tháng này.</p>
        <router-link to="/register" class="btn btn-warning btn-lg rounded-pill px-5 fw-bold shadow" data-aos="fade-up" data-aos-delay="400">Đăng Ký Ngay</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/index'; // Sử dụng trực tiếp api thay vì thông qua store
import AOS from 'aos';
import 'aos/dist/aos.css';

const localBestSellers = ref([]);
const isLoadingData = ref(true);

onMounted(async () => {
  AOS.init({ offset: 120, duration: 800, easing: 'ease-out-cubic', once: true });
  
  try {
    isLoadingData.value = true;
    // Gọi API lấy trực tiếp danh sách sản phẩm để đảm bảo không bị dính cache
    const res = await api.get('/products'); 
    const allProducts = res.data.products || [];
    
    // Lọc ra bestSellers (Ví dụ: Lấy 8 sản phẩm mới nhất hoặc random tùy logic của bạn)
    localBestSellers.value = allProducts.slice(0, 8); 
  } catch (error) {
    console.error("Lỗi khi load data trang chủ:", error);
  } finally {
    isLoadingData.value = false; 
  }
});

const formatPrice = (value) => {
  if (!value) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
};

const calculateSalePrice = (price, discount) => {
  return price * (1 - (discount || 0) / 100);
};

const isSaleActive = (p) => {
  if (!p.discount || p.discount <= 0 || !p.discountStart || !p.discountEnd) return false;
  
  const parseJavaDate = (str) => {
    if (!str) return new Date(0);
    if (str.includes('T')) return new Date(str);
    
    const [datePart, timePart] = str.split(' ');
    if (!datePart || !timePart) return new Date(0);
    
    const [d, m, y] = datePart.split('/');
    return new Date(`${y}-${m}-${d}T${timePart}`);
  };

  const now = new Date();
  const start = parseJavaDate(p.discountStart);
  const end = parseJavaDate(p.discountEnd);
  return now >= start && now <= end;
};
</script>

<style scoped>
.hero-img { height: 75vh; object-fit: cover; filter: brightness(0.6); transition: transform 10s ease; }
.carousel-item:hover .hero-img { transform: scale(1.05); }
.hero-caption { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(5px); border: 1px solid rgba(255, 255, 255, 0.2); padding: 2rem; border-radius: 1rem; box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
.feature-box { transition: all 0.3s ease; border: 1px solid rgba(0,0,0,0.05); }
.feature-box:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; border-color: #0d6efd; }
.feature-icon-box { width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; background: #f8f9fa; border-radius: 50%; transition: 0.3s; }
.feature-box:hover .feature-icon-box { background: #0d6efd; color: white !important; }
.feature-box:hover .feature-icon-box i { color: white !important; }
.product-card-pro { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.product-card-pro:hover { transform: translateY(-10px) scale(1.02); box-shadow: 0 15px 30px rgba(0,0,0,0.15) !important; }
.card-img-wrapper { overflow: hidden; height: 280px; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa; }
.card-img-top { transition: transform 0.5s ease; mix-blend-mode: multiply; }
.product-card-pro:hover .card-img-top { transform: scale(1.1); }
.marquee-section { background: white; padding: 2rem 0; overflow: hidden; white-space: nowrap; position: relative; box-shadow: inset 0 0 20px rgba(0,0,0,0.05); }
.marquee-track { display: inline-flex; animation: scroll 30s linear infinite; }
.marquee-section:hover .marquee-track { animation-play-state: paused; cursor: pointer; }
.brand-item { display: flex; }
.brand-item-content { margin: 0 40px; opacity: 0.5; transition: 0.3s; font-size: 1.5rem; font-weight: bold; color: #333; display: flex; align-items: center; }
.brand-item-content:hover { opacity: 1; color: #0d6efd; transform: scale(1.1); }
@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.marquee-section::before, .marquee-section::after { content: ""; position: absolute; top: 0; width: 100px; height: 100%; z-index: 2; }
.marquee-section::before { left: 0; background: linear-gradient(to right, white, transparent); }
.marquee-section::after { right: 0; background: linear-gradient(to left, white, transparent); }
</style>