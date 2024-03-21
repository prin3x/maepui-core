import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from 'categories/categories.module';
import { ProductCategoriesModule } from 'product-categories/product-categories.module';
import { ProductImagesModule } from 'product-images/product-images.module';
import { MinioModule } from 'minio/minio.module';
import { MediaModule } from 'media/media.module';
import { TagsModule } from 'tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule,
    ProductCategoriesModule,
    ProductImagesModule,
    MediaModule,
    MinioModule,
    TagsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
