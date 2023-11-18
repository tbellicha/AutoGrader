import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import { Assignment, Student } from '../types/TeacherDashboard';
import NavBar from './TeacherNavbar';

interface CourseDetailsProps {
  token: string | null;
  courseId: string;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ token, courseId }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch assignments for the course
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`/api/course/${courseId}/assignments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAssignments(data.assignments);
        } else {
          console.error('Error fetching assignments data');
          setErrorMessage('Error fetching assignments data');
        }
      } catch (error) {
        console.error('Error occurred:', error);
        setErrorMessage('An error occurred while fetching assignments data.');
      }
    };

    // Fetch students for the course
    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/course/${courseId}/students`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStudents(data.students);
        } else {
          console.error('Error fetching students data');
          setErrorMessage('Error fetching students data');
        }
      } catch (error) {
        console.error('Error occurred:', error);
        setErrorMessage('An error occurred while fetching students data.');
      }
    };

    fetchAssignments();
    fetchStudents();
  }, [token, courseId]);

  return (
    <div>
      <NavBar />
    <Container>
      <h2>Course Details</h2>

      <h3>Assignments</h3>
      <Table striped bordered hover>
        {/* Add table headers for assignments */}
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over assignments and display them */}
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.title}</td>
              <td>{assignment.description}</td>
              <td>{assignment.due_date}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Students</h3>
      <Table striped bordered hover>
        {/* Add table headers for students */}
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over students and display them */}
          {students.map((student) => (
            <tr key={student.id}>
              <td>{`${student.first_name} ${student.last_name}`}</td>
              <td>{student.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
    </Container>
    </div>
  );
};

export default CourseDetails;