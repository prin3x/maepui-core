import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindOrderDto } from './dto/find-orders.dto';
import { AuthPayload, IAuthPayload } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Post('myorders')
  createUserOrder(@AuthPayload() requestor: IAuthPayload, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createUserOrder(requestor.id, createOrderDto);
  }

  @Get()
  findAll(@Query() query: FindOrderDto) {
    return this.ordersService.findAll(query);
  }

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

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(id, status);
  }
}
