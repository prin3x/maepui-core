import { BLOG_STATUS_ENUM } from 'src/blogs/entities/blog.entity';
import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Media } from 'src/media/entities/media.entity';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsNumber({}, { each: true })
  categories: number[];

  @IsOptional()
  @IsObject()
  @IsOptional()
  thumbnail?: Media;

  @IsOptional()
  @IsString()
  meta_title: string;

  @IsOptional()
  @IsString()
  meta_description: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  tags: number[];

  @IsOptional()
  @IsEnum(BLOG_STATUS_ENUM)
  status: BLOG_STATUS_ENUM;
}
