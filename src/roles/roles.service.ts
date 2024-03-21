import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async findAll(): Promise<Roles[]> {
    return this.rolesRepository.find();
  }

  async findOne(id: number): Promise<Roles> {
    return this.rolesRepository.findOne({
      where: { id },
    });
  }

  async create(role: Roles): Promise<Roles> {
    return this.rolesRepository.save(role);
  }

  async update(id: number, role: Roles): Promise<Roles> {
    await this.rolesRepository.update(id, role);
    return this.rolesRepository.findOne({
      where: { id },
    });
  }
}
