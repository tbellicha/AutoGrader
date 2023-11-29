import React, { useRef, useState } from 'react';

import { Modal, Button, Form } from 'react-bootstrap';

import { Assignment } from '../types/Assignments';
import { ServerResponse } from '../types/ServerResponse';

import { useAuth } from '../components/AuthContext';

import { postAssignment, postSubmission } from '../services/AssignmentSubmissionService';
import { HomeworkData } from '../types/HomeworkData';

interface AssignmentModalProps {
    show: boolean;
    onHide: () => void;
    assignment: Assignment;
}

const AssignmentUploadModal: React.FC<AssignmentModalProps> = (props) => {
    const auth = useAuth();
    const authToken = auth.token ?? "";

    const progressInfosRef = useRef<any>(null);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [progressInfos, setProgressInfos] = useState<Array<any>>([]);
    const [message, setMessage] = useState<Array<string>>([]);
    const [homeworkData, setHomeworkData] = useState<HomeworkData | null>(null);

    const dateOptions: Intl.DateTimeFormatOptions = {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };

    const convertDate = (date: string): string => {
        return new Date(date).toLocaleDateString('en-US', dateOptions);
    };

    const selectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(event.target.files);
        setProgressInfos([]);
        setMessage([]);
    };

    const upload = async () => {
        if (selectedFiles === null) {
            return;
        }

        const files = Array.from(selectedFiles);

        let _progressInfos = Array(files.length).fill({ percentage: 0, fileName: "File Name" });
        progressInfosRef.current = _progressInfos;

        const uploadPromises = files.map((file, i) => {
            return postAssignment(props.assignment.id, authToken, file, (event: ProgressEvent) => {
                _progressInfos[i].percentage = Math.round((100 * event.loaded) / event.total);
                setProgressInfos([..._progressInfos]);
            }).then((response) => {
                setMessage((prevMessage) => [...prevMessage, `Uploaded: ${file.name} successfully!`]);
                console.log(`Response: ${response}`);
            }).catch((err: any) => {
                _progressInfos[i].percentage = 0;
                setProgressInfos([..._progressInfos]);

                let msg = `Failed to upload: ${file.name}!`;

                if (err.response && err.response.data && err.response.data.message) {
                    msg += ` ${err.response.data.message}`;
                }

                setMessage((prevMessage) => [...prevMessage, msg]);
            });
        });

        Promise.all(uploadPromises)
            .then(() => {
                console.log(`All files uploaded successfully!`);
                return postSubmission(props.assignment.id, authToken);
            })
            .then((data: ServerResponse) => {
                const homeworkData = data.homeworkData;
                console.log(`Homework score: ${JSON.stringify(homeworkData)}`);
                setHomeworkData(data.homeworkData);
            })
            .catch(err => console.log(err));
    };

    return (
        <>
            <Modal show={props.show} onHide={props.onHide} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Submit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='assignmentTitle'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type='text' value={props.assignment.title} readOnly disabled />
                        </Form.Group>
                        <Form.Group controlId='assignmentDescription' className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type='text' value={props.assignment.description} readOnly disabled />
                        </Form.Group>
                        <Form.Group controlId='assignmentDueDate' className="mt-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type='text' value={convertDate(props.assignment.due_date)} readOnly disabled />
                        </Form.Group>
                        <Form.Group controlId='assignmentFile' className="mt-4">
                            <Form.Label>Select Files</Form.Label>
                            <Form.Control multiple type='file' onChange={selectFiles} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={props.onHide}>Cancel</Button>
                    <Button variant='primary'
                        disabled={!selectedFiles}
                        onClick={upload}
                    >Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AssignmentUploadModal;