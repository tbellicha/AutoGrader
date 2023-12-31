import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import AssignmentUploadModal from '../components/AssignmentUploadModal';
import StudentNavbar from '../components/StudentNavbar';
import { Assignment, Assignments } from '../types/Assignments';
import useLocalStorage from '../hooks/useLocalStorage';
import { ServerResponse } from '../types/ServerResponse';

const STUDENT_ASSIGNMENT_ROUTE = '/AssignmentResults';

const StudentAssignments: React.FC<any> = () => {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [serverResponseData, _] = useLocalStorage<ServerResponse>("serverResponseData");

    const location = useLocation();
    const assignments: Assignments = location.state.assignments;
    const courseTitle: string = location.state.courseTitle;

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

    const handleBack = () => {
        window.history.back();
    };

    const handleSubmitAssignment = (assignment: Assignment) => {
        // forward assignmentId to AssignmentUploadModal component
        // open AssignmentUploadModal component
        setSelectedAssignment(assignment);
        setShowModal(true);
    };

    const handleViewResults = (assignment: Assignment) => {
        // forward assignmentId to AssignmentResults page
        // open AssignmentResults component
        // wait until the server response data is available in local storage,
        // once it is available, navigate to AssignmentResults page
        if(!serverResponseData) {
            console.log("DEBUG TRACE: serverResponseData is null");
            return;
        }

        if(serverResponseData.assignment.id !== assignment.id) {
            console.log("DEBUG TRACE: assignment id mismatch");
            return;
        }

        const state = {
            assignment_id: assignment.id
        };

        navigate(STUDENT_ASSIGNMENT_ROUTE, { state: state });
    };

    useEffect(() => {
        if (serverResponseData)
        {
            console.log("DEBUG TRACE: " + JSON.stringify(serverResponseData));
            setShowResults(true);
        }
    }, [serverResponseData]);

    return (
        <>
            <StudentNavbar />
            <Container>
                <Button className='mt-2' onClick={() => handleBack()}>&lt; Back</Button>
                <h1 className='mt-3'>{courseTitle} Assignments</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Assignment Title</th>
                            <th>Assignment Description</th>
                            <th>Due Date</th>
                            <th>Submit</th>
                            <th>Results</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment: Assignment, index) => (
                            <tr key={index}>
                                <td>{assignment.title}</td>
                                <td>{assignment.description}</td>
                                <td>{convertDate(assignment.due_date)}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleSubmitAssignment(assignment)}
                                    >
                                        Submit
                                    </Button>
                                </td>
                                <td>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleViewResults(assignment)}
                                        {...(showResults ? {} : { disabled: true })}
                                    >
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {
                    showModal && selectedAssignment &&
                    <AssignmentUploadModal
                        show={showModal}
                        onHide={() => {
                            setShowModal(false);
                            setSelectedAssignment(null);
                        }}
                        assignment={selectedAssignment}
                    />
                }
            </Container>
        </>
    );
};

export default StudentAssignments;