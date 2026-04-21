<template>
  <div class="container py-5 order-history-page">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        
        <div class="d-flex align-items-center mb-5">
          <div class="title-accent me-3"></div>
          <h3 class="luxury-font fw-bold mb-0 text-uppercase letter-spacing-1">Lịch sử giao dịch</h3>
        </div>

        <div v-if="isCanceling" class="text-center py-5 my-5">
          <div class="spinner-border gold-text" role="status"></div>
          <p class="mt-3 text-muted fw-bold text-uppercase small letter-spacing-1">Đang hoàn tác giao dịch và quay lại giỏ hàng...</p>
        </div>

        <template v-else>
          <div v-if="isLoading" class="text-center py-5 my-5">
            <div class="spinner-border gold-text" role="status"></div>
            <p class="mt-3 text-muted fw-bold text-uppercase small letter-spacing-1">Đang tải dữ liệu...</p>
          </div>

          <div v-else-if="orders.length === 0" class="text-center py-5 empty-state">
            <i class="bi bi-clock-history display-1 gold-text opacity-50 mb-4 d-block"></i>
            <h5 class="luxury-font fw-bold text-uppercase letter-spacing-1">Chưa có giao dịch nào</h5>
            <p class="text-muted mt-2 mb-4">Quý khách chưa thực hiện mua sắm cỗ máy thời gian nào tại hệ thống.</p>
            <router-link to="/products" class="btn btn-gold text-uppercase fw-bold px-5 py-3 letter-spacing-1">Khám phá bộ sưu tập</router-link>
          </div>

          <div v-else>
            <div v-for="order in orders" :key="order.id" class="card luxury-card mb-5">
              
              <div class="card-header bg-transparent py-3 border-bottom border-gold-subtle d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div class="d-flex align-items-center flex-wrap gap-3">
                  <span class="fw-bold text-dark fs-5 luxury-font letter-spacing-1">Mã Hóa Đơn: #{{ order.code || order.id }}</span>
                  <span class="badge-payment">
                    <i class="bi bi-credit-card-2-front me-1"></i> {{ order.paymentMethod }}
                  </span>
                  <span class="text-muted small letter-spacing-1"><i class="bi bi-calendar3 me-1"></i> {{ formatDate(order.orderDate) }}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="status-badge" :class="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </div>
              </div>

              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <div v-for="detail in order.orderDetails" :key="detail.productId" class="list-group-item p-4 border-0 border-bottom border-dashed">
                    <div class="d-flex align-items-center">
                      <div class="img-wrap border-gold-subtle p-2 bg-light d-flex align-items-center justify-content-center me-4">
                        <img :src="getImageUrl(detail.imageUrl)" class="img-fluid" @error="handleImageError">
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="fw-bold mb-2">
                          <router-link :to="`/product/${detail.productId}`" class="text-decoration-none text-dark product-name luxury-font fs-5">
                            {{ detail.name }}
                          </router-link>
                        </h6>
                        <div class="d-flex justify-content-between align-items-end mt-3">
                          <div class="text-muted small text-uppercase letter-spacing-1">
                            Số lượng: <strong class="text-dark">{{ detail.quantity }}</strong>
                          </div>
                          <span class="fw-bold gold-text">{{ formatPrice(detail.price) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-footer bg-light border-0 py-4 px-4">
                <div class="row align-items-center gy-3">
                  <div class="col-md-6">
                    <div class="d-flex align-items-start">
                      <i class="bi bi-geo-alt-fill gold-text mt-1 me-3 fs-5"></i>
                      <div>
                        <span class="d-block small text-muted text-uppercase letter-spacing-1 fw-bold mb-1">Địa chỉ nhận hàng</span>
                        <span class="text-dark small">{{ order.address }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-6 text-md-end d-flex flex-column align-items-md-end">
                    <div class="mb-3">
                      <span class="text-uppercase text-muted small letter-spacing-1 fw-bold me-3">Tổng cộng:</span>
                      <span class="fw-bold text-danger luxury-font fs-4">{{ formatPrice(order.totalPrice) }}</span>
                    </div>
                    <div class="d-flex gap-2">
                      <button v-if="['Chờ xác nhận', 'Đang chuẩn bị hàng'].includes(order.status)" @click="cancelOrder(order)" class="btn btn-outline-danger text-uppercase fw-bold px-4 py-2 small letter-spacing-1">
                        Hủy đơn hàng
                      </button>
                      <router-link :to="`/order/${order.id}`" class="btn btn-outline-gold text-uppercase fw-bold px-4 py-2 small letter-spacing-1">
                        Xem chi tiết
                      </router-link>
                    </div>
                  </div>

                </div>
              </div>
              
            </div>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore'; 
import api from '@/api/index';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

const LuxuryAlert = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-gold rounded-1 fw-bold px-4 py-2 shadow-sm text-uppercase letter-spacing-1',
    cancelButton: 'btn btn-outline-secondary rounded-1 fw-bold px-4 py-2 ms-2 text-uppercase letter-spacing-1'
  },
  buttonsStyling: false
});

const orders = ref<any[]>([]);
const isLoading = ref(true);
const isCanceling = ref(false); 

const formatPrice = (val: number) => {
  if (!val) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const getImageUrl = (img: string) => {
  if (!img) return 'https://via.placeholder.com/80';
  if (img.startsWith('http')) return img;
  return `http://localhost:8080/images/${img}`; 
};

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/80';
};

const getUserEmail = () => {
  try {
    let email = localStorage.getItem('user') || localStorage.getItem('email');
    if (email) {
      return email.replace(/"/g, ''); 
    }
  } catch (e) { return ''; }
  return '';
};

const cancelOrder = async (order: any) => {
  const result = await LuxuryAlert.fire({
    icon: 'warning',
    title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Hủy đơn hàng</h4>',
    text: 'Bạn có chắc chắn muốn hủy giao dịch này không?',
    showCancelButton: true,
    confirmButtonText: 'Đồng ý hủy',
    cancelButtonText: 'Quay lại'
  });

  if (result.isConfirmed) {
    try {
      const res = await api.post(`/orders/${order.id}/cancel`);
      
      // LOGIC CHUẨN: Bắt đúng trạng thái trả về để báo liên hệ Admin
      if ((res.data.paymentMethod === 'BANKING' || res.data.paymentMethod === 'Chuyển khoản') && res.data.paymentStatus === 'Đã thanh toán') {
        await LuxuryAlert.fire({
          icon: 'info',
          title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Đã hủy thành công</h4>',
          html: 'Đơn hàng đã được hủy và sản phẩm được đưa lại vào kho.<br><br><span class="text-danger fw-bold">Vui lòng liên hệ với Admin qua Chat hoặc Hotline để cung cấp số tài khoản và nhận lại tiền hoàn!</span>',
          confirmButtonText: 'Đã hiểu'
        });
      } else {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã hủy đơn hàng!', showConfirmButton: false, timer: 2000 });
      }
      
      await fetchMyOrders();
    } catch (error) {
      LuxuryAlert.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể hủy đơn hàng lúc này!' });
    }
  }
};

const fetchMyOrders = async () => {
  isLoading.value = true;
  const emailParam = getUserEmail();
  try {
    const res = await api.get(`/orders/my-orders?email=${encodeURIComponent(emailParam)}`);
    orders.value = res.data;
  } catch (error) {
    console.error("Lỗi lấy lịch sử đơn hàng:", error);
  } finally {
    isLoading.value = false;
  }
};

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'Hoàn thành': return 'status-success';
    case 'Đang giao': return 'status-info';
    case 'Chờ xác nhận': return 'status-pending';
    case 'Đang chuẩn bị hàng': return 'status-pending';
    case 'Đã hủy': return 'status-danger';
    default: return 'status-default';
  }
};

onMounted(async () => {
  if (route.query.cancel === 'true') {
     isCanceling.value = true; 
     
     const orderIdToCancel = route.query.orderCode || route.query.id; 
     if (orderIdToCancel) {
        try {
          await api.post(`/orders/${orderIdToCancel}/cancel`);
        } catch (e) {
          console.error("Lỗi hoàn tác hủy đơn:", e);
        }
     }
     
     const checkoutType = sessionStorage.getItem('checkoutType') || 'cart';
     router.replace({ path: '/checkout', query: { type: checkoutType, cancel: 'true' } });
     return; 
  }

  if (route.query.success === 'true') {
     const cartStore = useCartStore();
     if (sessionStorage.getItem('checkoutType') === 'buynow') {
        sessionStorage.removeItem('buyNowItem');
     } else {
        cartStore.clearCart();
     }
     sessionStorage.removeItem('checkoutType');
     sessionStorage.removeItem('backupCart');
     
     router.replace({ path: '/orders' });
  }

  fetchMyOrders();
});
</script>

<style scoped>
.order-history-page { font-family: 'Helvetica Neue', Arial, sans-serif; }
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }
.gold-text { color: #B38728 !important; }
.text-danger { color: #8b0000 !important; }
.border-gold-subtle { border-color: #eaeaea !important; }
.border-dashed { border-bottom: 1px dashed #e0e0e0 !important; }
.title-accent { width: 4px; height: 28px; background: linear-gradient(to bottom, #D4AF37, #B38728); }
.empty-state { background: #fdfbf7; border: 1px solid #f0e6d2; border-radius: 2px; }
.luxury-card { border: 1px solid #eaeaea; border-radius: 2px; box-shadow: 0 5px 20px rgba(0,0,0,0.02); transition: all 0.3s; }
.luxury-card:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.06); border-color: #D4AF37; }
.badge-payment { background: #fdfbf7; color: #111; border: 1px solid #D4AF37; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 2px; }
.status-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 6px 12px; border-radius: 2px; letter-spacing: 1px; }
.status-pending { background: #fff5e6; color: #b37700; border: 1px solid #ffd699; }
.status-success { background: #e6f2e6; color: #1a661a; border: 1px solid #99cc99; }
.status-info { background: #e6f9ff; color: #006699; border: 1px solid #99e6ff; }
.status-danger { background: #fff0f0; color: #cc0000; border: 1px solid #ffcccc; }
.status-default { background: #f5f5f5; color: #666; border: 1px solid #ddd; }
.img-wrap { width: 85px; height: 85px; border: 1px solid #eaeaea; border-radius: 2px; }
.img-wrap img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }
.product-name { transition: 0.3s; }
.product-name:hover { color: #B38728 !important; }
.btn-gold { background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%); color: #111 !important; border: 1px solid #D4AF37; border-radius: 2px; transition: all 0.4s ease; }
.btn-gold:hover { background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3); }
.btn-outline-gold { background: #fff; border: 1px solid #D4AF37; color: #B38728; border-radius: 2px; transition: all 0.3s ease; }
.btn-outline-gold:hover { background: #D4AF37; color: #fff; }
.btn-outline-danger { border-radius: 2px; transition: all 0.3s ease; }
</style>