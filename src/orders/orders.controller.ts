import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindOrderDto } from './dto/find-orders.dto';
import { AuthPayload, IAuthPayload } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('myorders')
  createUserOrder(@AuthPayload() requestor: IAuthPayload, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createUserOrder(requestor.id, createOrderDto);
  }

  @Get()
  findAll(@Query() query: FindOrderDto) {
    return this.ordersService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('myorders')
  findMyOrders(@AuthPayload() requestor: IAuthPayload) {
    return this.ordersService.findMyOrders(requestor.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
