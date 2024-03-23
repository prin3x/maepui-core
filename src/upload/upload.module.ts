import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { MinioModule } from 'src/minio/minio.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    MinioModule,
    MulterModule.register({
      dest: './uploads',
    }),
    MediaModule,
  ],
  providers: [UploadService],
  exports: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
