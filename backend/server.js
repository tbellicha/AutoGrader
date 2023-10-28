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
const jwtoken = require('jsonwebtoken');
const { UserRole } = require('@prisma/client');

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
 * @api {post} /api/signup/admin Signup as an Admin (Protected by JWT)
 * req.body.email: string
 * req.body.password: string
 */
app.post('/api/signup/admin', verifyAdminToken, (req, res, next) => {
    passport.authenticate('signupAdmin', { session: false }, async (err, user, info) => {
        if (err) throw new Error(err);
        if (user === false) return res.json(info);
        try {
            const newUser = await database.prisma.user.findUnique({
                where: {
                    id: user.id
                }
            });
            const updatedUser = await database.prisma.user.update({
                where: { id: newUser.id },
                data: { role: UserRole.ADMIN }
            });
            console.log("New user (Admin): ", updatedUser)
            return res.status(201).json({
                status: 'success',
                statusCode: res.statusCode,
            });
        } catch (error) {
            console.error(error.message);
            return res.status(401).send('An error occurred.');
        }
    })(req, res, next);
});

function verifyAdminToken(req, res, next) {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).send('Access denied. Token is missing.');
        }
        jwtoken.verify(token, process.env.ADMIN_TOKEN, (err, payload) => {
            if (err) {
                console.log("Error when creating Admin user: ", err)
                return res.status(403).send('Access denied. Invalid token.');
            }
            next();
        });
    } catch (error) {
        console.log("Error when creating Admin user: ", error)
        return res.status(403).send('Access denied. Invalid token.');
    }
}

/**
 * @api {post} /api/signup/student Signup as a student
 * req.body.email: string
 * req.body.password: string
 */
app.post('/api/signup/student', (req, res, next) => {
    passport.authenticate('signup', { session: false },  async (err, user, info) => {
        if (err) throw new Error(err)
        if (user === false) return res.json(info)
        const token = utils.generateToken(user.id)
        try {
            const decoded = jwt.decode(token, process.env.JWT_SECRET)
            const user = await database.prisma.user.findUnique({
                where: { id: decoded.id }
            })
            if (user.role !== UserRole.STUDENT) {
                throw new Error('User is not a student.')
            }
            console.log("New user (Student): ", user)
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

/**
 * @api {get} /api/users List all users (Protected by JWT)
 */
app.get(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send('Invalid token');
      }

      if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.TEACHER) {
        return res.status(401).send('Not enough permissions.');
      }

      const users = await database.prisma.user.findMany();
      return res.status(200).json({
        status: 'success',
        data: { users },
        statusCode: res.statusCode,
      });
    } catch (error) {
      console.error('Error occurred:', error);
      return res.status(500).send('An error occurred.');
    }
  }
);

const ip = '0.0.0.0'
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(path.join(__dirname, "server.js"));
});
