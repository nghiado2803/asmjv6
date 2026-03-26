<template>
  <div class="container-fluid p-4 d-flex flex-column" style="height: calc(100vh - 80px);">
    
    <div class="py-3 px-4 bg-white border rounded-top-4 d-flex justify-content-between align-items-center flex-shrink-0 shadow-sm">
      <h4 class="fw-bold mb-0 text-primary"><i class="bi bi-chat-square-text-fill me-2"></i>Live Chat Center</h4>
      <span class="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill">
        <i class="bi bi-circle-fill me-1" style="font-size: 8px;"></i> Đang trực tuyến
      </span>
    </div>

    <div class="row g-0 flex-grow-1 overflow-hidden bg-white border border-top-0 rounded-bottom-4 shadow-sm">
      
      <div class="col-md-3 border-end d-flex flex-column h-100">
        <div class="p-3 border-bottom bg-light">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
            <input type="text" class="form-control border-start-0 ps-0 shadow-none" placeholder="Tìm khách hàng...">
          </div>
        </div>
        <div class="flex-grow-1 overflow-auto">
          <div class="list-group list-group-flush">
            <a href="javascript:void(0)" v-for="s in sessions" :key="s.id" @click.prevent="loadChat(s)" 
               class="list-group-item list-group-item-action p-3 border-0 border-bottom" 
               :class="{ 'bg-primary bg-opacity-10': activeSession?.id === s.id }">
              <div class="d-flex align-items-center">
                <div class="position-relative">
                  <img :src="`https://ui-avatars.com/api/?name=${s.userName}&background=random`" class="rounded-circle shadow-sm" width="48">
                  <span class="position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle" style="transform: translate(25%, 25%);"></span>
                </div>
                <div class="ms-3 overflow-hidden w-100">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <h6 class="mb-0 fw-bold text-truncate text-dark" style="max-width: 70%;">{{ s.userName }}</h6>
                    <small class="text-muted" style="font-size: 0.75rem;">{{ s.time }}</small>
                  </div>
                  <small class="text-muted text-truncate d-block">{{ s.lastMessage || 'Nhấn để xem...' }}</small>
                </div>
              </div>
            </a>
            
            <div v-if="sessions.length === 0" class="text-center p-4 text-muted">
              Chưa có cuộc trò chuyện nào.
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-9 d-flex flex-column h-100 position-relative bg-light" v-if="activeSession">
        
        <div class="p-3 bg-white border-bottom shadow-sm flex-shrink-0 d-flex align-items-center z-1">
          <img :src="`https://ui-avatars.com/api/?name=${activeSession.userName}&background=random`" class="rounded-circle me-3" width="40">
          <div>
            <h6 class="mb-0 fw-bold text-dark">{{ activeSession.userName }}</h6>
            <small class="text-success fw-bold"><i class="bi bi-circle-fill" style="font-size: 0.5rem; vertical-align: middle;"></i> Đang hoạt động</small>
          </div>
        </div>
        
        <div id="chatBody" class="flex-grow-1 p-4 overflow-auto d-flex flex-column" style="background: #f4f7f6;">
          <div v-for="msg in messages" :key="msg.id" class="d-flex mb-3" :class="msg.isAdmin ? 'justify-content-end' : 'justify-content-start'">
            <div class="d-flex flex-column" :class="msg.isAdmin ? 'align-items-end ms-5' : 'align-items-start me-5'" style="max-width: 75%;">
              
              <div v-if="msg.content" class="p-3 shadow-sm" 
                   :class="msg.isAdmin ? 'bg-primary text-white rounded-bottom-0 rounded-start-4 rounded-top-4' : 'bg-white text-dark border rounded-top-4 rounded-end-4 rounded-bottom-0'">
                {{ msg.content }}
              </div>
              
              <img v-if="msg.imageUrl" :src="`http://localhost:8080/images/${msg.imageUrl}`" 
                   class="mt-2 rounded-3 shadow-sm border" style="max-height: 250px; max-width: 100%; cursor: pointer;" 
                   @click="openImage(`http://localhost:8080/images/${msg.imageUrl}`)">

              <a v-if="msg.product" :href="`/product/${msg.product.id}`" target="_blank" class="text-decoration-none mt-2">
                <div class="bg-white border rounded-3 p-2 shadow-sm d-flex align-items-center" style="width: 260px;">
                  <img :src="`http://localhost:8080/images/${msg.product.imageUrl}`" width="60" height="60" class="rounded object-fit-contain" @error="handleImageError">
                  <div class="ms-2 overflow-hidden text-dark text-start">
                    <small class="fw-bold d-block text-truncate">{{ msg.product.name }}</small>
                    <span class="text-danger fw-bold small">{{ formatPrice(msg.product.price) }}</span>
                  </div>
                </div>
              </a>

              <small class="text-muted mt-1" style="font-size: 10px;">{{ formatTime(msg.createdAt) }}{{ msg.isAdmin ? ' • Đã gửi' : '' }}</small>
            </div>
          </div>
        </div>

        <div class="p-3 bg-white border-top flex-shrink-0">
          <div v-if="imagePreviewUrl" class="mb-2 position-relative" style="width: fit-content;">
            <img :src="imagePreviewUrl" style="max-height: 100px; border-radius: 8px; border: 1px solid #ddd;">
            <button @click="cancelImage" class="btn btn-sm btn-danger rounded-circle position-absolute top-0 start-100 translate-middle">x</button>
          </div>

          <div class="input-group shadow-sm rounded-pill overflow-hidden border p-1">
            <label class="btn btn-light text-primary border-0 rounded-circle me-1" title="Gửi hình ảnh">
              <i class="bi bi-image fs-5"></i>
              <input type="file" ref="fileInput" @change="handleImageSelect" hidden accept="image/*">
            </label>
            <button class="btn btn-light text-primary border-0 rounded-circle me-1" @click="showProductModal = true" title="Gửi sản phẩm">
              <i class="bi bi-bag-plus fs-5"></i>
            </button>
            <input type="text" v-model="newMessage" class="form-control border-0 shadow-none bg-transparent" placeholder="Nhập tin nhắn..." @keypress.enter="sendMessage">
            <button class="btn btn-primary rounded-pill px-4 fw-bold ms-1" @click="sendMessage">
              <i class="bi bi-send-fill me-1"></i> Gửi
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="col-md-9 d-flex flex-column align-items-center justify-content-center text-muted h-100 bg-light">
        <i class="bi bi-chat-dots text-primary opacity-25" style="font-size: 5rem;"></i>
        <h5 class="mt-3 fw-bold text-dark opacity-50">Chọn một khách hàng để bắt đầu tư vấn</h5>
      </div>
    </div>

    <div v-if="showProductModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1060;">
      <div class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold text-primary"><i class="bi bi-box-seam me-2"></i>Chọn sản phẩm tư vấn</h5>
            <button type="button" class="btn-close shadow-none" @click="showProductModal = false"></button>
          </div>
          <div class="modal-body bg-light p-4">
            <div class="row g-3">
              <div class="col-md-4" v-for="p in products" :key="p.id">
                <div class="card h-100 cursor-pointer shadow-sm border-0 product-card-hover" @click="sendProduct(p)">
                  <div class="card-body p-3 text-center">
                    <img :src="`http://localhost:8080/images/${p.imageUrl}`" class="img-fluid rounded mb-3 bg-white border" style="height: 120px; width: 100%; object-fit: contain; padding: 10px;" @error="handleImageError">
                    <h6 class="fw-bold text-truncate text-dark mb-1">{{ p.name }}</h6>
                    <span class="text-danger fw-bold small">{{ formatPrice(p.price) }}</span>
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

// [ĐÃ SỬA]: Thêm /admin vào link để lọt qua bảo mật Spring Security
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

// [ĐÃ SỬA]: Thêm /admin vào link gửi tin và gửi ảnh
const sendMessage = async () => {
  if (!activeSession.value) return alert("Chọn khách hàng trước!");
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
    } catch (e) { alert("Lỗi gửi ảnh!"); }
  }

  if (newMessage.value.trim()) {
    const formData = new FormData();
    formData.append('sessionId', activeSession.value.id.toString());
    formData.append('content', newMessage.value.trim());
    try {
      await api.post('/admin/chat/send', formData);
      newMessage.value = '';
      sent = true;
    } catch (e) { alert("Lỗi gửi tin nhắn!"); }
  }

  if (sent) {
    await refreshMessages();
    scrollToBottom();
    fetchSessions(); 
  }
};

// [ĐÃ SỬA]: Thêm /admin vào link gửi sản phẩm
const sendProduct = async (product: any) => {
  if (!activeSession.value) return;
  const formData = new FormData();
  formData.append('sessionId', activeSession.value.id.toString());
  formData.append('content', 'Tư vấn sản phẩm:');
  formData.append('productId', product.id.toString()); 

  try {
    await api.post('/admin/chat/send', formData);
    showProductModal.value = false;
    await refreshMessages();
    scrollToBottom();
    fetchSessions();
  } catch (e) { alert("Lỗi gửi sản phẩm!"); }
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
.cursor-pointer { cursor: pointer; }
.product-card-hover { transition: all 0.2s ease; }
.product-card-hover:hover { transform: translateY(-5px); border-color: #0d6efd !important; }
</style>