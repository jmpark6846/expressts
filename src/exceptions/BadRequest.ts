import HttpException from "./HttpException";

class BadRequest extends HttpException {
  constructor(msg?: string) {
    super(400, msg || "bad request");
  }
}

export default BadRequest;
