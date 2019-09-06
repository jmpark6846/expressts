import express from "express";
import mongoose, { connect } from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.middleware";
import loggerMiddleware from "./middleware/logger.middleware";
import authMiddleware from "./middleware/auth.middleware";
import Controller from "interfaces/controller.interface";
class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddleware();
    this.connectDatabase();
    this.initializeControllers(controllers);
    this.app.use(errorMiddleware);
  }

  private initializeMiddleware() {
    this.app.use(loggerMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  private async connectDatabase() {
    const { DB_PASSWORD, DB_PATH, DB_USER, PORT } = process.env;
    try {
      const connection = await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_PATH}`, {
        useNewUrlParser: true
      });
      if (connection) {
        console.log("database connection successful");
      }
    } catch (error) {
      console.error("database connection failed");
      console.error(error);
    }
  }

  public listen() {
    this.app.listen(process.env.PORT, () => console.log(`app is running on ${process.env.PORT}`));
  }
}

export default App;
