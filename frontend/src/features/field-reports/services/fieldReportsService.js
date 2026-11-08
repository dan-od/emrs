import { apiGet, apiPost, apiPut } from '@/services/api';
import { FIELD_REPORTS } from '@/services/endpoints';

export const fieldReportsService = {
  getAll: async (params) => {
    const qs = params && Object.keys(params).length ? `?${new URLSearchParams(params)}` : '';
    return apiGet(`${FIELD_REPORTS.BASE}${qs}`);
  },

  getById: async (id) => apiGet(FIELD_REPORTS.BY_ID(id)),

  getMy: async () => apiGet(FIELD_REPORTS.MY),

  getPending: async () => apiGet(FIELD_REPORTS.PENDING),

  getStats: async () => apiGet(FIELD_REPORTS.STATS),

  create: async (data) => apiPost(FIELD_REPORTS.BASE, data),

  update: async (id, data) => apiPut(FIELD_REPORTS.BY_ID(id), data),

  // POST /:id/review — { status: 'Reviewed'|'Approved'|'Rejected', review_comments }
  review: async (id, data) => apiPost(FIELD_REPORTS.REVIEW(id), data),

  approve: async (id, comments) => apiPost(FIELD_REPORTS.APPROVE(id), { comments }),

  reject: async (id, reason) => apiPost(FIELD_REPORTS.REJECT(id), { reason })
};
