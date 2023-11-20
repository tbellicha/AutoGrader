import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import { Course } from '../types/TeacherDashboard';
import { Link } from 'react-router-dom';
import NavBar from './TeacherNavbar';

const TeacherDashboard: React.FC<{ token: string | null }> = ({ token }) => {
  const [courses, setCourses] =  useState<Course[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch teacher's courses
    const fetchCourses = async () => {
      try {
        const coursesResponse = await fetch('/api/teachers/:teacherId', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          setCourses(coursesData.teacher.Courses);
        } else {
          console.error('Error fetching courses data');
          setErrorMessage('Error fetching courses data');
        }
      } catch (error) {
        console.error('Error occurred:', error);
        setErrorMessage('An error occurred while fetching courses data.');
      }
    };

    fetchCourses();
  }, [token]);

  return (
    <div>
      <NavBar />
    <Container>
    <h2>Your Courses</h2>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Course Code</th>
          <th>Course Name</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>{course.course_code}</td>
            {/* Make the course name a clickable link */}
            <td>
              <Link to={`/course/${course.id}`}>{course.course_name}</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

      {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
    </Container>
    </div>
  );
};

export default TeacherDashboard;