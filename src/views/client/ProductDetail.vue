<template>
  <div class="product-detail-page">
    
    <div v-if="isLoading" class="text-center py-5 my-5">
      <div class="spinner-border gold-text" role="status"></div>
      <p class="mt-3 text-muted fw-bold text-uppercase small letter-spacing-1">Đang tải tuyệt tác...</p>
    </div>

    <div v-else-if="!product" class="container py-5 text-center my-5 empty-state">
      <i class="bi bi-exclamation-triangle display-1 gold-text opacity-50 mb-3"></i>
      <h2 class="text-dark fw-bold text-uppercase">Không tìm thấy sản phẩm</h2>
      <p class="text-muted mt-3">Sản phẩm này không tồn tại hoặc đã được chuyển vào kho lưu trữ.</p>
      <router-link to="/products" class="btn btn-gold rounded-1 px-4 py-2 mt-3 fw-bold text-uppercase letter-spacing-1">Quay lại Bộ sưu tập</router-link>
    </div>

    <div class="container py-4" v-else>
      
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb text-uppercase small fw-bold letter-spacing-1">
          <li class="breadcrumb-item"><router-link to="/" class="text-muted text-decoration-none hover-gold">Trang chủ</router-link></li>
          <li class="breadcrumb-item"><router-link to="/products" class="text-muted text-decoration-none hover-gold">Bộ sưu tập</router-link></li>
          <li class="breadcrumb-item active gold-text">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="product-grid-bg shadow-sm">
        <div class="row g-5">
          
          <div class="col-lg-5">
            <div class="gallery-container">
              <div class="main-image-wrap rounded-1 border-gold-subtle bg-white shadow-sm position-relative">
                <img :src="getImageUrl(mainImage)" class="main-image" @error="handleImageError">
                <span v-if="isSaleActive(product)" class="position-absolute top-0 start-0 bg-danger text-white fw-bold px-3 py-1 m-3 rounded-1 text-uppercase letter-spacing-1" style="font-size: 12px; z-index: 10;">
                  Sale -{{ product.discount }}%
                </span>
              </div>

              <div class="thumb-list d-flex flex-wrap justify-content-center gap-3 mt-4">
                <div :class="['thumb-item rounded-1', { active: mainImage === product.imageUrl }]" 
                     @click="setMainImage(product.imageUrl)">
                  <img :src="getImageUrl(product.imageUrl)" @error="handleImageError">
                </div>

                <template v-if="product.imageUrls && product.imageUrls.length > 0">
                  <div v-for="(img, index) in product.imageUrls" 
                       :key="index"
                       :class="['thumb-item rounded-1', { active: mainImage === img }]" 
                       @click="setMainImage(img)">
                    <img :src="getImageUrl(img)" @error="handleImageError">
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="product-info-wrap h-100 bg-white rounded-1 p-4 p-lg-5 border-gold-subtle shadow-sm d-flex flex-column">
              
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="brand-label text-uppercase letter-spacing-2">{{ product.brand || 'Luxury' }}</span>
                <div class="rating-stars small">
                  <span v-if="realReviewCount > 0">
                    <i v-for="i in 5" :key="i" :class="i <= realRating ? 'bi bi-star-fill gold-text' : 'bi bi-star text-muted opacity-25'"></i>
                    <span class="text-muted ms-2 fw-bold">({{ realReviewCount }} đánh giá)</span>
                  </span>
                  <span v-else class="text-muted fst-italic letter-spacing-1" style="font-size: 11px;">Chưa có đánh giá</span>
                </div>
              </div>

              <h1 class="product-title luxury-font mb-3">{{ product.name }}</h1>
              
              <div class="d-flex align-items-center mb-4 text-muted small letter-spacing-1 border-bottom border-gold-subtle pb-3">
                <span class="me-4 border-end pe-4">Mã SP: <b class="text-dark">{{ product.code }}</b></span>
                <span>Trạng thái: 
                  <b :class="product.stock > 0 ? 'text-success' : 'text-danger'">
                    {{ product.stock > 0 ? `Sẵn sàng phục vụ (${product.stock})` : 'Tạm hết hàng' }}
                  </b>
                </span>
              </div>

              <div class="price-section rounded-1 mb-4 shadow-sm">
                <div class="d-flex align-items-end flex-wrap gap-3">
                  <template v-if="isSaleActive(product)">
                    <span class="current-price text-danger fw-bold luxury-font">{{ formatPrice(calculateSalePrice(product.price, product.discount)) }}</span>
                    <span class="old-price text-muted text-decoration-line-through mb-1 luxury-font">{{ formatPrice(product.price) }}</span>
                    <span class="discount-badge mb-2 shadow-sm">-{{ product.discount }}%</span>
                  </template>
                  <template v-else>
                    <span class="current-price text-dark fw-bold luxury-font">{{ formatPrice(product.price) }}</span>
                  </template>
                </div>

                <div v-if="isSaleActive(product)" class="flash-sale-banner mt-3 d-flex align-items-center justify-content-between p-3 rounded-1 shadow-sm flex-wrap gap-2">
                  <div class="d-flex align-items-center text-white">
                    <i class="bi bi-lightning-charge-fill fs-4 me-2 text-warning animate-pulse"></i>
                    <span class="fw-bold letter-spacing-1 text-uppercase small" style="font-size: 11px;">Đặc quyền kết thúc sau:</span>
                  </div>
                  
                  <div class="flash-sale-timer">
                    <div class="timer-item" v-if="getCountdown(product.discountEnd).d > 0">
                      <span class="t-val">{{ getCountdown(product.discountEnd).d }}</span>
                      <span class="t-lbl">NGÀY</span>
                    </div>
                    <span class="timer-colon" v-if="getCountdown(product.discountEnd).d > 0">:</span>
                    
                    <div class="timer-item">
                      <span class="t-val">{{ getCountdown(product.discountEnd).h }}</span>
                      <span class="t-lbl">GIỜ</span>
                    </div>
                    <span class="timer-colon">:</span>
                    <div class="timer-item">
                      <span class="t-val">{{ getCountdown(product.discountEnd).m }}</span>
                      <span class="t-lbl">PHÚT</span>
                    </div>
                    <span class="timer-colon">:</span>
                    <div class="timer-item">
                      <span class="t-val text-warning">{{ getCountdown(product.discountEnd).s }}</span>
                      <span class="t-lbl text-warning">GIÂY</span>
                    </div>
                  </div>
                </div>

                <p class="mb-0 mt-3 text-muted small letter-spacing-1"><i class="bi bi-shield-check gold-text me-2 fs-5 align-middle"></i>Cam kết chính hãng 100% - Đầy đủ hộp sổ thẻ</p>
              </div>

              <p class="text-muted mb-4 line-clamp-3" style="line-height: 1.8;">
                {{ product.description || 'Tuyệt tác thời gian mang đậm dấu ấn phong cách sang trọng và đẳng cấp.' }}
              </p>

              <div class="mt-auto">
                <div class="mb-4">
                  <label class="fw-bold text-uppercase small mb-2 d-block letter-spacing-1">Số lượng:</label>
                  <div class="quantity-selector rounded-1 shadow-sm">
                    <button type="button" class="qty-btn" @click="updateQty(-1)" :disabled="product.stock === 0">-</button>
                    <input type="number" v-model="quantity" class="qty-input" min="1" :max="product.stock" readonly>
                    <button type="button" class="qty-btn" @click="updateQty(1)" :disabled="product.stock === 0">+</button>
                  </div>
                </div>

                <div class="row g-3">
                  <div class="col-sm-6">
                    <button @click="addToCart" class="btn btn-outline-gold w-100 text-uppercase letter-spacing-1 py-3" :disabled="product.stock === 0">
                      <i class="bi bi-cart-plus me-2"></i> Thêm Vào Giỏ
                    </button>
                  </div>
                  <div class="col-sm-6">
                    <button @click="buyNow" class="btn btn-gold w-100 text-uppercase letter-spacing-1 py-3" :disabled="product.stock === 0">
                      Mua Ngay Chính Hãng
                    </button>
                  </div>
                </div>
              </div>

              <div class="policy-box mt-5 pt-4 border-top border-gold-subtle">
                <div class="row g-3 text-muted small fw-bold letter-spacing-1" style="font-size: 11px;">
                  <div class="col-6 d-flex align-items-center"><i class="bi bi-award gold-text me-2 fs-5"></i>Bảo hành quốc tế 5 năm</div>
                  <div class="col-6 d-flex align-items-center"><i class="bi bi-arrow-repeat gold-text me-2 fs-5"></i>1 đổi 1 trong 30 ngày</div>
                  <div class="col-6 d-flex align-items-center"><i class="bi bi-truck gold-text me-2 fs-5"></i>Miễn phí vận chuyển VIP</div>
                  <div class="col-6 d-flex align-items-center"><i class="bi bi-gem gold-text me-2 fs-5"></i>Thẩm định thật giả miễn phí</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12">
          <div class="bg-white p-4 p-lg-5 rounded-1 shadow-sm border border-gold-subtle">
            <ul class="nav nav-tabs luxury-tabs mb-4" role="tablist">
              <li class="nav-item"><button class="nav-link active text-uppercase fw-bold" data-bs-toggle="tab" data-bs-target="#desc">Câu chuyện thiết kế</button></li>
              <li class="nav-item"><button class="nav-link text-uppercase fw-bold" data-bs-toggle="tab" data-bs-target="#specs">Thông số kỹ thuật</button></li>
              <li class="nav-item"><button class="nav-link text-uppercase fw-bold" data-bs-toggle="tab" data-bs-target="#reviews">Đánh giá ({{ realReviewCount }})</button></li>
            </ul>
            
            <div class="tab-content py-3">
              <div class="tab-pane fade show active text-muted" id="desc">
                <h4 class="fw-bold text-dark mb-4 luxury-font">{{ product.name }}</h4>
                <p style="white-space: pre-line; line-height: 1.8; font-size: 15px;">{{ product.description || 'Sản phẩm này hiện chưa có mô tả chi tiết.' }}</p>
              </div>
              
              <div class="tab-pane fade" id="specs">
                <table class="table table-bordered luxury-table" style="max-width: 800px;">
                  <tbody>
                    <tr><th width="35%" class="bg-light text-uppercase small letter-spacing-1">Thương hiệu</th><td class="fw-bold text-dark">{{ product.brand || '---' }}</td></tr>
                    <tr><th class="bg-light text-uppercase small letter-spacing-1">Mã sản phẩm (Ref)</th><td class="text-dark">{{ product.code }}</td></tr>
                    <tr><th class="bg-light text-uppercase small letter-spacing-1">Động cơ / Loại máy</th><td class="text-dark">{{ product.machineType || '---' }}</td></tr>
                    <tr><th class="bg-light text-uppercase small letter-spacing-1">Chất liệu kính</th><td class="text-dark">{{ product.glassMaterial || '---' }}</td></tr>
                    <tr><th class="bg-light text-uppercase small letter-spacing-1">Đường kính mặt</th><td class="text-dark">{{ product.diameter || '---' }}</td></tr>
                    <tr><th class="bg-light text-uppercase small letter-spacing-1">Độ chịu nước</th><td class="text-dark">{{ product.waterResistance || '---' }}</td></tr>
                  </tbody>
                </table>
              </div>
              
              <div class="tab-pane fade" id="reviews">
                <div v-if="reviews.length === 0" class="text-center py-5">
                  <i class="bi bi-envelope-paper display-4 gold-text opacity-50"></i>
                  <p class="mt-3 text-muted letter-spacing-1 fst-italic">Trở thành người đầu tiên sở hữu và đánh giá tuyệt tác này.</p>
                </div>
                
                <div v-else>
                  <div v-for="(rv, index) in reviews" :key="index" class="border-bottom border-gold-subtle pb-4 mb-4">
                    <div class="d-flex justify-content-between mb-3">
                      <div class="d-flex align-items-center">
                        <div class="avatar-circle shadow-sm">
                          {{ rv.user ? rv.user.charAt(0).toUpperCase() : 'V' }}
                        </div>
                        <div>
                          <h6 class="mb-1 fw-bold text-dark luxury-font">{{ rv.user || 'Khách hàng VIP' }}</h6>
                          <div class="small">
                            <i v-for="i in 5" :key="i" :class="i <= rv.rating ? 'bi bi-star-fill gold-text' : 'bi bi-star text-muted opacity-25'"></i>
                          </div>
                        </div>
                      </div>
                      <small class="text-muted letter-spacing-1" style="font-size: 11px;">{{ formatDate(rv.createdAt) }}</small>
                    </div>
                    <p class="text-muted mb-0 ms-5 ps-3 border-start border-3" style="border-color: #D4AF37 !important; font-style: italic; line-height: 1.6;">
                      "{{ rv.comment }}"
                    </p>
                  </div>
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/index';
import { useCartStore } from '@/stores/cartStore';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const isLoading = ref(true);
const product = ref<any>(null);
const reviews = ref<any[]>([]);
const realRating = ref(5);
const realReviewCount = ref(0);

const mainImage = ref('');
const quantity = ref(1);

// ==========================================
// STATE THỜI GIAN THỰC (Cho Countdown)
// ==========================================
const nowRef = ref(new Date());
let timerInterval: any = null;

const fetchProductDetail = async (id: string | string[]) => {
  isLoading.value = true;
  product.value = null; 
  
  try {
    const res = await api.get(`/products/${id}`);
    product.value = res.data.product;

    if (product.value.imageUrls && typeof product.value.imageUrls === 'string') {
      product.value.imageUrls = product.value.imageUrls.split(',');
    } else if (!product.value.imageUrls) {
      product.value.imageUrls = [];
    }

    reviews.value = res.data.reviews || [];
    realRating.value = res.data.realRating || 5;
    realReviewCount.value = res.data.realReviewCount || 0;
    
    mainImage.value = product.value.imageUrl;
    
    quantity.value = 1;
    if (product.value.stock === 0) quantity.value = 0;
    
  } catch (error: any) {
    console.error("Lỗi fetch chi tiết SP:", error);
  } finally {
    isLoading.value = false;
  }
};

watch(() => route.params.id, (newId) => {
  if (newId) fetchProductDetail(newId);
});

onMounted(() => {
  if (route.params.id) fetchProductDetail(route.params.id);

  // Bật bộ đếm thời gian
  timerInterval = setInterval(() => {
    nowRef.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const setMainImage = (src: string) => { 
  mainImage.value = src; 
};

const updateQty = (val: number) => {
  if (!product.value || product.value.stock === 0) return;
  let newVal = quantity.value + val;
  if(newVal >= 1 && newVal <= product.value.stock) {
    quantity.value = newVal;
  }
};

const getImageUrl = (img: string) => {
  if (!img) return 'https://via.placeholder.com/400';
  if (img.startsWith('http')) return img;
  return `http://localhost:8080/images/${img}`; 
};

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/400';
};

const formatPrice = (val: number) => {
  if (!val) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth()+1).padStart(2, '0')}/${d.getFullYear()}`;
};

const calculateSalePrice = (price: number, discount: any) => {
  const disc = parseFloat(discount) || 0;
  return price * (1 - disc / 100);
};

// ==========================================
// XỬ LÝ KHUYẾN MÃI & COUNTDOWN
// ==========================================
const parseJavaDate = (str: string): number => {
  if (!str) return 0;
  if (str.includes('T')) {
    const d = new Date(str);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }
  const parts = str.split(' ');
  const datePart = parts[0] || '';
  let timePart = parts[1] || '';
  if (!datePart || !timePart) return 0;
  if (timePart.includes('.')) timePart = timePart.split('.')[0] || timePart;

  if (datePart.includes('/')) {
    const dp = datePart.split('/');
    const d = dp[0] || '';
    const m = dp[1] || '';
    const y = dp[2] || '';
    if (d && m && y) {
      const dateObj = new Date(`${y}-${m}-${d}T${timePart}`);
      return isNaN(dateObj.getTime()) ? 0 : dateObj.getTime();
    }
  }
  if (datePart.includes('-')) {
    const dateObj = new Date(`${datePart}T${timePart}`);
    return isNaN(dateObj.getTime()) ? 0 : dateObj.getTime();
  }
  const fallback = new Date(str);
  return isNaN(fallback.getTime()) ? 0 : fallback.getTime();
};

const isSaleActive = (p: any): boolean => {
  if (!p) return false;
  const disc = parseFloat(p.discount);
  if (isNaN(disc) || disc <= 0 || !p.discountStart || !p.discountEnd) return false;

  const now = nowRef.value.getTime();
  const start = parseJavaDate(p.discountStart);
  const end = parseJavaDate(p.discountEnd);

  if (start === 0 || end === 0) return false;
  return now >= start && now <= end;
};

// Hàm tính đếm ngược (An toàn, không dùng ?.)
const getCountdown = (endDateStr?: string) => {
  if (!endDateStr) return { d: 0, h: '00', m: '00', s: '00' };

  const end = parseJavaDate(endDateStr);
  const diff = end - nowRef.value.getTime();

  if (diff <= 0) return { d: 0, h: '00', m: '00', s: '00' };

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

// ==========================================
// MUA HÀNG
// ==========================================
const addToCart = () => {
  const currentPrice = isSaleActive(product.value) 
    ? calculateSalePrice(product.value.price, product.value.discount) 
    : product.value.price;
  
  const productToCart = { ...product.value, price: currentPrice };
  cartStore.addToCart(productToCart, quantity.value);
};

const buyNow = () => {
  const currentPrice = isSaleActive(product.value) 
    ? calculateSalePrice(product.value.price, product.value.discount) 
    : product.value.price;
  
  // Đóng gói đúng 1 sản phẩm này
  const buyNowItem = {
    productId: product.value.id,
    name: product.value.name,
    price: currentPrice,
    quantity: quantity.value,
    imageUrl: product.value.imageUrl
  };

  // Lưu tạm vào bộ nhớ trình duyệt, KHÔNG đụng gì tới cartStore
  sessionStorage.setItem('buyNowItem', JSON.stringify([buyNowItem]));

  // Chuyển sang checkout kèm cờ ?type=buynow để trang bên kia biết
  router.push('/checkout?type=buynow');
};
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY DETAIL - KEM SỮA & VÀNG KIM 
========================================== */
.product-detail-page { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fcfaf8; min-height: 100vh;}
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }
.letter-spacing-2 { letter-spacing: 2px; }

/* Colors */
.gold-text { color: #B38728 !important; }
.text-danger { color: #8b0000 !important; } /* Đỏ mận sang trọng */
.border-gold-subtle { border: 1px solid #f0e6d2 !important; }
.hover-gold { transition: color 0.3s; }
.hover-gold:hover { color: #B38728 !important; }

/* Product Grid Background (Kem sữa) */
.product-grid-bg { background-color: #FFF5EB; padding: 30px; border-radius: 4px; }
@media (min-width: 992px) { .product-grid-bg { padding: 50px; } }

/* Gallery */
.gallery-container { position: sticky; top: 100px; }
.main-image-wrap { height: 480px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 20px; }
.main-image { max-height: 100%; max-width: 100%; transition: transform 0.4s ease; mix-blend-mode: multiply; }
.main-image:hover { transform: scale(1.15); cursor: zoom-in; }

/* Thumbnails */
.thumb-item { width: 75px; height: 75px; border: 1px solid #eaeaea; padding: 5px; cursor: pointer; background: #fff; transition: all 0.3s ease; }
.thumb-item:hover { border-color: #ccc; transform: translateY(-3px); }
.thumb-item.active { border-color: #D4AF37; box-shadow: 0 4px 10px rgba(212, 175, 55, 0.2); }
.thumb-item img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }

/* Product Info Box */
.brand-label { background: #111; color: #D4AF37; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 2px; }
.product-title { font-size: 30px; font-weight: 800; color: #111; line-height: 1.4; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

/* Price Section */
.price-section { background: #fdfbf7; padding: 25px; border-left: 4px solid #D4AF37; }
.current-price { font-size: 34px; letter-spacing: 1px; }
.old-price { font-size: 18px; }
.discount-badge { background: #8b0000; color: #fff; padding: 3px 8px; font-size: 13px; font-weight: bold; border-radius: 2px; }

/* ==========================================
   CSS COUNTDOWN BANNER (BỘ ĐẾM NGƯỢC)
========================================== */
.flash-sale-banner { background: linear-gradient(135deg, #8b0000 0%, #4a0000 100%); border-left: 4px solid #D4AF37; }
.flash-sale-timer { display: flex; align-items: center; color: #fff; }
.timer-item { display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 35px; background: rgba(255,255,255,0.1); border-radius: 4px; padding: 5px; }
.timer-item .t-val { font-size: 16px; font-weight: 800; font-family: 'Montserrat', sans-serif; line-height: 1; }
.timer-item .t-lbl { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #e0e0e0; margin-top: 4px; }
.timer-colon { font-size: 18px; font-weight: bold; margin: 0 5px; color: #D4AF37; align-self: center; padding-bottom: 12px;}
@keyframes pulse-opacity { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
.animate-pulse { animation: pulse-opacity 2s infinite; }

/* Quantity Selector */
.quantity-selector { display: flex; align-items: center; border: 1px solid #e0e0e0; width: fit-content; background: #fff; }
.qty-btn { width: 45px; height: 45px; border: none; background: transparent; font-size: 18px; cursor: pointer; color: #555; transition: 0.2s; }
.qty-btn:hover:not(:disabled) { color: #D4AF37; background: #fdfbf7; }
.qty-input { width: 60px; height: 45px; border: none; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; text-align: center; font-weight: 700; font-size: 16px; background: #fff;}

/* Buttons */
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111 !important; border: 1px solid #D4AF37; font-weight: 700; border-radius: 2px; transition: all 0.4s ease;
}
.btn-gold:hover:not(:disabled) { background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3); }
.btn-outline-gold { background: #fff; border: 1px solid #D4AF37; color: #B38728; font-weight: 700; border-radius: 2px; transition: all 0.3s ease; }
.btn-outline-gold:hover:not(:disabled) { background: #D4AF37; color: #fff; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3); }

/* Tabs */
.luxury-tabs { border-bottom: 2px solid #eaeaea; }
.luxury-tabs .nav-link { color: #888; border: none; font-size: 14px; letter-spacing: 1px; padding: 15px 20px; transition: 0.3s; background: transparent; }
.luxury-tabs .nav-link:hover { color: #D4AF37; }
.luxury-tabs .nav-link.active { color: #111; border-bottom: 3px solid #D4AF37; background: transparent; }

/* Table Specs */
.luxury-table th { color: #555; font-weight: 600; vertical-align: middle; border-bottom: 1px solid #eaeaea; }
.luxury-table td { color: #333; vertical-align: middle; padding: 15px; border-bottom: 1px solid #f9f9f9; }

/* Reviews */
.avatar-circle { width: 50px; height: 50px; background: linear-gradient(135deg, #111, #333); color: #D4AF37; border: 1px solid #D4AF37; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; font-family: 'Montserrat', sans-serif; margin-right: 15px; }
</style>