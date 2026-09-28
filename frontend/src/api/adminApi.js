import axiosClient from './axiosClient';

export const adminApi = {
  getUsers: () => axiosClient.get('/admin/users'),
  deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),
  getAllProperties: (params = {}) => axiosClient.get('/admin/properties', { params }),
  approveProperty: (id) => axiosClient.patch(`/admin/properties/${id}/approve`),
  rejectProperty: (id) => axiosClient.patch(`/admin/properties/${id}/reject`),
  deleteProperty: (id) => axiosClient.delete(`/admin/properties/${id}`),
};
