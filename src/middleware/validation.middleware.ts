import { RequestHandler, Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import ValidationException from "../exceptions/ValidationException";

const validationMiddleware = (type: any, skipMissingProperties: boolean = false): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(plainToClass(type, req.body), { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const messages = errors.map((error: ValidationError) => Object.values(error.constraints)).join(", ");
        next(new ValidationException(messages));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
