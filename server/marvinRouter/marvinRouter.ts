import express, { Request, Response, NextFunction } from 'express';
import userController from '../userController/userController';
import { queryOpenAIChat, firstQuestion } from '../controllers/aiController';
import {
  cacheResponse,
  clearCache,
  retrieveCache,
  logResponse,
} from '../controllers/cacheController';

const marvinRouter = express.Router();

marvinRouter.post(
  '/chat',

  userController.getString,
  cacheResponse,
  retrieveCache,
  queryOpenAIChat,
  logResponse,
  (req, res) => {
    return res.status(200).json({
      userResponse: res.locals.userResponse,
      aiResponse: res.locals.aiResponse,
    });
  }
);

marvinRouter.get(
  '/chat',
  clearCache,
  firstQuestion,
  logResponse,
  (_req, res) => {
    const initialQuestion = res.locals.initialQuestion;
    if (!initialQuestion) {
      return res
        .status(500)
        .json({ error: 'Failed to generate the first question.' });
    }
    return res.status(200).json({
      question: initialQuestion,
    });
  }
);

export default marvinRouter;
