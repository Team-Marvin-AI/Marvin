const userController = {
    getString: async (req, res, next) => {
        try {
            const {userInput}= req.body;
            if (!userInput) {
                return res.status(400).json({ message: 'No input provided'})
            }
            res.locals.userAnswer = userInput
            return next();
        }
        catch(err) {
            return next(err)
        }
    }
};

export default userController