import HttpException from './HttpException'

class NotFound extends HttpException {
  constructor() {
    super(404, `Resource Not Found`)
  }
}

export default NotFound
