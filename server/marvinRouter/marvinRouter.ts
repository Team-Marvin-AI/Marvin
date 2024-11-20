import express, { Request, Response, NextFunction} from 'express';
import userController from '../userController/userController';

const marvinRouter = express.Router();

marvinRouter.post('/chat', userController.getString, aiController.handleResponse, (req: Request, res: Response) => {
    return res.status(200).json({userResponse: res.locals.userResponse, aiResponse: res.locals.aiResponse})
});

export default marvinRouter