import axiosClient from './axiosClient';

export const propertyApi = {
  getProperties: (params = {}) => axiosClient.get('/properties', { params }),
  getPropertyById: (id) => axiosClient.get(`/properties/${id}`),
  createProperty: (data) => axiosClient.post('/properties', data),
  updateProperty: (id, data) => axiosClient.put(`/properties/${id}`, data),
  deleteProperty: (id) => axiosClient.delete(`/properties/${id}`),
  getMyListings: (params = {}) => axiosClient.get('/properties/my-listings', { params }),
  uploadImage: (formData) => axiosClient.post('/properties/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
