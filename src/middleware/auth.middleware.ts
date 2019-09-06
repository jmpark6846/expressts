import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../auth/user.model";
import ServerError from "../exceptions/ServerError";
import RequestWithUser from "../interfaces/request.interface";
import { DataStoredInToken } from "../auth/auth.interface";

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    try {
      const tokenData = jwt.verify(cookies.Authorization, process.env.JWT_SECRET) as DataStoredInToken;
      const user = await UserModel.findById(tokenData._id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new ServerError("wrong access token"));
      }
    } catch (error) {
      next(new ServerError(error));
    }
  } else {
    next(new ServerError("access token missing"));
  }
}

export default authMiddleware;
