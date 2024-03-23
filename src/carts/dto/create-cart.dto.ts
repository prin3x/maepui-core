import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
  @IsString()
  user_id: string;

  @IsNumber()
  total: number;

  @IsNumber()
  subtotal: number;
}
