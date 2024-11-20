import { RequestHandler } from 'express';
import { ServerError } from '../../types/types'
import OpenAI from "openai";

const openai = new OpenAI({
  organization: process.env.OPEN_AI_ORGANIZATION as string,
  project: process.env.OPEN_AI_PROJECT as string,
});
const apiKey = process.env.OPEN_AI_API_KEY as string

// generate inital question
export const firstQuestion: RequestHandler = async (_req, res, next) => {
  
  // system instructions
  const instructRole = 'You are a question generator to guess a Marvel character. '
  const instructGoal = 'You want to generate a random open ended question that the user can answer. '
  const instructFormat = 'Make a short quizitive question for the user to answer. Do not exceed 200 characters.'

  const systemMessage = instructRole + instructGoal + instructFormat
  try {
    const question = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages:
      [{ 
        role: 'system',
        content: systemMessage
      }],
      temperature: 1.0,
    })

    const { content } = question.choices[0].message;
    if (!content) {
      const error: ServerError = {
        log: "OpenAI did not generate a question",
        status: 500,
        message: {err: 'An error occured while generating a question'}
      }
      return next(error)
    }

    res.locals.initalQuestion = content;
    console.log('question generated: ', content);
    return next();

  } catch (err) {
    const error: ServerError = {
      log: `firstQuestion: ${err}`,
      status: 500,
      message: { err: 'An error occured while querying OpenAI for the first question'}
    }
  }
};

// all subsequent questions/answers/certainty
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


    // system instructions
    const instructRole = 'You are a Marval assistant that is trying to guess the user\'s Marval character. '
    const instructGoal = 'When given a user query, you try to guess the Marvel character the user is thinking about or ask the user more questions to better guess the character. '
    const instructFormat = 'You are to respond only in an object like this: {nextQuestion: [question], certainty: [certainty value], character: [character]}'

    const systemMessage = instructRole + instructGoal + instructFormat
    
    // openai API request
    try {
      const response = await openai.chat.completions.create({
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
      console.log('after getAIResponse: ', res.locals.aiResponse)
      return next()
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