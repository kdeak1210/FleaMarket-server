import aws from 'aws-sdk';
import express from 'express';

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const router = express.Router();

router.get('/s3sign', (req, res) => {
  const { filename, filetype } = req.query;
  const s3 = new aws.S3();

  const params = {
    Bucket: '',
    Key: filename,
    Expires: 60,
    ContentType: filetype,
  };

  s3.getSignedUrl('putObject', params, (err, data) => {
    if (err) {
      console.log(err);
      res.json({
        confirmation: 'fail',
        message: err,
      });
    }

    res.json({
      confirmation: 'success',
      result: data,
    });
  });
});

export default router;

