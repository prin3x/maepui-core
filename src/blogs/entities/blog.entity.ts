import { Category } from 'src/categories/entities/category.entity';
import { Media } from 'src/media/entities/media.entity';
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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BLOG_STATUS_ENUM {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column({
    type: 'enum',
    enum: BLOG_STATUS_ENUM,
    default: BLOG_STATUS_ENUM.ACTIVE,
  })
  status: BLOG_STATUS_ENUM;

  @Column({ nullable: true })
  meta_title: string;

  @Column({ nullable: true })
  meta_description: string;

  @Column({ nullable: true })
  blog_meta_image: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  author: string;

  @ManyToOne(() => Media, (media) => media.categories, { cascade: true, nullable: true })
  @JoinColumn({ name: 'thumbnail_id' })
  thumbnail: Media;

  @ManyToMany(() => Category, (category) => category.blog, { cascade: true })
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.blog, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
