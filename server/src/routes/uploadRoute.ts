import { Router, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import userAuth from '../middlewares/userAuth';
import axios from 'axios';

const router = Router();
const LLM_URI = process.env.LLM_URI;

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${(req as any).filename}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); 
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/upload', userAuth, upload.single('pdfFile'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type' });
  }
  const filename = req.file.filename;
  try{
    const response = await axios.post(`${LLM_URI}/pre-process/`, {
  filename: filename
});
  }
  catch(error: any){
    console.log('Error while calling fast API', error.message);
  }

  res.status(200).json({
    message: 'PDF uploaded successfully and preprocessed',
    filename: req.file.filename,
    path: req.file.path,
  });
});

export default router;
