import { GetUserParams, UserRepository } from '../repository';

export class SharedServices {
  private readonly _userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this._userRepo = userRepo;
  }

  async getUser(params: GetUserParams) {
    const user = await this._userRepo.getUser(params);
    if (!user) {
      // TODO: Refactor to use custom not found error handler
      throw new Error('User not found');
    }

    return user;
  }

  async checkUserExist(params: GetUserParams) {
    return await this._userRepo.checkUserExist(params);
  }
}
