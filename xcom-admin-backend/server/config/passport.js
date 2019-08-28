import passport from 'koa-passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import {
  JWT_SECRET
} from './env.config'
import User from './../db/models/user'

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
}
  

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
    return User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err))
})


passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id)
    if (user) {
      return done(null, user)
    }
    return done(null, false)
  } catch (err) {
    return done(err)
  }
}))


export default passport
