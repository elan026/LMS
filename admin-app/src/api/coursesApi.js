import axiosClient from './axiosClient.js';

export const getCourses = () => axiosClient.get('/admin/courses');
export const getCourseById = (id) => axiosClient.get(`/admin/courses/${id}`);
export const createCourse = (data) => axiosClient.post('/admin/courses', data);
export const updateCourse = (id, data) => axiosClient.put(`/admin/courses/${id}`, data);
export const deleteCourse = (id) => axiosClient.delete(`/admin/courses/${id}`);
