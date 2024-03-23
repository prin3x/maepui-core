import { CategoryStatusEnum, CategoryTypeEnum } from 'src/categories/entities/category.entity';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { Media } from 'src/media/entities/media.entity';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(CategoryStatusEnum)
  @IsOptional()
  status: CategoryStatusEnum;

  @IsObject()
  @IsOptional()
  thumbnail?: Media;

  @IsEnum(CategoryTypeEnum)
  @IsOptional()
  type: CategoryTypeEnum;
}
