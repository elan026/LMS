import axiosClient from './axiosClient.js';

export const getMyEnrollments = () => axiosClient.get('/student/enrollments');