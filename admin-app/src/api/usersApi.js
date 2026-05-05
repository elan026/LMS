import axiosClient from './axiosClient.js';

export const getUsers = (params) => axiosClient.get('/admin/users', { params });
export const getUserById = (id) => axiosClient.get(`/admin/users/${id}`);
export const deleteUser = (id) => axiosClient.delete(`/admin/users/${id}`);
