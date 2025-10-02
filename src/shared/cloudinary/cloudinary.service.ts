import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise<UploadApiResponse | UploadApiErrorResponse>(
      (resolve, reject) => {
        const stream = v2.uploader.upload_stream((err: any, result: any) => {
          if (err) reject(err);
          else resolve(result);
        });
        streamifier.createReadStream(file.buffer).pipe(stream);
      },
    );
  }
}
