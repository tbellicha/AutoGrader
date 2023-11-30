import axios from 'axios';

const BASE_URL = 'http://localhost:8080/';
const TEACHER_ENDPOINT_PLACEHOLDER = '/api/teachers/:teacherId';
const ASSIGNMENT_ENDPOINT_PLACEHOLDER = '/api/course/${courseId}/assignment';
const COURSE_INFORMATION_ENDPOINT_PLACEHOLER = '/api/course/:courseId/assignments'

const COURSE_CREATION_ENDPOINT = '/api/course';

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

export const createCourse = async (courseName: string, courseCode: string, teacherId: string, authToken: string): Promise<any> => {
  const response = await axios.post(COURSE_CREATION_ENDPOINT, 
    {
      course_name: courseName,
      course_code: courseCode,
      teacher_id: teacherId,
    },
    {
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      }
    }
  );
  return response;
}

export const getAssignments = async (courseId: string, authToken: string): Promise<any> => {
  const ENDPOINT = COURSE_INFORMATION_ENDPOINT_PLACEHOLER.replace(':courseId', courseId);
  
  const response = await axios.get(ENDPOINT, 
    {
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      }
    }
  );
  return response;
}

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