// cloudinaryConfig.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  delete_derived_resources: true
});

// File Filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Cloudinary Storage for accounts
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    public_id: (req, file) => file.originalname,
    url: async (req, file) => {
      return new Promise((resolve, reject) => {
        const uniqueFilename = new Date().toISOString();
        resolve(uniqueFilename);
      });
    },
  },
});

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;

// Cloudinary Storage for blog posts
const blogPostStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog',
    public_id: (req, file) => file.originalname,
    url: async (req, file) => {
      return new Promise((resolve, reject) => {
        const uniqueFilename = new Date().toISOString();
        resolve(uniqueFilename);
      });
    },
  },
});

export const postUpload = multer({ 
  storage: blogPostStorage,
  fileFilter: fileFilter,
});