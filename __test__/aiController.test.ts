import OpenAI from 'openai'
import { firstQuestion } from '../server/controllers/aiController.ts'
// NOT SURE IF WORKS

// mock/simulate behavior of openai API call without actually calling, stores it in mOpenAI
// jest.mock('openai', () => {
//     const mOpenAi = {
//         chat: {
//             completions: {
//                 create: jest.fn(),
//             },
//         },
//     };
//     return JsxEmit.fn(() => mOpenAI)
// });

// variables for the middleware 
describe ('queryOpenAI', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let mockOpenAI: jest.Mocked<Partial<OpenAI>>;

    
    // resets all of the tests to default state before moving on
    beforeEach(() => {
      req = {};
      res = {
          locals: {},
      };
      next = jest.fn();
      const mockCompletion = {
        data: {
          choices: [
            {
              text: "This is a mock response from OpenAI API"
            },
          ],
        },
      };
      const mockOpenAI = {
          createCompletion: jest.fn().mockResolvedValue(mockCompletion)
      };
        // jest.clearAllMocks();
    });

    it('should return an error if open ai did not generate a question', async () =>  {
        await firstQuestion(req, res, next);
        expect(next).toHaveBeenCalledWith({
            log: "OpenAI did not generate a question",
            status: 500,
            message: {err: 'An error occured while generating a question'}
        })
    });
    it('it should return an error if there was an issue querying openapi for first q', async () =>  {
        expect(next).toHaveBeenCalledWith({
            log: `firstQuestion: ${err}`,
            status: 500,
            message: { err: 'An error occured while querying OpenAI for the first question'}
        })
    });




})