import express from 'express'
import validateBody from '../decorators/validateBody.js'
import carControllers from '../controllers/carsControllers.js'
import { carAddSchema, carUpdateSchema } from '../schemas/carsSchemas.js'
import isValidId from '../middlewares/isValidId.js'
import authtenticate from '../middlewares/authtenticate.js'
import upload from '../middlewares/upload.js'

const carsRouter = express.Router()

carsRouter.get('/', carControllers.getAllCars)

carsRouter.get('/:id', isValidId, carControllers.getCarById)

carsRouter.get('/owner/:id', authtenticate, carControllers.getAllCarsByOwner)

// upload.fields([{name:'photo', maxCount:1}])
// upload.array('photo', 3)
carsRouter.post('/', upload.single("photo"), authtenticate, validateBody(carAddSchema), carControllers.addCar)

carsRouter.put('/:id', authtenticate, isValidId, validateBody(carUpdateSchema), carControllers.updateCar)

carsRouter.delete('/:id', authtenticate, isValidId, carControllers.deleteCar)

export default carsRouter;