import { Injectable, Logger, Param, UploadedFile } from '@nestjs/common';
import { MinioService } from 'minio/minio.service';
import * as fs from 'fs';
import { MediaService } from 'media/media.service';

@Injectable()
export class UploadService {
  constructor(private readonly minioService: MinioService, private readonly mediaService: MediaService) {}
  async uploadFiles(@UploadedFile() files: Express.Multer.File[], @Param('bucket') bucket: string): Promise<string[]> {
    let conputedFiles = [];
    const rtnFilePaths = [];
    if (Array.isArray(files)) {
      conputedFiles = files;
    } else {
      conputedFiles = [files];
    }
    try {
      for (const file of conputedFiles) {
        const fileExt = file.originalname.split('.').pop();
        const objectName = `${Date.now()}.${fileExt}`;
        const filePath = file.path;

        await this.minioService.uploadFile(bucket, objectName, filePath);

        const url = await this.minioService.getObjectUrl(bucket, objectName);

        rtnFilePaths.push(url);

        fs.unlinkSync(filePath);
      }
    } catch (error) {
      Logger.error(`Error uploading file to Minio: ${error.message}`);
      throw error;
    }

    return rtnFilePaths;
  }
}
