import React from 'react';

import { Navbar, Container, Form, Table } from 'react-bootstrap';

const StudentDashboard: React.FC<any> = () => {

    return (
        <>
            {/* Navigation Bar */}
            <Navbar expand="lg" bg="dark">
                <Container>
                    <Navbar.Brand href="/student"><p className="text-white">AutoGrader</p></Navbar.Brand>
                </Container>
            </Navbar>

            {/*  Courses Menu */}
            <Container>
                <Form.Group>
                    <Form.Label>Select Course</Form.Label>
                    <Form.Control as="select">
                        <option>Course 1</option>
                        <option>Course 2</option>
                        <option>Course 3</option>
                        <option>Course 4</option>
                    </Form.Control>
                </Form.Group>
            </Container>
            {/*  Assignments Menu */}
            <Container>
                <h2 className='mt-3'>Assignments</h2>
                {/*  Assignments Table */}
                <Table>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Grade</th>
                                <th>Due Date</th>
                                <th>Details</th>
                                <th>Submit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Assignment 1</td>
                                <td>100</td>
                                <td>1/1/2021</td>
                                <td><a href="/student/assignment">Details</a></td>
                                <td><a href="/student/submit">Submit</a></td>
                            </tr>
                            <tr>
                                <td>Assignment 2</td>
                                <td>100</td>
                                <td>1/1/2021</td>
                                <td><a href="/student/assignment">Details</a></td>
                                <td><a href="/student/submit">Submit</a></td>
                            </tr>
                            <tr>
                                <td>Assignment 3</td>
                                <td>100</td>
                                <td>1/1/2021</td>
                                <td><a href="/student/assignment">Details</a></td>
                                <td><a href="/student/submit">Submit</a></td>
                            </tr>
                        </tbody>
                    </table>
                </Table>
            </Container>
        </>
    );
};

export default StudentDashboard;