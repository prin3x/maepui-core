import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthPayload, IAuthPayload } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

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

  @Post('/:id')
  createAddress(@Body() createAddressDto: CreateAddressDto, @Param('id') id: string) {
    return this.addressService.create(id, createAddressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createOwnAddress(@AuthPayload() requestor: IAuthPayload, @Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(requestor.id, createAddressDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  removeAddress(@Param('id') id: string) {
    return this.addressService.removeAddress(+id);
  }
}
