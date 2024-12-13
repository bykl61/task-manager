import User from '../models/mysql/user.js';
import BaseRepository from './baseRepository.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }
}

export default new UserRepository();
