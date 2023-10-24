const { Strategy, ExtractJwt } = require('passport-jwt')
const passport = require('passport')
const database = require('../database_init')
require('dotenv').config({ path: '../application.env' })

const options = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

passport.use(
  new Strategy(options, async (jwt_payload, done) => {
    try {
      const user = await database.prisma.user.findUnique({
        where: {
          id: jwt_payload.id
        }
      })
      if (!user.mailVerification) return done(null, null)
      return done(null, user)
    } catch (err) {
      console.error(err.message)
      return done(null, null)
    }
  })
)
