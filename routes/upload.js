import aws from 'aws-sdk';
import express from 'express';

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const router = express.Router();

router.get('/s3sign', (req, res) => {
  const { filename, filetype } = req.query;

  const s3 = new aws.S3({
    signatureVersion: 'v4',
    region: process.env.AWS_REGION,
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    Expires: 60,
    ContentType: filetype,
    ACL: 'public-read',
  };

  s3.getSignedUrl('putObject', params, (err, data) => {
    if (err) {
      console.log(err);
      res.json({
        confirmation: 'fail',
        message: err,
      });

      return;
    }

    // The URL where the image will be located after successful upload
    // const imageUrl = `
    //   https://${process.env.AWS_BUCKET_NAME}
    //   .s3
    //   .${process.env.AWS_REGION}
    //   .amazonaws.com/${filename}
    // `;

    res.json({
      confirmation: 'success',
      signedUrl: data,
      // imageUrl,
    });
  });
});

export default router;

