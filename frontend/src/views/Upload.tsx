import React from 'react';
import FilesUpload from '../components/FilesUpload';

const Upload: React.FC<any> = () => {
  return (
    <>
        <div className="container" style={{width: "600px"}}>
            <div className="my-3">
                <h3>AutoGrader</h3>
                <h4>React Typescript Multiple Files Upload</h4>
            </div>

            <FilesUpload />
        </div>
    </>
  );
};

export default Upload;