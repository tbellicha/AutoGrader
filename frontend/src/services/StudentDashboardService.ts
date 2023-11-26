import axios from "axios";

const BASE_URL = "http://localhost:8080/";
const STUDENT_ENDPOINT_PLACEHOLDER = '/api/students/:studentId';
const COURSE_ENDPOINT_PLACEHOLDER = '/api/course/:courseId';

export const getStudentInfo = async (studentId: string, authToken: string): Promise<any> => {
    const ENDPOINT = STUDENT_ENDPOINT_PLACEHOLDER.replace(':studentId', studentId);
    
    const response = await axios.get(ENDPOINT, {
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
        }
    });

    return Promise.resolve(response.data);
};

export const getCourseInfo = async (courseId: string, authToken: string): Promise<any> => {
    const ENDPOINT = COURSE_ENDPOINT_PLACEHOLDER.replace(':courseId', courseId);
    
    const response = await axios.get(ENDPOINT, {
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
        }
    });

    return Promise.resolve(response.data);
};