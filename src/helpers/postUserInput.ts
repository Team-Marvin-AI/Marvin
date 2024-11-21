export const postUserInput = async (userAnswer: string, aiResponse: string) => {
  try {
    const response = await fetch('/marvin/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'userInput': userAnswer,
        'aiResponse': aiResponse,
      }),
    });
    if (response.ok === false) {
      throw new Error('Error trying sending post request with user input');
    }
    const data = await response.json();
    console.log(JSON.parse(data.aiResponse));
    console.log(data.aiResponse['nextQuestion']);
    console.log(data.aiResponse.certainty);
    console.log(data.aiResponse.character);
    return data.aiResponse;
  } catch (error) {
    console.log((error as Error).message || 'Error sending user input to AI');
  }
};
