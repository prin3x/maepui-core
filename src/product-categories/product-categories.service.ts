import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { isEmpty } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';

@Injectable()
export class ProductCategoriesService {
  private readonly logger = new Logger(ProductCategoriesService.name);
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}
  async createRelation(createProductCategoryDto: CreateProductCategoryDto) {
    this.logger.log(
      '[ProductCategoriesService] - create, createProductCategoryDto: ' + JSON.stringify(createProductCategoryDto),
    );
    const { product, categories } = createProductCategoryDto;
    let productCategory;
    try {
      // Bulk upsert
      const productCategories = [];
      categories.forEach((category) => {
        productCategories.push({ productId: product, categoryId: category });
      });
      productCategory = await this.productCategoryRepository.save(productCategories);
    } catch (error) {
      this.logger.error('[ProductCategoriesService] - create, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error creating productCategory');
    }
    return productCategory;
  }

  findAll() {
    return `This action returns all productCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productCategory`;
  }

  update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    return `This action updates a #${id} productCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} productCategory`;
  }
}
