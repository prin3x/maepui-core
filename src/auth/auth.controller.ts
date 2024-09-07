import { Body, Controller, Get, HttpStatus, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthPayload, IAuthPayload } from './auth.decorator';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignOutDto } from './dto/sign-out.dyo';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: CreateUserDto) {
    return await this.authService.signUp(signUpDto.email, signUpDto.password);
  }

  @Post('/signup-admin')
  async signUpAdmin(@Body() signUpDto: CreateUserDto) {
    return await this.authService.signUpAdmin(signUpDto.email, signUpDto.password);
  }

  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('/signin-admin')
  async signInAdmin(@Body() signInDto: SignInDto) {
    return await this.authService.signInAdmin(signInDto.email, signInDto.password);
  }

  @Post('/signout')
  async signOut(@Body() signOutDto: SignOutDto) {
    return await this.authService.signOut(signOutDto.email);
  }

  @Get('/self')
  async self(@AuthPayload() user: IAuthPayload) {
    return await this.authService.validateUser(user?.id);
  }

  @Post('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @AuthPayload() requestor: IAuthPayload,
    @Res() res: Response,
  ) {
    return await this.authService.resetPassword(
      requestor.email,
      changePasswordDto.current_password,
      changePasswordDto.password,
    );
  }

  @Patch('/update-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @AuthPayload() user: IAuthPayload,
    @Res() res: Response,
  ) {
    return await this.authService.resetPassword(
      user.email,
      resetPasswordDto.current_password,
      resetPasswordDto.password,
    );
  }

  @Post('/reset-password')
  async resetPasswordLink(@Body() email: string, @Res() res: Response) {
    return await this.authService.sendResetPasswordLink(email);
  }
}
