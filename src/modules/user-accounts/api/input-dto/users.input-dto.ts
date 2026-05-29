import { IsEmail, IsString, Length } from 'class-validator';
import { CreateUserDto } from '../../dto/create-user.dto';
import {
  loginConstraints,
  passwordConstraints,
} from '../../domain/user.entity';
import { Trim } from 'src/core/decorators/trim';

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateUserInputDto implements CreateUserDto {
  @IsString()
  @Trim()
  @Length(loginConstraints.minLength, loginConstraints.maxLength)
  login: string;

  @IsString()
  @Trim()
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  password: string;

  @IsString()
  @Trim()
  @IsEmail()
  email: string;
}
