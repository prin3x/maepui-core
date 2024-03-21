import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { CategoriesModule } from 'categories/categories.module';
import { TagsModule } from 'tags/tags.module';
import { MinioModule } from 'minio/minio.module';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), TagsModule, CategoriesModule, MinioModule],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
