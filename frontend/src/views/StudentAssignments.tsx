import React, { useEffect } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { Assignment, Assignments } from '../types/Assignments';

const StudentAssignments: React.FC<any> = () => {
    const location = useLocation();
    const assignments: Assignments = location.state.assignments;

    const dateOptions: Intl.DateTimeFormatOptions = { month: '2-digit', day: '2-digit', year: '2-digit' };

    const handleBack = () => {
        window.history.back();
    };

    const convertDate = (date: string): string => {
        return new Date(date).toLocaleDateString('en-US', dateOptions);
    };

    useEffect(() => {
        console.log(assignments);
    });

    return (
        <>
            <StudentNavbar />
            <Container>
                <Button className='mt-2' onClick={() => handleBack()}>&lt; Back</Button>
                <h1 className='mt-3'>Assignments</h1>
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
                                <td><Button variant="primary">Submit</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default StudentAssignments;