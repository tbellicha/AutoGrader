import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import FilesUpload from "./components/FilesUpload";

const App: React.FC = () => {
  return (
    <div className="container" style={{ width: "600px" }}>
      <div className="my-3">
        <h3>bezkoder.com</h3>
        <h4>React Typescript Multiple Files Upload</h4>
      </div>

      <FilesUpload />
    </div>
  );
}

export default App;