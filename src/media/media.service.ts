import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media, MediaTypeEnum } from './entities/media.entity';
import { In, Repository } from 'typeorm';
import { MinioService } from 'src/minio/minio.service';
import * as fs from 'fs';
import { MediaResponseInterface } from './dto/media.response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  async uploadFiles(files: Express.Multer.File[], bucket: string, type: MediaTypeEnum): Promise<string[]> {
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

        const url = await this.minioService.generateStaticUrl(bucket, objectName);

        const media = this.mediaRepository.create({
          bucket,
          key: objectName,
          type,
          url,
        });

        await this.mediaRepository.save(media);

        rtnFilePaths.push(url);

        fs.unlinkSync(filePath);
      }
    } catch (error) {
      Logger.error(`Error uploading file to Minio: ${error.message}`);
      throw error;
    }

    return rtnFilePaths;
  }

  async generateStaticUrl(bucket: string, key: string): Promise<string> {
    return `${this.configService.get('MINIO_URL')}/${bucket}/${key}`;
  }

  async findAll(): Promise<Media[]> {
    const media = await this.mediaRepository.find();

    return media;
  }

  async findByKeys(keys: string[]): Promise<Media[]> {
    const media = await this.mediaRepository.find({
      where: { key: In(keys) },
    });

    return media;
  }

  async findOneByKey(key: string): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { key },
    });

    return media;
  }

  async findOne(id: string): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id },
    });

    return media;
  }

  async create(bucket: string, key: string, type: MediaTypeEnum): Promise<Media> {
    const media = new Media();
    media.bucket = bucket;
    media.key = key;
    media.type = type;

    return this.mediaRepository.save(media);
  }

  async delete(id): Promise<void> {
    const media = await this.mediaRepository.findOne({
      where: { id },
    });

    const bucket = media.bucket;
    const objectName = media.key;

    try {
      await this.minioService.deleteObject(bucket, objectName);
      await this.mediaRepository.delete(id);
    } catch (error) {
      Logger.error(`Error deleting file from Minio: ${error.message}`);
      throw error;
    }
  }

  async deleteAllObjects(bucketName: string): Promise<void> {
    try {
      await this.minioService.deleteAllObjects(bucketName);
      Logger.log(`All objects removed successfully from bucket ${bucketName}`);
    } catch (error) {
      Logger.error(`Error removing objects from bucket ${bucketName}: ${error.message}`);
      throw error;
    }
  }

  async bulkDelete(ids: number[]): Promise<void> {
    await this.mediaRepository.softDelete(ids);
  }
}
