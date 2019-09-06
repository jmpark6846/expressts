import RequestWithUser from './interfaces/request.interface'
import NotAuthenticated from './exceptions/NotAuthenticatedException'
import { Response, NextFunction } from 'express'

const checkAuth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (!req.user) {
    next(new NotAuthenticated())
  }
  next()
}

export default checkAuth
