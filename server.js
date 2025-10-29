// ...new file...
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const projectDir = __dirname;
const imagesDir = path.join(projectDir, 'images');

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, Date.now() + '-' + Math.floor(Math.random() * 1e6) + ext);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => /^image\/(jpeg|png|gif|webp|bmp)$/.test(file.mimetype) ? cb(null, true) : cb(new Error('Only image files allowed')),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(express.static(projectDir));
app.use('/images', express.static(imagesDir));

app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: '/images/' + req.file.filename });
});

app.use((err, req, res, next) => {
  console.error(err && err.message ? err.message : err);
  res.status(400).json({ error: err && err.message ? err.message : 'Upload error' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
// ...new file...