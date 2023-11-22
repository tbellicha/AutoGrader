const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')

exports.s3UploadHW = async (files, assignment_id) => {
    const s3Client = new S3Client() 

    const params = files.map(file => {
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${assignment_id}/submission/${file.originalname}`,
            Body: file.buffer
        }
    })
    
    return await Promise.all(params.map(param => s3Client.send(new PutObjectCommand(param)))) 
}

exports.s3UploadTC = async (files, assignment_id) => {
    const s3Client = new S3Client()

    const params = files.map(file => {
        return {
            Bucket: process.env.AWS_BUCKET_NAME, 
            Key: `${assignment_id}/testcase/${file.originalname}`,
            Body: file.buffer
        }
    })

    return await Promise.all(params.map(param => s3Client.send(new PutObjectCommand(param))))

    /*const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${assignment_id}/testcase/${file.originalname}`,
        Body: file.buffer
    }*/ 
    //return await s3Client.send(new PutObjectCommand(param))
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