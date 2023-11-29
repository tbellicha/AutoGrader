import axios from 'axios';

const BASE_URL = 'http://localhost:8080/';
const ASSIGNMENT_SUBMISSION_ENDPOINT_PLACEHOLDER = '/api/upload/:assignment_id/assignment';

export const postSubmission = async (assignmentId: string, authToken: string, files: File[], onUploadProgress: (progressEvent: any) => void): Promise<any> => {
    const ENDPOINT = ASSIGNMENT_SUBMISSION_ENDPOINT_PLACEHOLDER.replace(':assignment_id', assignmentId);

    const formData = new FormData();

    files.forEach((file: File) => {
        formData.append('file', file);
    });

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