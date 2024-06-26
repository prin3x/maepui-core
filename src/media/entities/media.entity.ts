import { Blog } from 'src/blogs/entities/blog.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MediaTypeEnum {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  BLOG = 'BLOG',
}

export enum MediaVariantEnum {
  THUMBNAIL = 'THUMBNAIL',
  GALLERY = 'GALLERY',
}
@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bucket: string;

  @Column()
  key: string;

  @Column({
    type: 'enum',
    enum: MediaTypeEnum,
    default: MediaTypeEnum.PRODUCT,
  })
  type: string;

  @Column({ nullable: true })
  url?: string;

  @OneToMany(() => Product, (product) => product.thumbnail)
  products: Product[];

  @OneToMany(() => Blog, (blog) => blog.thumbnail)
  blog: Blog[];

  // @ManyToMany(() => Product, (product) => product.galleries)
  // products: Product[];

  @OneToMany(() => Category, (category) => category.thumbnail)
  categories: Category[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
