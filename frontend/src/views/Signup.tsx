import React, { useState } from 'react';

import SignupForm from '../components/SignupForm';

const Signup: React.FC<any> = () => {

    const [error, setError] = useState("");

    return (
        <>
            <SignupForm />
        </>
    );
};

export default Signup;