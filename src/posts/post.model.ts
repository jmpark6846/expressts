import mongoose, { Types } from "mongoose";
import { prop, Typegoose, Ref } from "typegoose";
import { IsString, IsInstance } from "class-validator";
import { User } from "../auth/user.model";

export class Post extends Typegoose {
  @prop({ ref: User })
  @IsInstance(Types.ObjectId)
  author: Ref<User>;

  @prop()
  @IsString()
  content: string;

  @prop()
  @IsString()
  title: string;
}

const PostModel = new Post().getModelForClass(Post);

export default PostModel;
