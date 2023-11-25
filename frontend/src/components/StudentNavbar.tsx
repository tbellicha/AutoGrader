import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useUser } from './UserContext';

const StudentNavbar: React.FC<any> = () => {

    const { logout, setUserData } = useUser();

    const handleLogout = () => {
       setUserData(null);
       logout();
    };

    return (
        <>
            <Navbar expand="lg" bg="dark">
                <Container>
                    <Navbar.Brand><p className="text-white"><b>AutoGrader</b></p></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                        <Nav>
                            <Nav.Link><Button onClick={() => handleLogout()}><b>Logout</b></Button></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default StudentNavbar;