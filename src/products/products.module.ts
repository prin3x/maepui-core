import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductCategoriesModule } from 'src/product-categories/product-categories.module';
import { ProductImagesModule } from 'src/product-images/product-images.module';
import { MinioModule } from 'src/minio/minio.module';
import { MediaModule } from 'src/media/media.module';
import { TagsModule } from 'src/tags/tags.module';

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
