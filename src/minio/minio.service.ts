// minio.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT'),
      port: +this.configService.get<number>('MINIO_PORT'),
      useSSL: true,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
      region: 'ap-southeast-1',
    });
  }

  async uploadFile(bucketName: string, objectName: string, filePath: string): Promise<string> {
    let rtnFilePath = '';
    try {
      await this.minioClient.fPutObject(bucketName, objectName, filePath, {});
      Logger.log(`File ${objectName} uploaded successfully to bucket ${bucketName}`);
      rtnFilePath = `${this.configService.get('MINIO_URL')}/${bucketName}/${objectName}`;
    } catch (error) {
      Logger.error(`Error uploading file to Minio: ${error.message}`);
      throw error;
    }

    return rtnFilePath;
  }

  async getObjectUrl(bucketName: string, objectName: string): Promise<string> {
    try {
      const presignedUrl = await this.minioClient.presignedGetObject(bucketName, objectName, 60 * 60 * 24 * 30);
      return presignedUrl;
    } catch (error) {
      Logger.error(`Error generating presigned URL for object ${objectName}: ${error.message}`);
      throw error;
    }
  }

  async generateStaticUrl(bucketName: string, objectName: string): Promise<string> {
    // if staging or production
    if (this.configService.get('MINIO_URL').includes('s3')) {
      return `${this.configService.get('MINIO_URL')}/${objectName}`;
    }
    return `${this.configService.get('MINIO_URL')}/${bucketName}/${objectName}`;
  }

  async findAllAssets(bucketName: string): Promise<Minio.BucketItem[]> {
    try {
      const objectsStream = await this.minioClient.listObjects(bucketName);
      const objects: Minio.BucketItem[] = [];
      objectsStream.on('data', (obj) => objects.push(obj));
      objectsStream.on('error', (error) => {
        Logger.error(`Error listing objects in bucket ${bucketName}: ${error.message}`);
        throw error;
      });
      return new Promise((resolve) => objectsStream.on('end', () => resolve(objects)));
    } catch (error) {
      Logger.error(`Error listing objects in bucket ${bucketName}: ${error.message}`);
      throw error;
    }
  }

  async deleteObject(bucketName: string, objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucketName, objectName);
      Logger.log(`Object ${objectName} removed successfully from bucket ${bucketName}`);
    } catch (error) {
      Logger.error(`Error removing object ${objectName} from bucket ${bucketName}: ${error.message}`);
      throw error;
    }
  }

  async createBucket(bucketName: string): Promise<void> {
    try {
      await this.minioClient.makeBucket(bucketName, 'us-east-1');
      Logger.log(`Bucket ${bucketName} created successfully`);
    } catch (error) {
      Logger.error(`Error creating bucket ${bucketName}: ${error.message}`);
      throw error;
    }
  }

  async deleteAllObjects(bucketName: string): Promise<void> {
    try {
      const objects = await this.findAllAssets(bucketName);
      const objectNames = objects.map((obj) => obj.name);
      await this.minioClient.removeObjects(bucketName, objectNames);
      Logger.log(`All objects removed successfully from bucket ${bucketName}`);
    } catch (error) {
      Logger.error(`Error removing all objects from bucket ${bucketName}: ${error.message}`);
      throw error;
    }
  }
}
