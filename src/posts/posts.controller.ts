import express, { Request, Response, NextFunction } from "express";
import PostModel, { Post } from "./post.model";
import Controller from "interfaces/controller.interface";
import NotFound from "../exceptions/NotFound";
import validationMiddleware from "../middleware/validation.middleware";
import ServerError from "../exceptions/ServerError";
import authMiddleware from "../middleware/auth.middleware";
import RequestWithUser from "../interfaces/request.interface";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import ValidationException from "../exceptions/ValidationException";
import validateData from "../interfaces/validateData";
class PostController implements Controller {
  public path: string = "/posts";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getPosts);
    this.router.get(this.path + "/:id", this.getPostById);
    this.router
      .all(this.path, authMiddleware)
      .post(this.path, this.createPost)
      .patch(this.path + "/:id", validationMiddleware(Post, true), this.modifyPost)
      .delete(this.path + "/:id", this.deletePost);
  }

  getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await PostModel.find();
      res.send(posts);
    } catch (error) {
      next(new ServerError(error));
    }
  };

  getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await PostModel.findById(req.params.id);
      if (post) {
        res.send(post);
      } else {
        next(new NotFound());
      }
    } catch (error) {
      next(new ServerError(error));
    }
  };

  createPost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const postData = { ...req.body, author: req.user._id };
    try {
      await validateData(Post, postData);
    } catch (error) {
      return next(error);
    }

    const createdPost = new PostModel(postData);
    try {
      const savedPost = await createdPost.save();
      res.send(savedPost);
    } catch (error) {
      next(new ServerError(error));
    }
  };

  modifyPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await PostModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
      if (post) {
        res.send(post);
      } else {
        next(new NotFound());
      }
    } catch (error) {
      next(new ServerError(error));
    }
  };

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await PostModel.findById(req.params.id);
      if (post) {
        await post.remove();
        res.send(post);
      } else {
        next(new NotFound());
      }
    } catch (error) {
      next(new ServerError(error));
    }
  };
}

export default PostController;
