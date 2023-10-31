import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import LoginService from "../services/LoginService";

import { Alert } from "react-bootstrap";

const DASHBOARD_PATH = "/dashboard";
const SIGNUP_PATH = "/signup";

const Login: React.FC<any> = () => {
    
    // useState hook to store error message
    const [error, setError] = useState("");

    // useNavigate hook to redirect to upload portal
    const navigate = useNavigate();
   
    const handleLoginResponse = (username: string, password: string) => {
        console.log("Login requested");
        console.log(`Username: ${username}, Password: ${password}`);

        const loginPromise = LoginService.login(username, password);

        loginPromise.then(({ data }) => {
            const { token } = data.data;

            // set the jwt token in session storage
            sessionStorage.setItem("jwt", token);

            // redirect to dashboard
            navigate(DASHBOARD_PATH);
        }).catch((error) => {
            console.error(`${error}`);
            setError("Login failed");
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
            <LoginForm onLoginSubmit={handleLoginResponse} onSignupClick={handleSignupClick}/>
        </>        
    );
};

export default Login;