import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

const StudentNavbar = () => {
  return (
    <>
        <Navbar expand="lg" bg="dark">
            <Container>
                <Navbar.Brand><p className="text-white"><b>AutoGrader</b></p></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Link href="/student/dashboard"><p className="text-white"><b>Dashboard</b></p></Nav.Link>
                        <Nav.Link href="/student/assignment"><p className="text-white"><b>Assignment</b></p></Nav.Link>
                        <Nav.Link href="/student/submit"><p className="text-white"><b>Submit</b></p></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
  );
};

export default StudentNavbar;