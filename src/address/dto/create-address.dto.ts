import { IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  title: string;

  @IsString()
  address: string;

  @IsString()
  district: string;

  @IsString()
  sub_district: string;

  @IsString()
  province: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  postalCode: string;

  @IsString()
  phone: string;

  @IsString()
  type: string;

  @IsString()
  user_id: string;
}
