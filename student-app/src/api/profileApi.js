import axiosClient from './axiosClient.js';

export const getProfile = (id) => axiosClient.get(`/users/${id}`);
export const updateProfile = (data) => axiosClient.put('/me', data);
