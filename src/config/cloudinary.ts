import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryConfig {
  private static instance: CloudinaryConfig;
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): CloudinaryConfig {
    if (!CloudinaryConfig.instance) {
      CloudinaryConfig.instance = new CloudinaryConfig();
    }
    return CloudinaryConfig.instance;
  }

  initialize(): void {
    if (this.initialized) {
      return;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    this.initialized = true;
    console.log('✓ Cloudinary initialized successfully');
  }

  getCloudinary() {
    if (!this.initialized) {
      this.initialize();
    }
    return cloudinary;
  }
}

