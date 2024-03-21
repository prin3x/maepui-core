import { Body, Controller, Get, HttpCode, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthPayload, IAuthPayload } from './auth.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: Record<string, any>) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  async signIn(@Body() signInDto: Record<string, any>) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('/refresh')
  async refreshToken(@Body() refreshTokenDto: Record<string, any>) {
    return await this.authService.validateRefreshToken(refreshTokenDto.email, refreshTokenDto.refreshToken);
  }

  @Get('/self')
  @UseGuards(JwtAuthGuard)
  async self(@AuthPayload() user: IAuthPayload) {
    return user;
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() user, @AuthPayload() requestor: IAuthPayload) {}

  @Post('/reset-password')
  @UseGuards(JwtAuthGuard)
  resetPassword(@Body('id') id: string) {}
}
