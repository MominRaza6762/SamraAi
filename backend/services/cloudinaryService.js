
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

export const uploadFile = async (fileBuffer, fileName, fileType) => {
  try {
    return new Promise((resolve, reject) => {
      const resourceType = fileType.startsWith('image/') ? 'image' : 
                          fileType.startsWith('audio/') ? 'video' : 
                          'raw';

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          public_id: `samraai/${Date.now()}_${fileName}`,
          folder: 'samraai'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      const readableStream = Readable.from(fileBuffer);
      readableStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

export const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};