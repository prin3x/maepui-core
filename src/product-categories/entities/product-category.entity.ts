import { Category } from 'categories/entities/category.entity';
import { Product } from 'products/entities/product.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.id)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: string;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
