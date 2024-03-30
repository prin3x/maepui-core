import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FindBlogDto } from './dto/find-blog.dto';
import { BLOG_STATUS_ENUM } from './entities/blog.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll(@Query() query: FindBlogDto) {
    return this.blogsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bulk-delete')
  bulkRemove(@Body('ids') ids: string[]) {
    return this.blogsService.bulkDelete(ids);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/status')
  updateStatus(@Body('status') status: BLOG_STATUS_ENUM, @Param('id') id: string) {
    return this.blogsService.updateStatus(id, status);
  }
}
