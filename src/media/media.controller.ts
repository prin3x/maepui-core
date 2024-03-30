import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { MediaService } from './media.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaTypeEnum } from './entities/media.entity';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('/upload/:bucket/:type')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('bucket') bucket: string,
    @Param('type') type: MediaTypeEnum,
  ): Promise<string[]> {
    return this.mediaService.uploadFiles(files, bucket, type);
  }

  @Get('/')
  async find() {
    return await this.mediaService.findAll();
  }

  @Post('/bulk-delete')
  async bulkDelete(@Body('ids') ids: number[]) {
    return await this.mediaService.bulkDelete(ids);
  }

  @Delete('/all/:bucket')
  async delete(@Param('bucket') bucket: string) {
    return await this.mediaService.deleteAllObjects(bucket);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.delete(id);
  }
}
