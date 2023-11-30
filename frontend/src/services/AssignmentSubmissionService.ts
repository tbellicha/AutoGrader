import axios from 'axios';

const BASE_URL = 'http://localhost:8080/';
const UPLOAD_ENDPOINT_PLACEHOLDER = '/api/upload/:assignment_id/assignment';
const SUBMISSIONS_ENDPOINT = '/api/assignment/:assignment_id/submission';

export const uploadAssignment = async (
    assignmentId: string,
    authToken: string,
    files: File[]
): Promise<any> => {
    try {
        const uploadEndpoint = UPLOAD_ENDPOINT_PLACEHOLDER.replace(':assignment_id', assignmentId);
        const submissionEndpoint = SUBMISSIONS_ENDPOINT.replace(':assignment_id', assignmentId);

        const formData = new FormData();

        // guard against empty files array
        if (files.length === 0) {
            return Promise.reject('No files selected');
        }

        // add files to form data
        files.forEach(file => {
            formData.append('file', file);
        });

        // upload files
        const uploadResponse = await axios.post(
            uploadEndpoint,
            formData,
            {
                baseURL: BASE_URL,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );

        console.log(`Upload Response: ${uploadResponse.data}`);

        // post submission
        const submissionResponse = await axios.post(
            submissionEndpoint,
            {

            },
            {
                baseURL: BASE_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );

        console.log('Submission Response:', submissionResponse.data);

        return Promise.resolve(submissionResponse.data);
    } catch (error: any) {
        console.error(error);
        return Promise.reject(error);
    }
};