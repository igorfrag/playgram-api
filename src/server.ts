import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { getUploadPath } from './utils/getUploadPath';

require('dotenv').config();
const app = express();
const { basePath, baseUrl } = getUploadPath();
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

const port = process.env.PORT;

app.use(baseUrl, express.static(basePath));

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from TypeScript Express!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
