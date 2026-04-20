<template>
  <div class="chat-widget-container">
    <div class="chat-floating-buttons">
      <button class="btn-float btn-ai mb-2" @click="toggleChat('ai')" title="Trợ lý AI">
        <i class="bi bi-robot"></i>
      </button>
      <button class="btn-float btn-admin" @click="toggleChat('admin')" title="Chat với Admin">
        <i class="bi bi-headset"></i>
        <span v-if="hasNewMessage" class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
      </button>
    </div>

    <div v-if="activeChat === 'ai'" class="chat-box shadow-lg">
      <div class="chat-header bg-gradient-ai text-white">
        <div class="d-flex align-items-center">
          <div class="avatar-ai-wrapper me-2">
            <i class="bi bi-robot fs-5"></i>
          </div>
          <div>
            <h6 class="mb-0 fw-bold luxury-font">WatchShop AI</h6>
            <small class="opacity-75 d-flex align-items-center" style="font-size: 11px;">
              <span class="status-dot bg-success me-1"></span> Trực tuyến
            </small>
          </div>
        </div>
        <button class="btn-close-chat" @click="activeChat = null"><i class="bi bi-x-lg"></i></button>
      </div>
      
      <div class="chat-body custom-scrollbar" ref="aiScrollBody">
        <div v-for="(msg, idx) in aiMessages" :key="idx" 
             :class="['message-wrapper', msg.role === 'user' ? 'user-side' : 'bot-side']">
          
          <div :class="['message', msg.role === 'user' ? 'user-msg' : 'bot-msg']" style="white-space: pre-wrap;">
            {{ msg.content }}
          </div>
          
          <div v-if="msg.product" class="ai-product-card mt-2 shadow-sm">
            <div class="bg-white p-2 d-flex justify-content-center align-items-center border-bottom" style="height: 120px;">
              <img :src="getImageUrl(msg.product.imageUrl)" class="img-fluid" style="max-height: 100%; object-fit: contain;">
            </div>
            <div class="p-2 bg-light">
              <small class="fw-bold d-block text-truncate text-dark mb-1" :title="msg.product.name">{{ msg.product.name }}</small>
              <div class="d-flex justify-content-between align-items-center mt-2">
                <span class="gold-text fw-bold" style="font-size: 13px;">{{ formatPrice(msg.product.price) }} ₫</span>
              </div>
              <router-link :to="`/product/${msg.product.id}`" class="btn btn-gold btn-sm w-100 mt-2 text-uppercase fw-bold" style="font-size: 10px; letter-spacing: 0.5px;">
                Xem chi tiết
              </router-link>
            </div>
          </div>
        </div>

        <div v-if="isAITyping" class="message-wrapper bot-side">
          <div class="message bot-msg typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div class="chat-footer flex-column">
        <div v-if="showQuickSuggestions && !isAITyping" class="quick-suggestions w-100 mb-2 pb-1 custom-scrollbar" style="overflow-x: auto; white-space: nowrap;">
          <button v-for="(sug, i) in quickSuggestions" :key="i"
                  @click="sendQuickMessage(sug.text)"
                  class="btn btn-sm btn-outline-gold rounded-pill me-1 mb-1"
                  style="font-size: 11px;">
            {{ sug.label }}
          </button>
        </div>

        <div class="d-flex w-100 align-items-center">
          <input type="text" v-model="aiInput" 
                 class="form-control custom-chat-input" 
                 placeholder="Nhập yêu cầu tư vấn..." 
                 :disabled="isAITyping"
                 @keypress.enter="sendMessageAI"
                 @focus="showQuickSuggestions = true">
          <button class="btn-send ms-2" @click="sendMessageAI" :disabled="!aiInput.trim() || isAITyping">
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-if="activeChat === 'admin'" class="chat-box shadow-lg">
      <div class="chat-header bg-dark text-white">
        <div class="d-flex align-items-center">
          <div class="position-relative me-2">
            <img src="https://ui-avatars.com/api/?name=Admin&background=d0021b&color=fff" class="rounded-circle" width="35">
            <span class="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"></span>
          </div>
          <div>
            <h6 class="mb-0 fw-bold">Hỗ trợ viên</h6>
            <small class="text-success" style="font-size: 0.75rem;">Trực tuyến</small>
          </div>
        </div>
        <button class="btn-close-chat" @click="activeChat = null"><i class="bi bi-x-lg"></i></button>
      </div>

      <div class="chat-body custom-scrollbar" ref="adminScrollBody">
        <div v-for="msg in adminMessages" :key="msg.id" 
             :class="['message-wrapper', (!msg.isAdmin) ? 'user-side' : 'bot-side']">
          <div v-if="msg.content" :class="['message', (!msg.isAdmin) ? 'user-msg' : 'admin-msg']">{{ msg.content }}</div>
          
          <img v-if="msg.imageUrl" :src="getChatImageUrl(msg.imageUrl)" class="w-100 rounded mt-2 cursor-pointer shadow-sm" style="max-height: 200px; object-fit: cover;" @click="openImage(msg.imageUrl)">
          
          <div v-if="msg.product" class="ai-product-card mt-2 shadow-sm">
            <div class="bg-white p-2 d-flex justify-content-center border-bottom" style="height: 100px;">
              <img :src="getImageUrl(msg.product.imageUrl)" class="img-fluid" style="max-height: 100%; object-fit: contain;">
            </div>
            <div class="p-2 bg-light">
              <small class="fw-bold d-block text-truncate text-dark">{{ msg.product.name }}</small>
              <span class="gold-text fw-bold small">{{ formatPrice(msg.product.price) }} ₫</span>
              <router-link :to="`/product/${msg.product.id}`" class="btn btn-gold btn-sm w-100 py-1 mt-1 text-uppercase fw-bold" style="font-size: 10px;">Xem chi tiết</router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-footer align-items-center">
        <label class="btn btn-sm text-secondary p-0 me-2" style="cursor: pointer;">
          <i class="bi bi-image fs-5"></i>
          <input type="file" @change="sendImageAdmin" accept="image/*" style="display: none;">
        </label>
        <input type="text" v-model="adminInput" class="form-control custom-chat-input" placeholder="Nhập tin nhắn..." @keypress.enter="sendMessageAdmin">
        <button class="btn-send ms-2" @click="sendMessageAdmin" :disabled="!adminInput.trim()"><i class="bi bi-send-fill"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/index'; 
import Swal from 'sweetalert2'; 

const router = useRouter();

const activeChat = ref<string | null>(null);
const hasNewMessage = ref(false);

const checkAuth = () => {
  return !!localStorage.getItem('user');
};

// CẤU HÌNH POPUP LUXURY
const LuxuryAlert = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-gold rounded-1 fw-bold px-4 py-2 shadow-sm text-uppercase letter-spacing-1'
  },
  buttonsStyling: false
});

// ==========================================
// 1. LOGIC AI - ENTERPRISE LEVEL
// ==========================================
const dbProducts = ref<any[]>([]); 
const aiInput = ref('');
const isAITyping = ref(false);
const showQuickSuggestions = ref(true);

const quickSuggestions = [
  { label: '👩 Đồng hồ Nữ', text: 'Tư vấn cho tôi mẫu đồng hồ nữ thanh lịch.' },
  { label: '👨 Đồng hồ Nam', text: 'Tôi cần tìm đồng hồ nam tính lịch lãm.' },
  { label: '💎 Sang trọng', text: 'Gợi ý các dòng sản phẩm cao cấp.' },
  { label: '💰 Dưới 3 triệu', text: 'Tầm giá dưới 3 triệu có mẫu nào tốt?' }
];

const aiMessages = ref<any[]>([
  { 
    role: 'bot', 
    content: '👋 Kính chào Quý khách! Tôi là AI WatchShop.\n\nĐể tôi gợi ý tuyệt tác phù hợp nhất, Quý khách đang tìm kiếm đồng hồ cho Nam hay Nữ, và tầm giá khoảng bao nhiêu ạ?' 
  }
]);
const aiScrollBody = ref<HTMLElement | null>(null);

onMounted(async () => {
  try {
    const res = await api.get('/products');
    let productList = [];
    if (res.data && res.data.content) productList = res.data.content;
    else if (res.data && res.data.data) productList = res.data.data;
    else if (Array.isArray(res.data)) productList = res.data;
    
    dbProducts.value = productList;
  } catch (error) {
    console.error("AI chưa tải được dữ liệu sản phẩm:", error);
  }
});

const sendQuickMessage = async (text: string) => {
  aiInput.value = text;
  showQuickSuggestions.value = false;
  await nextTick();
  sendMessageAI();
};

const sendMessageAI = async () => {
  if (!aiInput.value.trim() || isAITyping.value) return;
  
  const text = aiInput.value;
  aiMessages.value.push({ role: 'user', content: text });
  aiInput.value = '';
  showQuickSuggestions.value = false;
  
  // Kích hoạt hiệu ứng gõ phím
  isAITyping.value = true;
  await nextTick();
  scrollToBottom(aiScrollBody);

  // Giả lập thời gian AI xử lý ngôn ngữ
  setTimeout(() => {
    isAITyping.value = false;
    generateAIResponse(text.toLowerCase());
  }, 1200 + Math.random() * 800);
};

const findProductByKeywords = (keywords: string[], maxPrice?: number, minPrice?: number) => {
  if (dbProducts.value.length === 0) return null;
  
  let match = dbProducts.value.filter(p => {
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const isKeywordMatch = keywords.some(kw => name.includes(kw) || desc.includes(kw));
    
    let isPriceMatch = true;
    if (maxPrice) isPriceMatch = isPriceMatch && (p.price <= maxPrice);
    if (minPrice) isPriceMatch = isPriceMatch && (p.price >= minPrice);
    
    return isKeywordMatch && isPriceMatch;
  });

  if (match.length > 0) {
    return match[Math.floor(Math.random() * match.length)];
  }
  return dbProducts.value[Math.floor(Math.random() * dbProducts.value.length)];
};

const generateAIResponse = (text: string) => {
  let reply = '';
  let suggestedProduct = null;
  const input = text;

  // Nhận diện giá tiền thông minh
  let maxPrice: number | undefined = undefined;
  const priceMatch = input.match(/dưới\s*(\d+)\s*(triệu|tr)/i);
  if (priceMatch && priceMatch[1]) {
    maxPrice = parseInt(priceMatch[1]) * 1000000;
  }

  if (input.includes('nữ') || input.includes('bạn gái') || input.includes('vợ')) {
    reply = '✨ Tôn vinh nét thanh lịch của phái đẹp, những mẫu đính đá hoặc mặt nhỏ gọn sẽ là lựa chọn hoàn hảo. Quý khách tham khảo tuyệt tác này nhé:';
    suggestedProduct = findProductByKeywords(['nữ', 'lady', 'women', 'nho', 'đá'], maxPrice);
  }
  else if (input.includes('nam') || input.includes('bạn trai') || input.includes('chồng')) {
    reply = '🕴️ Khẳng định phong thái quý ông! Các thiết kế dây da cổ điển hoặc mặt Chronograph thể thao sẽ rất ấn tượng:';
    suggestedProduct = findProductByKeywords(['nam', 'men', 'man', 'chronograph', 'cơ'], maxPrice);
  }
  else if (input.includes('rẻ') || input.includes('sinh viên') || maxPrice) {
    reply = `💡 Trong tầm giá ${maxPrice ? 'dưới ' + maxPrice/1000000 + ' triệu' : 'hợp lý'}, chất lượng và độ bền vẫn được chúng tôi đặt lên hàng đầu. Đây là gợi ý lý tưởng:`;
    suggestedProduct = findProductByKeywords(['casio', 'orient', 'nhựa', 'rẻ'], maxPrice || 2500000); 
  }
  else if (input.includes('cao cấp') || input.includes('sang trọng') || input.includes('doanh nhân')) {
    reply = '👑 Đẳng cấp thượng lưu hội tụ trong nghệ thuật chế tác tinh xảo. Mời Quý khách chiêm ngưỡng:';
    suggestedProduct = findProductByKeywords(['sapphire', 'tissot', 'automatic', 'cao cấp', 'sang'], 999000000, 5000000);
  }
  else if (input.includes('thể thao') || input.includes('bơi') || input.includes('g-shock')) {
    reply = '🏃 Bền bỉ bứt phá mọi giới hạn! Dòng thể thao chống nước xuất sắc này sinh ra là dành cho bạn:';
    suggestedProduct = findProductByKeywords(['thể thao', 'sport', 'g-shock', 'chống nước', 'diver']);
  }
  else if (input.includes('bảo hành') || input.includes('sửa') || input.includes('thay pin')) {
    reply = '🛠️ **Đặc quyền tại WatchShop:**\n• Bảo hành bộ máy chính hãng 100%.\n• Hỗ trợ THAY PIN MIỄN PHÍ trọn đời.\nQuý khách hoàn toàn an tâm khi mua sắm ạ!';
    suggestedProduct = null; 
  }
  else {
    reply = '💭 Tôi hiểu nhu cầu của bạn. Xin phép đề xuất một trong những mẫu thiết kế đang được giới mộ điệu săn đón nhiều nhất hiện nay:';
    suggestedProduct = dbProducts.value.length > 0 ? dbProducts.value[Math.floor(Math.random() * dbProducts.value.length)] : null;
  }

  aiMessages.value.push({ role: 'bot', content: reply, product: suggestedProduct });
};


// ==========================================
// 2. LOGIC CHAT VỚI ADMIN (GIỮ NGUYÊN)
// ==========================================
const adminInput = ref('');
const adminMessages = ref<any[]>([]);
const clientSessionId = ref<number | null>(null);
const adminScrollBody = ref<HTMLElement | null>(null);

let pollInterval: any = null;
let adminInactivityTimer: any = null;
const INACTIVITY_LIMIT = 5 * 60 * 1000; 

const toggleChat = (type: string) => {
  if (type === 'admin') {
    if (!checkAuth()) {
      LuxuryAlert.fire({
        icon: 'warning',
        title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Yêu cầu đăng nhập</h4>',
        text: 'Vui lòng đăng nhập hệ thống để chat với Chuyên viên tư vấn!',
        confirmButtonText: 'Đăng nhập ngay',
      }).then(() => router.push('/login'));
      return;
    }
    activeChat.value = activeChat.value === 'admin' ? null : 'admin';
    if (activeChat.value === 'admin') initAdminChat();
  } else {
    activeChat.value = activeChat.value === 'ai' ? null : 'ai';
  }
};

const createNewSession = async () => {
   try {
        const startRes = await api.post('/chat/start');
        const startData = startRes.data ? startRes.data : startRes;
        clientSessionId.value = startData.sessionId;
        startPolling();
   } catch (err) { console.error("Lỗi tạo phòng chat:", err); }
}

const initAdminChat = async () => {
  try {
    const res = await api.get('/chat/my-messages');
    const data = res.data ? res.data : res; 
    
    if (data && data.sessionId) {
        clientSessionId.value = data.sessionId;
        adminMessages.value = data.messages || [];
        startPolling();
    } else {
        await createNewSession();
    }
  } catch (e: any) {
    if (e.response && e.response.status === 404) {
        await createNewSession();
    } else {
        console.error("Lỗi khởi tạo chat:", e);
    }
  }
};

const startAdminInactivityTimer = () => {
  clearTimeout(adminInactivityTimer);
  adminInactivityTimer = setTimeout(() => {
    if (activeChat.value === 'admin') {
      activeChat.value = 'ai'; 
      aiMessages.value.push({ 
        role: 'bot', 
        content: '⏰ Hiện tại Chuyên viên đang bận xử lý giao dịch. Em là Trợ lý AI, Quý khách cần tìm hiểu thêm thông tin gì ạ? 🤖' 
      });
    }
  }, INACTIVITY_LIMIT);
};

const sendMessageAdmin = async () => {
  if (!adminInput.value.trim() || !clientSessionId.value) return;
  const content = adminInput.value;
  adminInput.value = '';

  try {
    await api.post('/chat/send', null, {
      params: { sessionId: clientSessionId.value, content: content }
    });
    fetchMessages();
    startAdminInactivityTimer(); 
  } catch(e) { console.error("Lỗi gửi tin:", e); }
};

const sendImageAdmin = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target || !target.files || target.files.length === 0 || !clientSessionId.value) return;

  const file: File = target.files[0]!; 
  const formData = new FormData();
  formData.append('sessionId', clientSessionId.value.toString());
  formData.append('file', file);

  try {
    await api.post('/chat/upload', formData);
    target.value = ''; 
    await fetchMessages(); 
    startAdminInactivityTimer(); 
  } catch (err) { console.error("Lỗi gửi ảnh:", err); }
};

const fetchMessages = async () => {
  if (!clientSessionId.value) return;
  try {
    const res = await api.get(`/chat/messages/${clientSessionId.value}`);
    const newMessages = res.data || [];
    
    if (newMessages.length > 0) {
      const lastMsg = newMessages[newMessages.length - 1];
      if (lastMsg.isAdmin) {
        clearTimeout(adminInactivityTimer); 
      }
    }
    adminMessages.value = newMessages;
  } catch (e) { console.error(e); }
};

const startPolling = () => {
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(fetchMessages, 10000); 
};

// ==========================================
// CÁC HÀM HỖ TRỢ HIỂN THỊ
// ==========================================
const formatPrice = (v: number) => {
  if (!v) return '0';
  return new Intl.NumberFormat('vi-VN').format(v);
};

const getImageUrl = (url: string) => {
  if (!url) return 'https://placehold.co/100x100?text=No+Image';
  if (url.startsWith('http')) return url;
  return `http://localhost:8080/images/${url}`;
};

const getChatImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `http://localhost:8080/uploads/${url}`;
};

const openImage = (url: string) => window.open(getChatImageUrl(url));

const scrollToBottom = async (elementRef: any) => {
  await nextTick();
  if (elementRef.value) {
    elementRef.value.scrollTop = elementRef.value.scrollHeight;
  }
};

watch([aiMessages, adminMessages], () => {
  scrollToBottom(aiScrollBody);
  scrollToBottom(adminScrollBody);
}, { deep: true });

onUnmounted(() => { 
  if (pollInterval) clearInterval(pollInterval); 
  if (adminInactivityTimer) clearTimeout(adminInactivityTimer);
});
</script>

<style scoped>
/* ==================== GLOBAL & LUXURY ==================== */
.luxury-font { font-family: 'Montserrat', 'Segoe UI', sans-serif; }
.gold-text { color: #B38728 !important; }
.btn-gold { background: linear-gradient(135deg, #D4AF37, #B38728); color: #fff; border: none; }
.btn-gold:hover { background: linear-gradient(135deg, #FBF5B7, #D4AF37); color: #111; }
.btn-outline-gold { color: #B38728; border: 1px solid #B38728; background: transparent; }
.btn-outline-gold:hover { background: #B38728; color: #fff; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px;}
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }

/* ==================== FLOATING BUTTONS ==================== */
.chat-floating-buttons { position: fixed; bottom: 30px; right: 30px; z-index: 10000; display: flex; flex-direction: column; align-items: flex-end; }
.btn-float { width: 55px; height: 55px; border-radius: 50%; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-size: 1.5rem; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
.btn-float:hover { transform: scale(1.1); }
.btn-ai { background: linear-gradient(135deg, #111, #333); color: #D4AF37; border: 2px solid #D4AF37; }
.btn-admin { background-color: #f8f9fa; color: #111; border: 1px solid #ddd; position: relative; }

/* ==================== CHAT BOX ==================== */
.chat-box { position: fixed; bottom: 100px; right: 30px; width: 360px; height: 520px; background: #fff; border-radius: 12px; z-index: 10000; display: flex; flex-direction: column; overflow: hidden; animation: slideIn 0.3s ease-out; box-shadow: 0 10px 30px rgba(0,0,0,0.15); border: 1px solid #eaeaea; }
@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* ==================== HEADER ==================== */
.chat-header { padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; }
.bg-gradient-ai { background: linear-gradient(135deg, #111, #222); border-bottom: 2px solid #D4AF37; }
.avatar-ai-wrapper { width: 35px; height: 35px; background: #D4AF37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #111; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.btn-close-chat { background: none; border: none; color: white; font-size: 1.2rem; transition: 0.2s; }
.btn-close-chat:hover { opacity: 0.7; transform: scale(1.1); }

/* ==================== CHAT BODY & BUBBLES ==================== */
.chat-body { flex: 1; padding: 15px; overflow-y: auto; background-color: #fcfcfc; display: flex; flex-direction: column; }
.message-wrapper { display: flex; flex-direction: column; margin-bottom: 15px; width: 100%; animation: fadeIn 0.3s; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

.user-side { align-items: flex-end; }
.bot-side { align-items: flex-start; }

.message { max-width: 85%; padding: 12px 14px; border-radius: 12px; font-size: 0.9rem; line-height: 1.5; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.bot-msg { background: #fff; border: 1px solid #eee; color: #333; border-bottom-left-radius: 2px; }
.admin-msg { background: #111; color: #fff; border-bottom-left-radius: 2px; border-left: 2px solid #D4AF37; }
.user-msg { background: #f0f0f0; color: #111; border-bottom-right-radius: 2px; }

/* ==================== TYPING INDICATOR ==================== */
.typing-indicator { display: flex; gap: 4px; padding: 15px 18px !important; align-items: center; justify-content: center; width: fit-content; }
.typing-indicator span { width: 6px; height: 6px; background-color: #B38728; border-radius: 50%; animation: typing 1.4s infinite ease-in-out both; }
.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
@keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

/* ==================== PRODUCT CARD ==================== */
.ai-product-card { width: 220px; border-radius: 8px; overflow: hidden; border: 1px solid #eee; transition: 0.3s; }
.ai-product-card:hover { border-color: #D4AF37; box-shadow: 0 5px 15px rgba(212, 175, 55, 0.15) !important; }

/* ==================== FOOTER ==================== */
.chat-footer { padding: 10px 15px; background: #fff; border-top: 1px solid #eee; display: flex; }
.custom-chat-input { border-radius: 20px; font-size: 0.9rem; border: 1px solid #ddd; background: #fafafa; transition: 0.3s; }
.custom-chat-input:focus { border-color: #D4AF37; box-shadow: none; background: #fff; }
.btn-send { background: none; border: none; color: #B38728; font-size: 1.2rem; transition: 0.2s; }
.btn-send:hover:not(:disabled) { transform: scale(1.1); }
.btn-send:disabled { color: #ccc; cursor: not-allowed; }
</style>