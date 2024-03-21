import { Category } from 'categories/entities/category.entity';
import { IsNumber } from 'class-validator';
import { Product } from 'products/entities/product.entity';

export class CreateProductCategoryDto {
  // product entity
  product: Partial<Product>;

  categories: Partial<Category>[];
}
