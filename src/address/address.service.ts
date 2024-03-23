import { Injectable, Logger } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ThaiProvinces } from './entities/provinces.entity';
import { In, Repository } from 'typeorm';
import { ThaiAmphures } from './entities/amphures.entity';
import { ThaiTambons } from './entities/tambons.entity';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);
  constructor(
    @InjectRepository(ThaiProvinces)
    private thaiProvincesRepository: Repository<ThaiProvinces>,
    @InjectRepository(ThaiAmphures)
    private thaiAmphuresRepository: Repository<ThaiAmphures>,
    @InjectRepository(ThaiTambons)
    private thaiTambonsRepository: Repository<ThaiTambons>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}
  async create(createAddressDto: CreateAddressDto, userId: string) {
    const address = this.addressRepository.create(createAddressDto);
    address.user_id = userId;

    return await this.addressRepository.save(address);
  }

  async findUserAddress(userId: string) {
    this.logger.log('[AddressService] - findUserAddress');
    const address = await this.addressRepository.find({
      where: { user_id: userId },
    });
    return address;
  }

  async findAllProvinces() {
    this.logger.log('[AddressService] - findAllProvinces');
    const provinces = await this.thaiProvincesRepository.find();

    return provinces;
  }

  async findProvince(id: number) {
    this.logger.log('[AddressService] - findProvince');
    const province = await this.thaiProvincesRepository.findOne({
      where: { id },
    });
    return province;
  }

  async findAmphure(provinceId: number) {
    this.logger.log('[AddressService] - findAmphure');
    const amphure = await this.thaiAmphuresRepository.find({
      where: { province_id: provinceId },
    });
    return amphure;
  }

  async findSubDistrict(id: number) {
    this.logger.log(`[AddressService] - findSubDistrict - amphureId: ${id}`);
    const tambon = await this.thaiTambonsRepository.find({
      where: { amphure_id: id },
    });
    return tambon;
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
