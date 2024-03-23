import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag, TagStatusEnum } from './entities/tag.entity';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    this.logger.log('Creating a tag');

    const tag = new Tag();

    try {
      tag.name = createTagDto.name;
      tag.description = createTagDto.description;
    } catch (error) {
      this.logger.error('Error creating tag', error);
      throw error;
    }

    return await this.tagRepository.save(tag);
  }

  async findAll() {
    this.logger.log('Finding all tags');
    return await this.tagRepository.find();
  }

  async findByIds(ids: number[]) {
    this.logger.log('Finding tags by ids');
    return await this.tagRepository.findBy({ id: In(ids) });
  }

  async findOne(id: number) {
    this.logger.log('Finding tag by id');
    return await this.tagRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    this.logger.log('Updating tag');
    const tag = await this.findOne(id);
    if (tag) {
      tag.name = updateTagDto.name;
      tag.description = updateTagDto.description;
      return await this.tagRepository.save(tag);
    }
  }

  async updateStatus(id: number, status: TagStatusEnum) {
    this.logger.log('[TagsService] - updateStatus, id: ' + id + ', status: ' + status);
    let tag;
    try {
      tag = await this.tagRepository.update(id, { status });
    } catch (error) {
      this.logger.error('[TagsService] - updateStatus, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error updating category status');
    }
    return tag;
  }

  async remove(id: number) {
    this.logger.log('Removing tag');
    const tag = await this.findOne(id);
    if (tag) {
      return await this.tagRepository.softDelete(tag.id);
    }
  }

  async bulkDelete(ids: number[]): Promise<void> {
    this.logger.log('[ProductsService] - bulkDelete, ids: ' + ids.join(', '));

    try {
      await Promise.all(ids.map((id) => this.tagRepository.softDelete(id)));
    } catch (error) {
      this.logger.error('[ProductsService] - bulkDelete, error: ' + error.message);
      throw new InternalServerErrorException('Error deleting products');
    }
  }
}
