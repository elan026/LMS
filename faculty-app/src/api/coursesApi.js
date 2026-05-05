import axiosClient from './axiosClient.js';

export const getMyCourses = () => axiosClient.get('/faculty/courses');
