import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import App from "./app";
import PostController from "./posts/posts.controller";
import AuthController from "./auth/auth.controller";

const envResult = dotenv.config();
if (envResult.error) {
  throw envResult.error;
}

const app = new App([new PostController(), new AuthController()]);
app.listen();
