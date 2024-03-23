import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { FAQ, FAQStatusEnum } from './entities/faq.entity';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.faqService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(id);
  }

  @Post()
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaqDto: CreateFaqDto) {
    return this.faqService.update(id, updateFaqDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: FAQStatusEnum) {
    return this.faqService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }

  @Post('bulk-delete')
  bulkDelete(@Body() ids: string[]) {
    return this.faqService.bulkDelete(ids);
  }
}
