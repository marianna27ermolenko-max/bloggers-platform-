import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/services/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConfirmationDto } from './input-dto/confirmation.dto';
import { EmailResendingInputDto } from './input-dto/auth.email.resending.input.dto';
import { PasswordRecoveryDto } from './input-dto/зassword.recovery.input.dto';
import { NewPasswordInputDto } from './input-dto/new.passwort.input.dto';
import { AuthQwRepository } from '../infrastructure/query/auth.query-repository';
import { MeViewDto } from './view-dto/auth.user.view-dto';
import { LocalAuthGuard } from '../guard/local/local-auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { ExtractUserFromRequest } from '../guard/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../guard/dto/user-context.dto';
import { JwtAuthGuard } from '../guard/bearer/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { LoginInputDto } from './input-dto/auth.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../application/usecases/login-user.usecase';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authQwRepository: AuthQwRepository,
    private commandBus: CommandBus,
  ) {}

  @Post('registration')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() body: CreateUserDto): Promise<void> {
    await this.authService.registration(body);
  }

  @Post('registration-confirmation')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() body: ConfirmationDto): Promise<void> {
    await this.authService.registrationConfirmation(body.code);
  }

  @Post('registration-email-resending')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() body: EmailResendingInputDto) {
    await this.authService.registrationEmailResending(body.email);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginInputDto })
  async login(
    @ExtractUserFromRequest() user: UserContextDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const tokens = await this.commandBus.execute(
      new LoginUserCommand({ userId: user.id }),
    );
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return { accessToken: tokens.accessToken };

    // return this.authService.login(user.id);
  }

  @Post('password-recovery')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() body: PasswordRecoveryDto): Promise<void> {
    await this.authService.passwordRecovery(body.email);
  }

  @Post('new-password')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: NewPasswordInputDto): Promise<void> {
    await this.authService.newPassword(body);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getMeInfo(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<MeViewDto> {
    return await this.authQwRepository.me(user.id);
  }
}
