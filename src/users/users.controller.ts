import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/register-admin')
  registerAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registerAdmin(createUserDto);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Get()
  findAll(@Query() query: FindUserDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id/name-email')
  changeNameAndEmail(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.changeNameAndEmail(id, updateUserDto.name, updateUserDto.email);
  }
}
