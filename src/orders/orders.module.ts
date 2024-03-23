import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Address } from 'src/address/entities/address.entity';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Address, User, OrderItem])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
