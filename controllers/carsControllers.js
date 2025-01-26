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

const getCarsByFilter = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query
    const skip = (page - 1) * limit
    const { make, year, mileageFrom, mileageTo, minPrice, maxPrice, sortBy } = req.query

    const query = {};

    if (make) {
      query.make = { $regex: make, $options: "i" }; // Пошук без урахування регістру
    }

    // Фільтрація за роком
    if (year) {
      query.year = {};
      if (year) query.year.$gte = parseFloat(year); // Рік >= year
    }
    // Фільтрація за пробігом
    if (mileageFrom || mileageTo) {
      query.mileage = {};
      console.log(mileageFrom)
      if (mileageFrom) query.mileage.$gte = parseFloat(mileageFrom); // пробіг >= mileageFrom
      if (mileageTo) query.mileage.$lte = parseFloat(mileageTo); // пробіг <= mileageTo
    }
    // Фільтрація за діапазоном цін
    if (minPrice || maxPrice) {
      query.rentalPrice = {};
      if (minPrice) query.rentalPrice.$gte = parseFloat(minPrice); // Ціна >= minPrice
      if (maxPrice) query.rentalPrice.$lte = parseFloat(maxPrice); // Ціна <= maxPrice
    }
    // Сортування (опціонально)
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1; // Сортування за зростанням або спаданням
    }

    // // Виконання запиту
    // const items = await carsServices.find(query).sort(sortOptions);
    const result = await carsServices.getCarsByFilter(query, skip, limit)

    // Повертаємо результат клієнту
    console.log(skip, limit)
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
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
  getCarsByFilter: ctrlWrapper(getCarsByFilter),
  getCarById: ctrlWrapper(getCarById),
  addCar: ctrlWrapper(addCar),
  updateCar: ctrlWrapper(updateCar),
  deleteCar: ctrlWrapper(deleteCar)
}