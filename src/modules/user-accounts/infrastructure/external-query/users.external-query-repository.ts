import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../domain/user.entity';
import type { UserDocument, UserModelType } from '../../domain/user.entity';

@Injectable()
export class UsersExternalQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async getByOrNotFoundFail(id: string): Promise<UserDocument | null> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user; //потом добавим маппер
  }
}
