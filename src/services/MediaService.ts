import { CloudinaryConfig } from '@/config/cloudinary';
import { AppError } from '@/types';

export class MediaService {
  private cloudinary;

  constructor() {
    this.cloudinary = CloudinaryConfig.getInstance().getCloudinary();
  }

  async uploadVideo(
    fileBuffer: Buffer,
    fileName: string,
    folder: string = 'videos'
  ): Promise<{ url: string; publicId: string; duration: number }> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: `edusync/${folder}`,
            public_id: fileName,
            overwrite: true,
            transformation: [
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) {
              reject(new AppError(500, `Video upload failed: ${error.message}`));
            } else if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                duration: result.duration || 0,
              });
            } else {
              reject(new AppError(500, 'Video upload failed'));
            }
          }
        );
        uploadStream.end(fileBuffer);
      });
    } catch (error: any) {
      throw new AppError(500, `Video upload failed: ${error.message}`);
    }
  }

  async uploadImage(
    fileBuffer: Buffer,
    fileName: string,
    folder: string = 'images'
  ): Promise<{ url: string; publicId: string }> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: `edusync/${folder}`,
            public_id: fileName,
            overwrite: true,
            transformation: [
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) {
              reject(new AppError(500, `Image upload failed: ${error.message}`));
            } else if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            } else {
              reject(new AppError(500, 'Image upload failed'));
            }
          }
        );
        uploadStream.end(fileBuffer);
      });
    } catch (error: any) {
      throw new AppError(500, `Image upload failed: ${error.message}`);
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    folder: string = 'resources'
  ): Promise<{ url: string; publicId: string }> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: `edusync/${folder}`,
            public_id: fileName,
            overwrite: true,
          },
          (error, result) => {
            if (error) {
              reject(new AppError(500, `File upload failed: ${error.message}`));
            } else if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            } else {
              reject(new AppError(500, 'File upload failed'));
            }
          }
        );
        uploadStream.end(fileBuffer);
      });
    } catch (error: any) {
      throw new AppError(500, `File upload failed: ${error.message}`);
    }
  }

  async deleteMedia(publicId: string, resourceType: 'video' | 'image' | 'raw' = 'image'): Promise<void> {
    try {
      await this.cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error: any) {
      throw new AppError(500, `Media deletion failed: ${error.message}`);
    }
  }

  generateSignedUrl(publicId: string, resourceType: 'video' | 'image' = 'video'): string {
    try {
      return this.cloudinary.url(publicId, {
        resource_type: resourceType,
        sign_url: true,
        type: 'authenticated',
      });
    } catch (error: any) {
      throw new AppError(500, `Failed to generate signed URL: ${error.message}`);
    }
  }

  generateVideoStreamingUrl(publicId: string, quality: 'auto' | 'low' | 'medium' | 'high' = 'auto'): string {
    const qualityMap = {
      auto: 'auto',
      low: 'low',
      medium: 'medium',
      high: 'high',
    };

    return this.cloudinary.url(publicId, {
      resource_type: 'video',
      transformation: [
        { quality: qualityMap[quality] },
        { fetch_format: 'auto' },
      ],
    });
  }
}

