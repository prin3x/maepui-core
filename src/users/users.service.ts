import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log('[UsersService] - create, createUserDto: ' + JSON.stringify(createUserDto));
    const { email, password } = createUserDto;
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
      password_hash: password,
      status: 'ACTIVE',
    };

    try {
      user = this.repo.save(userData);
    } catch (error) {
      this.logger.error('[UsersService] - create, error: ' + JSON.stringify(error));
      throw new NotFoundException('Error creating user');
    }

    return user;
  }

  async findAll(query: FindUserDto) {
    this.logger.log('[UsersService] - findAll');
    const { page = 1, paginate } = query;
    const limit = Number(paginate) ?? 10;
    const offset = paginate ? (page - 1) * limit : 0;

    let users: User[] = [];
    let meta = { total: 0, page, limit };

    users = await this.repo.find({
      relations: ['addresses'],
      take: limit,
      skip: offset,
    });

    meta.total = await this.repo.count();

    return { data: users, ...meta };
  }

  async findOne(_email): Promise<User> {
    let user: User;
    try {
      user = await this.repo.findOne({ where: { email: _email } });
    } catch (error) {
      throw new NotFoundException('No user is found');
    }
    return user;
  }

  async findOneById(id: string): Promise<User> {
    let user: User;
    try {
      user = await this.repo.findOne({ where: { id }, relations: ['addresses'] });
    } catch (error) {
      throw new NotFoundException('No user is found');
    }
    return user;
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    this.logger.log('[UsersService] - updateRefreshToken');
    return await this.repo.update({ id }, { refresh_token_hash: refreshToken });
  }

  async resetPassword(id: string, password: string) {
    this.logger.log('[UsersService] - resetPassword');
    // return await this.repo.update({ id }, { password_hash: password });
  }

  async changePassword(id: string, password: string) {
    this.logger.log('[UsersService] - changePassword');

    // return await this.repo.update({ id }, { password_hash: password });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
