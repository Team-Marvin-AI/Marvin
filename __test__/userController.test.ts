import userController from "../server/userController/userController";

describe('userController.getSTring', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {},
        }
        next = jest.fn();
    })
    // testing missing user input
    test('getString is sent an empty string', async () => {
        await userController.getString(req, res, next)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'No input provided'});
        expect(next).not.toHaveBeenCalled();
    })

    // testing valid input
    test('When given a input, should go to next', async() => {
        req.body.userInput = 'mock input';
        await userController.getString(req, res, next);

        expect(res.status).not.toHaveBeenCalled()
        expect(res.locals.userAnswer).toBe('mock input');
        expect(next).toHaveBeenCalled();
    })

    // testing error handling
    test("should call next with error passed in", async() => {
        const error = new Error('mock error');
        const failingFunc = jest.fn(() => {
            throw error;
        });
        // i dont understand proxy portion... creates a new req.body object with failingFunc
        req.body = new Proxy(req.body, {get: failingFunc});
        await userController.getString(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    })
})