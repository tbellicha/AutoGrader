import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { ServerResponse } from '../types/ServerResponse';
import StudentNavbar from '../components/StudentNavbar';

const AssignmentResults: React.FC<any> = () => {
    const location = useLocation();

    const [serverResponseData, _] = useLocalStorage<ServerResponse>("serverResponseData");
    const [_assignmentId, setAssignmentId] = useState<string>(location.state.assignment_id);

    const color = (result: boolean): string => {
        return result ? "table-success" : "table-danger";
    };

    useEffect(() => {
        setAssignmentId(location.state.assignment_id);
        //console.log(`DEBUG TRACE: assignmentId: ${assignmentId}`);
    }, []);

    return (
        <>
            <StudentNavbar />
            <Container>
                <h1 className="mt-2">Assignment Results</h1>
                <hr />
                <h3>{serverResponseData.assignment.title}</h3>
                <h5>Score: {serverResponseData.homeworkData.studentPercentage}</h5>
                <h5>Homework Score: {serverResponseData.homeworkData.studentsTotal}</h5>
                <h5>Homework Total: {serverResponseData.homeworkData.homeworkTotal}</h5>
                <hr />
                <h5>Test cases:</h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Test Case</th>
                            <th>Expected</th>
                            <th>Actual</th>
                            <th>Pass/Fail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serverResponseData.homeworkData.tests.map((test, index) => (
                            // color row red or green depending on test result
                            <tr key={index} className={color(test.result)}>
                                <td>{test.name}</td>
                                <td>{test.case}</td>
                                <td>{test.points}</td>
                                <td>{test.result ? "Passed" : "Failed"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default AssignmentResults;