import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firebase_uid: string;

  @IsString()
  role: string;
}
