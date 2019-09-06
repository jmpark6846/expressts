import HttpException from "./HttpException";

class NotAuthenticated extends HttpException {
  constructor(messages: string) {
    super(401, "not authenticated");
  }
}

export default NotAuthenticated;
