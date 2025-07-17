require('dotenv').config();

const express = require('express');
const router = express.Router();

const sharp = require('sharp');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const { checkAuth } = require('../middleware/userAuth');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


const uploadMedia = async (buff, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
    Readable.from(buff).pipe(stream);
  })
}

router.post('/', checkAuth, upload.single('media'), async (req, res) => {
  const fileBuffer = req.file.buffer;
  const mimetype = req.file.mimetype;

  try {
    const originalUpload = await uploadMedia(fileBuffer, {
      resource_type: 'auto',
      folder: 'media/',
    });

    if (mimetype.startsWith('image/')) {
      const thumbnailBuffer = await sharp(fileBuffer)
        .resize({ width: 100, height: 100 })
        .toBuffer();

      const thumbnailUpload = await uploadMedia(thumbnailBuffer, {
        resource_type: 'auto',
        folder: 'thumbnails/',
      });

      return res.status(200).json({
        type: 'image',
        mediaUrl: originalUpload.secure_url,
        thumbnailUrl: thumbnailUpload.secure_url
      });
    }


    if (mimetype.startsWith('video/')) {
      const thumbnailTempUrl = originalUpload.secure_url.replace('.mp4', '.jpg')

      const thumbnailUpload = await cloudinary.uploader.upload(thumbnailTempUrl, {
        folder: 'thumbnails/',
        resource_type: 'image',
        transformation: [
          { width: 100, height: 100, crop: 'fill' },
          {
           overlay:'playButton',
            width: 50,
            height: 50,
            flags: 'relative',
            gravity: 'center'
          }
        ]
      });

      return res.status(200).json({
        type: 'video',
        mediaUrl: originalUpload.secure_url,
        thumbnailUrl: thumbnailUpload.secure_url,
      });
    }

    else {
      return res.status(400).json({ error: 'Sahi file format do' });
    }

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

module.exports = router;
