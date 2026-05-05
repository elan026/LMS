import axiosClient from './axiosClient.js';

export const getAssignmentsForCourse = (courseId) =>
  axiosClient.get(`/faculty/assignments/course/${courseId}`);

export const createAssignment = (data) => axiosClient.post('/faculty/assignments', data);
