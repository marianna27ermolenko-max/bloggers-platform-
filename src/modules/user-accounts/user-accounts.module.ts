import { Module } from '@nestjs/common';
import { UsersController } from './api/user-controller';
import { UsersService } from './application/services/user-service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersExternalQueryRepository } from './infrastructure/external-query/users.external-query-repository';
import { BcryptService } from './application/services/bcrypt.service';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/services/auth.service';
import { AuthQwRepository } from './infrastructure/query/auth.query-repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { NotificationsModule } from '../notifications/notifications.module';
import { PassportModule } from '@nestjs/passport';
import { BasicAuthGuard } from './guard/basic/basic-auth.guard';
import { JwtAuthGuard } from './guard/bearer/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local/local-auth.guard';
import { LocalStrategy } from './guard/local/local.strategy';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/auth-tokens.inject-constants';
import { SecurityDevicesController } from './api/security-devices.controller';
import { LoginUserCommandHandler } from './application/usecases/login-user.usecase';
import { JwtStrategy } from './guard/bearer/jwt.strategy';

const service = [UsersService, BcryptService, AuthService];
const commandHandler = [LoginUserCommandHandler];
const repository = [
  UsersRepository,
  UsersQueryRepository,
  UsersExternalQueryRepository,
  AuthQwRepository,
];
@Module({
  imports: [
    JwtModule,
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: jwtConstants.secret, //TODO: move to env. will be in the following lessons
          signOptions: { expiresIn: '5m' },
        });
      },
      inject: [
        /*TODO: inject configService. will be in the following lessons*/
      ],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: jwtConstants.secret, //TODO: move to env. will be in the following lessons
          signOptions: { expiresIn: '10m' },
        });
      },
      inject: [
        /*TODO: inject configService. will be in the following lessons*/
      ],
    },
    ...service,
    ...commandHandler,
    ...repository,
    BasicAuthGuard,
    JwtAuthGuard,
    JwtStrategy,
    LocalAuthGuard,
    LocalStrategy,
  ],
  exports: [UsersExternalQueryRepository, JwtModule],
})
export class UserAccountsModule {}
