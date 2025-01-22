import express from 'express'
import validateBody from '../decorators/validateBody.js'
import { signupSchema, signinSchema } from '../schemas/usersSchemas.js'
import authControllers from '../controllers/authControllers.js'
import authenticate from '../middlewares/authtenticate.js'

const authRouter = express.Router()

authRouter.post('/signup', validateBody(signupSchema), authControllers.signup)

authRouter.post('/signin', validateBody(signinSchema), authControllers.signin)

authRouter.get('/current', authenticate, authControllers.getCurrent)

authRouter.post('/signout', authenticate, authControllers.signout)

export default authRouter