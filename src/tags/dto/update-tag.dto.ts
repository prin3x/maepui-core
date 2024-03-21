import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';
import { IsOptional, IsString } from 'class-validator';
import { TagStatusEnum } from 'tags/entities/tag.entity';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @IsOptional()
  @IsString()
  status?: TagStatusEnum;
}
