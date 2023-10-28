import React, { useState } from "react";

import LoginService from "../services/LoginService";

import {
  Container,
  Form, 
  Button
} from "react-bootstrap";

const LoginForm: React.FC<any> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = LoginService.login(email, password);
    
    response
      .then(data => props.onLoginResponse(data))
      .catch(error => console.error(error));
  };

  return (
    <>
      <Container id="main-container" className="d-grid h-100">
        <Form id="sign-in-form" className="text-center w-100" onSubmit={handleSubmit}>
          <img
            className="mb-4 bootstrap-logo"
            src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg"
            alt="Bootstrap 5"/>
            <h1 className="mb-3 fs-3 fw-normal">Please Sign-in</h1>
            <Form.Group controlId="sign-in-email-address">
              <Form.Control
                type="email"
                size="lg"
                placeholder="Email Address"
                autoComplete="username"
                className="position-relative"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Group >
            <Form.Group className="mb-3" controlId="sign-in-password">
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
            <Form.Group controlId="remember-me">
              <Form.Check
               type="checkbox"
               label="Remember me"
               className="d-flex justify-content-center mb-4"
              />
            </Form.Group> 
            <div className="d-grid">
              <Button
                variant="primary"
                type="submit"
                size="lg"
              >Login</Button>
            </div>
            <p className="mt-5 text-muted">&copy; 2023</p>
        </Form>
      </Container>
    </>
  );
};

export default LoginForm;