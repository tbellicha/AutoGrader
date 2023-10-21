const express = require('express');
const bodyParser = require('body-parser'); 
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path'); 
const cors = require('cors')
const { exec } = require('child_process')
const os = require('os')

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname ,'/public'))); 
app.use(cors())

//Setting storage settings
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //Determine destination path to save file based on api path  
        const destination = req.path === '/api/upload/file' ? '/build/run/tests/code/' : '/build/run/tests/'
        cb(null, path.join(__dirname, destination))
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })  

//For the moment we include the test script already, we only require the homework submission for the demo
app.post("/api/upload/testcase", upload.single('file'), (req, res) => {})

app.post("/api/upload/file", upload.single('file'), (req, res) => {   
    //Entry point 
    const scriptPath = path.join(__dirname, "/run.py");   
    const result = req.file.filename.match("(?<lang>py|js|cpp|java)")   

    const configOS = {
        linux: { python: '/usr/bin/python3'},
        win32: { python: 'python'}
    }

    const platform = os.platform()
    const pythonPath = configOS[platform].python

    try {
        if(req.file){
            exec(`${pythonPath} ${scriptPath} "${result.groups["lang"]}"`, (error, stdout, stderr) => { 
                console.log("Starting execution....")
                if(error) {
                    res.status(500).send("Script execution failed")
                    console.error("Error occured: ", stderr)
                } else {
                    console.log(`Output: ${stdout}`)
                    res.json({output: stdout})
                }
            })
        } else {
            res.status(500).send("File upload failed")
        } 
    } catch(e) {  
        res.status(500).send(`Error occured: ${e.message}`)
    }
    
})

const ip = '0.0.0.0'
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(path.join(__dirname, "server.js"));
});