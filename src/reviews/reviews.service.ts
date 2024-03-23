import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindReviewDto } from './dto/find-review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}
  async create(createReviewDto: CreateReviewDto) {
    this.logger.log('[ReviewsService] - create, createReviewDto: ' + JSON.stringify(createReviewDto));
    const { rating, content, title, productId } = createReviewDto;
    let review;
    try {
      review = await this.reviewRepository.save({ rating, content, title, productId });
    } catch (error) {
      this.logger.error('[ReviewsService] - create, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error creating review');
    }
    return review;
  }

  async findAll(query: FindReviewDto) {
    this.logger.log('[ReviewsService] - findAll');
    const { page = 1, paginate, productId } = query;
    const limit = Number(paginate) ?? 10;
    const offset = paginate ? (page - 1) * limit : 0;

    let reviews: Review[] = [];
    let meta = { total: 0, page, limit };

    let where: FindOptionsWhere<Review> = { deleted_at: null };

    if (productId) {
      where = { ...where, product: productId };
    }

    try {
      reviews = await this.reviewRepository.find({
        where,
        order: { created_at: 'DESC' },
        take: limit,
        skip: offset,
      });

      meta.total = await this.reviewRepository.count({ where });
    } catch (error) {
      this.logger.error('[ReviewsService] - findAll, error: ' + JSON.stringify(error));
      throw new BadRequestException('Error finding reviews');
    }

    return { data: reviews, ...meta };
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
