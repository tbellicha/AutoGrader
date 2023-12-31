'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
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
const { s3UploadHW, s3UploadTC } = require('./s3Service');

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

/**
 * @api {post} /api/upload/:assignment_id, Upload test case to s3 bucket specified by assignment_id
 */
app.post(
    "/api/upload/:assignment_id/testcase",
    passport.authenticate('jwt', {session: false}), upload.array('file'), async (req, res) => {
    try {
        if(!req.files){
            return res.status(400).send("No file included")
        }
        if(!req.user){
            return res.status(401).send("Invalid token")
        }
        if(req.user.role !== UserRole.TEACHER){
            return res.status(401).send("Not enough permissions")
        }
        const uploadResult = await s3Upl*oadTC(req.files, req.params.assignment_id)
        console.log(uploadResult)
        res.status(200).send("Testcase upload successful")
    } catch (error) {
        console.log("Error occurred: ", error)
        return res.status(500).send("An error has occurred.")
    }
})

/**
 * @api {post} /api/upload/:assignment_id/assignment, Upload homework files to s3 bucket specified by assignment_id
 */
app.post(
    "/api/upload/:assignment_id/assignment",
    passport.authenticate('jwt', {session: false}), upload.array('file'), async (req, res) => {
    try {
        if(!req.files){
            return res.status(400).send("No files were included")
        }
        if(!req.user){
            return res.status(401).send("Invalid token")
        }
        if(req.user.role !== UserRole.STUDENT){
            return res.status(401).send("Not enough permissions")
        }
        const uploadResult = await s3UploadHW(req.files, req.params.assignment_id)
        console.log(uploadResult)
        res.status(200).send("Homework upload successful")
    } catch (error) {
        console.log("Error occurred: ", error)
        return res.status(500).send("An error has occurred.")
    }
})

/**
 * @api {post} /api/signup/admin Signup as an Admin (Protected by JWT)
 * req.body.email: String
 * req.body.password: String
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
 * req.body.email: String
 * req.body.password: String
 * req.body.first_name: String
 * req.body.last_name: String
 */
app.post('/api/signup/student', (req, res, next) => {
  passport.authenticate('signup', { session: false }, async (err, user, info) => {
    if (err) throw new Error(err);
    if (user == false) {
        const signupInfoMessage = {
            message: info.message
        }
        return res.status(info.statusCode).json(signupInfoMessage)
    }

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
            data: { role: UserRole.STUDENT }
        });
        console.log("New student: ", updatedUser);
        return res.status(201).json({});
    } catch (error) {
        console.error(error.message);
        return res.status(401).send('An error occurred.');
    }
  })(req, res, next);
})

/**
 * @api {post} /api/login Login
 * req.body.email: String
 * req.body.password: String
 */
app.post('/api/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) throw new Error(err)
    if (user == false) {
        const loginInfoMessage = {
            message: info.message
        }
        return res.status(info.statusCode).json(loginInfoMessage)
    }
    const token = utils.generateToken(user.id)
    console.log("User logged in: ", user)
    return res.status(200).json({
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
 * @api {post} /api/course Create a new course (Protected by JWT)
 * req.body.course_code: String
 * req.body.course_name: String
 * req.body.teacher_id: String
 */
app.post(
  '/api/course',
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
 * @api {get} /api/course/:courseId Get course information (Protected by JWT)
 */
app.get(
  '/api/course/:courseId',
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Invalid token');
        }
        const course = await database.prisma.course.findUnique({
            where: { id: req.params.courseId },
            include: { Assignments: true, Enrollments: true }
        })
        return res.status(200).json({ course });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).send('An error occurred.');
    }
  }
)

/**
 * @api {post} /api/course/:course_id/assignment Create a new Assignment to a Course (Protected by JWT)
 * req.body.title: String
 * req.body.description: String
 * req.body.due_date: DateTime
 */
app.post(
  '/api/course/:course_id/assignment',
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

/**
 * @api {post} /api/assignment/:assignment_id/submission Create a new Submission to an Assignment (Protected by JWT)
 */
app.post(
  '/api/assignment/:assignment_id/submission',
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Invalid token');
        }

        if (req.user.role !== UserRole.STUDENT) {
            return res.status(401).send('Not enough permissions.');
        }
        const assignment = await database.prisma.assignment.findUnique({
            where: { id: req.params.assignment_id },
        })
        if (!assignment) {
            return res.status(400).send('Assignment does not exist.');
        }
        const student = await database.prisma.student.findUnique({
            where: { id: req.user.student_id },
        })
        if (!student) {
            return res.status(400).send('Student does not exist.');
        }
        const checkStudentEnrollment = await database.prisma.enrollment.findFirst({
            where: { course_id: assignment.course_id, student_id: student.id },
        })
        if (!checkStudentEnrollment) {
            return res.status(400).send('Student is not enrolled in the course.');
        }

        //AutoGrader service
        const body = { path: req.params.assignment_id }
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(process.env.AG_SERVICE, options);
        const homeworkData = await response.json(); 

        const submission = await database.prisma.submission.create({
            data: {
                submission_date: new Date(),
                score: homeworkData.studentsTotal,
                comment: "",
                student_id: req.user.student_id,
                assignment_id: assignment.id,
            }
        })
        const updatedAssignment = await database.prisma.assignment.update({
            where: { id: assignment.id },
            include: { Submissions: true },
            data: { Submissions: { connect: { id: submission.id } } }
        })
        const updatedStudent = await database.prisma.student.update({
            where: { id: req.user.student_id },
            include: { Submissions: true },
            data: { Submissions: { connect: { id: submission.id } } }
        })
        console.log("Updated Assignment: ", updatedAssignment)
        return res.status(200).json({ assignment, homeworkData });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).send('An error occurred.');
    }
  }
)

/**
 * @api {post} /api/course/:course_id/enroll Enroll to a course (Protected by JWT)
 * req.body.title: String
 * req.body.description: String
 * req.body.due_date: String
 */
app.post(
  '/api/course/:course_id/enroll',
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Invalid token');
        }
        if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.TEACHER) {
            return res.status(401).send('Not enough permissions.');
        }
        const student_id = req.body.student_id;
        const required_parameters = ['student_id'];
        if (!student_id) {
            res.status(400).send('Missing required parameters: ' + required_parameters.filter(param => !req.body[param]).join(', '))
            return
        }
        const course = await database.prisma.course.findUnique({
            where: { id: req.params.course_id },
        })
        if (!course) {
            return res.status(400).send('Course does not exist.');
        }
        if (req.user.role == UserRole.TEACHER && req.user.teacher_id !== course.teacher_id) {
            return res.status(401).send('Not enough permissions, teacher is not the owner of the course.');
        }
        const student = await database.prisma.student.findUnique({
            where: { id: student_id },
        })
        if (!student) {
            return res.status(400).send('Student does not exist.');
        }
        const checkStudentEnrollment = await database.prisma.enrollment.findFirst({
            where: { course_id: course.id, student_id: student.id },
        })
        if (checkStudentEnrollment) {
            return res.status(400).send('Student is already enrolled in the course.');
        }
        const enrollment = await database.prisma.enrollment.create({
            data: {
                course_id: course.id,
                student_id: student.id,
            }
        })
        const updatedCourse = await database.prisma.course.update({
            where: { id: course.id },
            include: { Enrollments: true },
            data: { Enrollments: { connect: { id: enrollment.id } } }
        })
        const updatedStudent = await database.prisma.student.update({
            where: { id: student.id },
            include: { Enrollments: true },
            data: { Enrollments: { connect: { id: enrollment.id } } }
        })
        console.log("Updated Course: ", updatedCourse)
        console.log("Updated Student: ", updatedStudent)
        return res.status(200).json({ enrollment });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).send('An error occurred.');
    }
  }
)

/**
 * @api {get} /api/course/:course_id/students List all students of a course (Protected by JWT)
 */
app.get('/api/course/:course_id/students',
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Invalid token');
        }
        if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.TEACHER) {
            return res.status(401).send('Not enough permissions.');
        }
        
        const course = await database.prisma.course.findUnique({
            where: { id: req.params.course_id },
        })
        if (!course) {
            return res.status(400).send('Course does not exist.');
        }
        if (req.user.role == UserRole.TEACHER && req.user.teacher_id !== course.teacher_id) {
            return res.status(401).send('Not enough permissions, teacher is not the owner of the course.');
        }
        const students = await database.prisma.student.findMany({
            where: { Enrollments: { some: { course_id: course.id } } }
        })
        console.log("Students: ", students)
        return res.status(200).json({ students });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).send('An error occurred.');
    }
  }
)

/**
 * @api {put} /api/users/:userId Manage an user (Protected by JWT)
 */
app.put(
  '/api/users/:userId',
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Invalid token');
        }
        const targetUser = await database.prisma.user.findUnique({
            where: { id: req.params.userId },
        });
        if (!targetUser) {
            return res.status(404).send('User not found.');
        }

        if (req.user.role === UserRole.ADMIN) {
            const { email, password, role } = req.body;
            const updatedData = {};
            if (email) updatedData.email = email;
            if (password) updatedData.password = await hash(password);
            if (role) updatedData.role = role;

            const user = await database.prisma.user.findUnique({
                where: { id: targetUser.id },
            });
            const newEmail = updatedData.email ?? user.email;
            var updatedUser = {}
            if (user.role != updatedData.role) {
                if (updatedData.role === UserRole.TEACHER) {
                    if (user.role === UserRole.STUDENT) {
                        const student = await database.prisma.student.delete({
                            where: { id: user.student_id }
                        })
                    }
                    const teacher = await database.prisma.teacher.create({
                        data: {
                            email: newEmail,
                            first_name: user.first_name,
                            last_name: user.last_name,
                        }
                    });
                    updatedUser = await database.prisma.user.update({
                        where: { id: user.id },
                        data: {
                            email: newEmail,
                            role: UserRole.TEACHER,
                            student_id: null,
                            teacher_id: teacher.id
                        },
                    });
                    console.log("Updated user: ", updatedUser);
                    return res.status(200).json({ user: updatedUser });
                }
                else if (updatedData.role === UserRole.STUDENT) {
                    if (user.role === UserRole.TEACHER) {
                        const teacher = await database.prisma.teacher.delete({
                            where: { id: user.teacher_id }
                        })
                    }
                    const student = await database.prisma.student.create({
                        data: {
                            email: newEmail,
                            first_name: user.first_name,
                            last_name: user.last_name,
                        }
                    });
                    updatedUser = await database.prisma.user.update({
                        where: { id: user.id },
                        data: {
                            email: newEmail,
                            role: UserRole.STUDENT,
                            teacher_id: null,
                            student_id: student.id
                        },
                    });
                    console.log("Updated user: ", updatedUser);
                    return res.status(200).json({ user: updatedUser });
                }
            } else {
                updatedUser = await database.prisma.user.update({
                    where: { id: user.id },
                    data: { ...updatedData },
                });
                console.log("Updated user: ", updatedUser);
                return res.status(200).json({ user: updatedUser });
            }
        } else if (req.user.role === UserRole.STUDENT) {
            if (req.user.id !== targetUser.id)
                return res.status(401).send('Not enough permissions.');
            const { email, password } = req.body;
            const updatedData = {};
            if (email) updatedData.email = email;
            if (password) updatedData.password = await hash(password);

            const updatedUser = await database.prisma.user.update({
                where: { id: targetUser.id },
                data: { ...updatedData },
            });

            console.log("Updated user: ", updatedUser);
            return res.status(200).json({ user: updatedUser });
        } else {
            return res.status(401).send('Not enough permissions.');
        }
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).send('An error occurred.');
    }
  }
);

/**
 * @api {get} /api/students List all students (Protected by JWT)
 */
app.get(
  '/api/students',
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Invalid token');
        }
        if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.TEACHER) {
            return res.status(401).send('Not enough permissions.');
        }
        const students = await database.prisma.student.findMany({
            include: { Enrollments: true, Submissions: true },
        });
        return res.status(200).json({ students });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).send('An error occurred.');
    }
  }
)

/**
 * @api {get} /api/students/:studentId Get student information (Protected by JWT)
 */
app.get(
  '/api/students/:studentId',
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Invalid token');
        }
        if (req.user.role !== UserRole.ADMIN && req.params.studentId !== req.user.student_id) {
            return res.status(401).send('Not enough permissions.');
        }
        const student = await database.prisma.student.findUnique({
            where : { id: req.params.studentId },
            include: { Enrollments: true },
        });
        if (!student) {
            return res.status(400).send('Student does not exist.');
        }
        return res.status(200).json({ student });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).send('An error occurred.');
    }
  }
)

/**
 * @api {get} /api/teachers/:teacherId Get teacher information (Protected by JWT)
 */
app.get('/api/teachers/:teacherId',
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Invalid token');
        }
        if (req.user.role !== UserRole.ADMIN && req.params.teacherId !== req.user.teacher_id) {
            return res.status(401).send('Not enough permissions.');
        }
        const teacher = await database.prisma.teacher.findUnique({
            where: { id: req.params.teacherId },
            include: { Courses: true }
        })
        if (!teacher) {
            return res.status(400).send('Teacher does not exist.');
        }
        console.log("Teacher: ", teacher)
        return res.status(200).json({ teacher });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).send('An error occurred.');
    }
  }
);

async function includeFixtures() {
    try {
        const teacher = await database.prisma.teacher.create({
            data: {
                first_name: "John",
                last_name: "Doe",
                email: "john.doe@example.com"
            }
        });
        var student = await database.prisma.student.create({
            data: {
                first_name: "Jane",
                last_name: "Doe",
                email: "student@example.com"
            }
        });
        const user = await database.prisma.user.create({
            data: {
                email: teacher.email,
                password: await utils.hash("password"),
                teacher_id: teacher.id,
                role: UserRole.TEACHER
            }
        });
        var course = await database.prisma.course.create({
            data: {
                course_code: "CS 471",
                course_name: "Capstone Project",
                teacher_id: teacher.id,
                Assignments: {
                    create: [
                        {
                            title: "Assignment 1",
                            description: "Week 1",
                            due_date: new Date('2023-11-01T00:00:00'),
                        },
                        {
                            title: "Assignment 2",
                            description: "Week 2",
                            due_date: new Date('2023-11-15T00:00:00'),
                        }
                    ]
                },
                Enrollments: {
                    create: []
                }
            },
            include: { Assignments: true }
        });
        const user2 = await database.prisma.user.create({
            data: {
                email: student.email,
                password: await utils.hash("password"),
                student_id: student.id,
                role: UserRole.STUDENT,
            }
        });
        const enrollment = await database.prisma.enrollment.create({
            data: {
                course_id: course.id,
                student_id: student.id,
            }
        });
        student = await database.prisma.student.update({
            where: { id: student.id },
            include: { Enrollments: true },
            data: { Enrollments: { connect: { id: enrollment.id } } }
        });
        course = await database.prisma.course.update({
            where: { id: course.id },
            include: { Enrollments: true },
            data: { Enrollments: { connect: { id: enrollment.id } } }
        });


        console.log("Created course: ", course);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

const ip = '0.0.0.0'
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(path.join(__dirname, "server.js"));
    includeFixtures()
});
