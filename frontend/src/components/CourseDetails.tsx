import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Form } from 'react-bootstrap';
import { Assignment, Student } from '../types/TeacherDashboard';
import { useAuth } from '../components/AuthContext';
import { getAssignments, getStudents, uploadTestCase } from '../services/TeacherDashboardService';
import { useParams } from 'react-router-dom';
import NavBar from './TeacherNavbar';

const CourseDetails: React.FC = () => { 
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]); 

  //Authentication
  const auth = useAuth(); 
  const authToken = auth.token ?? ""; 

  //courseId query parameter
  const { id } = useParams();
  const courseId = id || ""; 

  //Converting datetime
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  };

  const convertDate = (date: string):string => {
    return new Date(date).toLocaleDateString('en-US', dateOptions);
  }
 

  useEffect(() => { 
    // Fetch assignments for the course
    const fetchAssignments = async () => { 
      try {
        const response = await getAssignments(courseId, authToken);
        if(response.status === 200){ 
          setAssignments(response.data.course.Assignments); 
        } else {
          console.error('Error fetching assignments data');
          setErrorMessage('Error fetching assignments data');
        }
      } catch (error) {
        console.error('Error occured', error);
        setErrorMessage('An error occurred while fetching assignments data.');
      } 
    };

    // Fetch students for the course /api/course/:course_id/students
    const fetchStudents = async () => {   
      try {
        const response = await getStudents(courseId, authToken)
        if(response.status === 200){
          setStudents(response.data.students);
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
  }, [authToken, id]);

  //Upload testcase for the assignment
  const uploadHandler = async (e: any) => {  
    setLoading(true);
    console.log(e.target.value);
    try { 
      const formData = new FormData();
      files.forEach(file => formData.append('file', file));  
      const response = await uploadTestCase(e.target.value, formData, authToken) 
      if(response.status !== 200){ 
        setErrorMessage('An error occurred while uploading testcases.');
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error('Error', error);
      setErrorMessage('An error occurred.');
    } finally {
      setLoading(false);
    }
  }

  const onChange = async (e: any) => { setFiles(Array.from(e.target.files)); }

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
              <td>{convertDate(assignment.due_date)}</td>
              <td>
                <Form.Group controlId="formFile" className="mb-3 input-group"> 
                  <Form.Control type="file" name="files" onChange={(e) => onChange(e)} multiple/> 
                  <Button variant='primary' value={assignment.id} onClick={(e) => uploadHandler(e)} disabled={loading}>Submit Testcase</Button>
                </Form.Group>
              </td> 
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