import { Media } from 'src/media/entities/media.entity';
import { Product } from 'src/products/entities/product.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Product, (product) => product.productImages, { eager: true })
  // productId: string;

  // @ManyToOne(() => Media, (media) => media.productImages, { eager: true })
  // mediaId: string;
}
