import express, { Request, Response } from 'express';
import cors from 'cors';
import { getUploadPath } from './utils/getUploadPath';

require('dotenv').config();
const app = express();
const { basePath, baseUrl } = getUploadPath();

app.use(express.json());
app.use(cors());
const port = process.env.PORT;

app.use(baseUrl, express.static(basePath));

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
