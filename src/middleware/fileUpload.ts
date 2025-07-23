import multer from 'multer';
import path from 'path';
import { getUploadPath } from '../utils/getUploadPath';

const { basePath } = getUploadPath();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, basePath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${
            Date.now() - Math.round(Math.random() * 1e9)
        }${ext}`;
        cb(null, uniqueName);
    },
});

export const upload = multer({ storage });
