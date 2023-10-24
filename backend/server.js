'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const cors = require('cors')
const { exec } = require('child_process')
const os = require('os')
const database = require('./database_init')
const utils = require('./utils')
require('dotenv').config({ path: '../local.env' })

/* Authentication */
const passport = require('passport')
const auth = require('./passport/strategy_options')
const auth_token = require('./passport/bearer_token')
const session = require('express-session')
const jwt = require('jwt-simple');

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  done(null, { id: id })
})

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname ,'/public')));
app.use(cors())
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

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
                    console.error("Error occurred: ", stderr)
                } else {
                    console.log(`Output: ${stdout}`)
                    res.json({output: stdout})
                }
            })
        } else {
            res.status(500).send("File upload failed")
        }
    } catch(e) {
        res.status(500).send(`Error occurred: ${e.message}`)
    }
})

/**
 * @api {post} /api/signup Signup
 * req.body.email: string
 * req.body.password: string
 */
app.post('/api/signup', (req, res, next) => {
    passport.authenticate('signup', { session: false },  async (err, user, info) => {
        if (err) throw new Error(err)
        if (user === false) return res.json(info)
        const token = utils.generateToken(user.id)
        try {
            const decoded = jwt.decode(token, process.env.JWT_SECRET)
            const user = await database.prisma.user.findUnique({
                where: {
                    id: decoded.id
                }
            })
            console.log("New user: ", user)
            return res.status(201).json({
                status: 'success',
                statusCode: res.statusCode,
            })
        } catch (error) {
            console.error(error.message)
            return res.status(401).send('An error occurred.')
        }
    })(req, res, next)
})

/**
 * @api {post} /api/login Login
 * req.body.email: string
 * req.body.password: string
 */
app.post('/api/login', (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) throw new Error(err)
        if (user == false) return res.json(info)
        const token = utils.generateToken(user.id)
        return res.status(201).json({
            status: 'success',
            data: { message: 'Welcome back.', user, token },
            statusCode: res.statusCode
        })
    })(req, res, next)
})

const ip = '0.0.0.0'
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(path.join(__dirname, "server.js"));
});
