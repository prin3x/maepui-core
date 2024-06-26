import { Blog } from 'src/blogs/entities/blog.entity';
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

export enum TagStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column('enum', {
    enum: TagStatusEnum,
    default: TagStatusEnum.ACTIVE,
  })
  status: TagStatusEnum;

  @ManyToOne(() => Blog, (blog) => blog.tags)
  @JoinColumn({ name: 'blog_id' })
  blog: string;

  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
