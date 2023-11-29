import React, { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import AssignmentUploadModal from '../components/AssignmentUploadModal';
import StudentNavbar from '../components/StudentNavbar';
import { Assignment, Assignments } from '../types/Assignments';

const StudentAssignments: React.FC<any> = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

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

        const msg = `Submission request for ${assignment.id} sent!`;
        console.log(msg);

        setShowModal(true);
    };

    useEffect(() => {
        console.log(assignments);
    }, [assignments]);

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
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment: Assignment, index) => (
                            <tr key={index}>
                                <td>{assignment.title}</td>
                                <td>{assignment.description}</td>
                                <td>{convertDate(assignment.due_date)}</td>
                                <td><Button variant="primary" onClick={() => handleSubmitAssignment(assignment)}>Submit</Button></td>
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