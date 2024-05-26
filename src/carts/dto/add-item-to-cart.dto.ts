import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';

export class AddItemToCartDto {
  @Type(() => Product)
  product: Product;

  @IsNumber()
  quantity: number;
}
