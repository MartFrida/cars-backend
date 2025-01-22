import * as authServices from '../services/authServices.js'
import * as userServices from '../services/userServices.js'
import jwt from 'jsonwebtoken'
import ctrlWrapper from '../decorators/ctrlWrapper.js'
import HttpError from '../helpers/HttpError.js'
import bcrypt from 'bcrypt'

const { JWT_SECRET } = process.env

const signup = async (req, res) => {
  const { email } = req.body
  const user = await userServices.findUser({ email })
  if (user) {
    throw HttpError(409, "This email already in use")
  }
  const newUser = await authServices.signup(req.body)

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    password: newUser.password,
  })
}

const signin = async (req, res) => {
  const { email, password } = req.body
  const user = await userServices.findUser({ email })
  if (!user) {
    throw HttpError(401, "Email or password invalid")
  }
  const passwordCompare = await bcrypt.compare(password, user.password)
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid")
  }
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email
  }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" })
  await authServices.setToken(user._id, token)

  res.json({
    token,
    username: user.username,
    email: user.email,
  })
}

const getCurrent = async (req, res) => {
  const { email, username } = req.user

  res.json({
    email,
    username,
  })
}

const signout = async (req, res) => {
  const { _id } = req.user
  await authServices.setToken(_id)

  res.json({
    message: 'Signout success'
  })
}

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
}