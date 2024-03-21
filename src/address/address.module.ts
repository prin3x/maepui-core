import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThaiAmphures } from './entities/amphures.entity';
import { ThaiProvinces } from './entities/provinces.entity';
import { ThaiTambons } from './entities/tambons.entity';
import { Address } from './entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThaiAmphures, ThaiProvinces, ThaiTambons, Address])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
