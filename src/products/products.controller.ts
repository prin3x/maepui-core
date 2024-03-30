import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductStatusEnum } from './entities/product.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: FindProductDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/status')
  updateStatus(@Body('status') updateStatusDto: ProductStatusEnum, @Param('id') id: string) {
    return this.productsService.updateStatus(id, updateStatusDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bulk-duplicate')
  async bulkDuplicate(@Body('ids') ids: any) {
    return await this.productsService.bulkDuplicate(ids);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bulk-delete')
  async bulkDelete(@Body('ids') ids: number[]) {
    return this.productsService.bulkDelete(ids);
  }
}
