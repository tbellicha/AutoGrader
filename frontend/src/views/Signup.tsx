import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SignupForm from '../components/SignupForm';
import SignupService from '../services/SignupService';

const ROOT_PATH = '/';

const Signup: React.FC<any> = () => {

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSignupRequest = (email: string,
        password: string,
        first_name: string,
        last_name: string) => {
            console.log("Signup requested");
            console.log(`Email: ${email}, Password: ${password}, First Name: ${first_name}, Last Name: ${last_name}`);

            const signupPromise = SignupService.signup(email, password, first_name, last_name);

            signupPromise
            .then((response) => {
                console.log(response);
                navigate(ROOT_PATH);
            })
            .catch((error) => {
                console.error(`${error}`);
                setError("Signup failed");
            });
    };

    const handleLoginClick = () => {
        navigate(ROOT_PATH);
    };

    return (
        <>
            <SignupForm onSignupSubmit={handleSignupRequest} onLoginClick={handleLoginClick} />
        </>
    );
};

export default Signup;