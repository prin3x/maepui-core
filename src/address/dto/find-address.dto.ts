import { IsOptional, IsString } from 'class-validator';

export class FindAddressDto {
  @IsOptional()
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  amphure: string;
}
