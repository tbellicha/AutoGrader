import { useState, useEffect } from 'react';
import { Table, Form, Button, Container } from 'react-bootstrap';
import {
  Course,
  Assignment,
  Enrollment,
} from "../types/TeacherDashboard";
import {
  fetchCourses,
  fetchAssignments,
  fetchEnrollments,
  createCourse,
  createAssignment,
  enrollStudent,
} from "../services/TeacherDashboardService";

function TeacherDashboard() {
  const [courseId, setCourseId] = useState<number | null>(null);
  const [courseName, setCourseName] = useState<string>('');
  const [courseCode, setCourseCode] = useState<string>('');
  const [teacherId, setTeacherId] = useState<number>(0);

  const [courses, setCourses] = useState<Course[]>([]);

  const [assignmentTitle, setAssignmentTitle] = useState<string>('');
  const [assignmentDescription, setAssignmentDescription] = useState<string>('');
  const [assignmentDueDate, setAssignmentDueDate] = useState<string>('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [studentId, setStudentId] = useState<number>(0);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    // Fetch the list of courses, assignments, and enrollments from the server.
    fetchCourses().then((response) => {
      setCourses(response.data);
    });
    fetchAssignments().then((response) => {
      setAssignments(response.data);
    });
    fetchEnrollments().then((response) => {
      setEnrollments(response.data);
    });
  }, []);

  const createCourseHandler = () => {
    createCourse({
      course_name: courseName,
      course_code: courseCode,
      teacher_id: teacherId,
    })
      .then((response) => {
        setCourses([...courses, response.data.course]);
        setCourseName('');
        setCourseCode('');
        setTeacherId(0);
      })
      .catch((error) => {
        console.error('Error creating course:', error);
      });
  };

  const createAssignmentHandler = () => {
    if (courseId !== null) {
      createAssignment(courseId, {
        title: assignmentTitle,
        description: assignmentDescription,
        due_date: assignmentDueDate,
      })
        .then((response) => {
          setAssignments([...assignments, response.data.assignment]);
          setAssignmentTitle('');
          setAssignmentDescription('');
          setAssignmentDueDate('');
        })
        .catch((error) => {
          console.error('Error creating assignment:', error);
        });
    } else {
      console.error('Please select a course before creating an assignment.');
    }
  };

  const enrollStudentHandler = () => {
    if (courseId !== null) {
      enrollStudent(courseId, {
        student_id: studentId,
      })
        .then((response) => {
          setEnrollments([...enrollments, response.data.enrollment]);
          setStudentId(0);
        })
        .catch((error) => {
          console.error('Error enrolling student:', error);
        });
    } else {
      console.error('Please select a course before enrolling a student.');
    }
  };

  return (
    <Container>
      <h1>Dashboard</h1>

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

      {/* Course Creation Section */}
      <Form>
        <h2>Create Course</h2>
        <Form.Group>
          <Form.Label>Course Name</Form.Label>
          <Form.Control
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Course Code</Form.Label>
          <Form.Control
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Teacher ID</Form.Label>
          <Form.Control
            type="text"
            value={teacherId}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                setTeacherId(value);
              } else {
                setTeacherId(0);
              }
            }}
            
          />
        </Form.Group>
        <Button variant="primary" onClick={createCourseHandler}>
          Create Course
        </Button>
      </Form>

      {/* Assignment Creation Section */}
      <Form>
        <h2>Create Assignment</h2>
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
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            value={assignmentDescription}
            onChange={(e) => setAssignmentDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="text"
            value={assignmentDueDate}
            onChange={(e) => setAssignmentDueDate(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={() => createAssignmentHandler()}>
  Create Assignment
</Button>

      </Form>

      {/* Student Enrollment Section */}
      <Form>
        <h2>Enroll Student</h2>
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
        <Form.Group>
          <Form.Label>Student ID</Form.Label>
          <Form.Control
            type="text"
            value={studentId}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                setStudentId(value);
              } else {
                setStudentId(0);
              }
            }}
            
          />
        </Form.Group>
        <Button variant="primary" onClick={() => enrollStudentHandler()}>
  Enroll Student
</Button>

      </Form>

      {/* Display Course, Assignment, and Enrollment Tables */}
      <Table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Course Code</th>
            <th>Teacher ID</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.course_name}</td>
              <td>{course.course_code}</td>
              <td>{course.teacher_id}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.title}</td>
              <td>{assignment.description}</td>
              <td>{assignment.due_date}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Course ID</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id}>
              <td>{enrollment.student_id}</td>
              <td>{enrollment.course_id}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default TeacherDashboard;
