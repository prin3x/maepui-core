import { IsBoolean, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Media } from 'media/entities/media.entity';
import { ProductStatusEnum } from 'products/entities/product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  short_description: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  sale_price: number;

  @IsNumber({}, { each: true })
  categories: number[];

  @IsNumber({}, { each: true })
  tags: number[];

  @IsNumber()
  @IsOptional()
  stock_quantity?: number;

  @IsNumber()
  @IsOptional()
  shipping_price?: number;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsObject()
  @IsOptional()
  thumbnail?: Media;

  @IsBoolean()
  is_free_shipping: boolean;

  @IsString()
  @IsOptional()
  meta_title?: string;

  @IsString()
  @IsOptional()
  meta_description?: string;

  @IsString()
  @IsOptional()
  meta_keywords?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsEnum(ProductStatusEnum)
  @IsOptional()
  status?: ProductStatusEnum;

  @IsOptional()
  // @IsString({ each: true })
  // Entity Media
  @IsObject({ each: true })
  galleries?: Media[];
}
