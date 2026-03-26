<template>
  <div class="container py-5">
    
    <div class="d-flex align-items-end mb-4">
      <h2 class="fw-bold mb-0">Giỏ hàng</h2>
      <span class="text-muted ms-3 pb-1">({{ cartStore.items.length }} sản phẩm)</span>
    </div>

    <div v-if="cartStore.items.length === 0" class="text-center py-5">
      <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" width="120" class="mb-4 opacity-50" alt="Empty Cart">
      <h4>Giỏ hàng của bạn đang trống</h4>
      <p class="text-muted mb-4">Hãy chọn những món đồ yêu thích để lấp đầy giỏ hàng nhé!</p>
      <router-link to="/products" class="btn btn-primary rounded-pill px-4 py-2 fw-bold">Mua sắm ngay</router-link>
    </div>

    <div v-else class="row g-4">
      <div class="col-lg-8">
        <div class="d-none d-md-flex row text-muted small fw-bold text-uppercase mb-3 px-3">
          <div class="col-6">Sản phẩm</div>
          <div class="col-3 text-center">Số lượng</div>
          <div class="col-3 text-end">Tạm tính</div>
        </div>

        <div v-for="item in cartStore.items" :key="item.productId" class="card border-0 shadow-sm rounded-4 mb-3 cart-item overflow-hidden">
          <div class="card-body p-3">
            <div class="row align-items-center">
              
              <div class="col-12 col-md-6 d-flex align-items-center">
                <div class="bg-white border rounded-3 p-2 d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                  <img :src="getImageUrl(item.imageUrl)" class="img-fluid" style="max-height: 100%;" :alt="item.name" @error="handleImageError">
                </div>
                <div class="ms-3">
                  <h6 class="fw-bold mb-1">
                    <router-link :to="`/product/${item.productId}`" class="text-dark text-decoration-none">{{ item.name }}</router-link>
                  </h6>
                  <p class="text-primary fw-bold small mb-0 d-md-none">{{ formatPrice(item.price) }}</p>
                </div>
              </div>

              <div class="col-6 col-md-3 mt-3 mt-md-0 d-flex justify-content-center">
                <div class="d-flex align-items-center bg-white border rounded-pill px-2 py-1 shadow-sm">
                  <button @click="cartStore.updateQuantity(item.productId, -1)" class="btn btn-qty shadow-none"><i class="bi bi-dash"></i></button>
                  <input type="number" :value="item.quantity" class="quantity-input mx-1" readonly>
                  <button @click="cartStore.updateQuantity(item.productId, 1)" class="btn btn-qty shadow-none"><i class="bi bi-plus"></i></button>
                </div>
              </div>

              <div class="col-6 col-md-3 mt-3 mt-md-0 text-end">
                <h6 class="fw-bold text-dark mb-1 d-none d-md-block">{{ formatPrice(item.price * item.quantity) }}</h6>
                <button @click="cartStore.removeItem(item.productId)" class="btn btn-link text-danger text-decoration-none p-0 small">
                  <i class="bi bi-trash3 me-1"></i> Xóa
                </button>
              </div>

            </div>
          </div>
        </div>

        <div class="mt-4">
          <router-link to="/products" class="text-decoration-none fw-bold text-primary">
            <i class="bi bi-arrow-left me-2"></i> Tiếp tục mua sắm
          </router-link>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-lg rounded-4 summary-card sticky-top" style="top: 100px; z-index: 1;">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Cộng giỏ hàng</h5>
            
            <div class="d-flex justify-content-between mb-3">
              <span class="text-muted">Tạm tính</span>
              <span class="fw-bold">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
           
            <div class="d-flex justify-content-between mb-4">
              <span class="text-muted">Vận chuyển</span>
              <span class="text-success fw-bold">Miễn phí</span>
            </div>
            
            <hr class="border-light my-4">
            
            <div class="d-flex justify-content-between align-items-center mb-4">
              <span class="h5 fw-bold mb-0">Tổng tiền</span>
              <span class="h4 fw-bold text-danger mb-0">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
            
            <router-link to="/checkout" class="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow hover-scale text-uppercase text-center">
              Thanh toán ngay
            </router-link>
            
            <div class="text-center mt-4 opacity-50">
              <p class="small mb-2">Chấp nhận thanh toán</p>
              <div class="d-flex justify-content-center gap-2 fs-4">
                <i class="bi bi-credit-card-2-front"></i>
                <i class="bi bi-paypal"></i>
                <i class="bi bi-qr-code-scan"></i>
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
  if (!img) return 'https://via.placeholder.com/80';
  if (img.startsWith('http')) return img;
  return `http://localhost:8080/images/${img}`; 
};

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/80';
};
</script>

<style scoped>
/* Code CSS cũ của mày tao giữ nguyên, cắt bớt mấy cái rườm rà */
.cart-item { transition: all 0.3s ease; border: 1px solid rgba(0,0,0,0.05); }
.cart-item:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important; border-color: transparent; }
.quantity-input { width: 40px; text-align: center; border: none; background: transparent; font-weight: 600; outline: none; }
.quantity-input::-webkit-inner-spin-button, .quantity-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.btn-qty { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #f1f5f9; color: #333; transition: 0.2s; border: none; }
.btn-qty:hover { background: #e2e8f0; color: #000; }
.summary-card { background: #fff; border: 1px solid rgba(0,0,0,0.05); }
</style>