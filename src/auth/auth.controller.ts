import bcrypt from "bcrypt";
import ServerError from "../exceptions/ServerError";
import { NextFunction, Request, Response, Router } from "express";
import Controller from "interfaces/controller.interface";
import BadRequest from "../exceptions/BadRequest";
import validationMiddleware from "../middleware/validation.middleware";
import UserModel, { SignInData, User } from "./user.model";
import { DataStoredInToken, TokenData } from "./auth.interface";
import jwt from "jsonwebtoken";

class AuthController implements Controller {
  public path = "/users";
  public router = Router();
  private user = UserModel;

  constructor() {
    this.initializeRoutes();
  }
  public initializeRoutes() {
    this.router.post(this.path + "/signup", validationMiddleware(User), this.signup);
    this.router.post(this.path + "/signin", validationMiddleware(SignInData), this.signin);
  }

  private signup = async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (await this.user.findOne({ email: request.body.email })) {
        next(new BadRequest("resoucre already exists"));
      } else {
        const hashedPassword = await bcrypt.hash(request.body.password, 3);
        const user = await this.user.create({
          ...request.body,
          password: hashedPassword
        });
        const token = this.createToken(user);
        response.setHeader("Set-Cookie", [this.createCookie(token)]);
        user.password = undefined;
        response.send(user);
      }
    } catch (error) {
      next(new ServerError(error));
    }
  };

  private signin = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = await this.user.findOne({ email: request.body.email });
      if (user) {
        const isMatching = await bcrypt.compare(request.body.password, user.password);
        if (isMatching) {
          const tokenData = this.createToken(user);
          response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
          user.password = undefined;
          response.send(user);
        } else {
          next(new BadRequest("wrong password"));
        }
      } else {
        next(new BadRequest("wrong email"));
      }
    } catch (error) {
      next(new ServerError(error));
    }
  };

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60;
    const payload: DataStoredInToken = {
      _id: user._id
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return { expiresIn, token };
  }
  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthController;
