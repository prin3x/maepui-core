import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthPayload, IAuthPayload } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // @Get()
  // async findAll() {
  //   return await this.cartsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartsService.findOne(id);
  // }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addItemToCart(@AuthPayload() requestor: IAuthPayload, @Body() body: AddItemToCartDto[]) {
    return await this.cartsService.addItemToCart(requestor.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOneByUserId(@AuthPayload() requestor: IAuthPayload) {
    const userId = requestor.id;
    return await this.cartsService.findOneByUserId(userId);
  }
}
