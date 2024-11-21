const userController = {
  getString: async (req, res, next) => {
    try {
      const { userInput, aiResponse } = req.body;
      if (!userInput) {
        return res.status(400).json({ message: 'No input provided' });
      }
      console.log('User input: ', userInput);
      console.log('Ai question input: ', aiResponse);
      res.locals.userAnswer = userInput;
      res.locals.aiResponse = aiResponse;
      return next();
    } catch (err) {
      return next(err);
    }
  },
};

export default userController;
