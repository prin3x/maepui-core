import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FindReviewDto } from './dto/find-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('product/:productId')
  create(@Param('productId') productId: string, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(productId, createReviewDto);
  }

  @Get()
  findAll(@Query() query: FindReviewDto) {
    return this.reviewsService.findAll(query);
  }

  @Get('/product/:productId')
  findOne(@Param('productId') productId: string) {
    return this.reviewsService.findByProductId(productId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
