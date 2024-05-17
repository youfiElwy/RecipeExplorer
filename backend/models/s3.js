const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.BUCKET_NAME
const scaledBucketName = process.env.SCALED_BUCKET_NAME
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const supportedMimeTypes = ['jpeg', 'png', 'jpg', 'gif'];

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

module.exports = {
  async getImage(key) {
    const url = "https://d3tctp88ma7e3h.cloudfront.net/" + key;

    return url
  },
  async getSignedUrl(key) {
    const url = "https://d3tctp88ma7e3h.cloudfront.net/" + key;
  
    return url;
  },
  async uploadFile(fileBuffer, fileName, mimetype) {
    if (!supportedMimeTypes.includes(mimetype.split('/')[1])) {
      throw new Error('Unsupported file type');
    }
    const result = await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimetype,
    }));
    return result;
  },
  async deleteFile(fileName) {
    const deleteParams = {
      Bucket: bucketName,
      Key: fileName,
    }

    return await s3Client.send(new DeleteObjectCommand(deleteParams));
  }
};