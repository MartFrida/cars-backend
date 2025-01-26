import Car from "../models/Car.js";

export const getAllCars = (offset, limit) => Car.find().skip(offset).limit(limit)

// export const getCarsByFilter = (filter, query = {}) => Car.find(filter, '-createdAt -updatedAt', query)

export const getCarsByFilter = (queryFilter = {}, offset, limit) => Car.find(queryFilter).skip(offset).limit(limit).exec()

export const getCarsCountByFilter = (filter) => Car.countDocuments(filter)

export const getCarById = (id) => Car.findById(id)

export const addCar = (data) => Car.create(data)

export const updateCarByFilter = (filter, data) => Car.findOneAndUpdate(filter, data, { new: true, runValidators: true })

export const deleteCarById = (id) => Car.findByIdAndDelete(id)

export const deleteCarByfilter = filter => Car.findOneAndDelete(filter)
