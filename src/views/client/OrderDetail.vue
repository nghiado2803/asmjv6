<template>
  <div class="bg-light min-vh-100 pb-5">
    <div v-if="isLoading" class="text-center py-5 mt-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted fw-bold">Đang tải thông tin đơn hàng...</p>
    </div>

    <div v-else-if="!order" class="container py-5 text-center mt-5">
      <h2 class="text-danger fw-bold"><i class="bi bi-exclamation-triangle me-2"></i>Không tìm thấy đơn hàng!</h2>
      <p class="text-muted mt-3">Đơn hàng này không tồn tại hoặc bạn không có quyền xem.</p>
      <router-link to="/orders" class="btn btn-outline-dark rounded-pill px-4 mt-3">Quay lại Lịch sử</router-link>
    </div>

    <div class="container py-5" v-else>
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold mb-0">Chi tiết đơn hàng</h3>
            <router-link to="/orders" class="btn btn-white border rounded-pill shadow-sm fw-bold bg-white">
              <i class="bi bi-arrow-left me-2"></i>Quay lại
            </router-link>
          </div>

          <div v-if="alert.success" class="alert alert-success alert-dismissible fade show rounded-4 mb-4" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>{{ alert.success }}
            <button type="button" class="btn-close" @click="alert.success = ''"></button>
          </div>
          <div v-if="alert.error" class="alert alert-warning alert-dismissible fade show rounded-4 mb-4" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ alert.error }}
            <button type="button" class="btn-close" @click="alert.error = ''"></button>
          </div>

          <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
            <div class="card-body p-4 text-center bg-white">
              <h5 class="fw-bold mb-2 text-uppercase"
                  :class="order.status === 'Chờ xác nhận' ? 'text-warning' : (order.status === 'Đã hủy' ? 'text-danger' : 'text-success')">
                {{ order.status }}
              </h5>
              <div class="text-muted small">
                Mã đơn: <span class="fw-bold text-dark me-3">#{{ order.code || order.id }}</span>
                Ngày đặt: <span>{{ formatDate(order.orderDate) }}</span>
              </div>
            </div>
          </div>

          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <div class="card border-0 shadow-sm rounded-4 h-100">
                <div class="card-header bg-white py-3 fw-bold border-bottom">
                  <i class="bi bi-geo-alt-fill text-danger me-2"></i>Thông tin nhận hàng
                </div>
                <div class="card-body p-4">
                  <p class="mb-1 text-muted small">Người nhận: <strong class="text-dark">{{ order.fullName }}</strong></p>
                  <p class="mb-1 text-muted small">SĐT: <strong class="text-dark">{{ order.phoneNumber }}</strong></p>
                  <p class="mb-0 text-muted small">Địa chỉ: <strong class="text-dark">{{ order.address }}</strong></p>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card border-0 shadow-sm rounded-4 h-100">
                <div class="card-header bg-white py-3 fw-bold border-bottom">
                  <i class="bi bi-credit-card-2-front text-primary me-2"></i>Thanh toán
                </div>
                <div class="card-body p-4">
                  <p class="mb-0">Phương thức:
                    <strong>{{ order.paymentMethod === 'BANKING' ? 'Chuyển khoản (PayOS)' : 'Tiền mặt (COD)' }}</strong>
                  </p>
                  <div v-if="order.paymentMethod === 'BANKING'" class="mt-2">
                    <p class="mb-0">Trạng thái:
                      <span v-if="order.paymentStatus === 'Đã thanh toán'" class="text-success fw-bold small">
                        <i class="bi bi-check-circle-fill me-1"></i>Đã thanh toán
                      </span>
                      <span v-else class="text-info small">
                        <i class="bi bi-clock-history me-1"></i>Chưa thanh toán
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="order.paymentMethod === 'BANKING' && order.paymentStatus !== 'Đã thanh toán'" class="text-center mb-4">
            <button @click="handlePayment(order.id)" class="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm" :disabled="isPaying">
              <span v-if="isPaying" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-qr-code-scan me-2"></i>Thanh toán ngay qua PayOS
            </button>
          </div>

          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-header bg-white py-3 fw-bold border-bottom">
              <i class="bi bi-bag-check-fill text-primary me-2"></i>Sản phẩm đã mua
            </div>
            <div class="card-body p-0">
              
              <div v-for="detail in order.orderDetails" :key="detail.productId" class="d-flex align-items-center p-3 border-bottom">
                <div style="width: 60px; height: 60px;" class="border rounded overflow-hidden p-1 me-3 bg-white">
                  <img :src="getImageUrl(detail.imageUrl)" class="w-100 h-100 object-fit-contain" @error="handleImageError">
                </div>
                <div class="flex-grow-1">
                  <h6 class="fw-bold mb-0 small">
                    <router-link :to="`/product/${detail.productId}`" class="text-dark text-decoration-none">{{ detail.name }}</router-link>
                  </h6>
                  <small class="text-muted">{{ formatPrice(detail.price) }}</small>
                </div>
                <div class="text-end">
                  <span class="fw-bold small d-block mb-2">x{{ detail.quantity }}</span>

                  <button v-if="order.status === 'Hoàn thành'"
        class="btn btn-sm btn-outline-warning rounded-pill"
        data-bs-toggle="modal" 
        data-bs-target="#reviewModal"
        @click="prepareReview(detail)"> <i class="bi bi-star-fill me-1"></i>Đánh giá
</button>
                </div>
              </div>

              <div class="p-4 bg-light rounded-bottom-4">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Tổng tiền hàng</span>
                  <span class="fw-bold">{{ formatPrice(order.totalPrice) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-3">
                  <span class="text-muted">Phí vận chuyển</span>
                  <span class="text-success fw-bold">Miễn phí</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold fs-5">Thực tế thanh toán</span>
                  <span class="fw-bold fs-4 text-danger">{{ formatPrice(order.totalPrice) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="reviewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">Đánh giá sản phẩm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="submitReview">
            <div class="modal-body">
              <p class="text-muted small mb-3">Sản phẩm: <strong class="text-dark">{{ reviewForm.productName }}</strong></p>

              <div class="mb-3 text-center">
                <label class="form-label d-block fw-bold text-muted small">Mức độ hài lòng</label>
                <div class="rate">
                  <input type="radio" id="star5" value="5" v-model="reviewForm.rating" />
                  <label for="star5" title="5 sao">5 stars</label>
                  <input type="radio" id="star4" value="4" v-model="reviewForm.rating" />
                  <label for="star4" title="4 sao">4 stars</label>
                  <input type="radio" id="star3" value="3" v-model="reviewForm.rating" />
                  <label for="star3" title="3 sao">3 stars</label>
                  <input type="radio" id="star2" value="2" v-model="reviewForm.rating" />
                  <label for="star2" title="2 sao">2 stars</label>
                  <input type="radio" id="star1" value="1" v-model="reviewForm.rating" />
                  <label for="star1" title="1 sao">1 star</label>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold small">Viết cảm nhận của bạn</label>
                <textarea v-model="reviewForm.comment" class="form-control bg-light border-0" rows="3" placeholder="Chất lượng sản phẩm thế nào? Giao hàng có nhanh không?..." required></textarea>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-light rounded-pill" data-bs-dismiss="modal" ref="closeModalBtn">Hủy</button>
              <button type="submit" class="btn btn-primary rounded-pill px-4" :disabled="isSubmittingReview">
                <span v-if="isSubmittingReview" class="spinner-border spinner-border-sm me-2"></span>Gửi đánh giá
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/index';

const route = useRoute();
const isLoading = ref(true);
const isPaying = ref(false);
const order = ref<any>(null);

const alert = reactive({ success: '', error: '' });
const closeModalBtn = ref<HTMLElement | null>(null);
const isSubmittingReview = ref(false);

const reviewForm = reactive({
  productId: null as number | null,
  productName: '',
  rating: 5,
  comment: ''
});

const getUserEmail = () => {
  try {
    let email = localStorage.getItem('user') || localStorage.getItem('email');
    if (email) return email.replace(/"/g, ''); 
  } catch (e) { return ''; }
  return '';
};

const fetchOrderDetail = async () => {
  isLoading.value = true;
  const emailParam = getUserEmail();
  try {
    const res = await api.get(`/orders/detail/${route.params.id}?email=${encodeURIComponent(emailParam)}`);
    order.value = res.data;
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchOrderDetail();
});

// HÀM MỚI: Gọi PayOS lấy link thanh toán
const handlePayment = async (orderId: number) => {
  isPaying.value = true;
  try {
    const res = await api.post(`/orders/${orderId}/pay`);
    if (res.data && res.data.url) {
      window.location.href = res.data.url; // Chuyển sang PayOS
    }
  } catch (error) {
  } finally {
    isPaying.value = false;
  }
};

const prepareReview = (detail: any) => {
  // Check xem ID nằm ở đâu (productId hay id?)
  const pId = detail.productId || detail.id; 
  
  if (!pId) {
    console.error("Lỗi: Không tìm thấy ID sản phẩm trong dữ liệu!", detail);
    return;
  }

  reviewForm.productId = pId;
  reviewForm.productName = detail.name || detail.productName;
  reviewForm.rating = 5;
  reviewForm.comment = '';
  
  // Reset alert
  alert.success = ''; 
  alert.error = '';
};

const submitReview = async () => {
  isSubmittingReview.value = true;
  const emailParam = getUserEmail();
  try {
    await api.post(`/reviews/add?email=${encodeURIComponent(emailParam)}`, {
      orderId: order.value.id,
      productId: reviewForm.productId,
      rating: reviewForm.rating,
      comment: reviewForm.comment
    });
    
    alert.success = "Cảm ơn bạn đã đánh giá sản phẩm!";
    if (closeModalBtn.value) closeModalBtn.value.click(); 
    
  } catch (error) {
    alert.error = "Bạn đã đánh giá sản phẩm này rồi hoặc có lỗi xảy ra.";
    if (closeModalBtn.value) closeModalBtn.value.click();
  } finally {
    isSubmittingReview.value = false;
  }
};

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
  if (!img) return 'https://via.placeholder.com/70';
  if (img.startsWith('http')) return img;
  return `http://localhost:8080/images/${img}`; 
};

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/70';
};
</script>

<style scoped>
.object-fit-contain { object-fit: contain; }

.rate {
  display: flex;
  flex-direction: row-reverse; 
  justify-content: center;
  height: 46px;
  padding: 0 10px;
}
.rate input { display: none; }
.rate label {
  float: right;
  width: 1em;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  font-size: 30px;
  color: #ccc; 
  padding: 0 5px;
}
.rate label:before { content: '★ '; }
.rate input:checked ~ label { color: #ffc700; }
.rate label:hover,
.rate label:hover ~ label { color: #deb217; }
.rate input:checked + label:hover,
.rate input:checked + label:hover ~ label,
.rate input:checked ~ label:hover,
.rate input:checked ~ label:hover ~ label,
.rate label:hover ~ input:checked ~ label { color: #c59b08; }
</style>