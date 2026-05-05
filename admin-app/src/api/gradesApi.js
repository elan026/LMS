import axiosClient from './axiosClient.js';

export const getAllGrades = () => axiosClient.get('/admin/grades');
export const getGradeReports = () => axiosClient.get('/admin/reports/grades');
export const getEnrollmentReports = () => axiosClient.get('/admin/reports/enrollments');
