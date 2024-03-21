import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';

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

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOneByUserId(@AuthPayload() requestor: IAuthPayload) {
    const userId = requestor.id;
    return await this.cartsService.findOneByUserId(userId);
  }
}
