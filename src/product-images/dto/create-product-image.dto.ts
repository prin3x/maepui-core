import { IsString } from 'class-validator';

export class CreateProductImageDto {
  @IsString({ each: true })
  filePaths: string[];

  @IsString()
  productId: string;
}
