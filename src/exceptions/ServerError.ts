import HttpException from "./HttpException";

class ServerError extends HttpException {
  constructor(message?: string) {
    super(500, `Something went wrong. ` + message);
  }
}

export default ServerError;
