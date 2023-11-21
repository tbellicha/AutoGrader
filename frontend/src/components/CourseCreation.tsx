import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import NavBar from './TeacherNavbar';
import { useAuth } from './AuthContext.tsx';

const CourseCreation: React.FC = () => {
  const { token, teacherId } = useAuth();
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  //const [teacherId, setTeacherId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const createCourseHandler = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_name: courseName,
          course_code: courseCode,
          teacher_id: teacherId,
        }),
      });

      if (response.ok) {
        setCourseName('');
        setCourseCode('');
        //setTeacherId('');
        console.log('Course created successfully');
      } else {
        const error = await response.text();
        setErrorMessage(error);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setErrorMessage('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
    <Container>
      <h2>Create Course</h2>
      <Form>
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
        <Button
          variant="primary"
          onClick={createCourseHandler}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Course'}
        </Button>
        {errorMessage && (
          <div className="text-danger mt-2">{errorMessage}</div>
        )}
      </Form>
    </Container>
    </div>
  );
};

export default CourseCreation;