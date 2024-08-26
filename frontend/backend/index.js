const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

const RESOLUTIONS = [
  { name: "360p", width: 480, height: 360 },
  { name: "480p", width: 858, height: 480 },
  { name: "720p", width: 1280, height: 720 },
];

const s3 = new S3Client({ region: '' }); 

const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const fileContent = fs.readFileSync(req.file.path);
    const params = {
      Bucket: 'temp-raw-videos.sandesh.com', // S3 bucket name
      Key: req.file.originalname,
      Body: fileContent
    };

    const command = new PutObjectCommand(params);
    const data = await s3.send(command);

    res.status(200).json({ success: true, message: "File uploaded successfully.", data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Upload failed.", error: err.message });
  }
});

app.get('/api/videos', async (req, res) => {
  const originalFileName = path.parse(req.query.filename).name;

  const videos = RESOLUTIONS.map((resolution) => {
      return {
          name: `${originalFileName}-video-${resolution.name}.mp4`,
          url: `https://s3.ap-south-1.amazonaws.com/production.sandesh.xyz/${originalFileName}-video-${resolution.name}.mp4`,
      };
  });

  res.json({ videos });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
