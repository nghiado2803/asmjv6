<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h2 class="fw-bold">Thanh toán</h2>
      <p class="text-muted">Hoàn tất đơn hàng của bạn</p>
    </div>

    <form @submit.prevent="submitOrder">
      <div class="row g-5">
        <div class="col-lg-7">
          <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 class="fw-bold mb-4 text-primary"><i class="bi bi-geo-alt-fill me-2"></i>Thông tin giao hàng</h5>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold small text-muted">Họ và tên</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input type="text" v-model="order.fullName" class="form-control py-2" placeholder="Nguyễn Văn A" required>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold small text-muted">Số điện thoại</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                  <input type="text" v-model="order.phoneNumber" class="form-control py-2" placeholder="09xx..." required>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label fw-bold small text-muted">Địa chỉ nhận hàng</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-map"></i></span>
                  <input type="text" v-model="order.address" class="form-control py-2" placeholder="Số nhà, đường, phường/xã..." required>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label fw-bold small text-muted">Ghi chú (Tùy chọn)</label>
                <textarea v-model="order.note" class="form-control" rows="2" placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."></textarea>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-4 p-4">
            <h5 class="fw-bold mb-4 text-primary"><i class="bi bi-credit-card-2-front-fill me-2"></i>Phương thức thanh toán</h5>
            <div class="d-flex flex-column gap-3">
              <div>
                <input type="radio" v-model="order.paymentMethod" id="cod" value="COD" class="payment-check">
                <label class="payment-label w-100" for="cod">
                  <div class="payment-option rounded-3 p-3 d-flex align-items-center">
                    <i class="bi bi-cash-stack fs-3 text-success me-3"></i>
                    <div>
                      <h6 class="fw-bold mb-0">Thanh toán khi nhận hàng (COD)</h6>
                      <small class="text-muted">Thanh toán bằng tiền mặt khi shipper giao hàng.</small>
                    </div>
                  </div>
                </label>
              </div>
              <div>
                <input type="radio" v-model="order.paymentMethod" id="banking" value="BANKING" class="payment-check">
                <label class="payment-label w-100" for="banking">
                  <div class="payment-option rounded-3 p-3 d-flex align-items-center">
                    <i class="bi bi-bank fs-3 text-primary me-3"></i>
                    <div>
                      <h6 class="fw-bold mb-0">Chuyển khoản (PayOS)</h6>
                      <small class="text-muted">Quét mã QR tự động xác nhận qua cổng PayOS.</small>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="card border-0 shadow rounded-4 sticky-top" style="top: 100px; z-index: 1;">
            <div class="card-header bg-white border-0 pt-4 pb-0"><h5 class="fw-bold">Đơn hàng của bạn</h5></div>
            <div class="card-body p-4">
              
              <div v-for="item in cartStore.items" :key="item.productId" class="d-flex align-items-center mb-3 pb-3 border-bottom border-dashed">
                <div class="position-relative">
                  <img :src="getImageUrl(item.imageUrl)" class="rounded border" style="width: 60px; height: 60px; object-fit: cover;" @error="handleImageError">
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary border border-light">{{ item.quantity }}</span>
                </div>
                <div class="ms-3 flex-grow-1">
                  <h6 class="fw-bold mb-0 text-truncate" style="max-width: 150px;">{{ item.name }}</h6>
                  <small class="text-muted">{{ formatPrice(item.price) }}</small>
                </div>
                <span class="fw-bold small text-end">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-4 mb-4">
                <span class="fs-5 fw-bold">Tổng cộng</span>
                <div class="text-end">
                  <span class="fs-4 fw-bold text-danger">{{ formatPrice(cartStore.totalPrice) }}</span>
                  <div class="small text-muted fst-italic">(Đã bao gồm VAT)</div>
                </div>
              </div>

              <button type="submit" class="btn btn-dark w-100 btn-lg rounded-pill fw-bold shadow-sm py-3" :disabled="cartStore.items.length === 0 || isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-lock-fill me-2"></i> Đặt Hàng Ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore'; 
import api from '@/api/index';

const router = useRouter();
const cartStore = useCartStore();

const isSubmitting = ref(false);
const order = reactive({ fullName: '', phoneNumber: '', address: '', note: '', paymentMethod: 'COD' });

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
  if (cartStore.items.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
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
    items: cartStore.items.map(item => ({
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
    
    // Nếu là thanh toán Banking -> Gọi API lấy link PayOS và chuyển hướng
    if (order.paymentMethod === 'BANKING') {
      try {
        const payRes = await api.post(`/orders/${orderId}/pay`);
        if (payRes.data && payRes.data.url) {
          cartStore.clearCart();
          window.location.href = payRes.data.url; // Chuyển sang trang PayOS
          return;
        }
      } catch (err) {
        console.error("Lỗi gọi PayOS:", err);
        alert("Có lỗi khi tạo link thanh toán, vui lòng thanh toán sau trong trang chi tiết đơn hàng.");
      }
    }

    cartStore.clearCart(); 
    alert("Đặt hàng thành công! Mã đơn: #" + (orderId || 'xxx'));
    router.push('/orders'); 
    
  } catch (error) {
    console.error("Lỗi đặt hàng:", error);
    alert("Có lỗi xảy ra khi đặt hàng. Vui lòng kiểm tra lại kết nối!");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.input-group-text { background-color: #fff; border-right: none; color: #6c757d; }
.form-control { border-left: none; }
.form-control:focus { box-shadow: none; border-color: #ced4da; }
.input-group:focus-within { box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15); border-radius: 0.375rem; }
.input-group:focus-within .form-control, .input-group:focus-within .input-group-text { border-color: #86b7fe; }
.payment-option { border: 1px solid rgba(0,0,0,0.1); transition: all 0.2s; cursor: pointer; }
.payment-option:hover { border-color: #0d6efd; background-color: #f8f9fa; }
.payment-check:checked + .payment-label .payment-option { border-color: #0d6efd; background-color: rgba(13, 110, 253, 0.05); box-shadow: 0 4px 12px rgba(13, 110, 253, 0.1); }
.payment-check { display: none; }
.border-dashed { border-bottom-style: dashed !important; border-bottom-color: #dee2e6 !important; }
</style>