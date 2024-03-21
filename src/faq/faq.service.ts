import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { FAQ, FAQStatusEnum } from './entities/faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';

@Injectable()
export class FaqService {
  private readonly logger = new Logger(FaqService.name);
  constructor(
    @InjectRepository(FAQ)
    private readonly faqRepository: Repository<FAQ>,
  ) {}

  async create(createFaqDto: CreateFaqDto) {
    this.logger.log('[FaqService] - create, createFaqDto: ' + JSON.stringify(createFaqDto));
    return await this.faqRepository.save(createFaqDto);
  }

  async findAll(query: any) {
    this.logger.log('[FaqService] - findAll');
    const { page = 1, paginate, category_ids, search } = query;
    const limit = Number(paginate) || 10;
    const offset = paginate ? (page - 1) * limit : 0;
    let FAQItems = [];

    if (search) {
      FAQItems = await this.faqRepository.find({
        where: { title: ILike(`%${search}%`) },
        take: limit,
        skip: offset,
      });
    } else {
      FAQItems = await this.faqRepository.find({
        take: limit,
        skip: offset,
      });
    }

    return {
      data: FAQItems,
      total: FAQItems.length,
      page,
      paginate: limit,
    };
  }

  async findOne(id: string) {
    this.logger.log('[FaqService] - findOne, id: ' + id);
    return await this.faqRepository.findOne({ where: { id } });
  }

  async update(id: string, updateFaqDto: CreateFaqDto) {
    this.logger.log('[FaqService] - update, id: ' + id + ', updateFaqDto: ' + JSON.stringify(updateFaqDto));
    return await this.faqRepository.update(id, updateFaqDto);
  }

  async updateStatus(id: string, status: FAQStatusEnum) {
    this.logger.log('[FaqService] - updateStatus, id: ' + id + ', status: ' + status);
    let faq;
    try {
      faq = await this.faqRepository.update(id, { status });
    } catch (error) {
      this.logger.error('[BlogsService] - updateStatus, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error updating blog status');
    }
    return faq;
  }

  async remove(id: string) {
    this.logger.log('[FaqService] - remove, id: ' + id);
    return await this.faqRepository.softDelete(id);
  }

  async bulkDelete(ids: string[]) {
    this.logger.log('[FaqService] - bulkDelete, ids: ' + JSON.stringify(ids));
    const deletePromises = [];
    ids.forEach((id) => {
      deletePromises.push(this.faqRepository.softDelete(id));
    });

    return await Promise.all(deletePromises);
  }
}
