<template>
  <div class="container py-5 cart-page">
    
    <div class="d-flex align-items-end mb-4 border-bottom pb-3 border-gold-subtle">
      <h2 class="luxury-font fw-bold mb-0 text-uppercase letter-spacing-1">Giỏ hàng của quý khách</h2>
      <span class="gold-text ms-3 pb-1 fw-bold letter-spacing-1">({{ cartStore.items.length }} tuyệt tác)</span>
    </div>

    <div v-if="cartStore.items.length === 0" class="text-center py-5 my-5 empty-cart-state">
      <i class="bi bi-bag-x display-1 gold-text opacity-50 mb-4 d-block"></i>
      <h4 class="luxury-font fw-bold text-uppercase">Giỏ hàng đang trống</h4>
      <p class="text-muted mb-4 letter-spacing-1">Chưa có cỗ máy thời gian nào được chọn vào bộ sưu tập của bạn.</p>
      <router-link to="/products" class="btn btn-gold px-5 py-3 fw-bold text-uppercase letter-spacing-1">Khám phá ngay</router-link>
    </div>

    <div v-else class="row g-5 mt-2">
      
      <div class="col-lg-8">
        <div class="d-none d-md-flex row text-muted small fw-bold text-uppercase mb-3 px-3 letter-spacing-1">
          <div class="col-6">Sản phẩm</div>
          <div class="col-3 text-center">Số lượng</div>
          <div class="col-3 text-end">Tạm tính</div>
        </div>

        <div v-for="item in cartStore.items" :key="item.productId" class="cart-item py-4 border-bottom border-gold-subtle">
          <div class="row align-items-center">
            
            <div class="col-12 col-md-6 d-flex align-items-center">
              <div class="img-wrap border-gold-subtle p-2 d-flex align-items-center justify-content-center bg-light">
                <img :src="getImageUrl(item.imageUrl)" class="img-fluid" :alt="item.name" @error="handleImageError">
              </div>
              <div class="ms-4">
                <h6 class="fw-bold mb-2">
                  <router-link :to="`/product/${item.productId}`" class="text-dark text-decoration-none product-name luxury-font fs-5">
                    {{ item.name }}
                  </router-link>
                </h6>
                <p class="text-muted small mb-0 letter-spacing-1 text-uppercase">Mã SP: WS-{{ item.productId }}</p>
                <p class="gold-text fw-bold mt-2 mb-0 d-md-none fs-5">{{ formatPrice(item.price) }}</p>
              </div>
            </div>

            <div class="col-6 col-md-3 mt-4 mt-md-0 d-flex justify-content-center">
              <div class="quantity-selector">
                <button @click="cartStore.updateQuantity(item.productId, -1)" class="qty-btn"><i class="bi bi-dash"></i></button>
                <input type="number" :value="item.quantity" class="qty-input" readonly>
                <button @click="cartStore.updateQuantity(item.productId, 1)" class="qty-btn"><i class="bi bi-plus"></i></button>
              </div>
            </div>

            <div class="col-6 col-md-3 mt-4 mt-md-0 text-end d-flex flex-column justify-content-center align-items-end">
              <h6 class="fw-bold text-dark mb-2 d-none d-md-block luxury-font fs-5">{{ formatPrice(item.price * item.quantity) }}</h6>
              <button @click="cartStore.removeItem(item.productId)" class="btn btn-link text-muted hover-danger text-decoration-none p-0 small text-uppercase letter-spacing-1 mt-2">
                <i class="bi bi-x-lg me-1"></i> Loại bỏ
              </button>
            </div>

          </div>
        </div>

        <div class="mt-5">
          <router-link to="/products" class="text-decoration-none fw-bold text-dark text-uppercase letter-spacing-1 hover-gold">
            <i class="bi bi-arrow-left me-2"></i> Tiếp tục mua sắm
          </router-link>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm summary-card sticky-top" style="top: 100px; z-index: 1;">
          <div class="card-body p-4 p-lg-5">
            <h5 class="luxury-font fw-bold mb-4 text-uppercase border-bottom pb-3 border-gold-subtle text-center">Tóm tắt đơn hàng</h5>
            
            <div class="d-flex justify-content-between mb-3 text-muted">
              <span class="letter-spacing-1">Tạm tính</span>
              <span class="fw-bold text-dark">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
           
            <div class="d-flex justify-content-between mb-4 text-muted">
              <span class="letter-spacing-1">Vận chuyển VIP</span>
              <span class="gold-text fw-bold text-uppercase small pt-1">Miễn phí</span>
            </div>
            
            <hr class="border-gold-subtle my-4">
            
            <div class="d-flex justify-content-between align-items-center mb-5">
              <span class="text-uppercase fw-bold letter-spacing-1 text-dark">Tổng cộng</span>
              <span class="h3 luxury-font fw-bold text-danger mb-0">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
            
            <router-link to="/checkout" class="btn btn-gold w-100 py-3 fw-bold text-uppercase text-center letter-spacing-1">
              Tiến hành thanh toán
            </router-link>
            
            <div class="text-center mt-4 pt-3 border-top border-gold-subtle">
              <p class="small text-muted mb-2 text-uppercase letter-spacing-1" style="font-size: 11px;">Thanh toán bảo mật tuyệt đối</p>
              <div class="d-flex justify-content-center gap-3 fs-3 text-muted opacity-50">
                <i class="bi bi-shield-lock-fill gold-text opacity-100"></i>
                <i class="bi bi-credit-card-2-front"></i>
                <i class="bi bi-paypal"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore';

// Lôi cái kho Pinia ra xài
const cartStore = useCartStore();

// Utils format giá & ảnh
const formatPrice = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + ' ₫';

const getImageUrl = (img: string) => {
  if (!img) return 'https://via.placeholder.com/100';
  if (img.startsWith('http')) return img;
  return `http://localhost:8080/images/${img}`; 
};

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/100';
};
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY CART - KEM SỮA & VÀNG KIM 
========================================== */
.cart-page { font-family: 'Helvetica Neue', Arial, sans-serif; }
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }

/* Colors */
.gold-text { color: #B38728 !important; }
.text-danger { color: #8b0000 !important; } /* Đỏ mận sang trọng */
.border-gold-subtle { border-color: #eaeaea !important; }
.hover-gold { transition: 0.3s; }
.hover-gold:hover { color: #B38728 !important; }

/* Empty State */
.empty-cart-state { background: #fdfbf7; border: 1px dashed #D4AF37; padding: 60px 20px; }

/* Danh sách Sản phẩm */
.cart-item { transition: all 0.3s ease; background: #fff; }
.cart-item:hover { background: #fdfbf7; }

.img-wrap { width: 100px; height: 100px; background-color: #fff; }
.img-wrap img { max-height: 100%; object-fit: contain; mix-blend-mode: multiply; transition: 0.3s; }
.cart-item:hover .img-wrap img { transform: scale(1.1); }

.product-name { transition: 0.3s; }
.product-name:hover { color: #B38728 !important; }

/* Quantity Selector - Chuẩn form góc cạnh Luxury */
.quantity-selector { 
  display: flex; align-items: center; 
  border: 1px solid #e0e0e0; 
  width: fit-content; background: #fff;
}
.qty-btn { 
  width: 35px; height: 40px; border: none; background: transparent; 
  font-size: 16px; cursor: pointer; color: #555; transition: 0.2s;
}
.qty-btn:hover { color: #D4AF37; background: #fdfbf7; }
.qty-input { 
  width: 45px; height: 40px; border: none; 
  border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; 
  text-align: center; font-weight: 700; font-size: 15px; color: #111;
  outline: none;
}
.qty-input::-webkit-inner-spin-button, .qty-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

/* Nút Xóa */
.hover-danger { transition: 0.3s; }
.hover-danger:hover { color: #8b0000 !important; }

/* Tóm tắt đơn hàng (Summary Card) */
.summary-card { 
  background: #fdfbf7; /* Màu nền kem sữa nhạt */
  border: 1px solid #f0e6d2 !important; 
  border-radius: 0; /* Vuông vức chuẩn Luxury */
}

/* Nút Button Gold */
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111 !important; border: 1px solid #D4AF37;
  font-weight: 700; border-radius: 2px; transition: all 0.4s ease;
}
.btn-gold:hover {
  background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%);
  transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}
</style>