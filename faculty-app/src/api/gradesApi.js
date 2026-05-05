import axiosClient from './axiosClient.js';

export const getCourseGrades = (courseId) => axiosClient.get(`/faculty/grades/course/${courseId}`);
export const submitGrade = (data) => axiosClient.post('/faculty/grades', data);
