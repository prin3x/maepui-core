import { Injectable, Logger, Param, UploadedFile } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';
import * as fs from 'fs';
import { MediaService } from 'src/media/media.service';
import * as admin from 'firebase-admin';

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

        // Upload file to Firebase Storage
        const bucketName = 'maepui-ba064.appspot.com' || bucket;
        const bucketRef = admin.storage().bucket(`gs://${bucketName}`);
        const [fileUpload] = await bucketRef.upload(filePath, {
          destination: objectName,
          public: true, // Make the file publicly accessible
        });

        // Get the public URL
        const url = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-01-2500', // Set a far future expiration date
        });

        rtnFilePaths.push(url);

        fs.unlinkSync(filePath);
      }
    } catch (error) {
      Logger.error(`Error uploading file to Firebase Storage: ${error.message}`);
      throw error;
    }

    return rtnFilePaths.flat();
  }
}
