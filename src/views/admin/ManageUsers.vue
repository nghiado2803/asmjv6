<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-dark">Quản lý người dùng</h3>
      <button class="btn btn-success fw-bold shadow-sm rounded-pill px-4" @click="openModal(null)">
        <i class="bi bi-person-plus-fill me-2"></i>Thêm User
      </button>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light text-secondary">
            <tr>
              <th class="ps-4 py-3">Người dùng</th>
              <th class="py-3">Liên hệ</th>
              <th class="py-3">Vai trò</th>
              <th class="py-3">Trạng thái</th>
              <th class="text-end pe-4 py-3">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id!">
              <td class="ps-4">
                <div class="d-flex align-items-center">
                  <div class="bg-gradient bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 40px; height: 40px;">
                    {{ getInitial(user.fullName) }}
                  </div>
                  <div class="ms-3">
                    <h6 class="fw-bold mb-0 text-dark">{{ user.fullName }}</h6>
                    <small class="text-muted">ID: #{{ user.id }}</small>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-dark small"><i class="bi bi-envelope-fill me-2 text-warning"></i>{{ user.email }}</span>
                  <span class="text-muted small"><i class="bi bi-telephone-fill me-2 text-success"></i>{{ user.phoneNumber || '---' }}</span>
                </div>
              </td>
              <td>
                <span :class="user.role === 'ROLE_ADMIN' ? 'badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-10' : 'badge bg-info bg-opacity-10 text-info border border-info border-opacity-10'">
                  {{ user.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER' }}
                </span>
              </td>
              <td>
                <span v-if="user.enabled" class="badge bg-success bg-opacity-10 text-success rounded-pill px-3">
                  <i class="bi bi-check-circle-fill me-1"></i>Hoạt động
                </span>
                <span v-else class="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 border border-warning">
                  <i class="bi bi-hourglass-split me-1"></i>Chờ duyệt / Khóa
                </span>
              </td>
              <td class="text-end pe-4">
                <button @click="openModal(user)" class="btn btn-sm btn-light text-primary shadow-sm rounded-circle me-1" title="Sửa thông tin">
                  <i class="bi bi-pencil-fill"></i>
                </button>
                
                <button @click="user.id && toggleStatus(user)" 
                        class="btn btn-sm shadow-sm rounded-circle" 
                        :class="[
                          user.enabled ? 'btn-light text-danger' : 'btn-primary text-white',
                          { 'opacity-50 cursor-not-allowed': user.role === 'ROLE_ADMIN' }
                        ]" 
                        :disabled="user.role === 'ROLE_ADMIN'"
                        :title="user.role === 'ROLE_ADMIN' ? 'Không thể khóa Admin' : (user.enabled ? 'Khóa tài khoản' : 'Duyệt / Mở khóa')">
                  <i :class="user.enabled ? 'bi bi-lock-fill' : 'bi bi-check-lg'"></i>
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="5" class="text-center py-5 text-muted">Đang tải danh sách người dùng...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5); z-index: 1050;">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold text-primary">{{ form.id ? 'Cập nhật người dùng' : 'Thông tin người dùng' }}</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="handleSave">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">Họ và tên</label>
                  <input type="text" v-model="form.fullName" class="form-control" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">Số điện thoại</label>
                  <input type="text" v-model="form.phoneNumber" class="form-control">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">Email (Tên đăng nhập)</label>
                  <input type="email" v-model="form.email" class="form-control" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">Mật khẩu</label>
                  <input type="password" v-model="form.password" class="form-control" placeholder="Để trống nếu không đổi">
                  <small class="text-muted" style="font-size: 0.75rem;">* Chỉ nhập khi tạo mới hoặc muốn đổi pass</small>
                </div>
                <div class="col-md-12">
                  <label class="form-label small fw-bold text-muted">Địa chỉ</label>
                  <input type="text" v-model="form.address" class="form-control">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">Vai trò</label>
                  <select v-model="form.role" class="form-select" :disabled="form.role === 'ROLE_ADMIN' && form.id !== null">
                    <option value="ROLE_USER">Người dùng (USER)</option>
                    <option value="ROLE_ADMIN">Quản trị viên (ADMIN)</option>
                  </select>
                  <small v-if="form.role === 'ROLE_ADMIN' && form.id !== null" class="text-danger" style="font-size: 0.75rem;">* Không thể hạ cấp Admin hiện tại</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">Trạng thái</label>
                  <div class="form-check form-switch mt-2">
                    <input class="form-check-input" type="checkbox" v-model="form.enabled" id="u_enabled" :disabled="form.role === 'ROLE_ADMIN'">
                    <label class="form-check-label" for="u_enabled">Cho phép hoạt động</label>
                  </div>
                </div>
              </div>
              <div class="d-grid mt-4">
                <button type="submit" class="btn btn-primary rounded-pill fw-bold py-2 shadow-sm" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-save me-2"></i> Lưu thông tin
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

interface User {
  id: number | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  address: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  enabled: boolean;
}

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

const getInitial = (name: string | null | undefined) => {
  if (name && name.length > 0) {
    return name.charAt(0).toUpperCase();
  }
  return 'U';
};

const fetchUsers = async () => {
  try {
    const res = await api.get<User[]>('/admin/users');
    users.value = res.data;
  } catch (e) {
    console.error("Không thể load danh sách user");
  }
};

onMounted(fetchUsers);

const openModal = (user: User | null = null) => {
  if (user) {
    Object.assign(form, user, { password: '' });
  } else {
    Object.assign(form, { id: null, fullName: '', email: '', phoneNumber: '', password: '', address: '', role: 'ROLE_USER', enabled: true });
  }
  showModal.value = true;
};

const handleSave = async () => {
  isLoading.value = true;
  try {
    await api.post('/admin/users/save', form);
    showModal.value = false;
    await fetchUsers();
  } catch (e) {
    alert("Lỗi khi lưu người dùng!");
  } finally {
    isLoading.value = false;
  }
};

const toggleStatus = async (user: User) => {
  // [LOGIC BẢO VỆ CHỐT HẠ BÊN TRONG HÀM]: Chặn đứng mọi hành vi cố tình gọi hàm nếu là ADMIN
  if (user.role === 'ROLE_ADMIN') {
    alert("Hành động bị từ chối: Tuyệt đối không được phép khóa Quản trị viên (Admin)!");
    return;
  }

  if (confirm(`Xác nhận thay đổi trạng thái user này?`)) {
    try {
      await api.get(`/admin/users/toggle-status/${user.id}`);
      await fetchUsers();
    } catch (e) {
      alert("Lỗi thao tác!");
    }
  }
};
</script>

<style scoped>
.cursor-not-allowed {
  cursor: not-allowed !important;
}
</style>