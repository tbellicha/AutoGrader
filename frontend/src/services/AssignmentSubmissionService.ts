import axios from 'axios';

const BASE_URL = 'http://localhost:8080/';
const UPLOAD_ENDPOINT_PLACEHOLDER = '/api/upload/:assignment_id/assignment';
const SUBMISSIONS_ENDPOINT = '/api/assignment/:assignment_id/submission';

export const postAssignment = async (assignmentId: string, authToken: string, file: File, onUploadProgress: (progressEvent: any) => void): Promise<any> => {
    const ENDPOINT = UPLOAD_ENDPOINT_PLACEHOLDER.replace(':assignment_id', assignmentId);

    const formData = new FormData();

    formData.append('file', file);

    const response = await axios.post(ENDPOINT, formData, {
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`
        },
        onUploadProgress
    });

    return Promise.resolve(response.data);
};

export const postSubmission = async (assignmentId: string, authToken: string): Promise<any> => {
    const ENDPOINT = SUBMISSIONS_ENDPOINT.replace(':assignment_id', assignmentId);

    const response = await axios.post(ENDPOINT, {}, {
        baseURL: BASE_URL,
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${authToken}`
        }
    });
    
    return Promise.resolve(response.data);
};