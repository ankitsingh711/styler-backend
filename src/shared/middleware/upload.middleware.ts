import multer from 'multer';
import { BadRequestException } from '@common/exceptions';

/**
 * Multer configuration for file uploads
 * Files are stored in memory as buffers for direct S3 upload
 */
const storage = multer.memoryStorage();

/**
 * File filter to only allow image files
 */
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new BadRequestException('Only image files are allowed'));
    }
};

/**
 * Multer upload instance with constraints
 * - Max file size: 5MB
 * - Only images allowed
 */
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter,
});
