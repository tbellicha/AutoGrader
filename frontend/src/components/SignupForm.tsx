import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';

interface SignupFormProps {
    onSignupSubmit: (username: string, password: string,
        first_name: string, last_name: string) => void;
    onLoginClick: () => void;
};

const SignupForm: React.FC<any> = (/*{onSignupSubmit, onLoginClick}: SignupFormProps*/) => {
    // useState to store email, password, first name, last name
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");


    const handleSignupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <>
            <Container className="d-grid h-100 align-items-center justify-content-center">
                <Form id='sign-up-form' className='text-center w-100'>
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
                            size="sm">
                            Login
                        </Button>
                    </div>
                </Form>
            </Container>
        </>
    );
};


export default SignupForm;