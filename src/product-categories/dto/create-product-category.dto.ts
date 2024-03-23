import { Category } from 'src/categories/entities/category.entity';
import { IsNumber } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';

export class CreateProductCategoryDto {
  // product entity
  product: Partial<Product>;

  categories: Partial<Category>[];
}
