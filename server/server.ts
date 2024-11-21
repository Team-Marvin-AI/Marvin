import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors'
import marvinRouter from './marvinRouter/marvinRouter'

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use('/marvin', marvinRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('Error; ', err);
    res.status(500).json({ messsage: 'Internal Server Error ', error: err.message })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})