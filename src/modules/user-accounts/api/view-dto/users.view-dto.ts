import { UserDocument } from '../../domain/user.entity';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
  // firstName: string;
  // lastName: string | null;

  static mapToView(this: void, user: UserDocument): UserViewDto {
    const mapUser = new UserViewDto();

    mapUser.email = user.email;
    mapUser.login = user.login;
    mapUser.id = user._id.toString();
    mapUser.createdAt = user.createdAt;
    // mapUser.firstName = user.name.firstName;
    // mapUser.lastName = user.name.lastName;

    return mapUser;
  }
}
