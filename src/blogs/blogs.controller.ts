import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FindBlogDto } from './dto/find-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BLOG_STATUS_ENUM } from './entities/blog.entity';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll(@Query() query: FindBlogDto) {
    return this.blogsService.findAll(query);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.blogsService.findOneById(id);
  }

  @Get('/slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.blogsService.findOneBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }

  @Post('bulk-delete')
  bulkRemove(@Body('ids') ids: string[]) {
    return this.blogsService.bulkDelete(ids);
  }

  @Patch('/:id/status')
  updateStatus(@Body('status') status: BLOG_STATUS_ENUM, @Param('id') id: string) {
    return this.blogsService.updateStatus(id, status);
  }
}
