import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${
            Date.now() - Math.round(Math.random() * 1e9)
        }${ext}`;
        cb(null, uniqueName);
    },
});

export const upload = multer({ storage });
