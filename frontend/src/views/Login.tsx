import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


import { useAuth } from "../components/AuthContext";
import { useUser } from "../components/UserContext";

import LoginForm from "../components/LoginForm";
import LoginService from "../services/LoginService";

import Alert from "react-bootstrap/Alert";

const SIGNUP_PATH = "/signup";

type statusCode = number;

type message = string;

type token = string;

type User = {
    id: string;
    role: string;
    email: string;
    password: string;
    student_id?: string;
    teacher_id?: string;
};

type LoginResponse = {
    data: {
        user?: User,
        token?: token,
    },
    status: statusCode,
    message?: message
};

const Login: React.FC<any> = () => {

    // useState hook to store error message
    const [error, setError] = useState("");

    // useAuth hook to store auth token
    const { setAuthData } = useAuth();

    // useUser hook to store user attributes
    const { login } = useUser();

    // useNavigate hook to redirect to upload portal
    const navigate = useNavigate();

    const handleLoginResponse = async (email: string, password: string) => {
        //console.log("Login requested");
        //console.log(`Email: ${email}, Password: ${password}`);
        //setAuthData(null, null, null);
        //logout();
        setError("");

        const loginPromise = LoginService.login(email, password);

        loginPromise.then((response: LoginResponse) => {
            const data = response.data;
            const status: statusCode = response.status;

            if (status >= 400) {
                setError(`Login failed - ${response.message}`);
                return;
            }

            if (!data.token) {
                setError(`Login failed - no token`);
                return;
            }

            const studentId = data.user?.student_id ?? null;
            const teacherId = data.user?.teacher_id ?? null;

            const user = data.user ?? null;

            setAuthData(data.token, studentId, teacherId);

            //console.log(`Pre-event - User: ${JSON.stringify(user)}`);

            if(user !== null && user !== undefined) {
                //console.log(`Post-event User: ${JSON.stringify(user)}`);
                login(user);
            }
        }).catch((error) => {
            console.error(`${error}`);
            setError(`Login failed because ${error}`);
            return;
        });
    };

    const handleSignupClick = () => {
        console.log("Signup requested");
        navigate(SIGNUP_PATH);
    };

    return (
        <>
            {
                error &&
                <div className="d-flex container justify-content-center align-items-center">
                    <Alert variant="danger" className="mt-3 w-50" dismissible><p className="text-center">Error: {error} </p></Alert>
                </div>
            }
            <LoginForm onLoginSubmit={handleLoginResponse} onSignupClick={handleSignupClick} />
        </>
    );
};

export default Login;