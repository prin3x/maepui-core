import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductStatusEnum } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Like, Repository } from 'typeorm';
import { isEmpty } from 'lodash';
import { CategoriesService } from 'src/categories/categories.service';
import { ProductImagesService } from 'src/product-images/product-images.service';
import { ConfigService } from '@nestjs/config';
import { MediaService } from 'src/media/media.service';
import { MinioService } from 'src/minio/minio.service';
import { TagsService } from 'src/tags/tags.service';
import { FindProductDto } from './dto/find-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoryService: CategoriesService,
    private tagService: TagsService,
    private productImagesService: ProductImagesService,
    private mediaService: MediaService,
    private minioService: MinioService,
    private configService: ConfigService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    this.logger.log('[ProductsService] - create, createProductDto: ' + JSON.stringify(createProductDto));

    const { name, categories, galleries, thumbnail, tags } = createProductDto;
    let product;

    // Find if product already exists
    const existingProduct = await this.productsRepository.findOne({
      where: { name },
    });

    if (!isEmpty(existingProduct)) {
      throw new BadRequestException('Product already exists');
    }

    // Find if collection exists
    const existingCollection = await this.categoryService.findCategoryByIds(categories);
    if (categories.length !== existingCollection.length) {
      throw new BadRequestException('Collection does not exist');
    }

    // Find if tags exists
    const existingTags = await this.tagService.findByIds(tags);
    if (tags.length !== existingTags.length) {
      throw new BadRequestException('Tags does not exist');
    }

    // Find media
    const mediaKeys = galleries.map((gal) => gal.key);
    const media = await this.mediaService.findByKeys(mediaKeys);

    if (media.length !== mediaKeys.length) {
      throw new BadRequestException('Media does not exist');
    }

    // Get thumbnail from media
    const thumbnailMedia = await this.mediaService.findOneByKey(thumbnail.key);

    const productData = this.productsRepository.create({
      ...createProductDto,
      thumbnail: thumbnailMedia,
      galleries: media,
      categories: existingCollection,
      tags: existingTags,
    });

    try {
      product = await this.productsRepository.save(productData);
    } catch (error) {
      this.logger.error('[ProductsService] - create, error: ' + error.message);
      throw new BadRequestException('Error creating product');
    }

    return product;
  }

  async findByIds(ids: number[]) {
    this.logger.log('[ProductsService] - findByIds, ids: ' + ids);
    const products = await this.productsRepository.find({
      where: { id: In(ids), deleted_at: null },
      relations: ['categories', 'galleries', 'tags', 'thumbnail'],
    });

    return products;
  }

  async findAll(query: FindProductDto) {
    this.logger.log('[ProductsService] - findAll');
    const { page = 1, paginate, category_ids, search, ids } = query;
    const limit = Number(paginate) || 10;
    const offset = paginate ? (page - 1) * limit : 0;
    let products = [];
    let where: FindOptionsWhere<Product> = { deleted_at: null };

    if (search) {
      where = { ...where, name: ILike(`%${search}%`) };
    }

    if (category_ids) {
      where = { ...where, categories: { id: In(category_ids.split(',')) } };
    }

    if (ids) {
      where = { ...where, id: In(ids.split(',')) };
    }
    products = await this.productsRepository.find({
      where,
      relations: ['categories', 'galleries', 'tags', 'thumbnail'],
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });

    const total = await this.productsRepository.count({ where });

    return {
      data: products,
      total,
      page,
      paginate: limit,
    };
  }

  async findOne(id: string) {
    this.logger.log('[ProductsService] - findOne, id: ' + id);
    const product = await this.productsRepository.findOne({
      where: { id: id, deleted_at: null },
      relations: ['categories', 'galleries', 'tags', 'thumbnail'],
    });

    // Add url to galleries
    product.galleries = await Promise.all(
      product.galleries.map(async (gal) => {
        gal.url = await this.minioService.getObjectUrl(gal.bucket, gal.key);
        return gal;
      }),
    );

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    this.logger.log(
      '[ProductsService] - update, id: ' + id + ', updateProductDto: ' + JSON.stringify(updateProductDto),
    );

    // Find if id exists
    const existingProduct = await this.productsRepository.findOne({
      where: { id },
    });

    if (isEmpty(existingProduct)) {
      throw new BadRequestException('Product does not exist');
    }

    const { categories, galleries, thumbnail, tags } = updateProductDto;
    let product;

    // Find if collection exists
    const existingCollection = await this.categoryService.findCategoryByIds(categories);
    if (categories.length !== existingCollection.length) {
      throw new BadRequestException('Collection does not exist');
    }

    // Find if tags exists
    const existingTags = await this.tagService.findByIds(tags);
    if (tags.length !== existingTags.length) {
      throw new BadRequestException('Tags does not exist');
    }

    // Find media
    const mediaKeys = galleries.map((gal) => gal.key);
    const media = await this.mediaService.findByKeys(mediaKeys);

    if (media.length !== mediaKeys.length) {
      throw new BadRequestException('Media does not exist');
    }

    // Format product data
    const thumbnailMedia = await this.mediaService.findOneByKey(thumbnail.key);

    const productData = this.productsRepository.create({
      ...existingProduct,
      ...updateProductDto,
      thumbnail: thumbnailMedia,
      galleries: media,
      categories: existingCollection,
      tags: existingTags,
    });

    try {
      product = await this.productsRepository.save(productData);
    } catch (error) {
      this.logger.error('[ProductsService] - update, error: ' + error.message);
      throw new BadRequestException('Error updating product');
    }

    return product;
  }

  async remove(id: string) {
    this.logger.log('[ProductsService] - remove, id: ' + id);

    // Update product deteledAt
    return await this.productsRepository.softDelete(id);
  }

  async duplicate(id: string) {
    this.logger.log('[ProductsService] - duplicate, id: ' + id);

    const originalProduct = await this.productsRepository.findOne({ where: { id } });
    if (!originalProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const duplicateProduct = { ...originalProduct, id: undefined, name: `${originalProduct.name} (Copy)` };
    const createdDuplicateProduct = this.productsRepository.create(duplicateProduct);

    try {
      const savedDuplicateProduct = await this.productsRepository.save(createdDuplicateProduct);
      return savedDuplicateProduct;
    } catch (error) {
      this.logger.error('[ProductsService] - duplicate, error: ' + error.message);
      throw new InternalServerErrorException('Error duplicating product');
    }
  }

  async bulkDuplicate(ids: string[]): Promise<any[]> {
    this.logger.log('[ProductsService] - bulkDuplicate, ids: ' + ids.join(', '));

    const duplicatePromises = ids.map(async (id) => {
      try {
        const originalProduct = await this.findOne(id);
        if (!originalProduct) {
          this.logger.error(`[ProductsService] - bulkDuplicate, error: Product with ID ${id} not found`);
          return null; // Return null to filter out later
        }

        const duplicateProduct = { ...originalProduct, id: undefined, name: `${originalProduct.name} (Copy)` };
        const createdDuplicateProduct = this.productsRepository.create(duplicateProduct);
        return await this.productsRepository.save(createdDuplicateProduct);
      } catch (error) {
        this.logger.error('[ProductsService] - bulkDuplicate, error: ' + error.message);
        return null; // Return null to filter out later
      }
    });

    const results = await Promise.all(duplicatePromises);
    const duplicatedProducts = results.filter((result) => result !== null);

    if (duplicatedProducts.length === 0) {
      throw new InternalServerErrorException('Error duplicating products');
    }

    return duplicatedProducts;
  }

  async bulkDelete(ids: number[]): Promise<void> {
    this.logger.log('[ProductsService] - bulkDelete, ids: ' + ids.join(', '));

    try {
      await Promise.all(ids.map((id) => this.productsRepository.softDelete(id)));
    } catch (error) {
      this.logger.error('[ProductsService] - bulkDelete, error: ' + error.message);
      throw new InternalServerErrorException('Error deleting products');
    }
  }

  async updateStatus(id: string, status: ProductStatusEnum): Promise<Product> {
    this.logger.log(`[ProductsService] - updateStatus, id: ${id}, status: ${status}`);

    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      this.logger.error(`[ProductsService] - updateStatus, error: Product with ID ${id} not found`);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.status = status;
    await this.productsRepository.save(product);

    return product;
  }
}
