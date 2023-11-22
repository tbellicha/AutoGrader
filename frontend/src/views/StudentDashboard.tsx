import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Form, Table } from 'react-bootstrap';

import StudentNavbar from '../components/StudentNavbar';
import { useAuth } from '../components/AuthContext';
import StudentInfo from '../types/StudentInfo';

const BASE_URL = 'http://localhost:8080';
const STUDENT_ENDPOINT_PLACEHOLDER = '/api/students/:studentId';

const StudentDashboard: React.FC<any> = () => {
    const auth = useAuth();
    const studentId = auth.studentId ?? "";

    const STUDENT_ENDPOINT = STUDENT_ENDPOINT_PLACEHOLDER.replace(':studentId', studentId);

    const [studentInfo, setStudentInfo] = useState<StudentInfo>();

    const getStudentInfo = async (): Promise<any> => {
        console.log('Fetching student info');
        console.log(`Student Endpoint: ${STUDENT_ENDPOINT}`);

        const response = await axios.get(STUDENT_ENDPOINT, {
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`
            }
        });

        return Promise.resolve(response.data);
    };

    useEffect(() => {
        getStudentInfo().then((data: unknown) => {
            const student: StudentInfo = (data as { student: StudentInfo }).student;

            //console.log(student);
            setStudentInfo(student);
        }).catch((error) => console.error(error));
    }, []);

    return (
        <>
            {/* Navigation Bar */}
            <StudentNavbar />

            {/*  Courses Menu */}
            <Container>
                <Form.Group>
                    <Form.Label>Select Course</Form.Label>
                    <Form.Control as="select">
                        {
                            studentInfo?.Enrollments.map((enrollment, index) => (
                                <option key={index} value={enrollment.course_id}>
                                    {enrollment.course_id}
                                </option>
                            ))
                        }
                    </Form.Control>
                </Form.Group>
            </Container>
            {/*  Assignments Menu */}
            <Container>
                <h2 className='mt-3'>Assignments</h2>
                {/*  Assignments Table */}
                <Table>
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
                </Table>
            </Container>
        </>
    );
};

export default StudentDashboard;