<template>
  <div class="container-custom py-5">
    
    <div class="text-center mb-5 mt-3 section-header">
      <h2 class="fw-bold text-uppercase section-title">BỘ SƯU TẬP MỚI</h2>
      <div class="divider-gold mx-auto my-3"></div>
      <p class="text-muted small letter-spacing-1">Khám phá những cỗ máy thời gian đẳng cấp nhất</p>
    </div>

    <div class="filter-bar luxury-shadow">
      <div class="d-flex align-items-center gap-3 flex-wrap">
        <span class="fw-bold text-dark small text-uppercase letter-spacing-1"><i class="bi bi-funnel-fill gold-text me-1"></i> BỘ LỌC</span>
        
        <select v-model="filters.categoryId" class="custom-select" @change="applyFilters">
          <option value="">Tất cả Thương hiệu</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        
        <select v-model="filters.priceRange" class="custom-select" @change="applyFilters">
          <option value="">Tất cả Mức giá</option>
          <option value="under100">Dưới 100 triệu</option>
          <option value="100to300">100 - 300 triệu</option>
          <option value="over300">Trên 300 triệu</option>
        </select>
        
        <select v-model="filters.sort" class="custom-select" @change="applyFilters">
          <option value="newest">Mới ra mắt</option>
          <option value="price-asc">Giá: Thấp đến Cao</option>
          <option value="price-desc">Giá: Cao đến Thấp</option>
        </select>
      </div>
      
      <div class="search-wrapper mt-3 mt-lg-0">
        <i class="bi bi-search search-icon"></i>
        <input type="text" v-model="filters.keyword" class="search-input" placeholder="Tìm kiếm tuyệt tác..." @keyup.enter="applyFilters">
      </div>
    </div>

    <div class="product-grid-bg">
      
      <div v-if="isLoading" class="text-center py-5 my-5">
        <div class="spinner-border gold-text" role="status"></div>
        <p class="mt-3 text-muted fw-bold text-uppercase small letter-spacing-1">Đang tải dữ liệu...</p>
      </div>

      <div v-else>
        <div v-if="products.length === 0" class="col-12 text-center py-5 my-5 empty-state">
          <i class="bi bi-watch display-1 text-muted opacity-25 mb-3"></i>
          <h5 class="fw-bold text-dark">KHÔNG TÌM THẤY SẢN PHẨM</h5>
          <p class="text-muted mb-4">Rất tiếc, không có mẫu đồng hồ nào khớp với tìm kiếm của quý khách.</p>
          <button @click="resetFilters" class="btn btn-gold text-uppercase fw-bold px-4 py-2">Xóa bộ lọc</button>
        </div>

        <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          <div class="col" v-for="p in products" :key="p.id">
            <div class="product-card">
              
              <span class="badge-luxury badge-sale" v-if="isSaleActive(p)">-{{ p.discount }}%</span>
              <span class="badge-luxury badge-hot" v-else>HOT</span>
              
              <div class="img-wrap">
                <router-link :to="`/product/${p.id}`">
                  <img :src="`http://localhost:8080/images/${p.imageUrl}`" class="product-img" :alt="p.name" @error="handleImageError">
                </router-link>

                <div v-if="isSaleActive(p)" class="flash-sale-timer shadow-sm">
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

                <div class="quick-view-overlay">
                  <router-link :to="`/product/${p.id}`" class="btn btn-outline-gold px-4 py-2 small text-uppercase fw-bold">Xem chi tiết</router-link>
                </div>
              </div>
              
              <div class="card-info">
                <span class="brand-name">{{ p.brand || 'Luxury' }}</span>
                <router-link :to="`/product/${p.id}`" class="product-name">{{ p.name }}</router-link>
                
                <div class="price-wrapper mt-2">
                  <div v-if="isSaleActive(p)" class="d-flex align-items-center justify-content-center gap-2">
                    <span class="price-text text-danger fw-bold">{{ formatPrice(calculateSalePrice(p.price, p.discount)) }}</span>
                    <span class="old-price small text-decoration-line-through">{{ formatPrice(p.price) }}</span>
                  </div>
                  <div v-else class="price-text text-dark fw-bold">{{ formatPrice(p.price) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div> 
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import api from '@/api/index';

// Định nghĩa Interface
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  discount?: number;
  discountStart?: string; 
  discountEnd?: string;   
  imageUrl: string;
}

// State
const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const isLoading = ref(true);

const filters = reactive({ 
  categoryId: '', 
  priceRange: '', 
  sort: 'newest', 
  keyword: '' 
});

// ==========================================
// STATE THỜI GIAN THỰC (Cho Countdown)
// ==========================================
const nowRef = ref(new Date());
let timerInterval: any = null;

// Hàm gọi API thực tế
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/products', { params: filters });
    products.value = res.data.products;
    categories.value = res.data.categories;
  } catch (error) {
    console.error("Lỗi khi tải danh sách sản phẩm:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProducts();

  // Khởi động bộ đếm nhảy mỗi 1 giây
  timerInterval = setInterval(() => {
    nowRef.value = new Date();
  }, 1000);
});

// Tắt bộ đếm khi chuyển trang để giải phóng bộ nhớ
onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const applyFilters = () => {
  fetchProducts();
};

const resetFilters = () => {
  filters.categoryId = ''; 
  filters.priceRange = ''; 
  filters.sort = 'newest'; 
  filters.keyword = '';
  applyFilters();
};

const formatPrice = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + ' ₫';

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/200';
};

const calculateSalePrice = (price: number, discount?: number) => {
  return price * (1 - (discount || 0) / 100);
};

// ==========================================
// XỬ LÝ KHUYẾN MÃI & COUNTDOWN
// ==========================================
const parseJavaDate = (str?: string) => {
  if (!str) return new Date(0);
  if (str.includes('T')) return new Date(str);
  
  const [datePart, timePart] = str.split(' ');
  if (!datePart || !timePart) return new Date(0);
  const [d, m, y] = datePart.split('/');
  return new Date(`${y}-${m}-${d}T${timePart}`);
};

// Cập nhật isSaleActive dùng nowRef.value để auto tắt mác Sale khi hết giờ
const isSaleActive = (p: Product) => {
  if (!p.discount || p.discount <= 0 || !p.discountStart || !p.discountEnd) return false;
  
  const start = parseJavaDate(p.discountStart);
  const end = parseJavaDate(p.discountEnd);
  return nowRef.value >= start && nowRef.value <= end;
};

// Hàm tính toán đếm ngược từng giây (ĐÃ FIX LỖI NULL)
const getCountdown = (endDateStr?: string) => {
  // Luôn trả về 1 object mặc định để HTML không bị lỗi
  if (!endDateStr) return { d: 0, h: '00', m: '00', s: '00' };

  const end = parseJavaDate(endDateStr);
  const diff = end.getTime() - nowRef.value.getTime();

  if (diff <= 0) return { d: 0, h: '00', m: '00', s: '00' }; // Hết giờ

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
/* ==========================================
   GIAO DIỆN LUXURY - TRẮNG ĐEN VÀNG KIM 
========================================== */
.container-custom { max-width: 1300px; margin: 0 auto; padding: 0 15px; font-family: 'Helvetica Neue', Arial, sans-serif; }

/* Tiêu đề & Căn chỉnh */
.section-header { position: relative; }
.section-title { font-family: 'Montserrat', sans-serif; font-size: 2.2rem; color: #111; letter-spacing: 2px; }
.divider-gold { width: 60px; height: 3px; background: linear-gradient(to right, #B38728, #FBF5B7, #D4AF37); }
.letter-spacing-1 { letter-spacing: 1px; }
.gold-text { color: #D4AF37 !important; }

/* Thanh Filter Bar */
.filter-bar { 
  background: #ffffff; 
  padding: 20px 25px; 
  margin-bottom: 30px; 
  border-radius: 4px; 
  border: 1px solid #eaeaea;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; 
}
.luxury-shadow { box-shadow: 0 10px 30px rgba(0,0,0,0.03); }

.custom-select { 
  border: 1px solid #e0e0e0; 
  border-radius: 2px; 
  padding: 10px 15px; 
  font-size: 0.85rem; 
  font-weight: 500;
  color: #333; 
  background-color: #fafafa; 
  cursor: pointer; 
  transition: all 0.3s; 
  text-transform: uppercase;
}
.custom-select:hover, .custom-select:focus { border-color: #D4AF37; outline: none; box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }

.search-wrapper { position: relative; width: 320px; }
.search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: #D4AF37; }
.search-input { 
  border: 1px solid #e0e0e0; 
  border-radius: 2px; 
  padding: 10px 15px 10px 45px; 
  font-size: 0.9rem; 
  width: 100%; 
  background: #fafafa; 
  outline: none; 
  transition: all 0.3s;
}
.search-input:focus { border-color: #D4AF37; background: #fff; }

/* ==========================================
   KHUNG NỀN SẢN PHẨM (MÀU KEM SỮA CHUẨN MẪU)
========================================== */
.product-grid-bg {
  background-color: #FFF5EB; 
  padding: 40px;
  border-radius: 8px;
  margin-bottom: 50px;
}

/* Product Card - Thẻ Sản phẩm */
.product-card { 
  background: #ffffff; 
  border: 1px solid transparent;
  border-radius: 4px; 
  overflow: hidden; 
  transition: all 0.4s ease; 
  position: relative; 
  height: 100%; 
}
.product-card:hover { 
  border-color: #eaeaea;
  box-shadow: 0 15px 35px rgba(0,0,0,0.08); 
  transform: translateY(-5px); 
}

/* Badges */
.badge-luxury { 
  position: absolute; 
  top: 15px; 
  left: 15px; 
  font-size: 11px; 
  font-weight: 700; 
  padding: 6px 12px; 
  z-index: 10; 
  text-transform: uppercase; 
  letter-spacing: 1px;
}
.badge-hot { background-color: #111; color: #D4AF37; }
.badge-sale { background-color: #8b0000; color: #fff; }

/* ==========================================
   CSS BỘ ĐẾM NGƯỢC (COUNTDOWN TIMER)
========================================== */
.flash-sale-timer {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(17, 17, 17, 0.85); /* Nền đen nhám mờ */
  backdrop-filter: blur(5px);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 4px;
  padding: 5px 12px;
  display: flex;
  align-items: center;
  color: #fff;
  z-index: 15;
  white-space: nowrap;
  transition: all 0.3s ease;
}
.product-card:hover .flash-sale-timer {
  opacity: 0; 
  pointer-events: none;
}

.timer-item {
  display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 25px;
}
.timer-item .t-val { font-size: 13px; font-weight: 800; font-family: 'Montserrat', sans-serif; line-height: 1.1; }
.timer-item .t-lbl { font-size: 7px; text-transform: uppercase; letter-spacing: 1px; color: #a0a0a0; margin-top: 2px; }
.timer-colon { font-size: 12px; font-weight: bold; margin: 0 4px; color: #777; align-self: flex-start; padding-top: 1px; }

/* Hình ảnh & Hover Overlay */
.img-wrap { 
  height: 280px; 
  background-color: #ffffff; 
  display: flex; align-items: center; justify-content: center; 
  padding: 20px; 
  position: relative; 
  overflow: hidden; 
}
.product-img { max-height: 100%; max-width: 100%; transition: transform 0.6s ease; mix-blend-mode: multiply; }
.product-card:hover .product-img { transform: scale(1.08); }

/* Nút Xem nhanh */
.quick-view-overlay {
  position: absolute;
  bottom: -50px;
  left: 0;
  width: 100%;
  text-align: center;
  transition: all 0.4s ease;
  opacity: 0;
  z-index: 20;
}
.product-card:hover .quick-view-overlay {
  bottom: 25px;
  opacity: 1;
}
.btn-outline-gold {
  border: 1px solid #D4AF37;
  color: #D4AF37;
  background: rgba(255,255,255,0.95);
  text-decoration: none;
  transition: all 0.3s;
}
.btn-outline-gold:hover {
  background: #D4AF37;
  color: #fff;
}

/* Thông tin thẻ */
.card-info { padding: 25px 15px; text-align: center; border-top: 1px solid #f9f9f9; background: #ffffff; }
.brand-name { 
  color: #B38728; 
  font-size: 11px; 
  font-weight: 700; 
  text-transform: uppercase; 
  letter-spacing: 2px; 
  margin-bottom: 8px; 
  display: block; 
}
.product-name { 
  display: block; 
  color: #111; 
  font-size: 16px; 
  font-weight: 600; 
  text-decoration: none; 
  margin-bottom: 10px; 
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s;
}
.product-name:hover { color: #D4AF37; }

/* Giá tiền */
.price-text { font-size: 17px; letter-spacing: 0.5px; font-family: 'Montserrat', sans-serif; }
.old-price { color: #aaa; font-family: 'Montserrat', sans-serif; }
.text-danger { color: #b30000 !important; }

/* Empty State / Buttons */
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111 !important;
  border: none;
  transition: all 0.4s ease;
}
.btn-gold:hover {
  background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%);
  transform: scale(1.05);
}
</style>