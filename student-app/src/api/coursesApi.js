import axiosClient from './axiosClient.js';

export const getMyCourses = () => axiosClient.get('/student/courses');
export const enrollInCourse = (courseId) =>
  axiosClient.post('/student/courses/enroll', { courseId });
