export class CreateUserDto {
  login: string;
  email: string;
  password: string;
}

export class CreateUserDomainDto {
  login: string;
  email: string;
  passwordHash: string;
}

export class UpdateUserDto {
  email: string;
}
