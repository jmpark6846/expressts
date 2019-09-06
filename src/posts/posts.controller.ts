import express, { Request, Response, NextFunction } from 'express'
import Controller from 'interfaces/controller.interface'
import NotFound from '../exceptions/NotFound'
import validationMiddleware from '../middleware/validation.middleware'
import ServerError from '../exceptions/ServerError'
import authMiddleware from '../middleware/auth.middleware'
import RequestWithUser from '../interfaces/request.interface'
import { validate, ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'
import ValidationException from '../exceptions/ValidationException'
import validateData from '../interfaces/validateData'
import Post from './post.entity'
import { getRepository } from 'typeorm'

class PostController implements Controller {
  public path: string = '/posts'
  public router = express.Router()
  private post = getRepository(Post)

  constructor() {
    this.initializeRoutes()
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getPosts)
    this.router.get(this.path + '/:id', this.getPostById)
    this.router
      .all(this.path, authMiddleware)
      .post(this.path, this.createPost)
      .patch(this.path + '/:id', validationMiddleware(Post, true), this.modifyPost)
      .delete(this.path + '/:id', this.deletePost)
  }

  getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.post.find({ relations: ['categories', 'author'] })
      res.send(posts)
    } catch (error) {
      next(new ServerError(error))
    }
  }

  getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post: Post = await this.post.findOne(req.params.id, { relations: ['categories', 'author'] })
      if (post) {
        res.send(post)
      } else {
        next(new NotFound())
      }
    } catch (error) {
      next(new ServerError(error))
    }
  }

  createPost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const postData: Post = { ...req.body, author: req.user }
    try {
      await validateData(Post, postData)
    } catch (error) {
      return next(error)
    }

    const newPost = this.post.create(postData)
    try {
      await this.post.save(newPost)
      res.send(newPost)
    } catch (error) {
      next(new ServerError(error))
    }
  }

  modifyPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.post.update(req.params.id, req.body)
      const post = await this.post.findOne(req.params.id)

      if (post) {
        res.send(post)
      } else {
        next(new NotFound())
      }
    } catch (error) {
      next(new ServerError(error))
    }
  }

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.post.delete(req.params.id)
      if (result.raw[1]) {
        res.send(200)
      } else {
        next(new NotFound())
      }
    } catch (error) {
      next(new ServerError(error))
    }
  }
}

export default PostController
