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
          <i class="bi bi-robot fs-4 me-2"></i>
          <div>
            <h6 class="mb-0 fw-bold">WatchShop AI</h6>
            <small class="opacity-75">Luôn sẵn sàng 24/7</small>
          </div>
        </div>
        <button class="btn-close-chat" @click="activeChat = null"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="chat-body" ref="aiScrollBody">
        <div v-for="(msg, idx) in aiMessages" :key="idx" 
             :class="['message', msg.role === 'user' ? 'user-msg' : 'bot-msg']">
          <div>{{ msg.content }}</div>
          
          <div v-if="msg.product" class="mt-2 bg-light p-2 rounded text-dark border shadow-sm" style="min-width: 200px;">
            <img :src="getImageUrl(msg.product.imageUrl)" class="w-100 rounded mb-1" style="height: 120px; object-fit: contain; background: #fff;">
            <small class="fw-bold d-block text-truncate" :title="msg.product.name">{{ msg.product.name }}</small>
            <span class="text-danger fw-bold small">{{ formatPrice(msg.product.price) }} ₫</span>
            <router-link :to="`/product/${msg.product.id}`" class="btn btn-sm btn-outline-danger w-100 py-0 mt-1" style="font-size: 11px;">Xem chi tiết</router-link>
          </div>
        </div>
      </div>
      <div class="chat-footer">
        <input type="text" v-model="aiInput" class="form-control" placeholder="Hỏi AI (Giá, độ tuổi...)" @keypress.enter="sendMessageAI">
        <button class="btn-send" @click="sendMessageAI"><i class="bi bi-send-fill"></i></button>
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
            <small class="text-success" style="font-size: 0.75rem;">● Đang trực tuyến</small>
          </div>
        </div>
        <button class="btn-close-chat" @click="activeChat = null"><i class="bi bi-x-lg"></i></button>
      </div>

      <div class="chat-body" ref="adminScrollBody">
        <div v-for="msg in adminMessages" :key="msg.id" 
             :class="['message', (!msg.isAdmin) ? 'user-msg' : 'bot-msg']">
          <div v-if="msg.content">{{ msg.content }}</div>
          
          <img v-if="msg.imageUrl" :src="getChatImageUrl(msg.imageUrl)" class="w-100 rounded mt-2 cursor-pointer" @click="openImage(msg.imageUrl)">
          
          <div v-if="msg.product" class="mt-2 bg-light p-2 rounded text-dark border shadow-sm" style="min-width: 200px;">
            <img :src="getImageUrl(msg.product.imageUrl)" class="w-100 rounded mb-1" style="height: 100px; object-fit: contain;">
            <small class="fw-bold d-block text-truncate">{{ msg.product.name }}</small>
            <span class="text-danger fw-bold small">{{ formatPrice(msg.product.price) }} ₫</span>
            <router-link :to="`/product/${msg.product.id}`" class="btn btn-sm btn-outline-danger w-100 py-0 mt-1" style="font-size: 11px;">Xem chi tiết</router-link>
          </div>
        </div>
      </div>

      <div class="chat-footer align-items-center">
        <label class="btn btn-sm text-secondary p-0 me-2" style="cursor: pointer;">
          <i class="bi bi-image fs-5"></i>
          <input type="file" @change="sendImageAdmin" accept="image/*" style="display: none;">
        </label>
        <input type="text" v-model="adminInput" class="form-control" placeholder="Nhập tin nhắn..." @keypress.enter="sendMessageAdmin">
        <button class="btn-send" @click="sendMessageAdmin"><i class="bi bi-send-fill"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/index'; 

const router = useRouter();

const activeChat = ref<string | null>(null);
const hasNewMessage = ref(false);

const checkAuth = () => {
  return !!localStorage.getItem('user');
};

// ==========================================
// 1. LOGIC AI - LẤY DỮ LIỆU THẬT TỪ DATABASE
// ==========================================
const dbProducts = ref<any[]>([]); 
const aiInput = ref('');
const aiMessages = ref<any[]>([
  { role: 'bot', content: 'Chào anh/chị! Em là AI WatchShop. Để em gợi ý mẫu đồng hồ chuẩn nhất, anh/chị có thể cho em biết: Độ tuổi, Gu thời trang, hoặc Mức giá mong muốn không ạ? 🤖' }
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

const sendMessageAI = () => {
  if (!aiInput.value.trim()) return;
  const text = aiInput.value;
  aiMessages.value.push({ role: 'user', content: text });
  aiInput.value = '';

  setTimeout(() => {
    generateAIResponse(text.toLowerCase());
  }, 600);
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

  if (input.includes('nữ') || input.includes('bạn gái') || input.includes('vợ')) {
    reply = 'Để tặng phái đẹp thì các mẫu mặt nhỏ, đính đá là "chân ái" ạ. Chị xem thử nhé:';
    suggestedProduct = findProductByKeywords(['nữ', 'lady', 'women', 'nho', 'đá']);
  }
  else if (input.includes('nam') || input.includes('bạn trai') || input.includes('chồng')) {
    reply = 'Cho nam thì ưu tiên sự lịch lãm. Một chiếc dây da hoặc kim loại nam tính sẽ rất phù hợp:';
    suggestedProduct = findProductByKeywords(['nam', 'men', 'man', 'chronograph', 'cơ']);
  }
  else if (input.includes('rẻ') || input.includes('dưới 2 triệu') || input.includes('sinh viên')) {
    reply = 'Tầm giá sinh viên nhưng chất lượng cực đỉnh nhé. Em tìm được mẫu này:';
    suggestedProduct = findProductByKeywords(['casio', 'orient', 'nhựa', 'rẻ'], 2500000); 
  }
  else if (input.includes('cao cấp') || input.includes('sang trọng') || input.includes('doanh nhân')) {
    reply = 'Hàng cao cấp thiết kế cực kỳ tinh xảo. Mời anh/chị tham khảo:';
    suggestedProduct = findProductByKeywords(['sapphire', 'tissot', 'automatic', 'cao cấp', 'sang'], 999000000, 5000000);
  }
  else if (input.includes('thể thao') || input.includes('bơi') || input.includes('g-shock')) {
    reply = 'Gu thể thao thì cần chống nước và bền bỉ:';
    suggestedProduct = findProductByKeywords(['thể thao', 'sport', 'g-shock', 'chống nước', 'diver']);
  }
  else if (input.includes('bảo hành') || input.includes('sửa') || input.includes('thay pin')) {
    reply = 'WatchShop bảo hành bộ máy chính hãng. Hỗ trợ THAY PIN MIỄN PHÍ trọn đời ạ! 🛠️';
    suggestedProduct = null; 
  }
  else {
    reply = 'Dạ em hiểu rồi. Anh/chị xem thử mẫu đang HOT này nhé:';
    suggestedProduct = dbProducts.value.length > 0 ? dbProducts.value[Math.floor(Math.random() * dbProducts.value.length)] : null;
  }

  aiMessages.value.push({ role: 'bot', content: reply, product: suggestedProduct });
};


// ==========================================
// 2. LOGIC CHAT VỚI ADMIN
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
      alert("Vui lòng đăng nhập để chat!");
      router.push('/login');
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
        content: 'Hỗ trợ viên đang bận xử lý. Em là Trợ lý AI, anh/chị cần tư vấn loại đồng hồ nào ạ? 🤖' 
      });
    }
  }, INACTIVITY_LIMIT);
};

const sendMessageAdmin = async () => {
  if (!adminInput.value.trim() || !clientSessionId.value) return;
  const content = adminInput.value;
  adminInput.value = '';

  try {
    // TUYỆT CHIÊU CUỐI: Đẩy thẳng tham số lên URL (Query String)
    // Cách này ép Spring Boot nhận @RequestParam 100% mà không phụ thuộc vào Body
    await api.post('/chat/send', null, {
      params: {
        sessionId: clientSessionId.value,
        content: content
      }
    });
    
    fetchMessages();
    startAdminInactivityTimer(); 
  } catch(e) { 
    console.error("Lỗi gửi tin 400:", e); 
  }
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
// CÁC HÀM HỖ TRỢ XỬ LÝ ẢNH
// ==========================================
const formatPrice = (v: number) => {
  if (!v) return '0';
  return new Intl.NumberFormat('vi-VN').format(v);
};

// FIX LỖI: Đường dẫn ảnh sản phẩm
const getImageUrl = (url: string) => {
  if (!url) return 'https://placehold.co/100x100?text=No+Image';
  if (url.startsWith('http')) return url;
  return `http://localhost:8080/images/${url}`;
};

// FIX LỖI: Đường dẫn ảnh Chat Upload 
const getChatImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `http://localhost:8080/uploads/${url}`;
};

const openImage = (url: string) => window.open(getChatImageUrl(url));

watch([aiMessages, adminMessages], () => {
  nextTick(() => {
    if (aiScrollBody.value) aiScrollBody.value.scrollTop = aiScrollBody.value.scrollHeight;
    if (adminScrollBody.value) adminScrollBody.value.scrollTop = adminScrollBody.value.scrollHeight;
  });
}, { deep: true });

onUnmounted(() => { 
  if (pollInterval) clearInterval(pollInterval); 
  if (adminInactivityTimer) clearTimeout(adminInactivityTimer);
});
</script>

<style scoped>
.chat-floating-buttons { position: fixed; bottom: 30px; right: 30px; z-index: 10000; display: flex; flex-direction: column; align-items: flex-end; }
.btn-float { width: 55px; height: 55px; border-radius: 50%; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-size: 1.5rem; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
.btn-float:hover { transform: scale(1.1); }
.btn-ai { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.btn-admin { background-color: #1a1a1a; color: white; position: relative; }

.chat-box { position: fixed; bottom: 100px; right: 30px; width: 350px; height: 480px; background: #fff; border-radius: 12px; z-index: 10000; display: flex; flex-direction: column; overflow: hidden; animation: slideIn 0.3s ease-out; box-shadow: 0 5px 25px rgba(0,0,0,0.15); }
@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.chat-header { padding: 15px; display: flex; justify-content: space-between; align-items: center; }
.bg-gradient-ai { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.btn-close-chat { background: none; border: none; color: white; font-size: 1.2rem; }

.chat-body { flex: 1; padding: 15px; overflow-y: auto; background-color: #f8f9fa; display: flex; flex-direction: column; }
.message { max-width: 85%; padding: 10px 12px; border-radius: 15px; font-size: 0.85rem; line-height: 1.4; margin-bottom: 8px; }
.bot-msg { background: #fff; border: 1px solid #eee; color: #333; align-self: flex-start; border-bottom-left-radius: 2px; }
.user-msg { background: #d0021b; color: white; align-self: flex-end; border-bottom-right-radius: 2px; }

.chat-footer { padding: 10px; background: #fff; border-top: 1px solid #eee; display: flex; }
.chat-footer input { border-radius: 20px; font-size: 0.9rem; }
.btn-send { background: none; border: none; color: #d0021b; font-size: 1.2rem; padding: 0 10px; }
.cursor-pointer { cursor: pointer; }
</style>