import { IsString } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
