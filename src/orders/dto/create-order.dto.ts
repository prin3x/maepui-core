import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderItem } from 'src/order-items/entities/order-item.entity';

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsNotEmpty()
  @IsNumber()
  shipping_address_id: number;

  @IsNotEmpty()
  @IsNumber()
  billing_address_id: number;

  @IsNotEmpty()
  @IsNumber()
  total_amount: number;

  @IsOptional()
  @IsNumber()
  total_discounts?: number;

  @IsNotEmpty()
  @IsString()
  payment_method: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  shipping_method?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  tracking_information?: string;

  @IsNotEmpty()
  @IsArray()
  products: OrderItem[];
}
