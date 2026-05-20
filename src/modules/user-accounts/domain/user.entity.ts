import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDomainDto, UpdateUserDto } from '../dto/create-user.dto';
import { Name, NameSchema } from './name.schema';
import { BadRequestException } from '@nestjs/common';

@Schema({ timestamps: true }) //флаг timestemp автоматичеки добавляет поля upatedAt и createdAt
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
    unique: true,
  })
  login: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  // @Prop({ type: Boolean, required: true, default: false })
  // isEmailConfirmed: boolean;

  @Prop({
    type: {
      confirmationCode: String,
      expirationDate: Date,
      isConfirmed: Boolean,
    },
    default: {
      confirmationCode: null,
      expirationDate: null,
      isConfirmed: false,
    },
  })
  emailConfirmation: {
    confirmationCode: string | null;
    expirationDate: Date | null;
    isConfirmed: boolean;
  };

  @Prop({
    type: {
      confirmationCode: String,
      expirationDate: Date,
    },
    default: {
      confirmationCode: null,
      expirationDate: null,
    },
  })
  recoveryCode: {
    confirmationCode: string | null;
    expirationDate: Date | null;
  };

  @Prop({ type: NameSchema })
  name: Name;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  static createInstance(dto: CreateUserDomainDto): UserDocument {
    const user = new this();
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.login = dto.login;
    user.emailConfirmation.isConfirmed = false;

    user.name = {
      firstName: 'firstName xxx',
      lastName: 'lastName yyy',
    };

    return user as UserDocument;
  }
  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new BadRequestException('Entity already deleted');
    }
    this.deletedAt = new Date();
  }

  update(dto: UpdateUserDto) {
    if (dto.email !== this.email) {
      this.emailConfirmation.isConfirmed = false;
    }
    this.email = dto.email;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

//регистрируем методы сущности в схеме
UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;
export type UserModelType = Model<UserDocument> & typeof User;
