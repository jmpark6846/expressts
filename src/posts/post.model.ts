import mongoose, { Types } from "mongoose";
import { prop, Typegoose } from "typegoose";
import { IsString, IsInstance } from "class-validator";

export class Post extends Typegoose {
  @prop()
  @IsInstance(Types.ObjectId)
  author: Types.ObjectId;

  @prop()
  @IsString()
  content: string;

  @prop()
  @IsString()
  title: string;
}

const PostModel = new Post().getModelForClass(Post);

export default PostModel;
