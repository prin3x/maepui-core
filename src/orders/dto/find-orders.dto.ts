import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindOrderDto {
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
}
