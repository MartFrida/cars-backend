import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const carSchema = new Schema({
  year: {
    type: Number,
    required: [true, 'Why no year?'],
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: [true, 'Why no model?'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type:
  {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  description:
  {
    type: String,
    required: true,
  },
  fuelConsumption: {
    type: Number,
    required: false,
  },
  engineSize: {
    type: String,
    required: false,
  },
  rentalPrice: {
    type: String,
    required: true,
  },
  rentalCompany: {
    type: Date,
    required: true,
  },
  address:
  {
    type: String,
    required: true,
  },
  rentalConditions: {
    type: String,
    required: false,
  },
  mileage:
  {
    type: Number,
    required: true,
  },
}, { versionKey: false, timestamps: true })

carSchema.post('save', handleSaveError)

carSchema.pre('findOneAndUpdate', setUpdateSettings)

carSchema.post('findOneAndUpdate', handleSaveError)

const Car = model('car', carSchema)

export default Car;