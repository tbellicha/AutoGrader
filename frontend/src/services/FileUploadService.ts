import http from "../http-common";

const upload = (file: File, onUploadProgress: (progressEvent: any) => void): Promise<any> => {
  let formData = new FormData();

  formData.append("file", file);

  return http.post("/api/upload/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  })
  .then(response => response.data);
};

const getFiles = () : Promise<any> => {
  return http.get("/files");
};

const FileUploadService = {
  upload,
  getFiles,
};

export default FileUploadService;