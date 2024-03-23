import { Injectable } from '@nestjs/common';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { UploadService } from 'src/upload/upload.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
    private readonly uploadService: UploadService,
  ) {}

  async uploadFiles(files: Express.Multer.File[], bucket: string): Promise<string[]> {
    return this.uploadService.uploadFiles(files, bucket);
  }
  async create(createProductImageDto: CreateProductImageDto) {
    const { filePaths, productId } = createProductImageDto;
    // Save filePaths to db
    if (filePaths.length > 0) {
      const productImages = filePaths.map(() => {
        const productImage = new ProductImage();
        // productImage.productId = productId;
        return productImage;
      });
      return this.productImagesRepository.save(productImages);
    }
  }

  findAll() {
    return `This action returns all productImages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productImage`;
  }

  update(id: number, updateProductImageDto: UpdateProductImageDto) {
    return `This action updates a #${id} productImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} productImage`;
  }
}
