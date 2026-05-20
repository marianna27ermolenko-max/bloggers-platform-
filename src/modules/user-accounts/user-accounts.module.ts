import { Module } from '@nestjs/common';
import { UsersController } from './api/user-controller';
import { UsersService } from './application/user-service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersExternalQueryRepository } from './infrastructure/external-query/users.external-query-repository';
import { BcryptService } from './services/bcrypt.service';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    UsersExternalQueryRepository,
    BcryptService,
  ],
  exports: [UsersExternalQueryRepository],
})
export class UserAccountsModule {}
