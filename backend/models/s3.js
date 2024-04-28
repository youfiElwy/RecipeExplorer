const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, getSin, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const eks = require('../eks.json');

const bucketName = eks.BUCKET_NAME
const region = eks.AWS_REGION
const accessKeyId = eks.AWS_ACCESS_KEY_ID
const secretAccessKey = eks.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

module.exports = {
  async getImage(key) {
    const params = {
      Bucket: bucketName,
      Key: key
    }
  
    // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 600 });
  
    return url
  },
  async getAllImages() {
    // getting all images from the bucket then returning an array with the signed urls for each image in the bucket without using the getImage function
    const params = {
      Bucket: bucketName
    }

    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);
    const images = data.Contents;
    const signedUrls = images.map(async (image) => {
      return {key: image.Key, url: await getSignedUrl(s3Client, new GetObjectCommand({ Bucket: bucketName, Key: image.Key }), { expiresIn: 600 })};
    });

    console.log("signedUrls: ", signedUrls);

    return Promise.all(signedUrls);
  },
  async uploadFile(fileBuffer, fileName, mimetype) {
    const result = await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimetype
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