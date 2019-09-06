import HttpException from "../exceptions/HttpException";
import { Response, Request, NextFunction } from "express";

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  response.status(error.status).json({ status: error.status, error: error.message });
}

export default errorMiddleware;
