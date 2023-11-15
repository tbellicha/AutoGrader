import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import LoginService from "../services/LoginService";

import Alert from "react-bootstrap/Alert";

const DASHBOARD_PATH = "/dashboard";
const SIGNUP_PATH = "/signup";

/**
 * Represents the status code of a HTTP response.
 * It can be a number or undefined.
 */
type StatusCode = number | undefined;

/**
 * Represents a token that can be either a string or undefined.
 */
type Token = string | undefined;

/**
 * Represents a message that can be either a string or undefined.
 */
type Message = string | undefined;

/**
 * Represents the data returned from a login request.
 * @property {Token} [token] - The authentication token.
 * @property {object} [user] - The user object.
 * @property {string} [message] - A message related to the login request.
 * @property {StatusCode} [statusCode] - The status code of the login request.
 */
type LoginData = {
    token?: Token,
    user?: object,
    message?: Message,
    statusCode?: StatusCode,
};

/**
 * Response object returned by the login API endpoint.
 */
type LoginResponse = {
    data: LoginData,
    status: number,
};

const Login: React.FC<any> = () => {

    // useState hook to store error message
    const [error, setError] = useState("");

    // useNavigate hook to redirect to upload portal
    const navigate = useNavigate();

    const handleLoginResponse = (email: string, password: string) => {
        console.log("Login requested");
        console.log(`Email: ${email}, Password: ${password}`);

        const loginPromise = LoginService.login(email, password);



        loginPromise.then((response: LoginResponse) => {
            const data = response.data;

            // enumerate the fields in the response
            for (const [key, value] of Object.entries(data)) {
                console.log(`${key}: ${value}`);
            }

            // response changes base on whether the request was successful or not
            // if unsuccessful, response.data.statusCode will be set
            // if successful, response.data.statusCode will be undefined
            const statusCode = data.statusCode;

            // if statusCode is undefined, then the login was successful
            // otherwise, the login was unsuccessful
            if (statusCode !== undefined) {
                setError(`Login failed: ${data.message}`);
                return;
            }

            // data will have 
            // - token: jwt token for the user to authenticate
            // - user: the user object
            const token = data.token;
            console.log(`Token: ${token}`);

            if (token === undefined) {
                setError(`Login failed: ${data.message}`);
                return;
            }

            sessionStorage.setItem("token", token);
            navigate(DASHBOARD_PATH);
        }).catch((error) => {
            console.error(`${error}`);
            setError(`Login failed: ${error}`);
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