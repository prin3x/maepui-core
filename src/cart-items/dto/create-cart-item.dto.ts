import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';

export class CreateCartItemDto {
  @IsString()
  product_id: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  subtotal: number;

  @IsString()
  user_id: string;
}
