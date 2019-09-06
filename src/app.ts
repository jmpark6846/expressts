import express from 'express'
import mongoose, { connect } from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import errorMiddleware from './middleware/error.middleware'
import loggerMiddleware from './middleware/logger.middleware'
import authMiddleware from './middleware/auth.middleware'
import Controller from 'interfaces/controller.interface'

class App {
  public app: express.Application
  public port: number

  constructor(controllers: Controller[]) {
    this.app = express()

    this.initializeMiddleware()
    this.initializeControllers(controllers)
    this.app.use(errorMiddleware)
  }

  private initializeMiddleware() {
    this.app.use(loggerMiddleware)
    this.app.use(bodyParser.json())
    this.app.use(cookieParser())
  }

  private initializeControllers(controllers) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router)
    })
  }

  public listen() {
    this.app.listen(process.env.PORT, () => console.log(`app is running on ${process.env.PORT}`))
  }
}

export default App
