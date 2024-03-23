import { IsNumber } from 'class-validator';

export class CreateCartAndCartItemDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  product_id: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  total: number;

  @IsNumber()
  subtotal: number;
}
