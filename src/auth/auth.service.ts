import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAuthPayload } from './auth.decorator';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { MyMailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MyMailerService,
    private config: ConfigService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: IAuthPayload = {
      id: user.id,
      email: user.email,
      role: user.roles,
      avatar: user.avatar,
      hash: user.password_hash,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '12h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Save refresh token in db
    this.userService.updateRefreshToken(user.id, refreshToken);

    return { access_token: token, refresh_token: refreshToken };
  }

  async validateRefreshToken(email: string, refreshToken: string) {
    // Verify token and regenerate new token
    const payload = this.validateToken(refreshToken);
    const user = await this.userService.findOne(email);
    if (user.refresh_token_hash !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const newToken = this.jwtService.sign(payload, { expiresIn: '12h' });
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { access_token: newToken, refresh_token: newRefreshToken };
  }

  async signUp(signUpDto: Record<string, any>) {
    this.logger.log(`Creating user ${signUpDto.email}`);
    const user = await this.userService.findOne(signUpDto.email);
    if (user) {
      throw new NotAcceptableException('User already exists');
    }
    const passwordHash = await bcrypt.hash(signUpDto.password, 3);
    const newUser = await this.userService.create({ ...signUpDto, password: passwordHash, email: signUpDto.email });

    // this.mailService.sendWelcomeEmail(user.email, user.email);

    return newUser;
  }

  async validateUser(id: string) {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password_hash;
    delete user.refresh_token_hash;

    return user;
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async resetPassword(email: string, oldPassword: string, newPassword: string) {
    this.logger.log(`Resetting password for user ${email}`);
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new NotAcceptableException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordHash = await bcrypt.hash(newPassword, 3);
    await this.userService.resetPassword(user.id, passwordHash);
  }

  async signOut(id: string) {
    await this.userService.updateRefreshToken(id, null);
  }
}
