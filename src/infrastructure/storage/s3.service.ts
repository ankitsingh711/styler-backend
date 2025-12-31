import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '@config/environment';
import { logger } from '@infrastructure/logger/logger.service';
import { ExternalServiceException } from '@common/exceptions';
import { generateUniqueFilename } from '@common/utils';
import { FileUpload, UploadedFile } from '@common/interfaces';

/**
 * S3 Storage Service
 * Handles file uploads, downloads, and management with AWS S3
 */
class S3Service {
    private client: S3Client;
    private bucketName: string;

    constructor() {
        this.bucketName = config.aws.s3.bucketName;
        this.client = new S3Client({
            region: config.aws.region,
            credentials: {
                accessKeyId: config.aws.accessKeyId,
                secretAccessKey: config.aws.secretAccessKey,
            },
        });
    }

    /**
     * Upload file to S3
     */
    async uploadFile(file: FileUpload, folder = 'uploads'): Promise<UploadedFile> {
        try {
            const filename = generateUniqueFilename(file.originalname);
            const key = `${folder}/${filename}`;

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await this.client.send(command);

            const url = `https://${this.bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;

            logger.info(`File uploaded to S3: ${key}`);

            return {
                url,
                key,
                mimetype: file.mimetype,
                size: file.size,
            };
        } catch (error) {
            logger.error('Error uploading file to S3:', error);
            throw new ExternalServiceException('Failed to upload file');
        }
    }

    /**
     * Upload multiple files
     */
    async uploadMultipleFiles(files: FileUpload[], folder = 'uploads'): Promise<UploadedFile[]> {
        try {
            const uploadPromises = files.map((file) => this.uploadFile(file, folder));
            return await Promise.all(uploadPromises);
        } catch (error) {
            logger.error('Error uploading multiple files to S3:', error);
            throw new ExternalServiceException('Failed to upload files');
        }
    }

    /**
     * Get signed URL for temporary access
     */
    async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            return await getSignedUrl(this.client, command, { expiresIn });
        } catch (error) {
            logger.error('Error generating signed URL:', error);
            throw new ExternalServiceException('Failed to generate signed URL');
        }
    }

    /**
     * Delete file from S3
     */
    async deleteFile(key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            await this.client.send(command);
            logger.info(`File deleted from S3: ${key}`);
        } catch (error) {
            logger.error('Error deleting file from S3:', error);
            throw new ExternalServiceException('Failed to delete file');
        }
    }

    /**
     * Delete multiple files
     */
    async deleteMultipleFiles(keys: string[]): Promise<void> {
        try {
            const deletePromises = keys.map((key) => this.deleteFile(key));
            await Promise.all(deletePromises);
        } catch (error) {
            logger.error('Error deleting multiple files from S3:', error);
            throw new ExternalServiceException('Failed to delete files');
        }
    }
}

export const s3Service = new S3Service();
