import { json, RequestHandler } from 'express';
import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { join } from 'path';

const cachePath = join(__dirname, './logs/cache.json');
const logPath = join(__dirname, './logs/log.txt');

export const logResponse: RequestHandler = async (req, res, next) => {
  //Extract data from res.locals
  //May need seperate logger for initial question
  const { aiResponse, initialQuestion, userResponse } = res.locals;

  //Error handling for each result
  if (!userResponse) {
    const error = {
      log: 'logResponse in cache controller did not receive user input',
      status: 500,
      message: { err: 'An error ocurred logging AI data' },
    };
    return next(error);
  }
  if (!aiResponse) {
    const error = {
      log: 'logResponse in cache controller did not receive ai output',
      status: 500,
      message: { err: 'An error ocurred logging AI data' },
    };
    return next(error);
  }
  if (!initialQuestion) {
    const error = {
      log: 'logResponse in cache controller did not receive ai output',
      status: 500,
      message: { err: 'An error ocurred logging AI data' },
    };
    return next(error);
  }

  //Create log of the result
  const log = `
  ---------------------User Input---------------------
  ${userResponse}
  ----------------------AI Prompt---------------------
  ${initialQuestion}
  ---------------------AI Output----------------------
  ${(JSON.stringify(aiResponse), null, 2)}\n\n
  `;
  //Write data to log file
  try {
    await appendFile(logPath, log);
    //next();
  } catch (err) {
    const error = {
      log: `logResponse in cache controller could not write to file. Received error: ${err}`,
      status: 500,
      message: { err: 'An error ocurred logging AI data' },
    };
    return next(error);
  }
};

export const cacheResponse: RequestHandler = async (req, res, next) => {
  //Extract data from res.locals
  //Front end will send the original question and answer
  const { aiResponse, userResponse } = res.locals;

  //Ensure data fields are populated
  if (!userResponse) {
    const error = {
      log: 'cacheResponse in cache controller did not receive user input',
      status: 500,
      message: { err: 'An error ocurred logging AI data' },
    };
    return next(error);
  }
  if (!aiResponse) {
    const error = {
      log: 'logResponse in cache controller did not receive ai output',
      status: 500,
      message: { err: 'An error ocurred logging AI data' },
    };
    return next(error);
  }

  //retrieve current cashed values
  const cache = await readFile(cachePath, 'utf-8');
  //If there is no cache, set to an empty array
  let parsedCache: object[] = [];
  //if there is a cache, parse the string from JSON
  if (cache) {
    parsedCache = JSON.parse(cache);
  }

  //Add new content to array
  const content = { aiOutput: aiResponse, userInput: userResponse };
  parsedCache.push(content);

  try {
    //Replace JSON file contents with new array
    await writeFile(cachePath, JSON.stringify(parsedCache));
    return next();
  } catch (err) {
    const error = {
      log: `cacheResponse in cache controller could not write to file. Received error: ${err}`,
      status: 500,
      message: { err: 'An error ocurred caching question responses' },
    };
    return next(error);
  }
};

export const retrieveCache: RequestHandler = async (_req, res, next) => {
  try {
    //Get cached data
    const cache = await readFile(cachePath, 'utf-8');
    //If cache is a falsey value, set cached responses to an empty array
    if (!cache) {
      res.locals.cachedResponses = [];
      return next();
    }
    //Forward cache through locals
    res.locals.cachedResponses = JSON.parse(cache);
    return next();
  } catch (err) {
    const error = {
      log: `retrieveCach in cache controller could not read file in ${cachePath}. Received error: ${err}`,
      status: 500,
      message: { err: 'An error ocurred retrieving cached responses' },
    };
    return next(error);
  }
};

export const clearCache: RequestHandler = async (_req, _res, next) => {
  try {
    //replace content of the cache with an empty array to delete it
    await writeFile(cachePath, JSON.stringify([]));
    return next();
  } catch (err) {
    const error = {
      log: `clearCache in cache controller could not clear file in ${cachePath}. Received error: ${err}`,
      status: 500,
      message: { err: 'An error ocurred deleting cached responses' },
    };
    return next(error);
  }
};
export const clearLog: RequestHandler = async (_req, _res, next) => {
  try {
    //replace content of the log with an empty string to delete it
    await writeFile(logPath, '');
    return next();
  } catch (err) {
    const error = {
      log: `clearLog in cache controller could not clear file in ${logPath}. Received error: ${err}`,
      status: 500,
      message: { err: 'An error ocurred deleting logged responses' },
    };
    return next(error);
  }
};
