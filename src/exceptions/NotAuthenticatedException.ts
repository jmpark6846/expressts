import HttpException from './HttpException'

class NotAuthenticated extends HttpException {
  constructor() {
    super(401, 'not authenticated')
  }
}

export default NotAuthenticated
