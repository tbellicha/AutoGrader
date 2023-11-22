import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


import { useAuth } from "../components/AuthContext";
import LoginForm from "../components/LoginForm";
import LoginService from "../services/LoginService";

import Alert from "react-bootstrap/Alert";

//const DASHBOARD_PATH = "/dashboard";
const TEACHER_DASHBOARD_PATH = "/TeacherDashboard";
const STUDENT_DASHBOARD_PATH = "/StudentDashboard"
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

    // useAuth hook to store user attributes
    const { setAuthData } = useAuth();

    // useNavigate hook to redirect to upload portal
    const navigate = useNavigate();

    const handleLoginResponse = async (email: string, password: string) => {
        //console.log("Login requested");
        //console.log(`Email: ${email}, Password: ${password}`);
        setAuthData(null, null, null);
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

            setAuthData(data.token, studentId, teacherId);

            if (studentId) {
                navigate(STUDENT_DASHBOARD_PATH);
            } else if (teacherId) {
                navigate(TEACHER_DASHBOARD_PATH);
            } else {
                setError(`Login failed - no user id`);
                return;
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