import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import { Alert } from "react-bootstrap";

const DASHBOARD_PATH = "/dashboard";

const Login: React.FC<any> = () => {
    
    // useState hook to store error message
    const [error, setError] = useState("");

    // useNavigate hook to redirect to upload portal
    const navigate = useNavigate();


    const handleLoginResponse = (response: any) => {
        // set the jwt token in session storage
        sessionStorage.setItem("jwt", response.data.jwt);

        // then, redirect to upload portal
        navigate(DASHBOARD_PATH);
        
        // else, display danger alert from bootstrap
        if (response.data.jwt === "") {
            setError("Login failed");
        }
    };

    return (
        <>
            {
                error && 
                <div className="d-flex justify-content-center align-items-center">
                    <Alert variant="danger" className="mt-3 w-50" dismissible><p className="text-center">Error: Login failed</p></Alert>
                </div>
            }
            <LoginForm onLoginResponse={handleLoginResponse}/>
        </>        
    );
};

export default Login;