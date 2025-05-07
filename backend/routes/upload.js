const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Allowed file types and maximum file size
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Configure multer with file validation
const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPEG, PNG, and JPG files are allowed.'));
        }
        cb(null, true);
    }
});

// POST /api/upload-after-look
router.post('/upload-after-look', upload.single('afterLookImage'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { productId } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;

        // You can optionally save this `imageUrl` to your database under the productId.

        res.json({ message: 'File uploaded successfully!', imageUrl });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Global error handler for multer errors
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle multer-specific errors
        return res.status(400).json({ message: err.message });
    } else if (err) {
        // Handle other errors
        return res.status(400).json({ message: err.message });
    }
    next();
});

module.exports = router;