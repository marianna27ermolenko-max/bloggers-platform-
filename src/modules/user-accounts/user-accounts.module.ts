import { Module } from '@nestjs/common';
import { UsersController } from './api/user-controller';
import { UsersService } from './application/user-service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersExternalQueryRepository } from './infrastructure/external-query/users.external-query-repository';
import { BcryptService } from './services/bcrypt.service';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { AuthQwRepository } from './infrastructure/query/auth.query-repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { NotificationsModule } from '../notifications/notifications.module';
import { PassportModule } from '@nestjs/passport';
import { BasicAuthGuard } from './guard/basic/basic-auth.guard';
import { JwtAuthGuard } from './guard/bearer/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local/local-auth.guard';
import { LocalStrategy } from './guard/local/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5m' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    UsersExternalQueryRepository,
    BcryptService,
    AuthService,
    AuthQwRepository,
    BasicAuthGuard,
    JwtAuthGuard,
    LocalAuthGuard,
    LocalStrategy,
  ],
  exports: [UsersExternalQueryRepository, JwtModule],
})
export class UserAccountsModule {}
