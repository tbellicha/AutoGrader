import axios from 'axios';

const BASE_URL = 'http://localhost:8080/';
const TEACHER_ENDPOINT_PLACEHOLDER = '/api/teachers/:teacherId';
const ASSIGNMENT_ENDPOINT_PLACEHOLDER = '/api/course/:courseId/assignment';
const COURSE_INFORMATION_ENDPOINT_PLACEHOLER = '/api/course/:courseId';
const LIST_COURSE_STUDENT_ENDPOINT_PLACEHOLDER = '/api/course/:course_id/students';
const LIST_ALL_STUDENT_ENDPOINT_PLACEHOLDER = '/api/students';
const LIST_ALL_TEACHER_COURSES_PLACEHOLDER = '/api/teachers/:teacherId';
const ENROLL_ENDPOINT_PLACEHOLDER = '/api/course/:course_id/enroll';
const UPLOAD_TESTCASE_ENDPOINT_PLACEHOLDER = '/api/upload/:assignment_id/testcase';

const COURSE_CREATION_ENDPOINT = '/api/course';

export const enrollStudent = async (courseId: string, student_id: string, authToken: string): Promise<any> => {
  const ENDPOINT = ENROLL_ENDPOINT_PLACEHOLDER.replace(':course_id', courseId);
  const response = await axios.post(ENDPOINT, 
    {
      student_id: student_id
    }, 
    {
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      }
    }
  );
  return Promise.resolve(response);
}

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
  return Promise.resolve(response);
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
  return Promise.resolve(response);
}

export const getStudents = async (courseId: string, authToken: string): Promise<any> => {
  const ENDPOINT = LIST_COURSE_STUDENT_ENDPOINT_PLACEHOLDER.replace(':course_id', courseId);
  
  const response = await axios.get(ENDPOINT, 
    {
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      }
    }  
  );
  return Promise.resolve(response);
}

export const getAllStudents = async (authToken: string): Promise<any> => {
  const ENDPOINT = LIST_ALL_STUDENT_ENDPOINT_PLACEHOLDER;
  const response = await axios.get(ENDPOINT,
    {
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      }
    }
  );
  return Promise.resolve(response);
}

export const getAllCourses = async(teacherId: string, authToken: string): Promise<any> => {
  const ENDPOINT = LIST_ALL_TEACHER_COURSES_PLACEHOLDER.replace(':teacherId', teacherId);
  const response = await axios.get(ENDPOINT, 
    {
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      }
    }  
  );
  return Promise.resolve(response);
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
    return Promise.resolve(response);
};

export const uploadTestCase = async (assignmentId: string, formData: FormData, authToken: string): Promise<any> => {
  const ENDPOINT = UPLOAD_TESTCASE_ENDPOINT_PLACEHOLDER.replace(':assignment_id', assignmentId);
  const response = await axios.post(ENDPOINT, formData,
    {
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authToken}`
      }
    }  
  );
  return Promise.resolve(response);
} 