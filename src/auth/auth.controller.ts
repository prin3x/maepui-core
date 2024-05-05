import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
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

  @Post('/signout')
  async signOut(@Body() signOutDto: Record<string, any>) {
    return await this.authService.signOut(signOutDto.id);
  }

  @Post('/refresh')
  async refreshToken(@Body() refreshTokenDto: Record<string, any>) {
    return await this.authService.validateRefreshToken(refreshTokenDto.email, refreshTokenDto.refreshToken);
  }

  @Get('/self')
  @UseGuards(JwtAuthGuard)
  async self(@AuthPayload() user: IAuthPayload) {
    return this.authService.validateUser(user?.id);
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() user, @AuthPayload() requestor: IAuthPayload) {}

  @Patch('/update-password')
  @UseGuards(JwtAuthGuard)
  resetPassword(
    @Body('id') id: string,
    @Body('current_password') current_password: string,
    @Body('password') password: string,
    @AuthPayload() user: IAuthPayload,
  ) {
    return this.authService.resetPassword(user.email, current_password, password);
  }
}
