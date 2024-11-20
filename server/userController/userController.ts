import express, { Request, Response, NextFunction} from 'express';

const userController = {
    getString: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {userInput}= req.body;
            if (!userInput) {
                return res.status(400).json({ message: 'No input provided'})
            }
            res.locals.userResponse = userInput
            return next();
        }
        catch(err) {
            return next(err)
        }
    }
};

export default userController