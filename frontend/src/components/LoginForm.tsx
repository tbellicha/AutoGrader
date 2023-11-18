import React, { useState } from "react";

import {
    Container,
    Form,
    Button
} from "react-bootstrap";

interface LoginFormProps {
    onLoginSubmit: (email: string, password: string) => Promise<string | null>;
    onSignupClick: () => void;
  }

  const LoginForm: React.FC<LoginFormProps> = ({
    onLoginSubmit,
    onSignupClick,
  }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState<string | null>(null);
  
    const handleLoginSubmit = async (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();
      try {
        const receivedToken = await onLoginSubmit(email, password);
  
        if (receivedToken) {
          setToken(receivedToken);
          console.log("Received token:", receivedToken);
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    };

    return (
        <>
            <Container id="main-container" className="d-grid h-100">
            <Form
          id="sign-in-form"
          className="text-center w-100"
          onSubmit={handleLoginSubmit}
        >
                <Form id="sign-in-form" className="text-center w-100" onSubmit={handleLoginSubmit}>
                    <img
                        className="mb-4 bootstrap-logo"
                        src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg"
                        alt="Bootstrap 5" />
                    <h1 className="mb-3 fs-3 fw-normal">Please Sign-in</h1>
                    <Form.Group controlId="sign-in-email-address" className="mb-1">
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
                            label="&nbsp;Remember Me"
                            className="d-flex justify-content-center mb-4"
                        />
                    </Form.Group>
                    <div className="d-grid">
            <Button variant="primary" type="submit" size="lg">
              Login
            </Button>
            <Button variant="link" size="sm" onClick={onSignupClick}>
              Signup
            </Button>
          </div>
          <p className="mt-5 text-muted">&copy; 2023</p>
        </Form>
        </Form>
      </Container>
    </>
  );
};

export default LoginForm;