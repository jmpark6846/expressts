import { Request } from 'express'
import User from '../auth/auth.entity'
interface RequestWithUser extends Request {
  user: User
}

export default RequestWithUser
