import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/role.guard';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { currentUserInterface } from 'src/common/interface/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() LoginAuthDto: LoginAuthDto) {
    return this.AuthService.login(LoginAuthDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles()
  @Get('profile')
  getProfile(@CurrentUser() user: currentUserInterface) {
    return user;
  }
}
