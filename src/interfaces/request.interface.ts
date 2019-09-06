import { Request } from "express";
import { User } from "auth/user.model";
interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
