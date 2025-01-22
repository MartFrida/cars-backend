import * as carsServices from '../services/carsServices.js'
import HttpError from '../helpers/HttpError.js'
import ctrlWrapper from '../decorators/ctrlWrapper.js'
import cloudinary from '../helpers/cloudinary.js'

const getAllCars = async (req, res) => {
  const { page = 1, limit = 50 } = req.query
  const skip = (page - 1) * limit
  const result = await carsServices.getAllCars(skip, limit);
  const total = await carsServices.getCarsCountByFilter()
  res.json({
    total,
    result,
  })
}

const getAllCarsByOwner = async (req, res) => {
  const { _id: owner } = req.user
  const { page = 1, limit = 5 } = req.query
  const skip = (page - 1) * limit
  const result = await carsServices.getCarsByFilter({ owner }, { skip, limit })
  const total = await carsServices.getCarsCountByFilter({ owner })
  res.json({
    total,
    result,
  })
}

const getCarById = async (req, res) => {
  const { id } = req.params
  const result = await carsServices.getCarById(id)
  if (!result)
    throw HttpError(404, `Car with ID ${id} not found`)
  res.json(result)
}

const addCar = async (req, res) => {
  const { _id: owner } = req.user
  // const { url: photo } = await cloudinary.uploader.upload(req.file.path, {
  //   folder: 'cars'
  // })
  console.log(req.body)
  const result = await carsServices.addCar({ ...req.body, owner })
  res.status(201).json(result)
}

const updateCar = async (req, res) => {
  const { id } = req.params
  const { _id: owner } = req.user
  const result = await carsServices.updateCarByFilter({ _id: id, owner }, req.body)
  if (!result)
    throw HttpError(404, `Car with ID ${id} not found`)
  res.json(result)
}

const deleteCar = async (req, res) => {
  const { id } = req.params
  const { _id: owner } = req.user
  if (!owner) {
    throw HttpError(401, 'no owner')
  }
  const result = await carsServices.deleteCarByfilter({ _id: id, owner })
  if (!result)
    throw HttpError(404, `Car with ID ${id} not found`)

  res.json({
    message: 'Delete success'
  })
}

export default {
  getAllCars: ctrlWrapper(getAllCars),
  getAllCarsByOwner: ctrlWrapper(getAllCarsByOwner),
  getCarById: ctrlWrapper(getCarById),
  addCar: ctrlWrapper(addCar),
  updateCar: ctrlWrapper(updateCar),
  deleteCar: ctrlWrapper(deleteCar)
}