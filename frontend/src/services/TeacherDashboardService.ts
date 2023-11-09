
import axios from 'axios';

export const fetchCourses = () => axios.get('/api/courses');
export const fetchAssignments = () => axios.get('/api/assignments');
export const fetchEnrollments = () => axios.get('/api/enrollments');

export const createCourse = (data: any) => axios.post('/api/course/create', data);
export const createAssignment = (courseId: number, data: any) =>
  axios.post(`/api/course/${courseId}/assignment/create`, data);
export const enrollStudent = (courseId: number, data: any) =>
  axios.post(`/api/course/${courseId}/enroll`, data);
