import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = Router();

router.post('/image', protect, (req, res, next) => {
  uploadImage.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: { url: `/uploads/${req.file.filename}` },
    });
  });
});

export default router;
