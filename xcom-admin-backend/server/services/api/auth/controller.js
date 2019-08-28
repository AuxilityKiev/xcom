import jwt from 'jsonwebtoken'
import Exception from '../../../utils/exception'
import passport from 'koa-passport'
import bcrypt from 'bcrypt'

import { JWT_SECRET } from '../../../config/env.config'
import User from '../../../db/models/user'

async function auth (ctx) {
  const { email, password } = ctx.request.body
  const user = await User.findOne({ email }) 
  if (user) {
    const passCheck = bcrypt.compareSync(password, user.password)
    if (passCheck) {
      ctx.state.sign = true
      ctx.response.body = {
          token: jwt.sign({
            id: user.id,
            email: user.email
          }, JWT_SECRET)
      }
      ctx.status = 200
    } else {
      ctx.status = 400
      throw new Exception(400)
    }
  } else {
    ctx.status = 404
    throw new Exception(404, 'User was not found')
  }  
}

async function userGuard (ctx, next) {
    await passport.authenticate('jwt', function (err, user) {
      if (!user) {
        ctx.status = 401
      }
      ctx.state.user = user
    })(ctx)
    if (ctx.status !== 401) {
      return next()
    } else {
      throw new Exception(401, 'Unauthorized user')
    }
  }

export default {
  auth,
  userGuard
}
