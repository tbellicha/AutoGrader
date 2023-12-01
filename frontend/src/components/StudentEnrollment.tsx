import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Student, Course } from '../types/TeacherDashboard';
import { useAuth } from '../components/AuthContext';
import { enrollStudent, getAllStudents, getTeacherCourses } from '../services/TeacherDashboardService';
import NavBar from './TeacherNavbar';

interface StudentEnrollmentProps {
  token: string | null;
}

const StudentEnrollment: React.FC= () => {
  const [courseId, setCourseId] = useState<string | null>('');
  const [studentId, setStudentId] = useState<string | null>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState([]);

  const auth = useAuth();
  const teacherId = auth.teacherId ?? "";
  const authToken = auth.token ?? ""; 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getTeacherCourses(teacherId, authToken);
        console.log(response);
        if(response != null){
          setCourses(response.teacher.Courses);
        } else {
          console.log('Error fetching courses');
        }
      } catch (error) {
        console.error('Error occured while fetching courses', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await getAllStudents(authToken);
        if(response.status === 200){ 
          setStudents(response.data.students);
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error occured while fetching students', error);
      }
    };

    fetchCourses();
    fetchStudents();
  }, [authToken]);

  const enrollStudentHandler = async () => { 
    /*
    try {
      if (courseId !== null) {
        const response = await fetch(`/api/course/${courseId}/enroll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            student_id: studentId,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Student enrolled:', result.enrollment);
        } else {
          const error = await response.text();
          console.error('Enrollment failed:', error);
        }
      } else {
        console.error('Please select a course before enrolling a student.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
    */
  };

  return (
    <div>
      <NavBar />
    <Container>
      <h2>Enroll Student</h2>
      <Form>
        {/* Course Selection Dropdown */}
        <Form.Group>
          <Form.Label>Select Course</Form.Label>
          <Form.Control
            as="select"
            value={courseId || ''}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="" disabled>Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Student Selection Dropdown */}
        <Form.Group>
          <Form.Label>Select Student</Form.Label>
          <Form.Control
            as="select"
            value={studentId || ''}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="" disabled>Select a student</option>
            {students.map((student: Student) => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Enroll Student Button */}
        <Button variant="primary" onClick={enrollStudentHandler}>
          Enroll Student
        </Button>
      </Form>
    </Container>
    </div>
  );
};

export default StudentEnrollment;