import axios from 'axios';

const BASE_URL = 'http://localhost:8080/';
const TEACHER_ENDPOINT_PLACEHOLDER = '/api/teachers/:teacherId';
const ASSIGNMENT_ENDPOINT_PLACEHOLDER = '/api/course/${courseId}/assignment';

export const getTeacherCourses = async (teacherId: string, authToken: string): Promise<any> => {
  const ENDPOINT = TEACHER_ENDPOINT_PLACEHOLDER.replace(':teacherId', teacherId);

    const response = await axios.get(ENDPOINT, {
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      }
    });
    return Promise.resolve(response.data);
};

export const createAssignment = async (courseId: string, assignmentData: any, authToken: string): Promise<any> => {
  const ENDPOINT = ASSIGNMENT_ENDPOINT_PLACEHOLDER.replace(':courseId', courseId);

  const response = await axios.post(ENDPOINT, assignmentData, {
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    }
    });
    return Promise.resolve(response.data);
};