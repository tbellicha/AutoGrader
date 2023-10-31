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
const { s3Uploadv3 } = require('./s3Service');

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
const storage = multer.memoryStorage()

const upload = multer({ storage: storage })

//For the moment we include the test script already, we only require the homework submission for the demo
app.post("/api/upload/testcase", upload.single('file'), (req, res) => {})

app.post("/api/upload/file", upload.single('file'), async (req, res) => {
    try {
        const uploadResult = await s3Uploadv3(file);
        console.log(uploadResult);
        res.json({status: "success", uploadResult})
    } catch (e) {
        console.log(e)
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
            where: { id: user.id }
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
 * req.body.first_name: string
 * req.body.last_name: string
 */
app.post('/api/signup/student', (req, res, next) => {
  passport.authenticate('signup', { session: false }, async (err, user, info) => {
    if (err) throw new Error(err);
    if (user === false) return res.json(info);

    const email = req.body.email;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const password = req.body.password;
    const required_parameters = ['email', 'first_name', 'last_name', 'password'];
    if (!email || !password || !first_name || !last_name) {
        res.status(400).send('Missing required parameters: ' + required_parameters.filter(param => !req.body[param]).join(', '))
        return
    }
    try {
        const newUser = await database.prisma.user.findUnique({
            where: { id: user.id }
        });
        const updatedUser = await database.prisma.user.update({
            where: { id: newUser.id },
            data: { role: UserRole.TEACHER }
        });
        console.log("New student: ", updatedUser);
        return res.status(201).json({
            status: 'success',
            statusCode: res.statusCode,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(401).send('An error occurred.');
    }
  })(req, res, next);
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
    console.log("User logged in: ", user)
    return res.status(201).json({
        user: user,
        token: token
    })
  })(req, res, next)
})

/**
 * @api {get} /api/users List all users (Protected by JWT)
 */
app.get(
  '/api/users',
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Invalid token');
        }
        if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.TEACHER) {
            return res.status(401).send('Not enough permissions.');
        }

        const users = await database.prisma.user.findMany();
        return res.status(200).json({ users });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).send('An error occurred.');
    }
  }
)

/**
 * @api {post} /api/course/create Create a new course (Protected by JWT)
 * req.body.course_code: string
 * req.body.course_name: string
 * req.body.teacher_id: string
 */
app.post(
  '/api/course/create',
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Invalid token');
        }
        if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.TEACHER) {
            return res.status(401).send('Not enough permissions.');
        }
        const course_code = req.body.course_code;
        const course_name = req.body.course_name;
        const teacher_id = req.body.teacher_id;
        const required_parameters = ['course_name', 'course_code', 'teacher_id'];
        if (!course_code || !course_name || !teacher_id) {
            res.status(400).send('Missing required parameters: ' + required_parameters.filter(param => !req.body[param]).join(', '))
            return
        }
        const teacher = await database.prisma.teacher.findUnique({
            where: { id: teacher_id },
        })
        if (!teacher) {
            return res.status(400).send('Teacher does not exist.');
        }
        const course = await database.prisma.course.create({
            data: {
                course_code: course_code,
                course_name: course_name,
                teacher_id: teacher.id,
                Assignments: { create : [] },
                Enrollments: { create : [] },
            }
        })
        const updatedTeacher = await database.prisma.teacher.update({
            where: { id: teacher.id },
            include : { Courses: true },
            data: { Courses: { connect: { id: course.id } } }
        })
        console.log("Updated teacher: ", updatedTeacher)
        return res.status(200).json({ course });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).send('An error occurred.');
    }
  }
)

/**
 * @api {post} /api/course/create Create a new course (Protected by JWT)
 * req.body.title: string
 * req.body.description: string
 * req.body.due_date: string
 */
app.post(
  '/api/course/:course_id/assignment/create',
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Invalid token');
        }
        if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.TEACHER) {
            return res.status(401).send('Not enough permissions.');
        }
        const title = req.body.title;
        const description = req.body.description;
        const due_date = req.body.due_date;
        const required_parameters = ['title', 'description', 'due_date'];
        if (!title || !description || !due_date) {
            res.status(400).send('Missing required parameters: ' + required_parameters.filter(param => !req.body[param]).join(', '))
            return
        }
        const course = await database.prisma.course.findUnique({
            where: { id: req.params.course_id },
        })
        if (!course) {
            return res.status(400).send('Course does not exist.');
        }
        if (req.user.role !== UserRole.ADMIN && course.teacher_id !== req.user.teacher_id) {
            return res.status(401).send('Not enough permissions.');
        }
        const assignment = await database.prisma.assignment.create({
            data: {
                title: title,
                description: description,
                due_date: due_date,
                course_id: course.id,
                Submissions: { create : [] },
            }
        })
        const updatedCourse = await database.prisma.course.update({
            where: { id: course.id },
            include: { Assignments: true },
            data: { Assignments: { connect: { id: assignment.id } } }
        })
        console.log("Updated Course: ", updatedCourse)
        return res.status(200).json({ course });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).send('An error occurred.');
    }
  }
)

const ip = '0.0.0.0'
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(path.join(__dirname, "server.js"));
});
