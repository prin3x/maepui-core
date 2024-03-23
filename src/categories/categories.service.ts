import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { isEmpty } from 'lodash';
import { Category, CategoryStatusEnum } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private mediaService: MediaService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    this.logger.log('[CategoryService] - create, createCategoryDto: ' + JSON.stringify(createCategoryDto));
    const { name, thumbnail } = createCategoryDto;
    let category;
    // Find if category already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });
    if (!isEmpty(existingCategory)) {
      throw new BadRequestException('Category already exists');
    }

    const thumbnailMedia = await this.mediaService.findOneByKey(thumbnail.key);

    if (!thumbnailMedia) {
      throw new BadRequestException('Invalid thumbnail');
    }

    createCategoryDto.thumbnail = thumbnailMedia;

    try {
      category = await this.categoryRepository.save(createCategoryDto);
    } catch (error) {
      this.logger.error('[CategoryService] - create, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error creating category');
    }
    return category;
  }

  async findAll(query) {
    this.logger.log('[CategoryService] - findAll query: ' + JSON.stringify(query) + '');
    const { search, type } = query;

    let categories: Category[] = [];
    try {
      const searchCondition = !isEmpty(search) ? { name: ILike(`%${search}%`) } : {};
      const typeCondition = !isEmpty(type) ? { type } : {};

      categories = await this.categoryRepository.find({
        where: {
          ...searchCondition,
          ...typeCondition,
        },
        relations: ['thumbnail'],
        order: {
          id: 'DESC',
        },
      });
    } catch (error) {
      this.logger.error('[CategoryService] - findAll, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error finding categories');
    }

    return categories;
  }

  findOne(id: number) {
    this.logger.log('[CategoryService] - findOne, id: ' + id);
    return this.categoryRepository.findOne({ where: { id }, relations: ['thumbnail'] });
  }

  async findCategoryByIds(ids: number[]) {
    this.logger.log('[CategoryService] - findCategoryByIds, ids: ' + ids.join(','));

    let categories: Category[] = [];

    try {
      categories = await this.categoryRepository.findBy({ id: In(ids) });
    } catch (error) {
      this.logger.error('[CategoryService] - findCategoryByIds, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error finding categories');
    }

    if (categories.length !== ids.length) {
      throw new BadRequestException('Invalid category ids');
    }

    return categories;
  }

  findByCategoryName(categoryName: string) {
    this.logger.log('[CategoryService] - findByCategoryName, categoryName: ' + categoryName);
    return this.categoryRepository.findOne({ where: { name: categoryName } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(
      '[CategoryService] - update, id: ' + id + ', updateCategoryDto: ' + JSON.stringify(updateCategoryDto),
    );

    const { thumbnail } = updateCategoryDto;
    let category;
    // Find if category already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (isEmpty(existingCategory)) {
      throw new BadRequestException(`Category with id ${id} does not exist`);
    }
    const thumbnailMedia = await this.mediaService.findOneByKey(thumbnail.key);

    if (!thumbnailMedia) {
      throw new BadRequestException('Invalid thumbnail');
    }

    updateCategoryDto.thumbnail = thumbnailMedia;

    try {
      category = this.categoryRepository.save({ ...existingCategory, ...updateCategoryDto });
    } catch (error) {
      this.logger.error('[CategoryService] - update, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error updating category');
    }
  }

  async updateStatus(id: number, status: CategoryStatusEnum) {
    this.logger.log('[CategoryService] - updateStatus, id: ' + id + ', status: ' + status);
    let blog;
    try {
      blog = await this.categoryRepository.update(id, { status });
    } catch (error) {
      this.logger.error('[CategoryService] - updateStatus, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error updating category status');
    }
    return blog;
  }

  remove(id: number) {
    this.logger.log('[CategoryService] - remove, id: ' + id);
    return this.categoryRepository.delete(id);
  }
}
