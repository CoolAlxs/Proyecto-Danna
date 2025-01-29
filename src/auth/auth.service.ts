import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import { payload } from 'src/common/interface/interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly JwtService: JwtService,
  ) {}

  async login(LoginAuthDto: LoginAuthDto) {
    try {
      const { password, email } = LoginAuthDto;

      const user = await this.usersService.findByEmail(email);
      await this.usersService.comparePassword(password, user.password);

      const payload: payload = {
        user_ID: user.user_ID,
        name: user.person.name,
        lastName: user.person.lastName,
        email: user.person.email,
        role: user.role.role,
      };

      const token = await this.JwtService.signAsync(payload);

      return { access_token: token };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: any) {
    if (
      error.message === 'Person not found' ||
      error.message === 'Invalid password'
    ) {
      throw new UnauthorizedException('Email o password incorrectos');
    }
    this.logger.error(error.message);
    throw new InternalServerErrorException('Database error');
  }
}
