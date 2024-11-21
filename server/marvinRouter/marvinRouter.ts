import express, { Request, Response, NextFunction } from 'express';
import userController from '../userController/userController';
import { queryOpenAIChat, firstQuestion } from '../controllers/aiController';

const marvinRouter = express.Router();

marvinRouter.post(
  '/chat',
  userController.getString,
  queryOpenAIChat,
  (req: Request, res: Response) => {
    return res.status(200).json({
      userResponse: res.locals.userResponse,
      aiResponse: res.locals.aiResponse,
    });
  }
);


marvinRouter.get(
    '/firstq',
    firstQuestion,
    (req: Request, res: Response) => {
      const initialQuestion = res.locals.initialQuestion;
      if (!initialQuestion) {
        return res.status(500).json({ error: 'Failed to generate the first question.' });
      }
      return res.status(200).json({
        question: initialQuestion,
      });
    }
  );

export default marvinRouter;
