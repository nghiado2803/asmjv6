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
          {{ msg.content }}
        </div>
      </div>
      <div class="chat-footer">
        <input type="text" v-model="aiInput" class="form-control" placeholder="Hỏi AI..." @keypress.enter="sendMessageAI">
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
             :class="['message', (msg.role === 'USER' || msg.role === 'ROLE_USER') ? 'user-msg' : 'bot-msg']">
          <div v-if="msg.content">{{ msg.content }}</div>
          <img v-if="msg.imageUrl" :src="`/images/${msg.imageUrl}`" class="w-100 rounded mt-2 cursor-pointer" @click="openImage(msg.imageUrl)">
          
          <div v-if="msg.product" class="mt-2 bg-light p-2 rounded text-dark border shadow-sm" style="min-width: 200px;">
            <img :src="`/images/${msg.product.imageUrl}`" class="w-100 rounded mb-1" style="height: 100px; object-fit: contain;">
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
import { ref, onUnmounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Trạng thái
const activeChat = ref<string | null>(null);
const isAuthenticated = ref(false); // Thay bằng logic auth thật của nhóm
const hasNewMessage = ref(false);

// Chat AI
const aiInput = ref('');
const aiMessages = ref([{ role: 'bot', content: 'Xin chào! Tôi là AI của WatchShop. Tôi có thể giúp gì cho bạn? 🤖' }]);
const aiScrollBody = ref<HTMLElement | null>(null);

// Chat Admin
const adminInput = ref('');
const adminMessages = ref<any[]>([]);
const clientSessionId = ref<number | null>(null);
const adminScrollBody = ref<HTMLElement | null>(null);
let pollInterval: any = null;

// Logic Đóng/Mở
const toggleChat = (type: string) => {
  if (type === 'admin') {
    if (!isAuthenticated.value) {
      router.push('/login'); // Chuyển thẳng sang login
      return;
    }
    activeChat.value = activeChat.value === 'admin' ? null : 'admin';
    if (activeChat.value === 'admin') initAdminChat();
  } else {
    activeChat.value = activeChat.value === 'ai' ? null : 'ai';
  }
};

// --- XỬ LÝ AI ---
const sendMessageAI = () => {
  if (!aiInput.value.trim()) return;
  aiMessages.value.push({ role: 'user', content: aiInput.value });
  const text = aiInput.value.toLowerCase();
  aiInput.value = '';

  setTimeout(() => {
    let reply = 'Dạ em chưa rõ, bạn hỏi về giá hay bảo hành ạ?';
    if (text.includes('giá')) reply = 'Dạ, shop có nhiều mẫu từ 2 triệu đến 500 triệu ạ.';
    if (text.includes('bảo hành')) reply = 'Bảo hành 5 năm chính hãng cho mọi sản phẩm ạ.';
    aiMessages.value.push({ role: 'bot', content: reply });
  }, 800);
};

// --- XỬ LÝ ADMIN (FETCH API) ---
const initAdminChat = async () => {
  try {
    const res = await fetch('/api/chat/my-messages');
    if (res.ok) {
      const data = await res.json();
      clientSessionId.value = data.sessionId;
      adminMessages.value = data.messages;
      startPolling();
    } else {
      const startRes = await fetch('/api/chat/start', { method: 'POST' });
      const startData = await startRes.json();
      clientSessionId.value = startData.id;
    }
  } catch (e) { console.error("API Chat lỗi"); }
};

const sendMessageAdmin = async () => {
  if (!adminInput.value.trim() || !clientSessionId.value) return;
  const content = adminInput.value;
  adminInput.value = '';
  await fetch('/api/chat/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ sessionId: clientSessionId.value.toString(), content })
  });
  fetchMessages();
};

const sendImageAdmin = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  
  // Kiểm tra kỹ đầu vào để đảm bảo target.files tồn tại
  if (!target || !target.files || target.files.length === 0 || !clientSessionId.value) {
    return;
  }

  // Dấu ! ở cuối giúp ép kiểu, bắt TypeScript phải chấp nhận đây là File (không phải undefined)
  const file: File = target.files[0]!; 
  
  const formData = new FormData();
  formData.append('sessionId', clientSessionId.value.toString());
  formData.append('file', file);

  try {
    const res = await fetch('/api/chat/upload', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      target.value = ''; // Reset input để có thể chọn lại cùng 1 file
      await fetchMessages(); 
    }
  } catch (err) {
    console.error("Lỗi gửi ảnh:", err);
  }
};

const fetchMessages = async () => {
  if (!clientSessionId.value) return;
  const res = await fetch(`/api/chat/messages/${clientSessionId.value}`);
  adminMessages.value = await res.json();
};

const startPolling = () => {
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(fetchMessages, 4000);
};

// Helpers
const formatPrice = (v: number) => new Intl.NumberFormat('vi-VN').format(v);
const openImage = (url: string) => window.open(`/images/${url}`);

watch([aiMessages, adminMessages], () => {
  nextTick(() => {
    if (aiScrollBody.value) aiScrollBody.value.scrollTop = aiScrollBody.value.scrollHeight;
    if (adminScrollBody.value) adminScrollBody.value.scrollTop = adminScrollBody.value.scrollHeight;
  });
}, { deep: true });

onUnmounted(() => { if (pollInterval) clearInterval(pollInterval); });
</script>

<style scoped>
/* CSS NGUYÊN BẢN TỪ FILE HTML */
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