import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Student, Course } from '../types/TeacherDashboard';
import NavBar from './TeacherNavbar';

interface StudentEnrollmentProps {
  token: string | null;
}

const StudentEnrollment: React.FC<StudentEnrollmentProps> = ({ token }) => {
  const [courseId, setCourseId] = useState<number | null>(null);
  const [studentId, setStudentId] = useState<number>(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setCourses(result.courses);
        } else {
          console.error('Failed to fetch courses:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred while fetching courses:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setStudents(result.students);
        } else {
          console.error('Failed to fetch students:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred while fetching students:', error);
      }
    };

    fetchCourses();
    fetchStudents();
  }, [token]);

  const enrollStudentHandler = async () => {
    try {
      if (courseId !== null) {
        const response = await fetch(`/api/course/${courseId}/enroll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
            value={courseId !== null ? courseId : ''}
            onChange={(e) => setCourseId(parseInt(e.target.value, 10))}
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
            value={studentId !== 0 ? studentId : ''}
            onChange={(e) => setStudentId(parseInt(e.target.value, 10))}
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