import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Readable } from 'node:stream';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = async (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'avatars',
                resource_type: 'image',
                overwrite: true,
                unique_filename: true,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            },
        );

        Readable.from(buffer).pipe(uploadStream);
    });
};
