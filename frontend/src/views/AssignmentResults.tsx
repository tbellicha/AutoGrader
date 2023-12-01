import React from 'react';
import { useLocation } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { ServerResponse } from 'http';

const AssignmentResults: React.FC<any> = () => {
    const location = useLocation();
    const [serverResponseData, setServerResponseData] = useLocalStorage<ServerResponse | null>("serverResponseData", null);

    return (
        <>
            <h1>Assignment Results</h1>
            <h2>Assignment ID: {location.state.assignment_id}</h2>
            <h2>Server Response:</h2>
            {
                serverResponseData !== "null" ?
                    <>
                        <p>{serverResponseData}</p>
                    </>
                    :
                    <>
                        <p>No response from server</p>
                    </>
            }
        </>
    );
};

export default AssignmentResults;