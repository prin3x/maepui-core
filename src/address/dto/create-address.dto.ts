import { IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  title: string;

  @IsString()
  address: string;

  @IsString()
  pincode: string;

  @IsString()
  phone: string;
}
