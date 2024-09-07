import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/address/entities/address.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { USER_STATUS, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectRepository(User) private repo: Repository<User>, private ordersService: OrdersService) {}

  async registerAdmin(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const userData = {
      ...createUserDto,
      email,
      password_hash: password,
      status: USER_STATUS.ACTIVE,
      role: 'admin',
    };
    return this.create(userData);
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.log('[UsersService] - create, createUserDto: ' + createUserDto.email);
    const { email } = createUserDto;
    let user;

    // Find if user already exists
    const existingUser = await this.repo.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new NotFoundException('User already exists');
    }

    const userData = {
      ...createUserDto,
      email,
      status: USER_STATUS.ACTIVE,
      role: createUserDto.role,
    };

    try {
      user = await this.repo.save(userData);
    } catch (error) {
      this.logger.error('[UsersService] - create, error: ' + JSON.stringify(error));
      throw new NotFoundException('Error creating user');
    }

    return user;
  }

  async findAll(query: FindUserDto) {
    this.logger.log('[UsersService] - findAll');
    const { page = 1, paginate } = query;
    const limit = Number(paginate) || 10;
    const offset = paginate ? (page - 1) * limit : 0;

    let users: User[] = [];
    const meta = { total: 0, page, limit };

    users = await this.repo.find({
      relations: ['addresses'],
      take: limit,
      skip: offset,
    });

    meta.total = await this.repo.count();

    return { data: users, ...meta };
  }

  async findOne(_email): Promise<User> {
    this.logger.log(`[UsersService] - findOne, _email: ${_email}`);
    return await this.repo.findOne({ where: { email: _email } });
  }

  async findOneById(id: string): Promise<User> {
    if (!id) {
      throw new NotFoundException('No user is found');
    }
    let user: User;
    try {
      user = await this.repo.findOne({ where: { id }, relations: ['addresses', 'orders'] });
    } catch (error) {
      throw new NotFoundException('No user is found');
    }
    return user;
  }

  async updateAddress(id: string, address: Address) {
    this.logger.log('[UsersService] - updateAddress');
    try {
      const user = await this.findOneById(id);
      user.addresses.push(address);
      return await this.repo.save(user);
    } catch (error) {
      this.logger.error('[UsersService] - updateAddress, error: ' + JSON.stringify(error));
      throw new NotFoundException('Error updating address');
    }
  }

  async changeNameAndEmail(id: string, name: string, email: string) {
    this.logger.log('[UsersService] - changeNameAndEmail');
    try {
      return await this.repo.update({ id }, { name, email });
    } catch (error) {
      this.logger.error('[UsersService] - changeNameAndEmail, error: ' + JSON.stringify(error));
      throw new NotFoundException('Error changing name and email');
    }
  }
}
