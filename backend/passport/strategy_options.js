const { Strategy } = require('passport-local')
const { hash, compare } = require('../utils')
const passport = require('passport')
const database = require('../database_init')
require('dotenv').config({ path: '../local.env' })

const options = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}

passport.use(
  'signup',
  new Strategy(options, async (req, email, password, cb) => {
    try {
      const existsEmail = await database.prisma.user.findFirst({
        where: { email }
      })
      if (existsEmail) {
        return cb(null, false, {
          message: 'Email already exists.',
          statusCode: 400
        })
      }
      const student = await database.prisma.student.create({
        data: {
          email: req.body.email,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
        }
      })
      const user = await database.prisma.user.create({
        data: {
          email: email,
          password: await hash(password),
          student_id: student.id,
        }
      })
      return cb(null, user)
    } catch (err) {
      console.error(err.message)
      return cb(null, err)
    }
  })
)


passport.use(
  'signupAdmin',
  new Strategy(options, async (req, email, password, cb) => {
    try {
      const existsEmail = await database.prisma.user.findFirst({
        where: { email }
      })
      if (existsEmail) {
        return cb(null, false, {
          message: 'Email already exists.',
          statusCode: 400
        })
      }
      const user = await database.prisma.user.create({
        data: {
          email: email,
          password: await hash(password),
        }
      })
      return cb(null, user)
    } catch (err) {
      console.error(err.message)
      return cb(null, err)
    }
  })
)

options.passReqToCallback = false

passport.use(
  'login',
  new Strategy(options, async (email, password, cb) => {
    try {
      const user = await database.prisma.user.findFirst({
        where: { email }
      })
      if (!user)
        return cb(null, false, {
          message: 'No user found.',
          statusCode: 400
        })
      const validPassword = await compare(password, user.password)
      if (!validPassword)
        return cb(null, false, {
          message: 'Invalid credentials.',
          statusCode: 401
        })
      return cb(null, user)
    } catch (err) {
      console.error(err.message)
      return cb(null, err)
    }
  })
)
