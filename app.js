import express from "express";
import cors from 'cors';
import morgan from "morgan";
import articlesRouter from "./routes/carRouter.js";
import mongoose from "mongoose";
import 'dotenv/config';
import authRouter from "./routes/authRouter.js";

const app = express();
app.use(morgan('tiny'))
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))
app.use(express.json())
app.use(express.static('public'))

app.use('/api/auth', authRouter)
app.use('/api/cars', articlesRouter)

app.use((_, res) => {
  res.status(404).json({
    message: "Not Found"
  })
})

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message })
})


const { DB_HOST, PORT = 3001 } = process.env

mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`)
    })
  }
  )
  .catch(error => {
    console.log(error.message)
    process.exit(1)
  });


