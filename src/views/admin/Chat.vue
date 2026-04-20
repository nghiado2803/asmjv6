<template>
  <div class="container-fluid p-4 d-flex flex-column admin-chat-page" style="height: calc(100vh - 80px);">
    
    <div class="py-3 px-4 bg-white border border-gold-subtle d-flex justify-content-between align-items-center flex-shrink-0 shadow-sm" style="border-radius: 2px 2px 0 0;">
      <h5 class="luxury-font fw-bold mb-0 text-dark text-uppercase letter-spacing-1">
        <i class="bi bi-headset gold-text me-2 fs-4"></i>Trung tâm CSKH VIP
      </h5>
      <span class="status-badge status-active shadow-sm">
        <i class="bi bi-circle-fill me-1" style="font-size: 8px;"></i>
      </span>
    </div>

    <div class="row g-0 flex-grow-1 overflow-hidden bg-white border border-top-0 border-gold-subtle shadow-sm" style="border-radius: 0 0 2px 2px;">
      
      <div class="col-md-3 border-end border-gold-subtle d-flex flex-column h-100 bg-light">
        <div class="p-3 border-bottom border-gold-subtle bg-white text-center">
          <span class="text-uppercase fw-bold gold-text letter-spacing-1 small">Danh sách kết nối</span>
        </div>
        <div class="flex-grow-1 overflow-auto session-list">
          <div class="list-group list-group-flush">
            
            <a href="javascript:void(0)" v-for="s in sessions" :key="s.id" @click.prevent="loadChat(s)" 
               class="list-group-item list-group-item-action p-3 border-0 border-bottom border-gold-subtle session-item" 
               :class="{ 'session-active': activeSession?.id === s.id }">
              <div class="d-flex align-items-center">
                <div class="position-relative avatar-wrap border-gold-subtle p-1 bg-white">
                  <img :src="`https://ui-avatars.com/api/?name=${s.userName}&background=D4AF37&color=fff&bold=true`" class="w-100 h-100 object-fit-cover" alt="Avatar">
                  <span class="position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle" style="transform: translate(25%, 25%);"></span>
                </div>
                <div class="ms-3 overflow-hidden w-100">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <h6 class="mb-0 fw-bold text-truncate text-dark luxury-font" style="max-width: 70%;">{{ s.userName }}</h6>
                    <small class="text-muted letter-spacing-1" style="font-size: 0.7rem;">{{ s.time }}</small>
                  </div>
                  <small class="text-muted text-truncate d-block" style="font-size: 13px;">{{ s.lastMessage || 'Nhấn để xem...' }}</small>
                </div>
              </div>
            </a>
            
            <div v-if="sessions.length === 0" class="text-center p-5 text-muted">
              <i class="bi bi-inbox display-4 gold-text opacity-25 d-block mb-3"></i>
              <span class="fst-italic small">Chưa có kết nối nào.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-9 d-flex flex-column h-100 position-relative" style="background: #fdfbf7;" v-if="activeSession">
        
        <div class="p-3 bg-white border-bottom border-gold-subtle shadow-sm flex-shrink-0 d-flex align-items-center z-1">
          <div class="avatar-wrap border-gold-subtle p-1 bg-light me-3" style="width: 45px; height: 45px;">
            <img :src="`https://ui-avatars.com/api/?name=${activeSession.userName}&background=D4AF37&color=fff&bold=true`" class="w-100 h-100 object-fit-cover">
          </div>
          <div>
            <h6 class="mb-1 fw-bold text-dark luxury-font fs-5">{{ activeSession.userName }}</h6>
            <small class="text-success fw-bold text-uppercase letter-spacing-1" style="font-size: 10px;"><i class="bi bi-circle-fill me-1" style="font-size: 6px; vertical-align: middle;"></i></small>
          </div>
        </div>
        
        <div id="chatBody" class="flex-grow-1 p-4 overflow-auto d-flex flex-column custom-scrollbar">
          <div v-for="msg in messages" :key="msg.id" class="d-flex mb-4" :class="msg.isAdmin ? 'justify-content-end' : 'justify-content-start'">
            <div class="d-flex flex-column" :class="msg.isAdmin ? 'align-items-end ms-5' : 'align-items-start me-5'" style="max-width: 70%;">
              
              <div v-if="msg.content" class="p-3 shadow-sm chat-bubble" 
                   :class="msg.isAdmin ? 'bubble-admin' : 'bubble-user'">
                {{ msg.content }}
              </div>
              
              <img v-if="msg.imageUrl" :src="`http://localhost:8080/images/${msg.imageUrl}`" 
                   class="mt-2 rounded-1 shadow-sm border-gold-subtle bg-white p-1" style="max-height: 250px; max-width: 100%; cursor: zoom-in;" 
                   @click="openImage(`http://localhost:8080/images/${msg.imageUrl}`)">

              <a v-if="msg.product" :href="`/product/${msg.product.id}`" target="_blank" class="text-decoration-none mt-2 product-chat-card">
                <div class="bg-white border-gold-subtle rounded-1 p-2 shadow-sm d-flex align-items-center transition-all" style="width: 280px;">
                  <div class="border-gold-subtle p-1 bg-light me-3" style="width: 65px; height: 65px;">
                    <img :src="`http://localhost:8080/images/${msg.product.imageUrl}`" class="w-100 h-100 object-fit-contain mix-blend-multiply" @error="handleImageError">
                  </div>
                  <div class="overflow-hidden text-dark text-start">
                    <small class="fw-bold d-block text-truncate luxury-font" style="font-size: 14px;">{{ msg.product.name }}</small>
                    <span class="gold-text fw-bold small letter-spacing-1 mt-1 d-block">{{ formatPrice(msg.product.price) }}</span>
                  </div>
                </div>
              </a>

              <small class="text-muted mt-2 letter-spacing-1" style="font-size: 10px;">{{ formatTime(msg.createdAt) }}</small>
            </div>
          </div>
        </div>

        <div class="p-3 bg-white border-top border-gold-subtle flex-shrink-0">
          
          <div v-if="imagePreviewUrl" class="mb-3 position-relative border-gold-subtle p-1 bg-light shadow-sm" style="width: fit-content; border-radius: 2px;">
            <img :src="imagePreviewUrl" style="max-height: 90px; object-fit: cover;">
            <button @click="cancelImage" class="btn btn-sm btn-danger rounded-0 position-absolute top-0 start-100 translate-middle shadow" style="padding: 2px 6px;"><i class="bi bi-x-lg"></i></button>
          </div>

          <div class="input-group shadow-sm border-gold-subtle bg-light p-1 align-items-center" style="border-radius: 2px;">
            <label class="btn btn-light text-dark border-0 me-1 hover-gold" title="Đính kèm hình ảnh">
              <i class="bi bi-image fs-5"></i>
              <input type="file" ref="fileInput" @change="handleImageSelect" hidden accept="image/*">
            </label>
            <button class="btn btn-light text-dark border-0 me-2 hover-gold" @click="showProductModal = true" title="Gửi thẻ sản phẩm">
              <i class="bi bi-bag-plus fs-5"></i>
            </button>
            <input type="text" v-model="newMessage" class="form-control custom-input border-0 shadow-none bg-transparent" placeholder="Soạn tin nhắn gửi khách hàng..." @keypress.enter="sendMessage">
            <button class="btn btn-gold px-4 py-2 fw-bold text-uppercase letter-spacing-1 ms-2 shadow-sm rounded-1" @click="sendMessage">
              <i class="bi bi-send-fill me-2"></i> Gửi
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="col-md-9 d-flex flex-column align-items-center justify-content-center text-muted h-100" style="background: #fdfbf7;">
        <i class="bi bi-chat-square-quote gold-text opacity-25" style="font-size: 6rem;"></i>
        <h5 class="mt-4 fw-bold text-dark luxury-font text-uppercase letter-spacing-1 opacity-75">Sẵn sàng phục vụ</h5>
        <p class="small text-muted letter-spacing-1">Vui lòng chọn một phiên kết nối bên trái để bắt đầu tư vấn.</p>
      </div>
    </div>

    <div v-if="showProductModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.6); z-index: 1060; backdrop-filter: blur(2px);">
      <div class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
        <div class="modal-content border-0 rounded-1 shadow-lg luxury-modal">
          <div class="modal-header border-bottom border-gold-subtle bg-light px-4 py-3">
            <h6 class="modal-title fw-bold text-dark text-uppercase letter-spacing-1"><i class="bi bi-box-seam gold-text me-2"></i>Chọn Tuyệt tác Tư vấn</h6>
            <button type="button" class="btn-close shadow-none" @click="showProductModal = false"></button>
          </div>
          <div class="modal-body bg-white p-4">
            <div class="row g-4">
              <div class="col-md-4" v-for="p in products" :key="p.id">
                <div class="card h-100 cursor-pointer shadow-sm border-gold-subtle product-card-hover" @click="sendProduct(p)">
                  <div class="card-body p-3 text-center d-flex flex-column align-items-center">
                    <div class="border-gold-subtle p-2 bg-light mb-3 w-100 d-flex justify-content-center align-items-center" style="height: 140px;">
                      <img :src="`http://localhost:8080/images/${p.imageUrl}`" class="img-fluid mix-blend-multiply" style="max-height: 100%; object-fit: contain;" @error="handleImageError">
                    </div>
                    <h6 class="fw-bold text-dark mb-2 luxury-font" style="font-size: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ p.name }}</h6>
                    <span class="gold-text fw-bold small letter-spacing-1 mt-auto">{{ formatPrice(p.price) }}</span>
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import api from '@/api/index';
import Swal from 'sweetalert2'; // CHỈ THÊM DÒNG NÀY

// CẤU HÌNH POPUP LUXURY
const LuxuryAlert = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-gold rounded-1 fw-bold px-4 py-2 shadow-sm text-uppercase letter-spacing-1'
  },
  buttonsStyling: false
});

const sessions = ref<any[]>([]);
const activeSession = ref<any>(null);
const messages = ref<any[]>([]);
const newMessage = ref('');
const showProductModal = ref(false);
const products = ref<any[]>([]);
let pollingTimer: any = null;

const fileInput = ref<any>(null);
const imageFile = ref<File | null>(null);
const imagePreviewUrl = ref('');

const fetchSessions = async () => {
  try {
    const res = await api.get('/admin/chat/sessions');
    sessions.value = res.data;
  } catch (e) { console.error("Lỗi fetch sessions", e); }
};

const fetchProducts = async () => {
  try {
    const res = await api.get('/admin/products');
    products.value = res.data;
  } catch (e) { console.error("Lỗi fetch products", e); }
};

const loadChat = async (session: any) => {
  activeSession.value = session;
  await refreshMessages();
  scrollToBottom();
  
  if (pollingTimer) clearInterval(pollingTimer);
  pollingTimer = setInterval(refreshMessages, 4000);
};

const refreshMessages = async () => {
  if (!activeSession.value) return;
  try {
    const res = await api.get(`/admin/chat/messages/${activeSession.value.id}`);
    messages.value = res.data;
  } catch (e) { console.error("Lỗi refresh messages", e); }
};

const handleImageSelect = (e: any) => {
  const file = e.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreviewUrl.value = URL.createObjectURL(file);
  }
};

const cancelImage = () => {
  imageFile.value = null;
  imagePreviewUrl.value = '';
  if (fileInput.value) fileInput.value.value = '';
};

const sendMessage = async () => {
  // SỬA ALERT 1
  if (!activeSession.value) {
    LuxuryAlert.fire({ icon: 'warning', title: 'Cảnh báo', text: 'Vui lòng chọn khách hàng cần tư vấn trước!' });
    return;
  }
  
  if (!newMessage.value.trim() && !imageFile.value) return;

  let sent = false;

  if (imageFile.value) {
    const formData = new FormData();
    formData.append('sessionId', activeSession.value.id.toString());
    formData.append('file', imageFile.value);
    try {
      await api.post('/admin/chat/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      cancelImage();
      sent = true;
    } catch (e) { 
      // SỬA ALERT 2
      LuxuryAlert.fire({ icon: 'error', title: 'Lỗi', text: 'Lỗi gửi ảnh!' }); 
    }
  }

  if (newMessage.value.trim()) {
    const params = new URLSearchParams();
    params.append('sessionId', activeSession.value.id.toString());
    params.append('content', newMessage.value.trim());
    try {
      await api.post('/admin/chat/send', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      newMessage.value = '';
      sent = true;
    } catch (e) { 
      // SỬA ALERT 3
      LuxuryAlert.fire({ icon: 'error', title: 'Lỗi', text: 'Lỗi gửi tin nhắn!' }); 
    }
  }

  if (sent) {
    await refreshMessages();
    scrollToBottom();
    fetchSessions(); 
  }
};

const sendProduct = async (product: any) => {
  if (!activeSession.value) return;
  
  const params = new URLSearchParams();
  params.append('sessionId', activeSession.value.id.toString());
  params.append('content', 'Gợi ý tuyệt tác từ chuyên viên:');
  params.append('productId', product.id.toString()); 

  try {
    await api.post('/admin/chat/send', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    showProductModal.value = false;
    await refreshMessages();
    scrollToBottom();
    fetchSessions();
  } catch (e) { 
    console.error("Lỗi 400:", e);
    // SỬA ALERT 4
    LuxuryAlert.fire({ icon: 'error', title: 'Lỗi', text: 'Lỗi gửi thẻ sản phẩm! Vui lòng kiểm tra lại kết nối.' }); 
  }
};

const handleImageError = (e: any) => {
  e.target.src = 'https://via.placeholder.com/150';
};

const formatPrice = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
const formatTime = (dateString: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const scrollToBottom = async () => {
  await nextTick();
  const chatBody = document.getElementById('chatBody');
  if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
};

const openImage = (url: string) => window.open(url, '_blank');

onMounted(() => {
  fetchSessions();
  fetchProducts();
});

onUnmounted(() => {
  if (pollingTimer) clearInterval(pollingTimer);
});
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY ADMIN CHAT
========================================== */
.admin-chat-page { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; }
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }

/* Colors & Basics */
.gold-text { color: #B38728 !important; }
.border-gold-subtle { border-color: #eaeaea !important; }
.bg-gold-light { background-color: #fdfbf7 !important; }
.hover-gold { transition: 0.3s; }
.hover-gold:hover { color: #B38728 !important; }

/* Avatar bọc viền vàng */
.avatar-wrap { width: 50px; height: 50px; border-radius: 2px; border: 1px solid #eaeaea; }

/* Status Badge */
.status-badge {
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
  padding: 6px 12px; border-radius: 2px;
}
.status-active { background: #e6f2e6; color: #1a661a; border: 1px solid #99cc99; }

/* Danh sách Session (Cột trái) */
.session-item { transition: all 0.3s ease; border-left: 3px solid transparent !important; }
.session-item:hover { background-color: #fdfbf7; border-left-color: #e8dcc4 !important; }
.session-active { 
  background-color: #fdfbf7 !important; 
  border-left-color: #D4AF37 !important; 
}

/* Chat Bubbles (Cột phải) */
.chat-bubble { font-size: 15px; line-height: 1.5; border-radius: 2px; }
.bubble-admin { 
  background: #1a1a1a; color: #fff; 
  border-bottom: 2px solid #D4AF37; 
}
.bubble-user { 
  background: #fff; color: #333; 
  border: 1px solid #eaeaea; 
  border-left: 2px solid #B38728;
}

/* Khung Input Chat */
.custom-input:focus { outline: none; box-shadow: none; }
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #FBF5B7 50%, #B38728 100%);
  color: #111 !important; border: 1px solid #D4AF37; transition: all 0.3s ease;
}
.btn-gold:hover { background: linear-gradient(135deg, #FBF5B7 0%, #D4AF37 50%, #AA771C 100%); }

/* Thẻ Sản Phẩm (Trong Modal & Trong Chat) */
.product-chat-card .transition-all { transition: all 0.3s ease; }
.product-chat-card:hover .transition-all { border-color: #D4AF37 !important; background-color: #fdfbf7 !important; }

.product-card-hover { transition: all 0.3s ease; border-radius: 2px; }
.product-card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; border-color: #D4AF37 !important; }

/* Tiện ích */
.cursor-pointer { cursor: pointer; }
.mix-blend-multiply { mix-blend-mode: multiply; }

/* Custom Scrollbar cho mượt */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #fdfbf7; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
</style>