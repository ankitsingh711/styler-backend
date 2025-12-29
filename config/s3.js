const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

// Configure S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'styler-profile-pictures';

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} - S3 file URL
 */
const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
    try {
        // Generate unique file name
        const fileExtension = fileName.split('.').pop();
        const uniqueFileName = `profile-pictures/${uuidv4()}.${fileExtension}`;

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: uniqueFileName,
            Body: fileBuffer,
            ContentType: mimeType,
            // ACL removed - bucket has ACLs disabled (use bucket policy instead)
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        // Return the public URL
        const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${uniqueFileName}`;
        return fileUrl;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
};

/**
 * Delete file from S3
 * @param {string} fileUrl - S3 file URL
 * @returns {Promise<void>}
 */
const deleteFromS3 = async (fileUrl) => {
    try {
        // Extract the key from the URL
        const url = new URL(fileUrl);
        const key = url.pathname.substring(1); // Remove leading slash

        const deleteParams = {
            Bucket: BUCKET_NAME,
            Key: key,
        };

        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);
    } catch (error) {
        console.error('Error deleting from S3:', error);
        throw new Error('Failed to delete file from S3');
    }
};

module.exports = {
    uploadToS3,
    deleteFromS3,
    s3Client
};
