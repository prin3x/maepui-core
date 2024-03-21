import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsNumber()
  rating: number;

  @IsNumber()
  productId: number;
}
