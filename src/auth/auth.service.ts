import { getRepository } from 'typeorm'

class AuthService {
  private user = getRepository(User)
}
