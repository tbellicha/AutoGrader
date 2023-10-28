const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')

exports.s3Uploadv3 = async (file) => {
    const s3Client = new S3Client()
    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${file.originalname}`,
        Body: file.buffer
    }
    return await s3Client.send(new PutObjectCommand(param));
}

exports.s3Downloadv3 = async (filename) => {
    const s3Client = new S3Client()
    const param = {
        Bucket: process.env.AWS_BUCKET_NAME, 
        Key: `uploads/${filename}`,
        ResponseContentType: "application/json"
    }
    return await s3Client.send(new GetObjectCommand(param));
}