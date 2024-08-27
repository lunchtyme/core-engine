import { UserModel } from '../infrastructure';

export class UserRepository {
  async create(payload: any) {
    try {
      const result = new UserModel(payload);
      return await result.save();
    } catch (error) {
      throw error;
    }
  }
}
