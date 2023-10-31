import React, { useState } from 'react';
import { Alert, Container } from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';

interface SignupFormProps {
    onSignupSubmit: (username: string, password: string,
        first_name: string, last_name: string) => void;
    onLoginClick: () => void;
};

const SignupForm: React.FC<any> = ({onSignupSubmit, onLoginClick}: SignupFormProps) => {

    // useState to store email, password, first name, last name
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // useState to store validation error message
    const [error, setError] = useState("");

    const handleSignupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // trim input fields
        setEmail(email.trim());
        setPassword(password.trim());
        setFirstName(firstName.trim());
        setLastName(lastName.trim());

        // validate input fields
        if (!validateInputFields()) {
            setError("Invalid input fields");
            return;
        }

        onSignupSubmit(email, password, firstName, lastName);
    };

    // check if input fields are valid (no empty fields, etc.)
    // test email regex 
    // test password is at least 8 characters long
    // test first name and last name are not empty
    const validateInputFields = () => {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{8,}$/;

        if (!email || !password || !firstName || !lastName) {
            console.error("Empty fields");
            return false;
        }

        if (!emailRegex.test(email)) {
            console.error("Invalid email");
            return false;
        }

        if (!passwordRegex.test(password)) {
            console.error("Invalid password");
            return false;
        }

        return true;
    };

    return (
        <>
            <Container className="d-grid h-100 align-items-center justify-content-center">
                { error && 
                    <Alert variant="danger" className="mt-3" dismissible>
                        <p className="text-center">Error: {error} </p></Alert>
                }

                <Form id='sign-up-form' className='text-center w-100' onSubmit={handleSignupSubmit}>
                    <img
                        className="mb-4 bootstrap-logo"
                        src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg"
                        alt="Bootstrap 5" />
                    <h1 className="mb-3 fs-3 fw-normal">Please Sign-up</h1>
                    <Form.Group controlId="sign-up-first-name" className="mb-1">
                        <Form.Control
                            type="text"
                            size="lg"
                            placeholder="First Name"
                            autoComplete="first-name"
                            className="position-relative"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="sign-up-last-name" className="mb-1">
                        <Form.Control
                            type="text"
                            size="lg"
                            placeholder="Last Name"
                            autoComplete="last-name"
                            className="position-relative"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="sign-up-email" className="mb-1">
                        <Form.Control
                            type="email"
                            size="lg"
                            placeholder="Email Address"
                            autoComplete="username"
                            className="position-relative"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="sign-up-password">
                        <Form.Control
                            type="password"
                            size="lg"
                            placeholder="Password"
                            autoComplete="current-password"
                            className="position-relative"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </Form.Group>
                    <div className="d-grid">
                        <Button
                            variant="primary"
                            size="lg"
                            type="submit"
                            className="btn-login text-uppercase fw-bold mb-2">
                            Register
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onLoginClick}>
                            Login
                        </Button>
                    </div>
                </Form>
            </Container>
        </>
    );
};


export default SignupForm;