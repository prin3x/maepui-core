import { Blog } from 'src/blogs/entities/blog.entity';
import { Media } from 'src/media/entities/media.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CategoryTypeEnum {
  PRODUCT = 'PRODUCT',
  BLOG = 'BLOG',
}

export enum CategoryStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, default: CategoryTypeEnum.PRODUCT })
  type: CategoryTypeEnum;

  @Column({ default: CategoryStatusEnum.ACTIVE })
  status: CategoryStatusEnum;

  @ManyToOne(() => Media, (media) => media.categories, { cascade: true, nullable: true })
  @JoinColumn({ name: 'thumbnail_id' })
  thumbnail: Media;

  @Column({ nullable: true })
  thumbnail_id: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product;

  @ManyToMany(() => Blog, (blog) => blog.categories)
  blog: Blog[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
