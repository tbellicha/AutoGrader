import React from 'react';

const ServerResponse: React.FC<any> = ( {response} ) => {
    return (
        <div>
            <h1>Server Response</h1>
            <p>{JSON.stringify(response)}</p>
        </div>
    )
};

export default ServerResponse;