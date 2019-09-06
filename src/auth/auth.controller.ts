import bcrypt from 'bcrypt'
import ServerError from '../exceptions/ServerError'
import { NextFunction, Request, Response, Router } from 'express'
import Controller from 'interfaces/controller.interface'
import BadRequest from '../exceptions/BadRequest'
import validationMiddleware from '../middleware/validation.middleware'
import { DataStoredInToken, TokenData } from './auth.interface'
import jwt from 'jsonwebtoken'
import RequestWithUser from '../interfaces/request.interface'
import PermissionDenied from '../exceptions/PermissionDenied'
import authMiddleware from '../middleware/auth.middleware'
import User, { SignInData } from './auth.entity'
import { getRepository } from 'typeorm'
import Post from '../posts/post.entity'

class AuthController implements Controller {
  public path = '/users'
  public router = Router()
  private user = getRepository(User)
  private post = getRepository(Post)

  constructor() {
    this.initializeRoutes()
  }

  public initializeRoutes() {
    this.router.post(this.path + '/signup', validationMiddleware(User), this.signup)
    this.router.post(this.path + '/signin', validationMiddleware(SignInData), this.signin)
    this.router.post(this.path + '/logout', this.logout)
    this.router.get(this.path + '/:id/posts', authMiddleware, this.getPostsByUser)
  }

  private signup = async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (await this.user.findOne({ email: request.body.email })) {
        next(new BadRequest('resoucre already exists'))
      } else {
        const hashedPassword = await bcrypt.hash(request.body.password, 3)
        const userData: User = {
          ...request.body,
          password: hashedPassword,
        }
        const user = this.user.create(userData)
        await this.user.save(user)
        const token = this.createToken(user)
        response.setHeader('Set-Cookie', [this.createCookie(token)])
        user.password = undefined
        response.send(user)
      }
    } catch (error) {
      next(new ServerError(error))
    }
  }

  private signin = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = await this.user.findOne({ email: request.body.email })
      if (user) {
        const isMatching = await bcrypt.compare(request.body.password, user.password)
        if (isMatching) {
          const tokenData = this.createToken(user)
          response.setHeader('Set-Cookie', [this.createCookie(tokenData)])
          user.password = undefined
          response.send(user)
        } else {
          next(new BadRequest('wrong password'))
        }
      } else {
        next(new BadRequest('wrong email'))
      }
    } catch (error) {
      next(new ServerError(error))
    }
  }

  private logout = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0'])
    response.send(200)
  }

  private getPostsByUser = async (requset: RequestWithUser, response: Response, next: NextFunction) => {
    if (Number(requset.params.id) === requset.user.id) {
      const posts = await this.post
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'user')
        .getMany()
      response.send(posts)
    } else {
      next(new PermissionDenied())
    }
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60
    const payload: DataStoredInToken = {
      id: user.id,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
    return { expiresIn, token }
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`
  }
}

export default AuthController
