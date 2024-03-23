import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Like, Repository } from 'typeorm';
import { BLOG_STATUS_ENUM, Blog } from './entities/blog.entity';
import { isEmpty } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/tags.service';
import { CategoriesService } from 'src/categories/categories.service';
import { MinioService } from 'src/minio/minio.service';
import { FindBlogDto } from './dto/find-blog.dto';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    private readonly tagsService: TagsService,
    private readonly categoriesService: CategoriesService,
    private readonly minioService: MinioService,
  ) {}
  async create(createBlogDto: CreateBlogDto) {
    this.logger.log('[BlogsService] - create, createBlogDto: ' + JSON.stringify(createBlogDto));
    const { title, categories } = createBlogDto;
    let blog;
    // Find if blog already exists
    const existingBlog = await this.blogRepository.findOne({
      where: { title },
    });
    if (!isEmpty(existingBlog)) {
      throw new BadRequestException('Blog already exists');
    }

    // Find tags
    const tags = await this.tagsService.findByIds(createBlogDto.tags);
    if (tags.length !== createBlogDto.tags.length) {
      throw new BadRequestException('Invalid tag ids');
    }

    // Find categories
    const existingCategories = await this.categoriesService.findCategoryByIds(categories);
    if (existingCategories.length !== categories.length) {
      throw new BadRequestException('Invalid category ids');
    }

    const blogData = Object.assign(createBlogDto, { tags }, { categories: existingCategories });

    try {
      blog = await this.blogRepository.save(blogData);
    } catch (error) {
      this.logger.error('[BlogsService] - create, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error creating blog');
    }
    return blog;
  }

  async findAll(query: FindBlogDto) {
    this.logger.log('[BlogsService] - findAll');
    const { page = 1, paginate = 5, search } = query;
    let blogs: Blog[] = [];
    const meta = { total: 0, page, limit: paginate };

    const limit = Number(paginate) ?? 10;
    const offset = paginate ? (page - 1) * limit : 0;

    let where: any = {};

    if (!isEmpty(search)) {
      where = { title: Like(`%${search}%`) };
    }
    try {
      blogs = await this.blogRepository.find({
        where,
        relations: ['tags', 'categories', 'thumbnail'],
        take: limit,
        skip: offset,
      });

      meta.total = await this.blogRepository.count({ where });
    } catch (error) {
      this.logger.error('[BlogsService] - findAll, error: ' + error);
      throw new BadRequestException('Error finding blogs');
    }
    return { data: blogs, ...meta };
  }

  async findOneByTitle(id: string) {
    this.logger.log('[BlogsService] - findOneByTitle, id: ' + id + '');
    let blog;
    try {
      blog = await this.blogRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      this.logger.error('[BlogsService] - findOneByTitle, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error finding blog');
    }
    return blog;
  }

  async findOne(id: string) {
    this.logger.log('[BlogsService] - findOne, id: ' + id + '');
    let blog;
    try {
      blog = await this.blogRepository.findOneOrFail({ where: { id }, relations: ['tags', 'categories', 'thumbnail'] });
    } catch (error) {
      this.logger.error('[BlogsService] - findOne, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error finding blog');
    }
    return blog;
  }

  async findByQuery(query) {
    this.logger.log('[BlogsService] - findByQuery query: ' + JSON.stringify(query) + '');
    const { search } = query;

    let blogs: Blog[] = [];
    try {
      let query = this.blogRepository.createQueryBuilder('blog');

      if (!isEmpty(search)) {
        query = query.where('blog.title ILIKE :search', { search: `%${search}%` });
      }

      blogs = await query.getMany();
    } catch (error) {
      this.logger.error('[BlogsService] - findByQuery, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error finding blogs');
    }

    return blogs;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    this.logger.log('[BlogsService] - update, id: ' + id + ', updateBlogDto: ' + JSON.stringify(updateBlogDto));
    const { categories } = updateBlogDto;
    let blog;
    // Find if blog already exists
    const existingBlog = await this.blogRepository.findOne({
      where: { id },
    });
    if (isEmpty(existingBlog)) {
      throw new BadRequestException('Blog does not exist');
    }

    // Find tags
    const tags = await this.tagsService.findByIds(updateBlogDto.tags);
    if (tags.length !== updateBlogDto.tags.length) {
      throw new BadRequestException('Invalid tag ids');
    }

    // Find categories
    const existingCategories = await this.categoriesService.findCategoryByIds(categories);
    if (existingCategories.length !== categories.length) {
      throw new BadRequestException('Invalid category ids');
    }

    const blogData = Object.assign(existingBlog, updateBlogDto, { tags }, { categories: existingCategories });

    try {
      blog = await this.blogRepository.save(blogData);
    } catch (error) {
      this.logger.error('[BlogsService] - create, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error creating blog');
    }
    return blog;
  }

  async remove(id: string) {
    this.logger.log('[BlogsService] - remove, id: ' + id + '');
    let blog;
    try {
      blog = await this.blogRepository.softDelete(id);
    } catch (error) {
      this.logger.error('[BlogsService] - remove, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error removing blog');
    }
    return blog;
  }

  async bulkDelete(ids: string[]) {
    this.logger.log('[BlogsService] - bulkDelete, ids: ' + JSON.stringify(ids) + '');
    let blogs;
    try {
      blogs = await Promise.all(ids.map((id) => this.blogRepository.softDelete(id)));
    } catch (error) {
      this.logger.error('[BlogsService] - bulkDelete, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error removing blogs');
    }
    return blogs;
  }

  async updateStatus(id: string, status: BLOG_STATUS_ENUM) {
    this.logger.log('[BlogsService] - updateStatus, id: ' + id + ', status: ' + status);
    let blog;
    try {
      blog = await this.blogRepository.update(id, { status });
    } catch (error) {
      this.logger.error('[BlogsService] - updateStatus, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error updating blog status');
    }
    return blog;
  }
}
