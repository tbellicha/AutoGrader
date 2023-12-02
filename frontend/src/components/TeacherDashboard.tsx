import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import { Course } from '../types/TeacherDashboard';
import { Link } from 'react-router-dom';
import NavBar from './TeacherNavbar';
import { getTeacherCourses } from '../services/TeacherDashboardService';
import { useAuth } from '../components/AuthContext';


const TeacherDashboard: React.FC<any> = () => {  
  const [courses, setCourses] = useState<Course[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  //Authentication
  const auth = useAuth();
  const teacherId = auth.teacherId ?? "";
  const authToken = auth.token ?? ""; 

  useEffect(() => { 
    getTeacherCourses(teacherId, authToken)
    .then(data => { 
      const courses: Course[] = data.teacher.Courses;

      // Update state
      setCourses(courses); 
    }) 
    .catch(error => {
      console.error('Error occurred:', error);
      setErrorMessage('An error occurred while fetching data.'); 
    }) 
  }, [teacherId, authToken]);

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