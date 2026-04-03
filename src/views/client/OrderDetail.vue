<template>
  <div class="order-detail-page min-vh-100 pb-5">
    
    <div v-if="isLoading" class="text-center py-5 mt-5">
      <div class="spinner-border gold-text" role="status"></div>
      <p class="mt-3 text-muted fw-bold text-uppercase small letter-spacing-1">Đang tải hồ sơ giao dịch...</p>
    </div>

    <div v-else-if="!order" class="container py-5 text-center mt-5 empty-state">
      <i class="bi bi-exclamation-triangle display-1 gold-text opacity-50 mb-4 d-block"></i>
      <h3 class="luxury-font text-dark fw-bold text-uppercase letter-spacing-1 mb-3">Không tìm thấy giao dịch</h3>
      <p class="text-muted mb-4">Mã giao dịch này không tồn tại hoặc quý khách không có quyền truy cập.</p>
      <router-link to="/orders" class="btn btn-outline-gold px-5 py-3 fw-bold text-uppercase letter-spacing-1">Quay lại Lịch sử</router-link>
    </div>

    <div class="container py-5" v-else>
      <div class="row justify-content-center">
        <div class="col-lg-8">
          
          <div class="d-flex justify-content-between align-items-center mb-4 border-bottom border-gold-subtle pb-3">
            <h3 class="luxury-font fw-bold mb-0 text-uppercase letter-spacing-1 text-dark">Hồ sơ Giao dịch</h3>
            <router-link to="/orders" class="btn btn-outline-secondary btn-sm text-uppercase fw-bold letter-spacing-1 border-0">
              <i class="bi bi-arrow-left me-2"></i>Trở về
            </router-link>
          </div>

          <div v-if="alert.success" class="alert custom-alert-success alert-dismissible fade show rounded-1 mb-4" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>{{ alert.success }}
            <button type="button" class="btn-close" @click="alert.success = ''"></button>
          </div>
          <div v-if="alert.error" class="alert custom-alert-danger alert-dismissible fade show rounded-1 mb-4" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ alert.error }}
            <button type="button" class="btn-close" @click="alert.error = ''"></button>
          </div>

          <div class="card border-gold-subtle shadow-sm rounded-1 mb-4 bg-white">
            <div class="card-body p-4 p-md-5 text-center">
              <h4 class="luxury-font fw-bold mb-3 text-uppercase letter-spacing-1"
                  :class="order.status === 'Chờ xác nhận' ? 'text-warning' : (order.status === 'Đã hủy' ? 'text-danger' : 'text-success')">
                <i v-if="order.status === 'Hoàn thành'" class="bi bi-check2-circle me-2"></i>
                <i v-if="order.status === 'Đã hủy'" class="bi bi-x-circle me-2"></i>
                {{ order.status }}
              </h4>
              <div class="text-muted small letter-spacing-1 d-flex flex-wrap justify-content-center gap-3">
                <span>Mã giao dịch: <strong class="text-dark">#{{ order.code || order.id }}</strong></span>
                <span class="d-none d-sm-inline">|</span>
                <span>Ngày lập: <strong class="text-dark">{{ formatDate(order.orderDate) }}</strong></span>
              </div>
            </div>
          </div>

          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <div class="card border-gold-subtle shadow-sm rounded-1 h-100 bg-white">
                <div class="card-header bg-transparent py-3 fw-bold border-bottom border-gold-subtle d-flex align-items-center">
                  <i class="bi bi-geo-alt-fill gold-text me-2 fs-5"></i>
                  <span class="text-uppercase letter-spacing-1 small text-dark">Địa chỉ nhận hàng</span>
                </div>
                <div class="card-body p-4">
                  <p class="mb-2 text-muted small"><span class="text-uppercase letter-spacing-1 me-2" style="font-size: 11px;">Người nhận:</span> <strong class="text-dark fs-6">{{ order.fullName }}</strong></p>
                  <p class="mb-2 text-muted small"><span class="text-uppercase letter-spacing-1 me-2" style="font-size: 11px;">Điện thoại:</span> <strong class="text-dark">{{ order.phoneNumber }}</strong></p>
                  <p class="mb-0 text-muted small"><span class="text-uppercase letter-spacing-1 me-2" style="font-size: 11px;">Địa chỉ:</span> <strong class="text-dark">{{ order.address }}</strong></p>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card border-gold-subtle shadow-sm rounded-1 h-100 bg-white">
                <div class="card-header bg-transparent py-3 fw-bold border-bottom border-gold-subtle d-flex align-items-center">
                  <i class="bi bi-credit-card-2-front gold-text me-2 fs-5"></i>
                  <span class="text-uppercase letter-spacing-1 small text-dark">Thanh toán</span>
                </div>
                <div class="card-body p-4">
                  <p class="mb-3 text-muted small">
                    <span class="text-uppercase letter-spacing-1 me-2 d-block mb-1" style="font-size: 11px;">Phương thức:</span> 
                    <strong class="text-dark">{{ order.paymentMethod === 'BANKING' ? 'Chuyển khoản (PayOS)' : 'Thanh toán tiền mặt (COD)' }}</strong>
                  </p>
                  <div v-if="order.paymentMethod === 'BANKING'" class="mt-2 border-top pt-3">
                    <p class="mb-0 text-muted small">
                      <span class="text-uppercase letter-spacing-1 me-2" style="font-size: 11px;">Tình trạng:</span>
                      <span v-if="order.paymentStatus === 'Đã thanh toán'" class="gold-text fw-bold">
                        <i class="bi bi-shield-check me-1"></i>Đã thanh toán
                      </span>
                      <span v-else class="text-danger fw-bold">
                        <i class="bi bi-clock-history me-1"></i>Chưa thanh toán
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="order.paymentMethod === 'BANKING' && order.paymentStatus !== 'Đã thanh toán'" class="text-center mb-5">
            <button @click="handlePayment(order.id)" class="btn btn-gold text-uppercase fw-bold letter-spacing-1 px-5 py-3 shadow" :disabled="isPaying">
              <span v-if="isPaying" class="spinner-border spinner-border-sm me-2"></span>
              <span v-else><i class="bi bi-qr-code-scan me-2"></i>Thanh toán ngay qua PayOS</span>
            </button>
            <p class="text-muted small mt-2 letter-spacing-1"><i class="bi bi-lock-fill me-1"></i>Giao dịch mã hóa an toàn</p>
          </div>

          <div class="card border-gold-subtle shadow-sm rounded-1 mb-5 bg-white">
            <div class="card-header bg-transparent py-3 fw-bold border-bottom border-gold-subtle d-flex align-items-center">
              <i class="bi bi-box-seam gold-text me-2 fs-5"></i>
              <span class="text-uppercase letter-spacing-1 small text-dark">Tuyệt tác đã chọn</span>
            </div>
            
            <div class="card-body p-0">
              <div v-for="detail in order.orderDetails" :key="detail.productId" class="d-flex align-items-center p-4 border-bottom border-dashed">
                <div class="img-wrap border-gold-subtle p-1 me-4 bg-light">
                  <img :src="getImageUrl(detail.imageUrl)" class="img-fluid" @error="handleImageError">
                </div>
                
                <div class="flex-grow-1">
                  <h6 class="fw-bold mb-2 luxury-font fs-5">
                    <router-link :to="`/product/${detail.productId}`" class="text-dark text-decoration-none hover-gold">{{ detail.name }}</router-link>
                  </h6>
                  <small class="text-muted letter-spacing-1 d-block mb-2">{{ formatPrice(detail.price) }}</small>
                  
                  <div class="d-flex justify-content-between align-items-end mt-2">
                    <span class="fw-bold small text-muted text-uppercase letter-spacing-1">SL: <strong class="text-dark">{{ detail.quantity }}</strong></span>
                    
                    <button v-if="order.status === 'Hoàn thành'"
                            class="btn btn-outline-gold btn-sm text-uppercase fw-bold px-3 py-1 letter-spacing-1"
                            style="font-size: 11px;"
                            data-bs-toggle="modal" 
                            data-bs-target="#reviewModal"
                            @click="prepareReview(detail)">
                      <i class="bi bi-star-fill me-1"></i>Đánh giá
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-4 p-md-5 bg-light">
                <div class="d-flex justify-content-between mb-3 text-muted small text-uppercase letter-spacing-1">
                  <span>Giá trị sản phẩm</span>
                  <span class="fw-bold text-dark">{{ formatPrice(order.totalPrice) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-4 text-muted small text-uppercase letter-spacing-1">
                  <span>Phí vận chuyển VIP</span>
                  <span class="gold-text fw-bold">Miễn phí</span>
                </div>
                <hr class="border-gold-subtle mb-4">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold fs-6 text-uppercase letter-spacing-1 text-dark">Tổng thanh toán</span>
                  <span class="fw-bold fs-3 text-danger luxury-font">{{ formatPrice(order.totalPrice) }}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <div class="modal fade" id="reviewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-1 border-gold-subtle shadow-lg">
          
          <div class="modal-header border-bottom border-gold-subtle bg-light">
            <h5 class="modal-title luxury-font fw-bold text-uppercase letter-spacing-1 text-dark">Chia sẻ trải nghiệm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          
          <form @submit.prevent="submitReview">
            <div class="modal-body p-4 p-md-5">
              <p class="text-center small text-uppercase letter-spacing-1 text-muted mb-2">Tuyệt tác</p>
              <p class="text-center fw-bold luxury-font fs-5 text-dark mb-4 pb-3 border-bottom border-dashed">{{ reviewForm.productName }}</p>

              <div class="mb-4 text-center">
                <label class="form-label d-block fw-bold text-uppercase letter-spacing-1 small text-dark mb-2">Mức độ hài lòng</label>
                <div class="rate mx-auto">
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
                <label class="form-label fw-bold text-uppercase letter-spacing-1 small text-dark">Cảm nhận của quý khách</label>
                <textarea v-model="reviewForm.comment" class="form-control custom-textarea" rows="4" placeholder="Thiết kế, chất liệu, trải nghiệm dịch vụ..." required></textarea>
              </div>
            </div>
            
            <div class="modal-footer border-top border-gold-subtle bg-light">
              <button type="button" class="btn text-muted text-uppercase fw-bold letter-spacing-1 small" data-bs-dismiss="modal" ref="closeModalBtn">Hủy bỏ</button>
              <button type="submit" class="btn btn-gold text-uppercase fw-bold letter-spacing-1 px-4 py-2" :disabled="isSubmittingReview">
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

const handlePayment = async (orderId: number) => {
  isPaying.value = true;
  try {
    const res = await api.post(`/orders/${orderId}/pay`);
    if (res.data && res.data.url) {
      window.location.href = res.data.url; 
    }
  } catch (error) {
  } finally {
    isPaying.value = false;
  }
};

const prepareReview = (detail: any) => {
  const pId = detail.productId || detail.id; 
  if (!pId) {
    console.error("Lỗi: Không tìm thấy ID sản phẩm trong dữ liệu!", detail);
    return;
  }
  reviewForm.productId = pId;
  reviewForm.productName = detail.name || detail.productName;
  reviewForm.rating = 5;
  reviewForm.comment = '';
  
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
    
    alert.success = "Chân thành cảm ơn những đánh giá quý báu của quý khách!";
    if (closeModalBtn.value) closeModalBtn.value.click(); 
    
  } catch (error) {
    alert.error = "Quý khách đã đánh giá tuyệt tác này hoặc có lỗi xảy ra.";
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
  if (!img) return 'https://via.placeholder.com/80';
  if (img.startsWith('http')) return img;
  return `http://localhost:8080/images/${img}`; 
};

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/80';
};
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY ORDER DETAIL
========================================== */
.order-detail-page { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fcfaf8; }
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }

/* Colors */
.gold-text { color: #B38728 !important; }
.text-danger { color: #8b0000 !important; }
.border-gold-subtle { border-color: #e8dcc4 !important; }
.border-dashed { border-bottom: 1px dashed #dcdcdc !important; }

/* Alerts */
.custom-alert-success { background: #fdfbf7; border: 1px solid #D4AF37; color: #B38728; }
.custom-alert-danger { background: #fff5f5; border: 1px solid #8b0000; color: #8b0000; }

/* Img */
.img-wrap { width: 85px; height: 85px; }
.img-wrap img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }

.hover-gold { transition: 0.3s; }
.hover-gold:hover { color: #B38728 !important; }

/* Buttons */
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111 !important; border: 1px solid #D4AF37;
  transition: all 0.4s ease;
}
.btn-gold:hover:not(:disabled) {
  background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%);
  transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

.btn-outline-gold {
  background: #fff; border: 1px solid #D4AF37; color: #B38728;
  transition: all 0.3s ease;
}
.btn-outline-gold:hover { background: #D4AF37; color: #fff; }

/* Modal & Form */
.custom-textarea { border: 1px solid #e0e0e0; background: #fafafa; transition: all 0.3s; font-size: 15px; border-radius: 2px;}
.custom-textarea:focus { border-color: #D4AF37; background: #fff; outline: none; box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }

/* Rating Stars */
.rate { display: inline-flex; flex-direction: row-reverse; height: 46px; }
.rate input { display: none; }
.rate label {
  float: right; width: 1em; overflow: hidden; white-space: nowrap;
  cursor: pointer; font-size: 35px; color: #e0e0e0; padding: 0 5px; transition: 0.2s;
}
.rate label:before { content: '★ '; }
.rate input:checked ~ label { color: #D4AF37; }
.rate label:hover, .rate label:hover ~ label { color: #B38728; }
.rate input:checked + label:hover,
.rate input:checked + label:hover ~ label,
.rate input:checked ~ label:hover,
.rate input:checked ~ label:hover ~ label,
.rate label:hover ~ input:checked ~ label { color: #8a6312; }
</style>