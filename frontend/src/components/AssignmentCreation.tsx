import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Course } from '../types/TeacherDashboard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../components/AuthContext';
import { getTeacherCourses, createAssignment } from '../services/TeacherDashboardService';
import NavBar from './TeacherNavbar'; 

const AssignmentCreation: React.FC = () => {
  const [courseId, setCourseId] = useState<string | null>('');
  const [loading, setLoading] = useState(false); 
  const [assignmentTitle, setAssignmentTitle] = useState<string>('');
  const [assignmentDescription, setAssignmentDescription] = useState<string>('');
  const [assignmentDueDate, setAssignmentDueDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);

  //Authentication
  const auth = useAuth();
  const teacherId = auth.teacherId ?? "";
  const authToken = auth.token ?? "";

  useEffect(() => {
    // Fetch assignments for the course
    const fetchCourses = async () => { 
      getTeacherCourses(teacherId, authToken)
      .then(data => { 
        const coursesData: Course[] = data.teacher.Courses;  
        setCourses(coursesData);  
      }) 
      .catch(error => {
        console.error('Error occurred:', error);
        setErrorMessage('An error occurred while fetching data.'); 
      })
    };  

    fetchCourses();   
  }, [authToken]);

  const createAssignmentHandler = async () => { 
    setLoading(true);
    const data = {
      title: assignmentTitle,
      description: assignmentDescription,
      due_date: assignmentDueDate,
    }
    const validCourseId = courseId || "";

    
    try {
      const response = await createAssignment(validCourseId, data, authToken)
      console.log(response);
      if(response.status === 200){
        setAssignmentTitle('');
        setAssignmentDescription('');
        setAssignmentDueDate(null);
      } else {
        const error = await response.text();
        setErrorMessage(error);
      }
    } catch(error) {
      console.error("Error occured", error);
      setErrorMessage("An error occured while creating assignment!");
    } finally {
      setLoading(false);
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
            style={{width: '15%'}}
            as="select"
            type="text" 
            value={courseId || ""}
            onChange={(e) => { 
              console.log(e.target.value);
              setCourseId(e.target.value); 
            }}
          >
            <option value="" disabled>Select a course</option>
            { 
              courses.map((course) => { 
                return (
                  <option key={course.id} value={course.id}>{course.course_name}</option>
                )
              })
            } 
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
          <br/>
          <DatePicker
            selected={assignmentDueDate}
            onChange={(date) => setAssignmentDueDate(date)}
          />
        </Form.Group>
        <Button variant="primary" onClick={createAssignmentHandler} disabled={loading}>
          Create Assignment
        </Button>
        {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
      </Form>
    </Container>
    </div>
  );
};

export default AssignmentCreation;