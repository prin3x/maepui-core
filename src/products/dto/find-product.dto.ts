import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindProductDto {
  @IsString()
  @IsOptional()
  search: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  paginate: number;

  @IsString({ each: true })
  @IsOptional()
  category_ids: string;

  @IsString({ each: true })
  @IsOptional()
  sort: string;

  @IsString()
  @IsOptional()
  field: string;

  @IsString()
  @IsOptional()
  ids: string;
}
