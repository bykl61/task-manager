import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image', 'video', 'application'];
    const fileType = file.mimetype.split('/')[0];

    if (allowedTypes.includes(fileType)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export const uploadFile = async (file) => {
  // In a real application, you might upload to cloud storage
  // For this example, we'll just return the local path
  return {
    url: `/uploads/${file.filename}`
  };
};