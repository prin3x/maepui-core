import { Category } from 'src/categories/entities/category.entity';
import { Media } from 'src/media/entities/media.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ProductCategory } from 'src/product-categories/entities/product-category.entity';
import { ProductImage } from 'src/product-images/entities/product-image.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  short_description: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float' })
  sale_price: number;

  @Column({ nullable: true, type: 'float' })
  discount?: number;

  @Column({ nullable: true, type: 'float' })
  shipping_price?: number;

  @Column({ nullable: true })
  stock_quantity?: number;

  @Column({ nullable: true })
  sku?: string;

  @Column({ nullable: true })
  meta_title?: string;

  @Column({ nullable: true })
  meta_description?: string;

  @Column({ nullable: true })
  meta_keywords?: string;

  @Column({
    type: 'enum',
    enum: ProductStatusEnum,
    default: ProductStatusEnum.ACTIVE,
  })
  status: string;

  @Column({ nullable: true })
  unit?: string;

  @Column({ nullable: true })
  weight?: number;

  @Column({ type: 'boolean', default: false })
  is_free_shipping: boolean;

  @ManyToMany(() => Category, (category) => category.products, { cascade: true })
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Media, (media) => media.products, { cascade: true })
  @JoinTable()
  galleries?: Media[];

  @OneToMany(() => Review, (review) => review.product)
  reviews?: Review[];

  @ManyToOne(() => Media, (media) => media.products, { cascade: true, nullable: true })
  @JoinColumn({ name: 'thumbnail_id' })
  thumbnail: Media;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @ManyToMany(() => Tag, (tag) => tag.products, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
