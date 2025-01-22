import Joi from 'joi'

export const carAddSchema = Joi.object({
  year: Joi.number().required(),
  make: Joi.string().required(),
  model: Joi.string().required(),
  type: Joi.string().required(),
  img: Joi.number().required(),
  description: Joi.string().required(),
  fuelConsumption: Joi.string(),
  engineSize: Joi.string(),
  rentalPrice: Joi.number().required(),
  rentalCompany: Joi.string().required(),
  address: Joi.string().required(),
  rentalConditions: Joi.string(),
  mileage: Joi.number().required(),
})

export const carUpdateSchema = Joi.object({
  year: Joi.number(),
  make: Joi.string(),
  model: Joi.string(),
  type: Joi.string(),
  img: Joi.number(),
  description: Joi.string(),
  fuelConsumption: Joi.string(),
  engineSize: Joi.string(),
  rentalPrice: Joi.number(),
  rentalCompany: Joi.string(),
  address: Joi.string(),
  rentalConditions: Joi.string(),
  mileage: Joi.number(),
})