import axiosClient from './axiosClient.js';

export const getMyGrades = () => axiosClient.get('/student/grades');
