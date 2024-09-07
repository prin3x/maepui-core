import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import * as firebaseAdmin from 'firebase-admin';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { MyMailerService } from 'src/services/mailer/mailer.service';
import { UsersService } from 'src/users/users.service';
import { GetUserResponseDto } from './dto/get-user-response.dto';
import { SignInResponseMapper } from './dto/sign-in-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly signInResponseMapper = new SignInResponseMapper();

  private readonly firebaseApp: firebaseAdmin.app.App;
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MyMailerService,
    private config: ConfigService,
    @Inject('FIREBASE_AUTH') private readonly firebase,
  ) {
    if (!firebaseAdmin.apps.length) {
      this.firebaseApp = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    } else {
      this.firebaseApp = firebaseAdmin.app();
    }
  }

  async signUpAdmin(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.firebase, email, password);
      const user = await this.userService.create({
        email: email,
        password: password,
        role: 'admin',
        firebase_uid: userCredential.user.uid,
      });
      const customClaims = { role: user.role, id: user.id };
      // Set custom claims
      await this.firebaseApp.auth().setCustomUserClaims(user.firebase_uid, customClaims);
      return HttpStatus.CREATED;
    } catch (error) {
      this.logger.error('Error signing up:', error);

      throw new Error('Error signing up: ' + error.message);
    }
  }
  async validateUser(id: string) {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return plainToInstance(GetUserResponseDto, user);
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

    try {
      // Reauthenticate the user with the old password
      const userCredential = await signInWithEmailAndPassword(this.firebase, email, oldPassword);
      const firebaseUser = userCredential.user;

      // Update the password
      await updatePassword(firebaseUser, newPassword);
      this.logger.log(`Password updated successfully for user ${email}`);
    } catch (error) {
      this.logger.error(`Error resetting password for user ${email}: ${error.message}`);
      throw new HttpException('Error resetting password', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signUp(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (user) {
      throw new ConflictException('User already exists');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(this.firebase, email, password);
      const user = await this.userService.create({
        email: email,
        password: password,
        role: 'user',
        firebase_uid: userCredential.user.uid,
      });
      const customClaims = { roles: user.roles, id: user.id };
      // Set custom claims
      await this.firebaseApp.auth().setCustomUserClaims(user.firebase_uid, customClaims);
      await this.mailService.sendWelcomeEmail(email);
      return HttpStatus.CREATED;
    } catch (error) {
      this.logger.error('Error signing up:', error);

      throw new Error('Error signing up: ' + error.message);
    }
  }

  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.firebase, email, password);
      const user = userCredential.user;
      // Get the ID token
      return this.signInResponseMapper.map(user);
    } catch (error) {
      throw new Error('Error signing in: ' + error.message);
    }
  }

  async signInAdmin(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new NotAcceptableException('User not found');
    }

    if (user.role !== 'admin') {
      throw new NotAcceptableException('User is not an admin');
    }
    try {
      const userCredential = await signInWithEmailAndPassword(this.firebase, email, password);
      const user = userCredential.user;
      // Get the ID token
      return this.signInResponseMapper.map(user);
    } catch (error) {
      throw new Error('Error signing in: ' + error.message);
    }
  }

  async signOut(email: string) {
    try {
      const user = await this.userService.findOne(email);
      if (!user) {
        throw new NotAcceptableException('User not found');
      }
      // Revoke refresh tokens for the user
      await this.firebaseApp.auth().revokeRefreshTokens(user.firebase_uid);
    } catch (error) {
      this.logger.error(`Error signing out user ${email}: ${error.message}`);
      throw new HttpException('Error signing out', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendResetPasswordLink(email: string) {
    try {
      // Send password reset email
      // await sendPasswordResetEmail(this.firebase, email);

      this.logger.log(`Password reset link sent to ${email}`);
    } catch (error) {
      this.logger.error(`Error sending password reset link to ${email}: ${error.message}`);
      throw new HttpException('Error sending password reset link', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
