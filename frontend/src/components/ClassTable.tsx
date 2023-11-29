import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button } from "react-bootstrap";

import { getCourseInfo } from "../services/StudentDashboardService";
import { useAuth } from "./AuthContext";
import { Assignments } from "../types/Assignments";

type ClassTuple = [number, string, string];

const STUDENT_ASSIGNMENTS_PATH = "/StudentAssignments";

const ClassTable: React.FC<{ classTuple: ClassTuple[], courseIds: string[] }> = ({ classTuple, courseIds }) => {
    const navigate = useNavigate();

    const auth = useAuth();
    const authToken = auth.token ?? "";

    const [assignments, setAssigments] = React.useState<Assignments>([]);

    const handleClick = async (courseId: string) => {
        const courseInfo = (await getCourseInfo(courseId, authToken) as { course: { course_code: string, course_name: string, Assignments: any[] } }).course;
        const assignments: Assignments = courseInfo.Assignments;
        const courseTitle: string = `${courseInfo.course_code} - ${courseInfo.course_name}`;

        setAssigments(assignments);

        // navigate to the assignments page and pass the assignments state data to the page
        if (assignments.length > 0) {
            navigate(STUDENT_ASSIGNMENTS_PATH, { state: { assignments: assignments, courseTitle: courseTitle } });
        }
    };

    return (
        <Container>
            <h2 className='mt-3'>Course List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Assignment Details</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        classTuple.map((course, index) => (
                            <tr key={index}>
                                <td>{course[1]}</td>
                                <td>{course[2]}</td>
                                <td><Button variant="primary" onClick={() => handleClick(courseIds[index])}>View Assignments</Button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </Container>
    );
};

export default ClassTable;