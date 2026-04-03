<template>
  <div class="luxury-theme custom-scrollbar-container">
    <section class="position-relative overflow-hidden p-0 hero-section">
      <div id="heroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="6000">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="hero-overlay"></div>
            <img src="@/assets/images/banner.jpg" class="d-block w-100 hero-img animate-zoom" alt="WatchStore Banner">
            <div class="carousel-caption d-flex flex-column justify-content-center h-100 text-start container">
              <div class="col-lg-7 col-md-9 hero-content" data-aos="fade-right" data-aos-duration="1500">
                <div class="d-inline-block border-bottom border-gold pb-2 mb-4">
                  <h6 class="text-gold text-uppercase fw-bold letter-spacing-3 mb-0 fs-6">Bộ sưu tập 2026</h6>
                </div>
                <h1 class="display-3 font-heading fw-black text-white mb-4 hero-title text-uppercase">
                  Đẳng Cấp Của <br> <span class="text-gradient-gold">Sự Thành Công</span>
                </h1>
                <p class="text-white mb-5 fs-5 fw-medium letter-spacing-1 hero-subtitle-highlight" data-aos="fade-up" data-aos-delay="200">
                  Sự kết hợp hoàn hảo giữa công nghệ chính xác và nghệ thuật chế tác thủ công vượt thời gian.
                </p>
                <div data-aos="fade-up" data-aos-delay="400">
                  <router-link to="/products" class="btn btn-luxury-gold btn-lg rounded-pill px-5 py-3 fw-bold letter-spacing-2 text-uppercase btn-hover-sweep shadow-glow">
                    <span>Khám Phá Ngay</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="marquee-section py-4 bg-light border-top border-bottom">
      <div class="marquee-track">
        <div class="brand-item" v-for="i in 2" :key="i">
          <span class="brand-item-content"><i class="bi bi-watch text-dark me-2"></i> ROLEX</span>
          <span class="brand-item-content"><i class="bi bi-gem text-dark me-2"></i> OMEGA</span>
          <span class="brand-item-content"><i class="bi bi-stopwatch text-dark me-2"></i> TAG HEUER</span>
          <span class="brand-item-content"><i class="bi bi-heptagon text-dark me-2"></i> CASIO</span>
          <span class="brand-item-content"><i class="bi bi-stars text-dark me-2"></i> SEIKO</span>
          <span class="brand-item-content"><i class="bi bi-lightning-charge text-dark me-2"></i> HUBLOT</span>
          <span class="brand-item-content"><i class="bi bi-droplet text-dark me-2"></i> PATEK PHILIPPE</span>
        </div>
      </div>
    </section>

    <div class="container my-5 py-5">
      <div class="row g-4 g-lg-5 text-center px-2">
        <div class="col-md-4" data-aos="flip-up" data-aos-delay="0" data-aos-duration="1000">
          <div class="feature-box px-4 py-5 h-100 rounded-4 glass-shadow">
            <div class="feature-icon-box mb-4 mx-auto animate-float"><i class="bi bi-truck fs-2"></i></div>
            <h5 class="fw-bold font-heading mb-3">Vận chuyển đặc quyền</h5>
            <p class="text-muted mb-0 fs-6 fw-normal">Giao hàng an toàn tuyệt đối, miễn phí cho đơn hàng trên 5 triệu đồng toàn quốc.</p>
          </div>
        </div>
        <div class="col-md-4" data-aos="flip-up" data-aos-delay="200" data-aos-duration="1000">
          <div class="feature-box px-4 py-5 h-100 rounded-4 glass-shadow">
            <div class="feature-icon-box mb-4 mx-auto animate-float" style="animation-delay: 0.3s;"><i class="bi bi-shield-check fs-2"></i></div>
            <h5 class="fw-bold font-heading mb-3">Bảo hành 5 năm</h5>
            <p class="text-muted mb-0 fs-6 fw-normal">Cam kết chính hãng 100%, bảo dưỡng máy móc trọn đời bởi chuyên gia.</p>
          </div>
        </div>
        <div class="col-md-4" data-aos="flip-up" data-aos-delay="400" data-aos-duration="1000">
          <div class="feature-box px-4 py-5 h-100 rounded-4 glass-shadow">
            <div class="feature-icon-box mb-4 mx-auto animate-float" style="animation-delay: 0.6s;"><i class="bi bi-arrow-counterclockwise fs-2"></i></div>
            <h5 class="fw-bold font-heading mb-3">Đổi trả 30 ngày</h5>
            <p class="text-muted mb-0 fs-6 fw-normal">Trải nghiệm an tâm với chính sách đổi trả tinh gọn, chuyên nghiệp.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mb-5 pb-5">
      <div class="p-4 p-md-5 rounded-4" style="background-color: #ebf4fa;">
        <h3 class="text-center font-heading fw-bold text-dark text-uppercase mb-4">ĐỒNG HỒ NỔI BẬT</h3>

        <div v-if="isLoadingData" class="text-center py-5 my-5">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"></div>
          <p class="mt-4 fw-bold text-uppercase letter-spacing-2 text-muted animate-pulse">Đang tải dữ liệu...</p>
        </div>

        <div v-else>
          <div class="row g-3">
            <div class="col-lg-3 col-md-4 col-6" v-for="(p, index) in localBestSellers" :key="p.id" data-aos="fade-up" :data-aos-delay="index * 100">
              <div class="card h-100 border-0 shadow-sm rounded-3 product-card-shopdongho bg-white">
                
                <div class="position-relative text-center p-3 pb-4">
                  <router-link :to="`/product/${p.id}`">
                    <img :src="getImageUrl(p.imageUrl)" class="img-fluid transition-all hover-zoom" style="height: 200px; width: 100%; object-fit: contain;" :alt="p.name">
                  </router-link>

                  <div v-if="isSaleActive(p) && getCountdown(p.discountEnd)" class="flash-sale-timer shadow-sm">
                    <div class="timer-item" v-if="getCountdown(p.discountEnd).d > 0">
                      <span class="t-val">{{ getCountdown(p.discountEnd).d }}</span>
                      <span class="t-lbl">NGÀY</span>
                    </div>
                    <span class="timer-colon" v-if="getCountdown(p.discountEnd).d > 0">:</span>
                    
                    <div class="timer-item">
                      <span class="t-val">{{ getCountdown(p.discountEnd).h }}</span>
                      <span class="t-lbl">GIỜ</span>
                    </div>
                    <span class="timer-colon">:</span>
                    <div class="timer-item">
                      <span class="t-val">{{ getCountdown(p.discountEnd).m }}</span>
                      <span class="t-lbl">PHÚT</span>
                    </div>
                    <span class="timer-colon">:</span>
                    <div class="timer-item">
                      <span class="t-val text-gold">{{ getCountdown(p.discountEnd).s }}</span>
                      <span class="t-lbl text-gold">GIÂY</span>
                    </div>
                  </div>
                </div>

                <div class="card-body text-center p-3 pt-2 d-flex flex-column border-top" style="background: #fafafa;">
                  <h6 class="card-title mb-2">
                    <router-link :to="`/product/${p.id}`" class="text-dark text-decoration-none fw-bold font-heading" style="font-size: 0.95rem; line-height: 1.4;">
                      {{ p.name }}
                    </router-link>
                  </h6>
                  
                  <div class="mt-auto">
                    <template v-if="isSaleActive(p)">
                      <del class="text-muted small d-block mb-1">{{ formatPrice(p.price) }}</del>
                      <div class="fw-bold text-danger font-heading" style="font-size: 1.1rem;">
                        {{ formatPrice(calculateSalePrice(p.price, p.discount)) }}
                        <span class="badge bg-danger ms-1 align-top" style="font-size: 0.65rem;">-{{ p.discount }}%</span>
                      </div>
                    </template>
                    <template v-else>
                      <div class="fw-bold text-dark mt-2 font-heading" style="font-size: 1.1rem;">
                        {{ formatPrice(p.price) }}
                      </div>
                    </template>

                    <div class="text-warning mt-2" style="font-size: 0.85rem;">
                      <i class="bi bi-star-fill"></i>
                      <i class="bi bi-star-fill"></i>
                      <i class="bi bi-star-fill"></i>
                      <i class="bi bi-star-fill"></i>
                      <i class="bi bi-star-fill"></i>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div class="text-center mt-5 mb-2" data-aos="fade-up">
            <router-link to="/products" class="btn btn-outline-dark rounded-pill px-5 py-2 fw-bold text-uppercase transition-all btn-view-all-bottom font-heading letter-spacing-1">
              Xem tất cả tuyệt tác
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'; 
import api from '@/api/index'; 
import AOS from 'aos';
import 'aos/dist/aos.css';

const localBestSellers = ref([]);
const isLoadingData = ref(true);

// 1. STATE THỜI GIAN THỰC (Cho đếm ngược)
const nowRef = ref(new Date());
let timerInterval = null;

onMounted(async () => {
  AOS.init({ offset: 80, duration: 1000, easing: 'ease-out-cubic', once: true });
  
  // Bật bộ đếm thời gian nhảy mỗi 1 giây
  timerInterval = setInterval(() => {
    nowRef.value = new Date();
  }, 1000);

  try {
    isLoadingData.value = true;
    const res = await api.get('/products'); 
    const allProducts = res.data.products || [];
    localBestSellers.value = allProducts.slice(0, 8); 
    
    await nextTick();
    AOS.refresh(); 

  } catch (error) {
    console.error("Lỗi khi load data trang chủ:", error);
  } finally {
    isLoadingData.value = false; 
  }
});

// Hủy bộ đếm khi chuyển trang để tránh lag máy
onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

// 2. HÀM XỬ LÝ ẢNH & TIỀN TỆ
const getImageUrl = (img) => {
  if (!img || img === 'null') return 'https://via.placeholder.com/50';
  const firstImg = (img.split(',')[0] || '').trim();
  if (firstImg.startsWith('http')) return firstImg;
  return `http://localhost:8080/images/${firstImg}`; 
};

const formatPrice = (value) => {
  if (!value) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
};

const calculateSalePrice = (price, discount) => {
  return price * (1 - (discount || 0) / 100);
};

// 3. HÀM CHUYỂN ĐỔI CHUỖI THỜI GIAN TỪ JAVA
const parseJavaDate = (str) => {
  if (!str) return new Date(0);
  if (str.includes('T')) return new Date(str);
  
  const [datePart, timePart] = str.split(' ');
  if (!datePart || !timePart) return new Date(0);
  
  const [d, m, y] = datePart.split('/');
  return new Date(`${y}-${m}-${d}T${timePart}`);
};

// 4. HÀM KIỂM TRA KHUYẾN MÃI (Sử dụng nowRef để tự động cập nhật)
const isSaleActive = (p) => {
  if (!p.discount || p.discount <= 0 || !p.discountStart || !p.discountEnd) return false;
  const start = parseJavaDate(p.discountStart);
  const end = parseJavaDate(p.discountEnd);
  // Nếu thời gian hiện tại nằm trong khoảng khuyến mãi
  return nowRef.value >= start && nowRef.value <= end;
};

// 5. HÀM TÍNH TOÁN BỘ ĐẾM NGƯỢC
const getCountdown = (endDateStr) => {
  const end = parseJavaDate(endDateStr);
  const diff = end - nowRef.value;

  if (diff <= 0) return null; // Hết giờ

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return {
    d: d > 0 ? d : 0,
    h: h.toString().padStart(2, '0'),
    m: m.toString().padStart(2, '0'),
    s: s.toString().padStart(2, '0')
  };
};
</script>

<style scoped>
/* Gọi font Montserrat thẳng vào style nội bộ phòng hờ */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

/* Global & Variables */
.luxury-theme {
  font-family: 'Inter', sans-serif;
  color: #333;
  --gold: #d4af37;
  --gold-light: #f3e5ab;
  --gold-dark: #aa8822;
  --dark: #111;
  overflow-x: hidden;
  scroll-behavior: smooth;
}
.font-heading { font-family: 'Montserrat', sans-serif; }
.fw-black { font-weight: 900; } 
.text-gold { color: var(--gold) !important; }
.border-gold { border-color: var(--gold) !important; }
.letter-spacing-1 { letter-spacing: 1px; }
.letter-spacing-2 { letter-spacing: 2px; }
.letter-spacing-3 { letter-spacing: 4px; }
.transition-all { transition: all 0.3s ease; }

/* CSS CARD SẢN PHẨM */
.product-card-shopdongho {
  transition: all 0.4s ease;
  border: 1px solid transparent !important;
}
.product-card-shopdongho:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.08) !important;
  border-color: #D4AF37 !important;
}
.hover-zoom { transition: transform 0.4s ease; }
.product-card-shopdongho:hover .hover-zoom { transform: scale(1.08); }

/* ==========================================
   CSS BỘ ĐẾM NGƯỢC (COUNTDOWN TIMER)
   Thiết kế chuẩn Luxury, đè lên ảnh sản phẩm
========================================== */
.flash-sale-timer {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(17, 17, 17, 0.9); /* Nền đen nhám mờ */
  backdrop-filter: blur(5px);
  border: 1px solid rgba(212, 175, 55, 0.4); /* Viền mạ vàng */
  border-radius: 4px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  color: #fff;
  z-index: 10;
  white-space: nowrap;
}
.timer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 25px;
}
.timer-item .t-val {
  font-size: 13px;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  line-height: 1.1;
}
.timer-item .t-lbl {
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #a0a0a0;
  margin-top: 2px;
}
.timer-colon {
  font-size: 12px;
  font-weight: bold;
  margin: 0 3px;
  color: #666;
  align-self: flex-start;
  padding-top: 1px;
}

/* Nút Xem tất cả ở dưới cùng */
.btn-view-all-bottom { border-width: 2px; background-color: transparent; color: #111; }
.btn-view-all-bottom:hover { background-color: #111; color: #fff; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); border-color: #111; }

/* --- CÁC CLASS CŨ KHÁC --- */
.text-gradient-gold {
  background: linear-gradient(to right, var(--gold-dark), var(--gold-light), var(--gold-dark), var(--gold-light));
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shine 4s linear infinite;
  display: inline-block;
}
@keyframes shine { to { background-position: 200% center; } }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: var(--gold-dark); }

@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
.animate-float { animation: float 5s ease-in-out infinite; }
@keyframes pulse-opacity { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
.animate-pulse { animation: pulse-opacity 2.5s infinite; }
@keyframes cinematic-zoom { 0% { transform: scale(1) translateY(0); filter: brightness(0.95); } 100% { transform: scale(1.12) translateY(-15px); filter: brightness(0.85); } }
.animate-zoom { animation: cinematic-zoom 30s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate; }

.btn-hover-sweep { position: relative; overflow: hidden; z-index: 1; }
.btn-hover-sweep::before {
  content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0));
  transform: skewX(-25deg); transition: 0s; z-index: -1;
}
.btn-hover-sweep:hover::before { left: 200%; transition: 0.8s ease-in-out; }

.btn-luxury-gold { background-color: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.6); backdrop-filter: blur(5px); }
.btn-luxury-gold:hover { background-color: #fff; color: var(--dark); border-color: #fff; transform: translateY(-3px); }
.shadow-glow:hover { box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4) !important; }

.hero-section { background-color: #000; position: relative; border-bottom: 5px solid var(--gold); } 
.hero-img { height: 90vh; width: 100%; object-fit: cover; } 
.hero-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%); z-index: 1;
}
.hero-content { position: relative; z-index: 2; }
.hero-title { line-height: 1.15; letter-spacing: -2px; }
.hero-subtitle-highlight { text-shadow: 0 2px 10px rgba(0,0,0,0.8); }

.marquee-section { 
  overflow: hidden; white-space: nowrap; position: relative; 
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}
.marquee-track { display: inline-flex; animation: scroll 35s linear infinite; }
.marquee-section:hover .marquee-track { animation-play-state: paused; }
.brand-item { display: flex; }
.brand-item-content {
  margin: 0 60px; opacity: 0.3; transition: all 0.5s; font-size: 1.4rem; 
  font-family: 'Montserrat', sans-serif; font-weight: 800; color: #000; display: flex; align-items: center;
}
.brand-item-content:hover { opacity: 1; transform: scale(1.15) translateY(-5px); color: var(--gold); }
@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

.feature-box { background: #ffffff; border: 1px solid rgba(0,0,0,0.02); transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1); box-shadow: 0 5px 15px rgba(0,0,0,0.03); }
.glass-shadow:hover { transform: translateY(-15px); box-shadow: 0 20px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.02) !important; border-color: rgba(212, 175, 55, 0.3); }
.feature-icon-box { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 50%; transition: all 0.5s ease; color: #333; }
.feature-box:hover .feature-icon-box { background: var(--dark); color: var(--gold) !important; transform: scale(1.1) rotate(5deg); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.feature-box:hover .feature-icon-box i { color: var(--gold) !important; }
</style>