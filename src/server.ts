import dotenv from 'dotenv'
const envResult = dotenv.config()
if (envResult.error) {
  throw envResult.error
}

import express from 'express'
import bodyParser from 'body-parser'
// import 'reflect-metadata'

import App from './app'
import PostController from './posts/posts.controller'
import AuthController from './auth/auth.controller'
import { createConnection } from 'typeorm'
import ORMConfig from './ormconfig'

createConnection(ORMConfig)
  .then(connection => {
    console.log('Database connection established')
    connection.runMigrations()
    const app = new App([new PostController(), new AuthController()])
    app.listen()
  })
  .catch(error => {
    console.error('Error connecting to database ' + error)
  })
