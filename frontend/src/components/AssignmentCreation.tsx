import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Assignment } from '../types/TeacherDashboard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NavBar from './TeacherNavbar';

interface AssignmentCreationProps {
  token: string | null;
  onAssignmentCreated: (assignment: Assignment) => void;
}

const AssignmentCreation: React.FC<AssignmentCreationProps> = ({
  token,
  onAssignmentCreated,
}) => {
  const [courseId, setCourseId] = useState<number | null>(null);
  const [assignmentTitle, setAssignmentTitle] = useState<string>('');
  const [assignmentDescription, setAssignmentDescription] = useState<string>('');
  const [assignmentDueDate, setAssignmentDueDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const createAssignmentHandler = async () => {
    try {
      if (courseId !== null && token) {
        const response = await fetch(`/api/course/${courseId}/assignment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: assignmentTitle,
            description: assignmentDescription,
            due_date: assignmentDueDate,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const createdAssignment = result.course.Assignments[0];
          onAssignmentCreated(createdAssignment);
          setAssignmentTitle('');
          setAssignmentDescription('');
          setAssignmentDueDate(null);
        } else {
          const error = await response.text();
          setErrorMessage(error);
        }
      } else {
        console.error('Invalid course ID or missing token');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setErrorMessage('An error occurred.');
    }
  };

  return (
    <div>
      <NavBar />
    <Container>
      <h2>Create Assignment</h2>
      <Form>
        <Form.Group>
          <Form.Label>Course ID</Form.Label>
          <Form.Control
            type="text"
            value={courseId !== null ? courseId : ''}
            onChange={(e) => setCourseId(parseInt(e.target.value, 10))}
          />
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
          <br/>
          <DatePicker
            selected={assignmentDueDate}
            onChange={(date) => setAssignmentDueDate(date)}
          />
        </Form.Group>
        <Button variant="primary" onClick={createAssignmentHandler}>
          Create Assignment
        </Button>
        {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
      </Form>
    </Container>
    </div>
  );
};

export default AssignmentCreation;