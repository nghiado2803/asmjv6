<template>
  <div>
    <div v-if="isLoading" class="text-center py-5 mt-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted fw-bold">Đang tải thông tin sản phẩm...</p>
    </div>

    <div v-else-if="!product" class="container py-5 text-center mt-5">
      <h2 class="text-danger fw-bold"><i class="bi bi-exclamation-triangle me-2"></i>Không tìm thấy sản phẩm!</h2>
      <p class="text-muted mt-3">Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
      <router-link to="/products" class="btn btn-outline-dark rounded-pill px-4 mt-3">Quay lại Cửa hàng</router-link>
    </div>

    <div class="container py-4" v-else>
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link></li>
          <li class="breadcrumb-item"><router-link to="/products">Sản phẩm</router-link></li>
          <li class="breadcrumb-item active">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="row g-4">
        <div class="col-lg-5">
          <div class="gallery-container shadow-sm">
            <div class="main-image-wrap">
              <img :src="getImageUrl(mainImage)" class="main-image" @error="handleImageError">
            </div>
            <div class="thumb-list d-flex justify-content-center gap-2">
              <div :class="['thumb-item', { active: mainImage === product.imageUrl }]" @click="setMainImage(product.imageUrl)">
                <img :src="getImageUrl(product.imageUrl)" @error="handleImageError">
              </div>
              <div :class="['thumb-item', { active: mainImage === product.imageUrl }]" @click="setMainImage(product.imageUrl)">
                <img :src="getImageUrl(product.imageUrl)" style="transform: scaleX(-1);" @error="handleImageError">
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="product-info-wrap shadow-sm h-100">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="brand-label">{{ product.brand || 'Luxury' }}</span>
              <div class="text-warning small">
                <span v-if="realReviewCount > 0">
                  <i v-for="i in 5" :key="i" :class="i <= realRating ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                  <span class="text-muted ms-1">({{ realReviewCount }} đánh giá)</span>
                </span>
                <span v-else class="text-muted fst-italic">Chưa có đánh giá</span>
              </div>
            </div>

            <h1 class="product-title">{{ product.name }}</h1>
            <div class="d-flex align-items-center mb-3 text-muted small">
              <span class="me-3">Mã SP: <b>WS-{{ product.id }}</b></span>
              <span>Tình trạng: <b :class="product.stock > 0 ? 'text-success' : 'text-danger'">{{ product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng' }}</b></span>
            </div>

            <div class="price-section">
              <div class="d-flex align-items-center flex-wrap gap-2">
                <template v-if="isSaleActive(product)">
                  <span class="current-price">{{ formatPrice(calculateSalePrice(product.price, product.discount)) }}</span>
                  <span class="old-price ms-2">{{ formatPrice(product.price) }}</span>
                  <span class="discount-badge ms-2">-{{ product.discount }}%</span>
                </template>
                <template v-else>
                  <span class="current-price">{{ formatPrice(product.price) }}</span>
                </template>
              </div>
              <p class="mb-0 mt-2 text-muted small"><i class="bi bi-check-circle-fill text-success me-1"></i> Cam kết chính hãng 100%</p>
            </div>

            <p class="text-muted mb-4 line-clamp-3">{{ product.description || 'Chưa có mô tả cho sản phẩm này.' }}</p>

            <div class="mb-4">
              <label class="fw-bold small mb-2 d-block">Số lượng:</label>
              <div class="quantity-selector">
                <button type="button" class="qty-btn" @click="updateQty(-1)" :disabled="product.stock === 0">-</button>
                <input type="number" v-model="quantity" class="qty-input" min="1" :max="product.stock" readonly>
                <button type="button" class="qty-btn" @click="updateQty(1)" :disabled="product.stock === 0">+</button>
              </div>
            </div>

            <div class="row g-2">
              <div class="col-6">
                <button @click="addToCart" class="btn btn-add-cart" :disabled="product.stock === 0">
                  <i class="bi bi-cart-plus me-1"></i> THÊM GIỎ HÀNG
                </button>
              </div>
              <div class="col-6">
                <button @click="buyNow" class="btn btn-buy-now" :disabled="product.stock === 0">
                  MUA NGAY
                </button>
              </div>
            </div>

            <div class="policy-box mt-4 pt-3 border-top d-grid gap-2" style="grid-template-columns: 1fr 1fr; font-size: 13px;">
              <div><i class="bi bi-shield-check text-primary me-2"></i>Bảo hành 5 năm</div>
              <div><i class="bi bi-arrow-repeat text-primary me-2"></i>1 đổi 1 trong 30 ngày</div>
              <div><i class="bi bi-truck text-primary me-2"></i>Miễn phí vận chuyển</div>
              <div><i class="bi bi-battery-charging text-primary me-2"></i>Thay pin trọn đời</div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12">
          <div class="bg-white p-4 rounded-3 shadow-sm">
            <ul class="nav nav-tabs mb-3" role="tablist">
              <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#desc">Mô tả</button></li>
              <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#specs">Thông số</button></li>
              <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#reviews">Đánh giá ({{ realReviewCount }})</button></li>
            </ul>
            <div class="tab-content">
              
              <div class="tab-pane fade show active text-muted" id="desc">
                <h5 class="fw-bold text-dark mb-3">{{ product.name }}</h5>
                <p style="white-space: pre-line;">{{ product.description || 'Sản phẩm này hiện chưa có mô tả chi tiết.' }}</p>
              </div>
              
              <div class="tab-pane fade" id="specs">
                <table class="table table-striped table-bordered" style="max-width: 600px;">
                  <tbody>
                    <tr><th width="30%">Thương hiệu</th><td>{{ product.brand || '---' }}</td></tr>
                    <tr><th>Mã sản phẩm</th><td>WS-{{ product.id }}</td></tr>
                    <tr><th>Loại máy</th><td>{{ product.machineType || '---' }}</td></tr>
                    <tr><th>Kính</th><td>{{ product.glassMaterial || '---' }}</td></tr>
                    <tr><th>Đường kính</th><td>{{ product.diameter || '---' }}</td></tr>
                    <tr><th>Chống nước</th><td>{{ product.waterResistance || '---' }}</td></tr>
                  </tbody>
                </table>
              </div>
              
              <div class="tab-pane fade py-4" id="reviews">
                <div v-if="reviews.length === 0" class="text-center py-5">
                  <i class="bi bi-chat-square-quote display-4 text-muted opacity-25"></i>
                  <p class="mt-3 text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
                </div>
                
                <div v-else>
                  <div v-for="(rv, index) in reviews" :key="index" class="border-bottom pb-3 mb-3">
                    <div class="d-flex justify-content-between mb-2">
                      <div class="d-flex align-items-center">
                        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-secondary me-3" style="width: 40px; height: 40px; border: 1px solid #eee;">
                          {{ rv.user ? rv.user.charAt(0).toUpperCase() : 'U' }}
                        </div>
                        <div>
                          <h6 class="mb-0 fw-bold">{{ rv.user || 'Khách hàng' }}</h6>
                          <div class="text-warning small">
                            <i v-for="i in 5" :key="i" :class="i <= rv.rating ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                          </div>
                        </div>
                      </div>
                      <small class="text-muted">{{ formatDate(rv.createdAt) }}</small>
                    </div>
                    <p class="text-muted mb-0 ms-5">{{ rv.comment }}</p>
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
import { ref, onMounted, watch } from 'vue';
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

const fetchProductDetail = async (id: string | string[]) => {
  isLoading.value = true;
  product.value = null; 
  
  try {
    const res = await api.get(`/products/${id}`);
    product.value = res.data.product;
    reviews.value = res.data.reviews;
    realRating.value = res.data.realRating;
    realReviewCount.value = res.data.realReviewCount;
    
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

// ==========================================
// LOGIC KHUYẾN MÃI (CHỐT CHẶN NGÀY GIỜ CHUẨN)
// ==========================================
const calculateSalePrice = (price: number, discount: any) => {
  const disc = parseFloat(discount) || 0;
  return price * (1 - disc / 100);
};

const isSaleActive = (p: any): boolean => {
  const disc = parseFloat(p.discount);
  if (isNaN(disc) || disc <= 0 || !p.discountStart || !p.discountEnd) return false;

  const parseJavaDate = (str: string): number => {
    if (!str) return 0;
    
    if (str.includes('T')) {
      const d = new Date(str);
      return isNaN(d.getTime()) ? 0 : d.getTime();
    }

    const parts = str.split(' ');
    // ÉP KIỂU TUYỆT ĐỐI: Gán fallback là chuỗi rỗng để TS câm nín lỗi "undefined"
    const datePart = parts[0] || '';
    let timePart = parts[1] || '';

    if (!datePart || !timePart) return 0;

    if (timePart.includes('.')) {
      const timeParts = timePart.split('.');
      timePart = timeParts[0] || timePart;
    }

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

  const now = new Date().getTime();
  const start = parseJavaDate(p.discountStart);
  const end = parseJavaDate(p.discountEnd);

  if (start === 0 || end === 0) return false;
  return now >= start && now <= end;
};

// ==========================================
// THÊM GIỎ HÀNG CHUẨN GIÁ TẠI THỜI ĐIỂM HIỆN TẠI
// ==========================================
const addToCart = () => {
  const currentPrice = isSaleActive(product.value) 
    ? calculateSalePrice(product.value.price, product.value.discount) 
    : product.value.price;
  
  const productToCart = { ...product.value, price: currentPrice };
  cartStore.addToCart(productToCart, quantity.value);
  alert('Đã thêm sản phẩm vào giỏ hàng thành công!');
};

const buyNow = () => {
  const currentPrice = isSaleActive(product.value) 
    ? calculateSalePrice(product.value.price, product.value.discount) 
    : product.value.price;
  
  const productToCart = { ...product.value, price: currentPrice };
  cartStore.addToCart(productToCart, quantity.value);
  router.push('/checkout');
};
</script>

<style scoped>
/* Không đụng chạm gì phần CSS của bạn */
.breadcrumb-item a { color: #666; text-decoration: none; font-size: 14px; }
.gallery-container { background: #fff; border-radius: 8px; padding: 20px; position: sticky; top: 100px; }
.main-image-wrap { height: 450px; display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid #eee; margin-bottom: 15px; }
.main-image { max-height: 100%; max-width: 100%; transition: transform 0.3s; }
.main-image:hover { transform: scale(1.1); cursor: zoom-in; }
.thumb-item { width: 70px; height: 70px; border: 1px solid #ddd; border-radius: 4px; padding: 5px; cursor: pointer; }
.thumb-item.active { border-color: #d0021b; }
.thumb-item img { width: 100%; height: 100%; object-fit: contain; }
.product-info-wrap { background: #fff; padding: 25px; border-radius: 8px; }
.brand-label { background: #f0f0f0; color: #555; font-size: 12px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; font-weight: 600; }
.product-title { font-size: 24px; font-weight: 700; margin: 10px 0; line-height: 1.3; }
.price-section { background: #fafafa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px dashed #ddd; }
.current-price { color: #d0021b; font-size: 28px; font-weight: 700; }
.old-price { color: #888; text-decoration: line-through; font-size: 16px; }
.discount-badge { background: #d0021b; color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 12px; vertical-align: text-top; }
.quantity-selector { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 4px; width: fit-content; }
.qty-btn { width: 35px; height: 35px; border: none; background: #fff; cursor: pointer; }
.qty-btn:hover { background: #f5f5f5; color: #d0021b; }
.qty-input { width: 50px; height: 35px; border: none; border-left: 1px solid #ddd; border-right: 1px solid #ddd; text-align: center; font-weight: 600; }
.btn-add-cart { background: #fff; border: 1px solid #d0021b; color: #d0021b; font-weight: 700; padding: 12px; border-radius: 4px; width: 100%; transition: 0.2s; }
.btn-add-cart:hover { background: #fff5f5; }
.btn-buy-now { background: #d0021b; border: 1px solid #d0021b; color: #fff; font-weight: 700; padding: 12px; border-radius: 4px; width: 100%; display: block; text-align: center; transition: 0.2s; }
.btn-buy-now:hover { background: #a50014; color: #fff; }
.nav-tabs .nav-link { color: #555; font-weight: 500; cursor: pointer; }
.nav-tabs .nav-link.active { color: #d0021b; border-bottom: 3px solid #d0021b; border-top: none; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
</style>