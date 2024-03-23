import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindUserDto {
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
