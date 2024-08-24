import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { Roles } from 'src/roles/entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Roles]), OrdersModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
