import HttpException from "./HttpException";

class PermissionDenied extends HttpException {
  constructor() {
    super(403, `permission denied`);
  }
}

export default PermissionDenied;
