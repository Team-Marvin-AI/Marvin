import { RequestHandler } from 'express';
import { ServerError } from '../../types/types'
import OpenAI from "openai";

const openai = new OpenAI({
  organization: process.env.OPEN_AI_ORGANIZATION as string,
  project: process.env.OPEN_AI_PROJECT as string,
});

const apiKey = process.env.OPEN_AI_API_KEY as string

export const queryOpenAIChat:RequestHandler = async(_req, res, next) => {
  const { userAnswer } = res.locals;

  // error handling if we dont have a userAnswer
  if (!userAnswer) {
    const error: ServerError = {
      log: 'queryOpenAIChat did not receive a user answer',
      status: 500,
      message: { err: 'An error occure before querying OpenAI'}
    };
    return next(error);
  }

  // openai API request
  async function getAIResponse(text: string) {
    
    const instructRole = 'You are a Marval assistant that is trying to guess the user\'s Marval character. '
    const instructGoal = 'When given a user query, you try to guess the Marvel character the user is thinking about or ask the user more questions to better guess the character. '
    const instructFormat = 'You are to respond only in an object like this: {nextQuestion: [question], certainty: [certainty value], character: [character]}'

    const systemMessage = instructRole + instructGoal + instructFormat

    try {
      const response = await openai.chat.completion.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: userAnswer
          }
        ],
        temperature: 0.8,
      })

      const { content } = response.choices[0].message;
      if(!content) {
        const error: ServerError = {
          log: `OpenAI did not return a completion`,
          status: 500,
          message: { err: `An error occured while querying OpenAI`}
        };
        return next(error);
      }

      res.locals.aiResponse = content;
    }
    catch (err) {
      const error: ServerError = {
        log: `queryOpenAI: ${err}`,
        status: 500,
        message: { err: 'An error occured while querying OpenAI' }
      };
      return next(error);
    }
  };

  getAIResponse(userAnswer);

};