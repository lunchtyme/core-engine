import { GetUserParams, UserRepository } from '../repository';
import { NotFoundError } from '../utils';

export class SharedServices {
  private readonly _userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this._userRepo = userRepo;
  }

  async getUserWithDetails(params: GetUserParams) {
    const user = await this._userRepo.getUserWithDetails(params);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getUser(params: GetUserParams) {
    const user = await this._userRepo.getUser(params);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async checkUserExist(params: GetUserParams) {
    return await this._userRepo.checkUserExist(params);
  }
}
