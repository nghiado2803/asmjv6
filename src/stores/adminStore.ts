import { defineStore } from 'pinia';
import api from '@/api/index';
import type { AdminStats, Order, User } from '@/types/admin';
import Swal from 'sweetalert2';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    stats: {} as AdminStats,
    orders: [] as Order[],
    users: [] as User[],
    isLoading: false as boolean
  }),

  actions: {
    async fetchDashboard(): Promise<void> {
      this.isLoading = true;
      try {
        const res = await api.get<AdminStats>('/admin/dashboard-stats');
        this.stats = res.data;
      } catch (error) {
        console.error("Lỗi fetch dashboard:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async updateOrderStatus(orderId: number, status: string): Promise<void> {
      try {
        await api.post('/admin/orders/update-status', { orderId, status });
        // Sau khi update thành công, refresh lại data
        await this.fetchDashboard();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể cập nhật trạng thái đơn hàng',
          confirmButtonText: 'Đóng',
          customClass: {
            confirmButton: 'btn btn-gold rounded-1 fw-bold px-4 py-2 shadow-sm text-uppercase letter-spacing-1'
          },
          buttonsStyling: false
        });
      }
    }
  }
});