import mongoose, { Types } from "mongoose";
import { Typegoose, prop } from "typegoose";
import { IsString, IsEmail } from "class-validator";

export class User extends Typegoose {
  @prop()
  _id: Types.ObjectId;

  @prop()
  @IsString()
  name: string;

  @prop()
  @IsEmail()
  email: string;

  @prop()
  @IsString()
  password: string;
}

export class SignInData {
  email: string;
  password: string;
}
const UserModel = new User().getModelForClass(User);

export default UserModel;
