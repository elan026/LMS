import axiosClient from './axiosClient.js';

export const getCourseEnrollments = (courseId) =>
  axiosClient.get(`/faculty/enrollments/course/${courseId}`);
