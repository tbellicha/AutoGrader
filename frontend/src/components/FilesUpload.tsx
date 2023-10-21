import { useState, useEffect, useRef } from "react";
import UploadService from "../services/FileUploadService";
import IFile from "../types/File";
import ServerResponse from "./ServerResponse";

interface ProgressInfo {
  fileName: string;
  percentage: number;
}

const FilesUpload: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [progressInfos, setProgressInfos] = useState<Array<ProgressInfo>>([]);
  const [message, setMessage] = useState<Array<string>>([]);
  const [fileInfos, setFileInfos] = useState<Array<IFile>>([]);
  const [serverResponse, setServerResponse] = useState<any>(null);
  const progressInfosRef = useRef<any>(null);

  useEffect(() => {
    UploadService.getFiles().then((response) => {
      setFileInfos(response.data);
    });
  }, []);

  const selectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
    setProgressInfos([]);
    setMessage([]);
  };

  const upload = (idx: number, file: File) => {
    let _progressInfos = [...progressInfosRef.current];
    return UploadService.upload(file, (event) => {
      _progressInfos[idx].percentage = Math.round(
        (100 * event.loaded) / event.total
      );
      setProgressInfos(_progressInfos);
    })
      .then((response) => {
        setMessage((prevMessage) => [
          ...prevMessage,
          file.name + ": Successful!"
        ]);

        setServerResponse(response);
        console.log(`Response: ${response}`);
        //console.log(`Server Reponse: ${serverResponse}`);
      })
      .catch((err: any) => {
        _progressInfos[idx].percentage = 0;
        setProgressInfos(_progressInfos);

        let msg = file.name + ": Failed!";
        if (err.response && err.response.data && err.response.data.message) {
          msg += " " + err.response.data.message;
        }

        setMessage((prevMessage) => [
          ...prevMessage,
          msg
        ]);
      });
  };

  const uploadFiles = () => {
    if (selectedFiles != null) {
      const files = Array.from(selectedFiles);

      let _progressInfos = files.map((file) => ({
        percentage: 0,
        fileName: file.name
      }));

      progressInfosRef.current = _progressInfos;

      const uploadPromises = files.map((file, i) => upload(i, file));

      Promise.all(uploadPromises)
        .then(() => UploadService.getFiles())
        .then((files) => {
          setFileInfos(files.data);
        });

      setMessage([]);
    }
  };

  return (
    <div>
      {progressInfos &&
        progressInfos.length > 0 &&
        progressInfos.map((progressInfo: ProgressInfo, index: number) => (
          <div className="mb-2" key={index}>
            <span>{progressInfo.fileName}</span>
            <div className="progress">
              <div
                className="progress-bar progress-bar-info"
                role="progressbar"
                aria-valuenow={progressInfo.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: progressInfo.percentage + "%" }}
              >
                {progressInfo.percentage}%
              </div>
            </div>
          </div>
        ))}

      <div className="row my-3">
        <div className="col-8">
          <label className="btn btn-default p-0">
            <input type="file" multiple onChange={selectFiles} />
          </label>
        </div>

        <div className="col-4">
          <button
            className="btn btn-success btn-sm"
            disabled={!selectedFiles}
            onClick={uploadFiles}
          >
            Upload
          </button>
        </div>
      </div>

      {message.length > 0 && (
        <div className="alert alert-secondary" role="alert">
          <ul>
            {message.map((item, i) => {
              return <li key={i}>{item}</li>;
            })}
          </ul>
        </div>
      )}

      <div className="card">
        <div className="card-header">List of Files</div>
        <ul className="list-group list-group-flush">
          {fileInfos &&
            fileInfos.map((file, index) => (
              <li className="list-group-item" key={index}>
                <a href={file.url}>{file.name}</a>
              </li>
            ))}
        </ul>
      </div>

      <div>
        {serverResponse && (
          <ServerResponse response={serverResponse} />
        )}
      </div>
    </div>
  );
};

export default FilesUpload;