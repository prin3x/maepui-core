import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Address } from 'address/entities/address.entity';
import { User } from 'users/entities/user.entity';
import { OrderItem } from 'order-items/entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Address, User, OrderItem])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
