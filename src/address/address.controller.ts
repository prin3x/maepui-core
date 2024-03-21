import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findUserAddress(@AuthPayload() requestor: IAuthPayload) {
    return await this.addressService.findUserAddress(requestor.id);
  }

  @Get('/provinces')
  async findAllProvinces() {
    return await this.addressService.findAllProvinces();
  }

  @Get('/amphures/:provinceId')
  async findAmphure(@Param('provinceId') provinceId: string) {
    return await this.addressService.findAmphure(+provinceId);
  }

  @Get('/sub-district/:amphureId')
  async findSubDistrict(@Param('amphureId') amphureId: string) {
    return await this.addressService.findSubDistrict(+amphureId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(+id);
  }

  @Post('/user/:userId')
  createAddress(@Body() createAddressDto: CreateAddressDto, @Param('userId') userId: string) {
    return this.addressService.create(createAddressDto, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
