import express, { Request, Response } from 'express';
import cors from 'cors';
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());
const port = process.env.PORT;
const UPLOAD_BASE_PATH = process.env.UPLOAD_BASE_PATH || '/uploads';

app.use(`${UPLOAD_BASE_PATH}`, express.static('uploads'));

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from TypeScript Express!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
