import axiosClient from './axiosClient.js';

export const getProfile = () => axiosClient.get('/me');
export const updateProfile = (data) => axiosClient.put('/me', data);
