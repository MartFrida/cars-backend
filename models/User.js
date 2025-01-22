import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";
import { emailRegexp } from '../constants/regexp.js'

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match: emailRegexp,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlenth: 6,
  },
  token: {
    type: String,
  },
}, { versionKey: false, timestamps: true })

userSchema.post('save', handleSaveError)

userSchema.pre('findOneAndUpdate', setUpdateSettings)

userSchema.post('findOneAndUpdate', handleSaveError)


const User = model("user", userSchema)

export default User;