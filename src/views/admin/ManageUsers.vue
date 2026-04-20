<template>
  <div class="admin-users-page p-4 p-md-5">
    
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div class="d-flex align-items-center">
        <div class="title-accent me-3"></div>
        <h3 class="luxury-font fw-bold mb-0 text-uppercase letter-spacing-1 text-dark">Quản lý hồ sơ</h3>
      </div>
      <button class="btn btn-gold fw-bold shadow-sm rounded-1 px-4 py-2 text-uppercase letter-spacing-1" @click="openModal(null)">
        <i class="bi bi-person-plus-fill me-2"></i>Thêm Hồ Sơ
      </button>
    </div>

    <div class="card border-gold-subtle shadow-sm rounded-1 overflow-hidden bg-white">
      <div class="table-responsive">
        <table class="table luxury-table align-middle mb-0">
          <thead>
            <tr>
              <th class="ps-4 py-3 text-uppercase letter-spacing-1">Khách hàng</th>
              <th class="py-3 text-uppercase letter-spacing-1">Thông tin liên lạc</th>
              <th class="py-3 text-uppercase letter-spacing-1">Phân quyền</th>
              <th class="py-3 text-uppercase letter-spacing-1">Trạng thái</th>
              <th class="text-end pe-4 py-3 text-uppercase letter-spacing-1">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id!" class="table-row-hover">
              
              <td class="ps-4 py-3">
                <div class="d-flex align-items-center">
                  <div class="avatar-luxury d-flex align-items-center justify-content-center shadow-sm">
                    {{ getInitial(user.fullName) }}
                  </div>
                  <div class="ms-3">
                    <h6 class="fw-bold mb-1 text-dark luxury-font fs-6">{{ user.fullName }}</h6>
                    <div class="d-flex align-items-center gap-2">
                      <small class="text-muted text-uppercase letter-spacing-1" style="font-size: 11px;">ID: <strong class="text-dark">#{{ user.id }}</strong></small>
                      <span v-if="isGoogleAccount(user)" class="badge bg-light text-danger border border-danger-subtle ms-1" style="font-size: 9px; letter-spacing: 0;">
                        <i class="bi bi-google me-1"></i>GMAIL
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              
              <td class="py-3">
                <div class="d-flex flex-column gap-1">
                  <span class="text-dark small fw-medium"><i class="bi bi-envelope-fill me-2 gold-text"></i>{{ user.email }}</span>
                  <span class="text-muted small"><i class="bi bi-telephone-fill me-2 gold-text opacity-75"></i>{{ user.phoneNumber || 'Chưa cập nhật' }}</span>
                </div>
              </td>
              
              <td class="py-3">
                <span :class="isAdmin(user) ? 'role-badge badge-admin' : 'role-badge badge-user'">
                  {{ isAdmin(user) ? 'Quản Trị' : 'Thành Viên' }}
                </span>
              </td>
              
              <td class="py-3">
                <span v-if="user.enabled" class="status-badge status-active">
                  <i class="bi bi-check2-circle me-1"></i>Hoạt động
                </span>
                <span v-else class="status-badge status-locked">
                  <i class="bi bi-lock-fill me-1"></i>Đang khóa
                </span>
              </td>
              
              <td class="text-end pe-4 py-3">
                <div class="btn-group shadow-sm">
                  <button @click="openModal(user)" class="btn btn-sm btn-light border-gold-subtle text-dark action-btn" title="Cập nhật hồ sơ">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  
                  <button @click="user.id && toggleStatus(user)" 
                          class="btn btn-sm action-btn border-gold-subtle" 
                          :class="[
                            user.enabled ? 'btn-light text-danger hover-danger' : 'btn-dark text-white',
                            { 'opacity-50 cursor-not-allowed': isAdmin(user) }
                          ]" 
                          :disabled="isAdmin(user)"
                          :title="isAdmin(user) ? 'Không thể khóa Quản trị viên' : (user.enabled ? 'Khóa tài khoản' : 'Mở khóa')">
                    <i :class="user.enabled ? 'bi bi-lock-fill' : 'bi bi-unlock-fill'"></i>
                  </button>
                </div>
              </td>

            </tr>
            <tr v-if="users.length === 0">
              <td colspan="5" class="text-center py-5 text-muted fst-italic">Hệ thống đang tải danh sách hồ sơ...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.6); z-index: 1050; backdrop-filter: blur(2px);">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 rounded-1 shadow-lg luxury-modal">
          
          <div class="modal-header border-bottom border-gold-subtle bg-light px-4 py-3">
            <h5 class="modal-title luxury-font fw-bold text-uppercase letter-spacing-1 text-dark">
              <i class="bi bi-person-lines-fill gold-text me-2"></i>{{ form.id ? 'Cập nhật hồ sơ' : 'Khởi tạo hồ sơ mới' }}
            </h5>
            <button type="button" class="btn-close shadow-none" @click="showModal = false"></button>
          </div>
          
          <div class="modal-body p-4 p-md-5">
            <form @submit.prevent="handleSave">
              <div class="row g-4">
                
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Họ và tên</label>
                  <input type="text" v-model="form.fullName" class="form-control custom-input" placeholder="Nhập đầy đủ họ tên..." required>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Số điện thoại</label>
                  <input type="text" v-model="form.phoneNumber" class="form-control custom-input" placeholder="09xx...">
                </div>
                
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Định danh Email</label>
                  <input type="email" v-model="form.email" class="form-control custom-input" placeholder="email@domain.com" :readonly="form.id !== null" required>
                </div>               
                <div class="col-md-12">
                  <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Địa chỉ liên hệ</label>
                  <input type="text" v-model="form.address" class="form-control custom-input" placeholder="Số nhà, đường, quận/huyện...">
                </div>

                <div class="col-md-12 mt-4 pt-3 border-top border-gold-subtle">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Phân quyền hệ thống</label>
                      <select v-model="form.role" class="form-select custom-input fw-bold" :disabled="isAdmin(form) && form.id !== null">
                        <option value="ROLE_USER">Khách hàng / Thành viên (USER)</option>
                        <option value="ROLE_ADMIN">Quản trị viên hệ thống (ADMIN)</option>
                      </select>
                      <small v-if="isAdmin(form) && form.id !== null" class="text-danger d-block mt-1 fst-italic" style="font-size: 11px;">* Không thể hạ cấp Quản trị viên hiện tại.</small>
                    </div>
                    
                    <div class="col-md-6 d-flex flex-column justify-content-center">
                      <label class="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Trạng thái hồ sơ</label>
                      <div class="form-check form-switch mt-1">
                        <input class="form-check-input custom-switch" type="checkbox" v-model="form.enabled" id="u_enabled" :disabled="isAdmin(form)">
                        <label class="form-check-label fw-bold ms-2" for="u_enabled" :class="form.enabled ? 'text-success' : 'text-danger'">
                          {{ form.enabled ? 'Cho phép hoạt động' : 'Tạm khóa truy cập' }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
              <div class="mt-5 d-flex justify-content-end gap-3">
                <button type="button" class="btn btn-outline-secondary rounded-1 px-4 py-2 fw-bold text-uppercase letter-spacing-1" @click="showModal = false">Hủy bỏ</button>
                <button type="submit" class="btn btn-gold rounded-1 fw-bold px-5 py-2 shadow-sm text-uppercase letter-spacing-1" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-shield-check me-2"></i> Lưu hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import api from '@/api/index';
import Swal from 'sweetalert2'; // CHỈ THÊM DÒNG NÀY

// CẤU HÌNH POPUP LUXURY
const LuxuryAlert = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-gold rounded-1 fw-bold px-4 py-2 shadow-sm text-uppercase letter-spacing-1',
    cancelButton: 'btn btn-outline-secondary rounded-1 fw-bold px-4 py-2 ms-2 text-uppercase letter-spacing-1'
  },
  buttonsStyling: false
});

// Định nghĩa Interface chuẩn
interface User {
  id: number | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  address: string;
  role: string;
  enabled: boolean;
}

// Biến trạng thái
const users = ref<User[]>([]);
const showModal = ref(false);
const isLoading = ref(false);

const form = reactive<User>({
  id: null,
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  address: '',
  role: 'ROLE_USER',
  enabled: true
});

// Hàm tiện ích: Lấy chữ cái đầu làm Avatar
const getInitial = (name: string | null | undefined) => {
  if (name && name.length > 0) return name.charAt(0).toUpperCase();
  return 'U';
};

// Hàm kiểm tra: Có phải Admin không?
const isAdmin = (user: User) => {
  return user.role === 'ROLE_ADMIN' || user.role === 'ADMIN';
};

// Hàm kiểm tra: Có phải tài khoản Gmail không? (Dựa vào đuôi email và không có mật khẩu)
const isGoogleAccount = (user: User) => {
  return user.email.endsWith('@gmail.com') && !user.password;
};

// Fetch danh sách User từ API
const fetchUsers = async () => {
  try {
    const res = await api.get<User[]>('/admin/users');
    users.value = res.data;
  } catch (e) {
    console.error("Không thể load danh sách user");
  }
};

onMounted(fetchUsers);

// Mở Modal (truyền user nếu là cập nhật, truyền null nếu thêm mới)
const openModal = (user: User | null = null) => {
  if (user) {
    Object.assign(form, user, { password: '' });
  } else {
    Object.assign(form, { id: null, fullName: '', email: '', phoneNumber: '', password: '', address: '', role: 'ROLE_USER', enabled: true });
  }
  showModal.value = true;
};

// Xử lý Lưu dữ liệu
const handleSave = async () => {
  if (!form.fullName || !form.email) {
    // SỬA ALERT 1
    LuxuryAlert.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng điền đầy đủ Họ tên và Email!' });
    return;
  }

  // Nếu là THÊM MỚI (id === null) và không phải thêm tài khoản Google, bắt buộc xử lý mật khẩu
  if (!form.id && (!form.password || form.password.trim().length < 6) && !isGoogleAccount(form)) {
    // SỬA CONFIRM 1
    const result = await LuxuryAlert.fire({
      icon: 'question',
      title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Xác nhận bảo mật</h4>',
      text: "Mật khẩu đang trống hoặc quá ngắn. Hệ thống sẽ gán mật khẩu mặc định là '123456'. Tiếp tục?",
      showCancelButton: true,
      confirmButtonText: 'Tiếp tục',
      cancelButtonText: 'Hủy bỏ'
    });
    if (!result.isConfirmed) return;
    form.password = '123456';
  }

  isLoading.value = true;
  try {
    await api.post('/admin/users/save', form);
    
    showModal.value = false;
    await fetchUsers(); // Tải lại danh sách
    form.password = ''; // Xóa pass rác trong form
    
    // Thêm Toast báo lưu thành công
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Lưu hồ sơ thành công!', showConfirmButton: false, timer: 2000 });
  } catch (e: any) {
    const msg = e.response?.data?.message || "Lỗi hệ thống khi lưu hồ sơ!";
    // SỬA ALERT 2
    LuxuryAlert.fire({ icon: 'error', title: 'Lỗi', text: msg });
  } finally {
    isLoading.value = false;
  }
};

// Xử lý Cập nhật trạng thái Khóa / Mở khóa
const toggleStatus = async (user: User) => {
  if (isAdmin(user)) {
    // SỬA ALERT 3
    LuxuryAlert.fire({ icon: 'error', title: 'Cảnh báo bảo mật', text: 'Tuyệt đối không được phép khóa tài khoản Quản trị viên!' });
    return;
  }

  const actionText = user.enabled ? 'KHÓA TRUY CẬP' : 'MỞ KHÓA';
  const actionColor = user.enabled ? '#cc0000' : '#1a661a';

  // SỬA CONFIRM 2
  const result = await LuxuryAlert.fire({
    icon: 'warning',
    title: '<h4 class="luxury-font fw-bold mb-0 text-dark">Xác nhận thao tác</h4>',
    html: `Xác nhận <strong style="color: ${actionColor};">${actionText}</strong> đối với tài khoản <b>${user.email}</b>?`,
    showCancelButton: true,
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Hủy bỏ'
  });

  if (result.isConfirmed) {
    try {
      // Gửi request lên Backend để đảo trạng thái (Backend tự đổi enabled = !enabled)
      await api.get(`/admin/users/toggle-status/${user.id}`);
      await fetchUsers();
      // Toast báo thành công
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Cập nhật trạng thái thành công!', showConfirmButton: false, timer: 2000 });
    } catch (e) {
      // SỬA ALERT 4
      LuxuryAlert.fire({ icon: 'error', title: 'Lỗi', text: 'Lỗi thao tác khi cập nhật trạng thái!' });
    }
  }
};
</script>

<style scoped>
/* ==========================================
   GIAO DIỆN LUXURY ADMIN USERS (Giữ nguyên)
========================================== */
.admin-users-page { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; min-height: 100vh; }
.luxury-font { font-family: 'Montserrat', sans-serif; }
.letter-spacing-1 { letter-spacing: 1px; }

/* Colors & Basics */
.gold-text { color: #B38728 !important; }
.border-gold-subtle { border-color: #eaeaea !important; }
.title-accent { width: 4px; height: 28px; background: linear-gradient(to bottom, #D4AF37, #B38728); }

/* Bảng Dữ liệu (Table) */
.luxury-table { margin-bottom: 0; }
.luxury-table thead { background-color: #fafafa; border-bottom: 1px solid #eaeaea; }
.luxury-table th { 
  font-size: 11px; color: #888; font-weight: 700; 
  padding: 15px 10px; border-bottom: none;
}
.luxury-table td { padding: 15px 10px; color: #444; border-bottom: 1px solid #f9f9f9; vertical-align: middle; }
.table-row-hover { transition: all 0.2s ease; background-color: #fff; }
.table-row-hover:hover { background-color: #fdfbf7; }

/* Avatar Khách hàng */
.avatar-luxury {
  width: 45px; height: 45px;
  background: linear-gradient(135deg, #111, #333);
  color: #D4AF37;
  border: 1px solid #D4AF37;
  border-radius: 2px;
  font-size: 18px;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
}

/* Badges (Vai trò & Trạng thái) */
.role-badge {
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
  padding: 5px 10px; border-radius: 2px; border: 1px solid transparent;
}
.badge-admin { background: #111; color: #D4AF37; border-color: #D4AF37; }
.badge-user { background: #fafafa; color: #666; border-color: #eaeaea; }

.status-badge {
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
}
.status-active { color: #1a661a; }
.status-locked { color: #cc0000; }

/* Cột Hành động (Action Buttons) */
.action-btn { border-radius: 0; padding: 4px 10px; background: #fff; transition: 0.3s; }
.action-btn:hover:not(:disabled) { background: #fdfbf7; border-color: #D4AF37; color: #D4AF37 !important; }
.hover-danger:hover:not(:disabled) { background: #fff5f5; border-color: #8b0000; color: #8b0000 !important; }
.cursor-not-allowed { cursor: not-allowed !important; }

/* ==========================================
   MODAL & FORMS
========================================== */
.custom-input { 
  border: 1px solid #e0e0e0; border-radius: 2px; 
  padding: 10px 15px; font-size: 14px; background: #fafafa; 
  transition: all 0.3s; box-shadow: none; color: #333;
}
.custom-input:focus { border-color: #D4AF37; background: #fff; box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); outline: none; }
.custom-input:disabled, .custom-input[readonly] { background: #f0f0f0; color: #888; border-color: #eee; cursor: not-allowed; }

/* Toggle Switch (Nút gạt trạng thái) */
.custom-switch { width: 3em !important; height: 1.5em !important; cursor: pointer; }
.custom-switch:checked { background-color: #1a661a; border-color: #1a661a; }
.custom-switch:focus { box-shadow: 0 0 0 0.25rem rgba(26, 102, 26, 0.2); }
.custom-switch:disabled { cursor: not-allowed; opacity: 0.5; }

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
</style>