import HttpException from "./HttpException";

class ValidationException extends HttpException {
  constructor(messages: string) {
    super(400, messages);
  }
}

export default ValidationException;
