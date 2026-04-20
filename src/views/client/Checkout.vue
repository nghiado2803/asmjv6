<template>
  <div class="container py-5 checkout-page">
    
    <div class="text-center mb-5 mt-2">
      <h2 class="luxury-font fw-bold text-uppercase letter-spacing-1 mb-2">Thanh Toán</h2>
      <div class="divider-gold mx-auto my-3"></div>
      <p class="text-muted letter-spacing-1 small">Hoàn tất thông tin để sở hữu tuyệt tác của bạn</p>
    </div>

    <form @submit.prevent="submitOrder">
      <div class="row g-5">
        
        <div class="col-lg-7">
          
          <div class="card border-gold-subtle shadow-sm rounded-1 p-4 p-lg-5 mb-4 bg-white">
            <h5 class="luxury-font fw-bold mb-4 text-uppercase border-bottom pb-3"><i class="bi bi-geo-alt gold-text me-2"></i>Thông tin giao hàng</h5>
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label fw-bold small text-muted text-uppercase letter-spacing-1">Họ và tên</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input type="text" v-model="order.fullName" class="form-control py-2" placeholder="Tên người nhận..." required>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold small text-muted text-uppercase letter-spacing-1">Số điện thoại</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                  <input type="text" v-model="order.phoneNumber" class="form-control py-2" placeholder="09xx..." required>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label fw-bold small text-muted text-uppercase letter-spacing-1">Địa chỉ nhận hàng</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text"><i class="bi bi-map"></i></span>
                  <input type="text" v-model="order.address" class="form-control py-2" placeholder="Số nhà, đường, phường/xã..." required>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label fw-bold small text-muted text-uppercase letter-spacing-1">Ghi chú (Tùy chọn)</label>
                <textarea v-model="order.note" class="form-control custom-textarea" rows="3" placeholder="Yêu cầu đặc biệt về thời gian giao hàng, gói quà..."></textarea>
              </div>
            </div>
          </div>

          <div class="card border-gold-subtle shadow-sm rounded-1 p-4 p-lg-5 bg-white">
            <h5 class="luxury-font fw-bold mb-4 text-uppercase border-bottom pb-3"><i class="bi bi-credit-card-2-front gold-text me-2"></i>Phương thức thanh toán</h5>
            <div class="d-flex flex-column gap-3">
              
              <div>
                <input type="radio" v-model="order.paymentMethod" id="cod" value="COD" class="payment-check">
                <label class="payment-label w-100" for="cod">
                  <div class="payment-option rounded-1 p-3 p-md-4 d-flex align-items-center">
                    <div class="icon-wrapper me-4">
                      <i class="bi bi-cash-stack fs-2"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-1 text-uppercase letter-spacing-1 text-dark">Thanh toán khi nhận hàng (COD)</h6>
                      <small class="text-muted">Thanh toán bằng tiền mặt khi chuyên viên giao hàng tận nơi.</small>
                    </div>
                  </div>
                </label>
              </div>
              
              <div>
                <input type="radio" v-model="order.paymentMethod" id="banking" value="BANKING" class="payment-check">
                <label class="payment-label w-100" for="banking">
                  <div class="payment-option rounded-1 p-3 p-md-4 d-flex align-items-center">
                    <div class="icon-wrapper me-4">
                      <i class="bi bi-bank fs-2"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-1 text-uppercase letter-spacing-1 text-dark">Chuyển khoản / Quét mã QR</h6>
                      <small class="text-muted">Thanh toán bảo mật tự động xác nhận qua cổng PayOS.</small>
                    </div>
                  </div>
                </label>
              </div>

            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="card summary-card border-gold-subtle shadow-sm rounded-1 sticky-top" style="top: 100px; z-index: 1;">
            <div class="card-header bg-transparent border-bottom border-gold-subtle pt-4 pb-3">
              <h5 class="luxury-font fw-bold text-center text-uppercase letter-spacing-1 mb-0">Tóm tắt đơn hàng</h5>
            </div>
            <div class="card-body p-4 p-lg-5">
              
              <div v-for="item in checkoutItems" :key="item.productId" class="d-flex align-items-center mb-4 pb-4 border-bottom border-dashed">
                <div class="position-relative img-wrap bg-white border-gold-subtle p-1">
                  <img :src="getImageUrl(item.imageUrl)" class="img-fluid" style="width: 65px; height: 65px; object-fit: contain; mix-blend-mode: multiply;" @error="handleImageError">
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-dark border border-light text-white" style="width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px;">
                    {{ item.quantity }}
                  </span>
                </div>
                <div class="ms-4 flex-grow-1">
                  <h6 class="fw-bold mb-1 text-dark text-truncate" style="max-width: 160px; font-size: 15px;">{{ item.name }}</h6>
                  <small class="text-muted letter-spacing-1">{{ formatPrice(item.price) }}</small>
                </div>
                <span class="fw-bold text-end text-dark">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-2 mb-4">
                <span class="text-uppercase fw-bold letter-spacing-1 text-muted">Vận chuyển</span>
                <span class="gold-text fw-bold text-uppercase small">Miễn phí</span>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-4 mb-5 pt-3 border-top border-gold-subtle">
                <span class="fs-5 fw-bold text-uppercase letter-spacing-1">Tổng cộng</span>
                <div class="text-end">
                  <span class="fs-4 fw-bold text-danger luxury-font">{{ formatPrice(checkoutTotal) }}</span>
                </div>
              </div>

              <button type="submit" class="btn btn-gold w-100 btn-lg rounded-1 fw-bold py-3 text-uppercase letter-spacing-1" :disabled="checkoutItems.length === 0 || isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                <span v-else><i class="bi bi-lock-fill me-2"></i> Xác nhận Đặt Hàng</span>
              </button>

            </div>
          </div>
        </div>
        
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore'; 
import api from '@/api/index';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const isSubmitting = ref(false);
const order = reactive({ fullName: '', phoneNumber: '', address: '', note: '', paymentMethod: 'COD' });

// --- LOGIC PHÂN LUỒNG MỚI ---
// Tự động kiểm tra xem đang thanh toán Mua Ngay hay Giỏ hàng
const checkoutItems = computed(() => {
  if (route.query.type === 'buynow') {
    const item = sessionStorage.getItem('buyNowItem');
    return item ? JSON.parse(item) : [];
  }
  return cartStore.items;
});

const checkoutTotal = computed(() => {
  return checkoutItems.value.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
});
// -----------------------------

const getUserEmail = () => {
  try {
    let email = localStorage.getItem('user') || localStorage.getItem('email');
    if (email) {
      email = email.replace(/"/g, ''); 
      return email;
    }
  } catch (e) {
    return '';
  }
  return '';
};

onMounted(async () => {
  if (checkoutItems.value.length === 0) {
    alert("Không có sản phẩm nào để thanh toán!");
    router.push('/cart');
    return;
  }

  const emailParam = getUserEmail();
  
  if (emailParam) {
    try {
      const res = await api.get(`/orders/user-info?email=${encodeURIComponent(emailParam)}`);
      if (res.data && res.data.fullName) {
        order.fullName = res.data.fullName || '';
        order.phoneNumber = res.data.phoneNumber || '';
        order.address = res.data.address || '';
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
    }
  }
});

const formatPrice = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + ' ₫';

const getImageUrl = (img: string) => {
  if (!img) return 'https://via.placeholder.com/80';
  if (img.startsWith('http')) return img;
  return `http://localhost:8080/images/${img}`; 
};

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/80';
};

const submitOrder = async () => {
  isSubmitting.value = true;
  const emailParam = getUserEmail();
  
  const payload = {
    fullName: order.fullName,
    phoneNumber: order.phoneNumber,
    address: order.address,
    note: order.note,
    paymentMethod: order.paymentMethod,
    items: checkoutItems.value.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl
    }))
  };

  try {
    const res = await api.post(`/orders/checkout?email=${encodeURIComponent(emailParam)}`, payload);
    const orderId = res.data.orderId;
    
    if (order.paymentMethod === 'BANKING') {
      try {
        const payRes = await api.post(`/orders/${orderId}/pay`);
        if (payRes.data && payRes.data.url) {
          clearDataAfterOrder();
          window.location.href = payRes.data.url; 
          return;
        }
      } catch (err) {
        console.error("Lỗi gọi PayOS:", err);
        alert("Có lỗi khi tạo link thanh toán, vui lòng thanh toán sau trong trang chi tiết đơn hàng.");
      }
    }

    clearDataAfterOrder(); 
    alert("Đặt hàng thành công! Mã đơn của quý khách: #" + (orderId || 'xxx'));
    router.push('/orders'); 
    
  } catch (error) {
    console.error("Lỗi đặt hàng:", error);
    alert("Có lỗi xảy ra khi đặt hàng. Vui lòng kiểm tra lại kết nối!");
  } finally {
    isSubmitting.value = false;
  }
};

// Hàm dọn dẹp đúng chỗ: Thanh toán cái nào xóa cái đó
const clearDataAfterOrder = () => {
  if (route.query.type === 'buynow') {
    sessionStorage.removeItem('buyNowItem');
  } else {
    cartStore.clearCart();
  }
};
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY CHECKOUT
========================================== */
.checkout-page { font-family: 'Helvetica Neue', Arial, sans-serif; }
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }

/* Colors & Basics */
.gold-text { color: #B38728 !important; }
.text-danger { color: #8b0000 !important; } /* Đỏ mận sang trọng */
.border-gold-subtle { border: 1px solid #eaeaea !important; }
.divider-gold { width: 60px; height: 3px; background: linear-gradient(to right, #B38728, #FBF5B7, #D4AF37); }

/* Inputs (Giao hàng) */
.custom-input-group { border: 1px solid #e0e0e0; border-radius: 2px; transition: all 0.3s ease; background: #fafafa; }
.custom-input-group .input-group-text { background-color: transparent; border: none; color: #B38728; }
.custom-input-group .form-control { border: none; background-color: transparent; box-shadow: none; padding-left: 0; font-size: 15px; }
.custom-input-group:focus-within { border-color: #D4AF37; background: #fff; box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }

.custom-textarea { border: 1px solid #e0e0e0; border-radius: 2px; background: #fafafa; transition: all 0.3s; box-shadow: none; font-size: 15px; padding: 12px; }
.custom-textarea:focus { border-color: #D4AF37; background: #fff; outline: none; box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }

/* Phương thức thanh toán */
.payment-check { display: none; }
.payment-option { border: 1px solid #e0e0e0; transition: all 0.3s ease; cursor: pointer; background: #fff; }
.payment-option .icon-wrapper { color: #aaa; transition: 0.3s; }

.payment-option:hover { border-color: #D4AF37; background-color: #fdfbf7; }
.payment-option:hover .icon-wrapper { color: #D4AF37; }

.payment-check:checked + .payment-label .payment-option { 
  border-color: #D4AF37; 
  background-color: #fdfbf7; 
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.15); 
}
.payment-check:checked + .payment-label .payment-option .icon-wrapper { color: #D4AF37; }

/* Tóm tắt đơn hàng */
.summary-card { background: #fdfbf7; } /* Màu nền kem sữa nhạt */
.img-wrap { border: 1px solid #e0e0e0; border-radius: 2px; }
.border-dashed { border-bottom: 1px dashed #dcdcdc !important; }

/* Nút Submit */
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111 !important; border: 1px solid #D4AF37;
  transition: all 0.4s ease;
}
.btn-gold:hover:not(:disabled) {
  background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%);
  transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}
.btn-gold:disabled { opacity: 0.7; filter: grayscale(50%); cursor: not-allowed; }
</style>