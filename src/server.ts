import express, { Request, Response } from 'express';
import cors from 'cors';
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
const port = process.env.PORT;

const userRoutes = require('./routes/userRoutes');

app.use('/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from TypeScript Express!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
